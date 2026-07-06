import { generateSlug } from "./slug.js";
import type {
  GeneratedOkfConcept,
  OkfConceptInput,
  OkfImportance,
  OkfSourceArtifactInput,
} from "./types.js";

const MAX_ARTIFACT_RAW_TEXT = 30_000;
const MAX_SECTION_TEXT = 8_000;

function normalizeImportance(value: unknown): OkfImportance {
  return value === "low" || value === "high" ? value : "medium";
}

function capText(text: string, maxLength: number) {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength).trimEnd()}...`;
}

function yamlList(values: string[]) {
  if (values.length === 0) {
    return "[]";
  }
  return `[${values.map((value) => `"${value.replace(/"/g, '\\"')}"`).join(", ")}]`;
}

function buildUserContextSection(content: OkfConceptInput["content"]) {
  const lines: string[] = [];

  if (content.personalNote) {
    lines.push(`- Personal note: ${content.personalNote}`);
  }
  if (content.whySaved) {
    lines.push(`- Remember this for: ${content.whySaved}`);
  }
  if (content.collection) {
    lines.push(`- Collection: ${content.collection}`);
  }
  if (content.importance) {
    lines.push(`- Importance: ${content.importance}`);
  }
  if (content.tags?.length) {
    lines.push(`- Tags: ${content.tags.join(", ")}`);
  }
  if (content.type === "pdf" && content.fileMetadata) {
    const filename =
      typeof content.fileMetadata.originalFilename === "string"
        ? content.fileMetadata.originalFilename
        : null;
    const secureUrl =
      typeof content.fileMetadata.secureUrl === "string"
        ? content.fileMetadata.secureUrl
        : null;
    if (filename) {
      lines.push(`- PDF file: ${filename}`);
    }
    if (secureUrl) {
      lines.push(`- PDF URL: ${secureUrl}`);
    }
  }

  return lines.length > 0 ? lines.join("\n") : "_No additional user context provided._";
}

function buildExtractedKnowledgeSection(artifacts: OkfSourceArtifactInput[]) {
  const sections: string[] = [];
  let remainingBudget = MAX_ARTIFACT_RAW_TEXT;

  for (const artifact of artifacts) {
    if (artifact.artifactType === "metadata") {
      continue;
    }

    const rawText = artifact.rawText?.trim();
    const header = `### ${artifact.artifactType}`;
    const metaLines: string[] = [`- type: ${artifact.artifactType}`];

    if (artifact.provider) {
      metaLines.push(`- provider: ${artifact.provider}`);
    }
    if (artifact.extractionStatus) {
      metaLines.push(`- status: ${artifact.extractionStatus}`);
    }
    if (artifact.extractionQuality) {
      metaLines.push(`- quality: ${artifact.extractionQuality}`);
    }
    if (artifact.extractionError) {
      metaLines.push(`- error: ${artifact.extractionError}`);
    }

    let body = "";
    if (rawText && remainingBudget > 0) {
      const allowed = Math.min(MAX_SECTION_TEXT, remainingBudget);
      body = capText(rawText, allowed);
      remainingBudget -= body.length;
    } else if (artifact.extractionStatus === "skipped") {
      body = "_Extraction skipped for this source type._";
    } else {
      body = "_No extracted text available._";
    }

    sections.push(`${header}\n${metaLines.join("\n")}\n\n${body}`);
  }

  return sections.length > 0
    ? sections.join("\n\n")
    : "_No platform extraction artifacts were available._";
}

function buildSourcesSection(artifacts: OkfSourceArtifactInput[]) {
  return artifacts
    .map((artifact) => {
      const status = artifact.extractionStatus ?? "unknown";
      return `- type: ${artifact.artifactType} (${status})`;
    })
    .join("\n");
}

function hasExtractedArtifactText(artifacts: OkfSourceArtifactInput[]) {
  return artifacts.some(
    (artifact) =>
      artifact.artifactType !== "metadata" &&
      artifact.extractionStatus === "success" &&
      Boolean(artifact.rawText?.trim())
  );
}

export function generateOkfConcept(input: OkfConceptInput): GeneratedOkfConcept {
  const { content, sourceArtifacts } = input;
  const title = content.title?.trim() || "Untitled concept";
  const slug = generateSlug(title);
  const tags = (content.tags ?? []).filter(Boolean).slice(0, 10);
  const collection = content.collection?.trim() ?? "";
  const importance = normalizeImportance(content.importance);
  const sourceTypes = [
    ...new Set(
      sourceArtifacts
        .map((artifact) => artifact.artifactType)
        .filter((artifactType) => artifactType !== "metadata")
    ),
  ];

  const summary =
    content.summary?.trim() ||
    content.personalNote?.trim()?.slice(0, 280) ||
    `Concept generated from saved ${content.type ?? "content"}.`;

  const generatedFrom = hasExtractedArtifactText(sourceArtifacts)
    ? "source_artifacts"
    : "metadata_only";

  const frontmatter: Record<string, unknown> = {
    title,
    type: "okf_concept",
    tags,
    sourceTypes,
    contentId: content._id ? String(content._id) : null,
    importance,
    generatedFrom,
    contentType: content.type ?? null,
    link: content.link ?? null,
  };

  if (collection) {
    frontmatter.collection = collection;
  }

  const bodyMarkdown = `---
title: "${title.replace(/"/g, '\\"')}"
type: "okf_concept"
tags: ${yamlList(tags)}
sourceTypes: ${yamlList(sourceTypes)}
contentId: "${content._id ? String(content._id) : ""}"
importance: "${importance}"
generatedFrom: "${generatedFrom}"
---

# ${title}

## Summary

${summary}

## User Context

${buildUserContextSection(content)}

## Extracted Knowledge

${buildExtractedKnowledgeSection(sourceArtifacts)}

## Sources

${buildSourcesSection(sourceArtifacts)}
`;

  const relatedConcepts = tags.slice(0, 5);

  if (!bodyMarkdown.trim()) {
    throw new Error("OKF concept body could not be generated.");
  }

  return {
    title,
    slug,
    summary,
    bodyMarkdown,
    tags,
    collection,
    importance,
    sourceTypes,
    frontmatter,
    relatedConcepts,
    generatedFrom,
  };
}
