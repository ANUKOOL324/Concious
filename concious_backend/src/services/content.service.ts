import { ContentModel, ContentChunkModel, SourceArtifactModel, OkfConceptModel } from "../db.js";
import { getHfEmbedding } from "../providers.js";
import {
  deleteCloudinaryPdf,
  isCloudinaryConfigured,
  uploadPdfToCloudinary,
} from "../providers/cloudinary.js";
import { buildMetadataText, indexContentForRag } from "../rag/index.js";
import {
  normalizeImportance,//clean user inputs
  normalizeTags,
  optionalText,
} from "../utils/contentHelpers.js";

export class ContentValidationError extends Error {//custom validation error , so the controller can know this is error from user not from server
  constructor(message: string) {
    super(message);
    this.name = "ContentValidationError";
  }
}

export interface CreateContentInput {
  title: string;
  link: string;
  type: string;
  personalNote?: string | undefined;
  summary?: string | undefined;
  tags: string[];
  collection?: string | undefined;
  whySaved?: string | undefined;
  importance: "low" | "medium" | "high";
}

const LINK_CONTENT_TYPES = new Set([
  "youtube",
  "twitter",
  "spotify",
  "article",
  "other",
]);

function parseCreateBody(body: Record<string, unknown>): CreateContentInput {
  const title = String(body.title ?? "").trim();
  const link = String(body.link ?? "").trim();
  const type = String(body.type ?? "").trim().toLowerCase();

  if (!title) {
    throw new ContentValidationError("title is required");
  }

  if (!link) {
    throw new ContentValidationError("link is required");
  }

  if (type === "pdf") {
    throw new ContentValidationError("Use POST /api/v1/content/pdf to upload PDFs");
  }

  if (!LINK_CONTENT_TYPES.has(type)) {
    throw new ContentValidationError("invalid content type");
  }

  return {
    title,
    link,
    type,
    personalNote: optionalText(body.personalNote, 1000),
    summary: optionalText(body.summary, 1000),
    tags: normalizeTags(body.tags),
    collection: optionalText(body.collection, 80),
    whySaved: optionalText(body.whySaved, 500),
    importance: normalizeImportance(body.importance),
  };
}

export async function createContent(userId: string, body: Record<string, unknown>) {
  const input = parseCreateBody(body);

  const embedding = await getHfEmbedding(
    buildMetadataText(input),
    "document"
  );

  const createInput: Record<string, unknown> = {
    ...input,
    userId,
    indexingStatus: "pending",
  };

  if (embedding) {
    createInput.embedding = embedding;
  }

  const savedContent = await ContentModel.create(createInput);

  void indexContentForRag(String(savedContent._id)).catch((error) => {
    console.error("background indexing failed", error);
  });

  return {
    message: "content is added !",
    mode: embedding ? "vector" : "lexical-fallback",
    content: savedContent,
  };
}

function parsePdfMetadata(body: Record<string, unknown>) {
  const title = String(body.title ?? "").trim();
  if (!title) {
    throw new ContentValidationError("title is required");
  }

  return {
    title,
    tags: normalizeTags(body.tags),
    personalNote: optionalText(body.personalNote, 1000),
    summary: optionalText(body.summary, 1000),
    collection: optionalText(body.collection, 80),
    whySaved: optionalText(body.whySaved, 500),
    importance: normalizeImportance(body.importance),
  };
}

export async function createPdfContent(
  userId: string,
  file: Express.Multer.File,
  body: Record<string, unknown>
) {
  if (!file) {
    throw new ContentValidationError("PDF file is required");
  }

  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  if (file.mimetype !== "application/pdf") {
    throw new ContentValidationError("Only PDF files are allowed");
  }

  const metadata = parsePdfMetadata(body);
  const uploaded = await uploadPdfToCloudinary(file.buffer, file.originalname);

  const fileMetadata = {
    provider: "cloudinary",
    publicId: uploaded.publicId,
    secureUrl: uploaded.secureUrl,
    resourceType: uploaded.resourceType,
    format: uploaded.format ?? "pdf",
    bytes: uploaded.bytes,
    originalFilename: uploaded.originalFilename,
    uploadedAt: new Date().toISOString(),
  };

  const embedding = await getHfEmbedding(
    buildMetadataText({
      title: metadata.title,
      link: uploaded.secureUrl,
      type: "pdf",
      tags: metadata.tags,
      collection: metadata.collection,
      whySaved: metadata.whySaved,
      personalNote: metadata.personalNote,
      summary: metadata.summary,
      importance: metadata.importance,
    }),
    "document"
  );

  const createInput: Record<string, unknown> = {
    ...metadata,
    link: uploaded.secureUrl,
    type: "pdf",
    userId,
    fileMetadata,
    indexingStatus: "not_indexed",
  };

  if (embedding) {
    createInput.embedding = embedding;
  }

  try {
    const savedContent = await ContentModel.create(createInput);

    void indexContentForRag(String(savedContent._id)).catch((error) => {
      console.error("background indexing failed for pdf", error);
    });

    return {
      message: "PDF content is added !",
      mode: embedding ? "vector" : "lexical-fallback",
      content: savedContent,
    };
  } catch (error) {
    await deleteCloudinaryPdf(uploaded.publicId).catch((cleanupError) => {
      console.error("Cloudinary cleanup failed after DB error:", cleanupError);
    });
    throw error;
  }
}

