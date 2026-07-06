import mongoose, { model, Schema } from "mongoose";
import { MONGO_URI } from "./config.js";

const DEFAULT_EMBEDDING_MODEL = "intfloat/e5-small-v2";
const DEFAULT_EMBEDDING_DIMENSION = 384;
const DEFAULT_CHUNKING_VERSION = "v2";

export async function connectDB() {
  await mongoose.connect(MONGO_URI);
}

// 1. User
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model("user", UserSchema);

// 2. Content
const CONTENT_TYPES = [
  "youtube",
  "twitter",
  "spotify",
  "article",
  "pdf",
  "other",
] as const;

const ContentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    normalizedTitle: { type: String, trim: true },
    link: { type: String, trim: true },
    normalizedLink: { type: String, trim: true },
    type: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: CONTENT_TYPES,
    },
    tags: { type: [String], default: [] },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },

    personalNote: { type: String },
    summary: { type: String },
    whySaved: { type: String },
    collection: { type: String },
    importance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    description: { type: String },
    extractedText: { type: String },

    sourceMetadata: { type: Schema.Types.Mixed },
    fileMetadata: { type: Schema.Types.Mixed },

    embedding: { type: [Number], default: undefined },
    embeddingModel: { type: String, default: DEFAULT_EMBEDDING_MODEL },
    embeddingDimension: { type: Number, default: DEFAULT_EMBEDDING_DIMENSION },

    indexingStatus: {
      type: String,
      enum: ["not_indexed", "pending", "indexed", "failed"],
      default: "not_indexed",
    },
    indexingError: { type: String },
    lastIndexedAt: { type: Date },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

ContentSchema.index({ userId: 1 });
ContentSchema.index({ userId: 1, type: 1 });
ContentSchema.index({ userId: 1, normalizedLink: 1 });
ContentSchema.index({ userId: 1, createdAt: -1 });

export const ContentModel = model("content", ContentSchema);

// 3. SourceArtifact
const ARTIFACT_TYPES = [
  "metadata",
  "article",
  "youtube_transcript",
  "youtube_description",
  "spotify_metadata",
  "twitter_thread",
  "pdf_text",
  "manual_note",
  "other",
] as const;

const ARTIFACT_PROVIDERS = [
  "user",
  "scraper",
  "youtube",
  "spotify",
  "twitter",
  "pdf",
  "system",
] as const;

const SourceArtifactSchema = new Schema(
  {
    contentId: {
      type: mongoose.Types.ObjectId,
      ref: "content",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    artifactType: {
      type: String,
      enum: ARTIFACT_TYPES,
      required: true,
    },
    provider: {
      type: String,
      enum: ARTIFACT_PROVIDERS,
      default: "system",
    },
    sourceUrl: { type: String },
    rawText: { type: String },
    rawHtml: { type: String },
    metadata: { type: Schema.Types.Mixed },
    extractionStatus: {
      type: String,
      enum: ["pending", "success", "failed", "skipped"],
      default: "pending",
    },
    extractionQuality: { type: String },
    extractionError: { type: String },
    extractedAt: { type: Date },
    extractorVersion: { type: String },
    charLength: { type: Number },
  },
  { timestamps: true }
);

SourceArtifactSchema.index({ contentId: 1 });
SourceArtifactSchema.index({ userId: 1 });
SourceArtifactSchema.index({ userId: 1, contentId: 1 });
SourceArtifactSchema.index({ userId: 1, artifactType: 1 });

export const SourceArtifactModel = model("sourceartifact", SourceArtifactSchema);

// 3b. OkfConcept
const OkfConceptSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    contentId: {
      type: mongoose.Types.ObjectId,
      ref: "content",
      required: true,
    },
    sourceArtifactIds: {
      type: [{ type: mongoose.Types.ObjectId, ref: "sourceartifact" }],
      default: [],
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    summary: { type: String, default: "" },
    bodyMarkdown: { type: String, required: true },
    tags: { type: [String], default: [] },
    collection: { type: String, default: "" },
    importance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    sourceTypes: { type: [String], default: [] },
    frontmatter: { type: Schema.Types.Mixed, default: {} },
    relatedConcepts: { type: [String], default: [] },
    generationStatus: {
      type: String,
      enum: ["pending", "generated", "failed"],
      default: "pending",
    },
    generationError: { type: String },
    generatedFrom: {
      type: String,
      enum: ["source_artifacts", "metadata_only", "manual"],
      default: "source_artifacts",
    },
    okfVersion: { type: String, default: "v1" },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

OkfConceptSchema.index({ userId: 1 });
OkfConceptSchema.index({ contentId: 1 });
OkfConceptSchema.index({ userId: 1, contentId: 1 });
OkfConceptSchema.index({ userId: 1, slug: 1 });
OkfConceptSchema.index({ userId: 1, tags: 1 });

export const OkfConceptModel = model("okfconcept", OkfConceptSchema);

// 4. ContentChunk
const CHUNK_SOURCE_TYPES = [
  "metadata",
  "user_context",
  "article",
  "youtube_transcript",
  "youtube_description",
  "spotify_metadata",
  "twitter_thread",
  "pdf_text",
  "okf_concept",
  "mixed",
  "other",
] as const;

const ContentChunkSchema = new Schema(
  {
    contentId: {
      type: mongoose.Types.ObjectId,
      ref: "content",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },

    title: { type: String },
    link: { type: String },
    type: { type: String },

    sourceArtifactId: {
      type: mongoose.Types.ObjectId,
      ref: "sourceartifact",
    },
    okfConceptId: {
      type: mongoose.Types.ObjectId,
      ref: "okfconcept",
    },
    okfSlug: { type: String },
    body: { type: String },
    metadataText: { type: String },

    chunkText: {
      type: String,
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },

    source: {
      type: String,
      default: "metadata",
    },

    sourceType: {
      type: String,
      enum: CHUNK_SOURCE_TYPES,
      default: "mixed",
    },
    heading: { type: String },
    sectionPath: { type: String },
    startOffset: { type: Number },
    endOffset: { type: Number },
    tokenCount: { type: Number },
    charLength: { type: Number },

    embeddingModel: {
      type: String,
      default: DEFAULT_EMBEDDING_MODEL,
    },
    embeddingDimension: {
      type: Number,
      default: DEFAULT_EMBEDDING_DIMENSION,
    },
    chunkingVersion: {
      type: String,
      default: DEFAULT_CHUNKING_VERSION,
    },
    qualityScore: { type: Number },
  },
  { timestamps: true }
);

ContentChunkSchema.index({ userId: 1 });
ContentChunkSchema.index({ contentId: 1 });
ContentChunkSchema.index({ userId: 1, contentId: 1 });
ContentChunkSchema.index({ userId: 1, sourceType: 1 });
ContentChunkSchema.index({ userId: 1, okfConceptId: 1 });
ContentChunkSchema.index({
  body: "text",
  metadataText: "text",
  chunkText: "text",
  title: "text",
  type: "text",
});

export const ContentChunkModel = model("contentchunk", ContentChunkSchema);

// 5. Link
const LinkSchema = new Schema(
  {
    hash: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const LinkModel = model("link", LinkSchema);
