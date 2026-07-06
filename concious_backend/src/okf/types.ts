import type mongoose from "mongoose";
import type { ContentForExtraction } from "../rag/07_extractors.js";

export type OkfImportance = "low" | "medium" | "high";
export type OkfGeneratedFrom = "source_artifacts" | "metadata_only" | "manual";

export interface OkfContentInput extends ContentForExtraction {
  _id?: mongoose.Types.ObjectId | string;
  importance?: OkfImportance | null;
  fileMetadata?: Record<string, unknown> | null;
}

export interface OkfSourceArtifactInput {
  _id?: mongoose.Types.ObjectId | string;
  artifactType: string;
  provider?: string | null;
  rawText?: string | null;
  extractionStatus?: string | null;
  extractionQuality?: string | null;
  extractionError?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface OkfConceptInput {
  content: OkfContentInput;
  sourceArtifacts: OkfSourceArtifactInput[];
}

export interface GeneratedOkfConcept {
  title: string;
  slug: string;
  summary: string;
  bodyMarkdown: string;
  tags: string[];
  collection: string;
  importance: OkfImportance;
  sourceTypes: string[];
  frontmatter: Record<string, unknown>;
  relatedConcepts: string[];
  generatedFrom: OkfGeneratedFrom;
}

export interface OkfMarkdownChunk {
  body: string;
  metadataText: string;
  chunkText: string;
  heading?: string;
  sectionPath?: string[];
  tokenCount: number;
  charLength: number;
}