export async function listUserContent(userId: string) {
  return ContentModel.find({ userId })
    .sort({ createdAt: -1 })
    .populate("userId", "username");
}

export interface PdfStreamSource {
  secureUrl: string;
  filename: string;
}

export async function getPdfStreamSource(
  userId: string,
  contentId: string
): Promise<PdfStreamSource | null> {
  const content = await ContentModel.findOne({ _id: contentId, userId });
  if (!content || content.type !== "pdf") {
    return null;
  }

  const fileMetadata = content.get("fileMetadata") as
    | Record<string, unknown>
    | undefined;

  const secureUrl =
    typeof fileMetadata?.secureUrl === "string" && fileMetadata.secureUrl.trim()
      ? fileMetadata.secureUrl.trim()
      : typeof content.link === "string" && content.link.trim()
        ? content.link.trim()
        : null;

  if (!secureUrl) {
    return null;
  }

  const originalFilename = fileMetadata?.originalFilename;
  const filename =
    typeof originalFilename === "string" && originalFilename.trim()
      ? originalFilename.trim()
      : typeof content.title === "string" && content.title.trim()
        ? `${content.title.trim()}.pdf`
        : "document.pdf";

  return { secureUrl, filename };
}

export async function updateContent(
  userId: string,
  contentId: string,
  body: Record<string, unknown>
) {
  const existingContent = await ContentModel.findOne({ _id: contentId, userId });
  if (!existingContent) {
    return null;
  }

  if (body.title !== undefined) existingContent.title = String(body.title);
  if (body.personalNote !== undefined) {
    existingContent.personalNote = optionalText(body.personalNote, 1000) ?? null;
  }
  if (body.summary !== undefined) {
    existingContent.summary = optionalText(body.summary, 1000) ?? null;
  }
  if (body.tags !== undefined) existingContent.tags = normalizeTags(body.tags);
  if (body.collection !== undefined) {
    existingContent.set("collection", optionalText(body.collection, 80) ?? null);
  }
  if (body.whySaved !== undefined) {
    existingContent.whySaved = optionalText(body.whySaved, 500) ?? null;
  }
  if (body.importance !== undefined) {
    existingContent.importance = normalizeImportance(body.importance);
  }

  const refreshedEmbedding = await getHfEmbedding(
    buildMetadataText({
      title: existingContent.title,
      link: existingContent.link ?? null,
      type: existingContent.type ?? null,
      personalNote: existingContent.personalNote ?? null,
      summary: existingContent.summary ?? null,
      tags: existingContent.tags ?? null,
      collection: existingContent.get("collection") ?? null,
      whySaved: existingContent.whySaved ?? null,
      importance: existingContent.importance ?? null,
    }),
    "document"
  );

  if (refreshedEmbedding) {
    existingContent.embedding = refreshedEmbedding;
  }

  await existingContent.save();

  void indexContentForRag(String(existingContent._id)).catch((error) => {
    console.error("background indexing failed on update", error);
  });

  return existingContent;
}

function getCloudinaryPdfPublicId(content: {
  type: string;
  get: (key: string) => unknown;
}): string | null {
  if (content.type !== "pdf") {
    return null;
  }

  const fileMetadata = content.get("fileMetadata") as
    | Record<string, unknown>
    | undefined;

  if (!fileMetadata || fileMetadata.provider !== "cloudinary") {
    return null;
  }

  const publicId = fileMetadata.publicId;
  if (typeof publicId !== "string") {
    return null;
  }

  const trimmedPublicId = publicId.trim();
  return trimmedPublicId || null;
}

export async function deleteContent(userId: string, contentId: string) {
  const existingContent = await ContentModel.findOne({ _id: contentId, userId });
  if (!existingContent) {
    return false;
  }

  const cloudinaryPublicId = getCloudinaryPdfPublicId(existingContent);

  await ContentChunkModel.deleteMany({
    contentId: existingContent._id,
    userId: existingContent.userId,
  });

  await SourceArtifactModel.deleteMany({
    contentId: existingContent._id,
    userId: existingContent.userId,
  });

  await OkfConceptModel.deleteMany({
    contentId: existingContent._id,
    userId: existingContent.userId,
  });

  await ContentModel.deleteOne({ _id: existingContent._id, userId });

  if (cloudinaryPublicId) {
    await deleteCloudinaryPdf(cloudinaryPublicId).catch((error) => {
      console.warn(
        `Cloudinary PDF cleanup failed for publicId ${cloudinaryPublicId}:`,
        error
      );
    });
  }

  return true;
}

export async function reindexSingleContent(userId: string, contentId: string) {
  const content = await ContentModel.findOne({ _id: contentId, userId });
  if (!content) {
    return null;
  }

  await indexContentForRag(String(content._id));
  return ContentModel.findById(content._id);
}

export async function reindexAllUserContent(userId: string) {
  const docs = await ContentModel.find({ userId });
  let updated = 0;

  for (const doc of docs) {
    await indexContentForRag(String(doc._id));
    updated += 1;
  }

  return updated;
}
