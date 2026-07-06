import { estimateTokenCount } from "../rag/08_chunker.js";
import type { OkfMarkdownChunk } from "./types.js";

const MAX_SECTION_CHARS = 1_200;
const MAX_FALLBACK_CHUNKS = 12;
const MIN_CHUNK_CHARS = 80;

interface MarkdownSection {
  heading: string;
  level: number;
  path: string[];
  body: string;
}

function buildMetadataText(input: {
  title: string;
  summary?: string;
  tags?: string[];
  collection?: string;
  importance?: string;
}) {
  const parts = [`Title: ${input.title}`];

  if (input.summary?.trim()) {
    parts.push(`Summary: ${input.summary.trim()}`);
  }
  if (input.tags?.length) {
    parts.push(`Tags: ${input.tags.join(", ")}`);
  }
  if (input.collection?.trim()) {
    parts.push(`Collection: ${input.collection.trim()}`);
  }
  if (input.importance) {
    parts.push(`Importance: ${input.importance}`);
  }

  parts.push("Source: okf_concept");
  return parts.join("\n");
}

function buildChunkText(metadataText: string, body: string) {
  const trimmedBody = body.trim();
  if (!trimmedBody) {
    return metadataText;
  }
  return `Context: ${metadataText}\n\nChunk Content:\n${trimmedBody}`;
}

function stripFrontmatter(markdown: string) {
  const trimmed = markdown.trim();
  if (!trimmed.startsWith("---")) {
    return trimmed;
  }

  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    return trimmed;
  }

  return trimmed.slice(end + 4).trim();
}

function splitMarkdownSections(markdown: string): MarkdownSection[] {
  const body = stripFrontmatter(markdown);
  const lines = body.split("\n");
  const sections: MarkdownSection[] = [];
  const headingStack: Array<{ level: number; text: string }> = [];

  let currentHeading = "Document";
  let currentLevel = 1;
  let currentLines: string[] = [];

  function flushSection() {
    const sectionBody = currentLines.join("\n").trim();
    if (!sectionBody) {
      return;
    }

    const path = headingStack.map((entry) => entry.text);
    sections.push({
      heading: currentHeading,
      level: currentLevel,
      path,
      body: sectionBody,
    });
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushSection();
      currentLines = [];

      const level = headingMatch[1]?.length ?? 1;
      const text = headingMatch[2]?.trim() ?? "Section";
      currentHeading = text;
      currentLevel = level;

      while (headingStack.length > 0) {
        const last = headingStack[headingStack.length - 1];
        if (!last || last.level >= level) {
          headingStack.pop();
          continue;
        }
        break;
      }
      headingStack.push({ level, text });
      continue;
    }

    currentLines.push(line);
  }

  flushSection();
  return sections;
}

function splitLongSection(section: MarkdownSection): MarkdownSection[] {
  if (section.body.length <= MAX_SECTION_CHARS) {
    return [section];
  }

  const parts: MarkdownSection[] = [];
  let offset = 0;

  while (offset < section.body.length && parts.length < MAX_FALLBACK_CHUNKS) {
    const slice = section.body.slice(offset, offset + MAX_SECTION_CHARS).trim();
    if (slice.length >= MIN_CHUNK_CHARS) {
      parts.push({
        ...section,
        heading: `${section.heading} (part ${parts.length + 1})`,
        body: slice,
      });
    }
    offset += MAX_SECTION_CHARS;
  }

  return parts.length > 0 ? parts : [section];
}

function buildChunkFromSection(
  section: MarkdownSection,
  metadataText: string,
  chunkIndex: number
): OkfMarkdownChunk {
  const body = section.body.trim();
  const chunkText = buildChunkText(metadataText, body);
  const chunk: OkfMarkdownChunk = {
    body,
    metadataText,
    chunkText,
    tokenCount: estimateTokenCount(chunkText),
    charLength: chunkText.length,
  };

  if (section.heading) {
    chunk.heading = section.heading;
  }
  if (section.path.length > 0) {
    chunk.sectionPath = section.path;
  }

  void chunkIndex;
  return chunk;
}

export function chunkOkfMarkdown(concept: {
  title: string;
  bodyMarkdown: string;
  summary?: string;
  tags?: string[];
  collection?: string;
  importance?: string;
}): OkfMarkdownChunk[] {
  const metadataInput: {
    title: string;
    summary?: string;
    tags?: string[];
    collection?: string;
    importance?: string;
  } = {
    title: concept.title,
  };

  if (concept.summary) {
    metadataInput.summary = concept.summary;
  }
  if (concept.tags?.length) {
    metadataInput.tags = concept.tags;
  }
  if (concept.collection) {
    metadataInput.collection = concept.collection;
  }
  if (concept.importance) {
    metadataInput.importance = concept.importance;
  }

  const metadataText = buildMetadataText(metadataInput);

  const sections = splitMarkdownSections(concept.bodyMarkdown);
  const expandedSections =
    sections.length > 0
      ? sections.flatMap((section) => splitLongSection(section))
      : [{ heading: concept.title, level: 1, path: [concept.title], body: concept.bodyMarkdown }];

  const chunks = expandedSections
    .map((section, index) => buildChunkFromSection(section, metadataText, index))
    .filter((chunk) => chunk.chunkText.trim().length >= MIN_CHUNK_CHARS);

  if (chunks.length > 0) {
    return chunks.slice(0, MAX_FALLBACK_CHUNKS);
  }

  const fallbackText = buildChunkText(metadataText, concept.bodyMarkdown);
  return [
    {
      body: concept.bodyMarkdown.trim(),
      metadataText,
      chunkText: fallbackText,
      tokenCount: estimateTokenCount(fallbackText),
      charLength: fallbackText.length,
    },
  ];
}
