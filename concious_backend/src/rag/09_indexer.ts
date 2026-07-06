import mongoose from "mongoose";
import { HF_EMBEDDING_MODEL } from "../config.js";
import {
  ContentModel,
  ContentChunkModel,
  OkfConceptModel,
  SourceArtifactModel,
} from "../db.js";
import { chunkOkfMarkdown, generateOkfConcept } from "../okf/index.js";
import type { OkfSourceArtifactInput } from "../okf/types.js";
import { getHfEmbedding } from "../providers.js";
import { extractSourceArtifactInputs } from "./07_extractors.js";
import { buildMetadataText } from "./02_metadata.js";

const EMBEDDING_MODEL = HF_EMBEDDING_MODEL;
const EMBEDDING_DIMENSION = 384;
const CHUNKING_VERSION = "v2";
const EXTRACTOR_VERSION = "v2";
const MIN_BODY_TEXT_LENGTH = 100;

function mapLegacySourceLabel(sourceType: string): string {
  if (sourceType === "okf_concept") {
    return "okf-concept";
  }

  if (sourceType === "article") {
    return "url-extraction";
  }

  if (sourceType === "user_context" || sourceType === "metadata") {
    return "metadata";
  }

  return sourceType;
}

function toOkfArtifactInput(artifact: mongoose.Document): OkfSourceArtifactInput {
  const input: OkfSourceArtifactInput = {
    _id: artifact._id as mongoose.Types.ObjectId,
    artifactType: String(artifact.get("artifactType") ?? "other"),
  };

  const provider = artifact.get("provider");
  if (typeof provider === "string") {
    input.provider = provider;
  }

  const rawText = artifact.get("rawText");
  if (typeof rawText === "string") {
    input.rawText = rawText;
  }

  const extractionStatus = artifact.get("extractionStatus");
  if (typeof extractionStatus === "string") {
    input.extractionStatus = extractionStatus;
  }

  const extractionQuality = artifact.get("extractionQuality");
  if (typeof extractionQuality === "string") {
    input.extractionQuality = extractionQuality;
  }

  const extractionError = artifact.get("extractionError");
  if (typeof extractionError === "string") {
    input.extractionError = extractionError;
  }

  const metadata = artifact.get("metadata");
  if (metadata && typeof metadata === "object") {
    input.metadata = metadata as Record<string, unknown>;
  }

  return input;
}

async function createPlatformArtifact(
  content: mongoose.Document & {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
  },
  extraction: Awaited<ReturnType<typeof extractSourceArtifactInputs>>[number]
) {
  const platformArtifactData: Record<string, unknown> = {
    contentId: content._id,
    userId: content.userId,
    artifactType: extraction.artifactType,
    provider: extraction.provider,
    sourceUrl: extraction.sourceUrl,
    extractionStatus: extraction.extractionStatus,
    extractedAt: new Date(),
    extractorVersion: EXTRACTOR_VERSION,
    metadata: extraction.metadata,
  };

  if (extraction.rawText) {
    platformArtifactData.rawText = extraction.rawText;
  }
  if (extraction.extractionQuality) {
    platformArtifactData.extractionQuality = extraction.extractionQuality;
  }
  if (extraction.extractionError) {
    platformArtifactData.extractionError = extraction.extractionError;
  }
  if (typeof extraction.charLength === "number") {
    platformArtifactData.charLength = extraction.charLength;
  }

  return SourceArtifactModel.create(platformArtifactData);
}

