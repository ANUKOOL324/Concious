import { ContentModel, ContentChunkModel } from "../db.js";
import { getHfEmbedding } from "../providers.js";
import { buildMetadataText, indexContentForRag } from "../rag/index.js";
import {
  normalizeImportance,
  normalizeTags,
  optionalText,
} from "../utils/contentHelpers.js";

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

function parseCreateBody(body: Record<string, unknown>): CreateContentInput {
  return {
    title: String(body.title ?? ""),
    link: String(body.link ?? ""),
    type: String(body.type ?? ""),
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

export async function listUserContent(userId: string) {
  return ContentModel.find({ userId }).populate("userId", "username");
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

export async function deleteContent(userId: string, contentId: string) {
  const existingContent = await ContentModel.findOne({ _id: contentId, userId });
  if (!existingContent) {
    return false;
  }

  await ContentChunkModel.deleteMany({
    contentId: existingContent._id,
    userId: existingContent.userId,
  });

  await ContentModel.deleteOne({ _id: existingContent._id, userId });
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