export async function indexContentForRag(contentId: string): Promise<void> {
  const content = await ContentModel.findById(contentId);
  if (!content) return;

  content.indexingStatus = "pending";
  content.indexingError = "";
  await content.save();

  try {
    await ContentChunkModel.deleteMany({ contentId: content._id });
    await SourceArtifactModel.deleteMany({ contentId: content._id });
    await OkfConceptModel.deleteMany({
      contentId: content._id,
      userId: content.userId,
    });

    const metadataText = buildMetadataText({
      title: content.title,
      link: content.link,
      type: content.type,
      tags: content.tags,
      collection: content.collection,
      importance: content.importance,
      whySaved: content.whySaved,
      personalNote: content.personalNote,
      description: content.description,
      summary: content.summary,
    });

    const metadataArtifact = await SourceArtifactModel.create({
      contentId: content._id,
      userId: content.userId,
      artifactType: "metadata",
      provider: "user",
      sourceUrl: content.link ?? null,
      rawText: metadataText,
      extractionStatus: metadataText ? "success" : "skipped",
      extractedAt: new Date(),
      extractorVersion: EXTRACTOR_VERSION,
      charLength: metadataText.length,
      metadata: {
        platform: content.type,
        sourceType: content.type,
        originalUrl: content.link ?? null,
        normalizedUrl: content.link ?? null,
        contentType: content.type,
      },
    });

    const platformExtractions = await extractSourceArtifactInputs({
      title: content.title,
      link: content.link,
      type: content.type,
      summary: content.summary,
      description: content.description,
      personalNote: content.personalNote,
      whySaved: content.whySaved,
      tags: content.tags,
      collection: content.collection,
    });

    const savedArtifacts: mongoose.Document[] = [metadataArtifact];

    for (const platformExtraction of platformExtractions) {
      const platformArtifact = await createPlatformArtifact(content, platformExtraction);
      savedArtifacts.push(platformArtifact);

      if (platformExtraction.sourceMetadata) {
        content.sourceMetadata = platformExtraction.sourceMetadata;
      }

      if (
        platformExtraction.bodyText &&
        platformExtraction.bodyText.length >
          (platformExtraction.minBodyLength ?? MIN_BODY_TEXT_LENGTH) &&
        platformExtraction.extractionStatus === "success"
      ) {
        content.extractedText = platformExtraction.bodyText;
      }
    }

    const fileMetadata = content.get("fileMetadata");
    const generatedOkf = generateOkfConcept({
      content: {
        _id: content._id,
        title: content.title,
        link: content.link,
        type: content.type,
        summary: content.summary,
        description: content.description,
        personalNote: content.personalNote,
        whySaved: content.whySaved,
        tags: content.tags,
        collection: content.collection,
        importance: content.importance,
        fileMetadata:
          fileMetadata && typeof fileMetadata === "object"
            ? (fileMetadata as Record<string, unknown>)
            : null,
      },
      sourceArtifacts: savedArtifacts.map((artifact) => toOkfArtifactInput(artifact)),
    });

    const okfConcept = await OkfConceptModel.create({
      userId: content.userId,
      contentId: content._id,
      sourceArtifactIds: savedArtifacts.map((artifact) => artifact._id),
      title: generatedOkf.title,
      slug: generatedOkf.slug,
      summary: generatedOkf.summary,
      bodyMarkdown: generatedOkf.bodyMarkdown,
      tags: generatedOkf.tags,
      collection: generatedOkf.collection,
      importance: generatedOkf.importance,
      sourceTypes: generatedOkf.sourceTypes,
      frontmatter: generatedOkf.frontmatter,
      relatedConcepts: generatedOkf.relatedConcepts,
      generationStatus: "generated",
      generatedFrom: generatedOkf.generatedFrom,
      okfVersion: "v1",
    });

    const okfChunks = chunkOkfMarkdown({
      title: generatedOkf.title,
      bodyMarkdown: generatedOkf.bodyMarkdown,
      summary: generatedOkf.summary,
      tags: generatedOkf.tags,
      collection: generatedOkf.collection,
      importance: generatedOkf.importance,
    });

    if (okfChunks.length === 0) {
      throw new Error("No indexable OKF chunks were generated for this content item.");
    }

    const chunkDocs = [];

    for (const [chunkIndex, okfChunk] of okfChunks.entries()) {
      const embedding = await getHfEmbedding(okfChunk.chunkText, "document");

      if (!embedding) {
        continue;
      }

      const chunkDoc: Record<string, unknown> = {
        contentId: content._id,
        userId: content.userId,
        sourceArtifactId: metadataArtifact._id,
        okfConceptId: okfConcept._id,
        okfSlug: generatedOkf.slug,
        title: content.title,
        link: content.link,
        type: content.type,
        body: okfChunk.body,
        metadataText: okfChunk.metadataText,
        chunkText: okfChunk.chunkText,
        chunkIndex,
        sourceType: "okf_concept",
        tokenCount: okfChunk.tokenCount,
        charLength: okfChunk.charLength,
        embedding,
        embeddingModel: EMBEDDING_MODEL,
        embeddingDimension: EMBEDDING_DIMENSION,
        chunkingVersion: CHUNKING_VERSION,
        source: mapLegacySourceLabel("okf_concept"),
      };

      if (okfChunk.heading) {
        chunkDoc.heading = okfChunk.heading;
      }
      if (okfChunk.sectionPath?.length) {
        chunkDoc.sectionPath = okfChunk.sectionPath.join(" > ");
      }

      chunkDocs.push(chunkDoc);
    }

    if (chunkDocs.length === 0) {
      await OkfConceptModel.updateOne(
        { _id: okfConcept._id },
        {
          generationStatus: "failed",
          generationError: "Failed to generate embeddings for OKF chunks.",
        }
      );
      throw new Error("Failed to generate embeddings for any OKF chunks.");
    }

    await ContentChunkModel.insertMany(chunkDocs);

    content.indexingStatus = "indexed";
    content.indexingError = "";
    content.lastIndexedAt = new Date();
    await content.save();
  } catch (error: unknown) {
    console.error(`RAG Indexing failure on content ${contentId}:`, error);

    content.indexingStatus = "failed";
    content.indexingError =
      error instanceof Error ? error.message : "Unknown indexing error";
    content.lastIndexedAt = new Date();
    await content.save();
  }
}
