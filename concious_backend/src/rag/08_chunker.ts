const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 120;
const MAX_CHUNKS = 10;

export interface StructuredChunk {
  body: string;
  metadataText: string;
  chunkText: string;
  chunkIndex: number;
  sourceType: string;
  startOffset?: number;
  endOffset?: number;
  tokenCount: number;
  charLength: number;
}

export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function buildChunkText(metadataText: string, body: string): string {
  if (!body.trim()) {
    return metadataText;
  }

  return `Context: ${metadataText}\n\nChunk Content:\n${body}`;
}

function buildMetadataOnlyChunk(
  metadataText: string,
  sourceType: string,
  chunkIndex: number
): StructuredChunk {
  const chunkText = metadataText.trim();

  return {
    body: "",
    metadataText,
    chunkText,
    chunkIndex,
    sourceType,
    tokenCount: estimateTokenCount(chunkText),
    charLength: chunkText.length,
  };
}

function buildBodyChunks(
  bodyText: string,
  metadataText: string,
  sourceType: string,
  startIndex: number
): StructuredChunk[] {
  const chunks: StructuredChunk[] = [];
  const trimmedBody = bodyText.trim();

  if (!trimmedBody) {
    return [];
  }

  let offset = 0;

  while (offset < trimmedBody.length && chunks.length < MAX_CHUNKS) {
    let end = offset + CHUNK_SIZE;
    if (end > trimmedBody.length) {
      end = trimmedBody.length;
    }

    const bodySlice = trimmedBody.slice(offset, end).trim();

    if (bodySlice.length > 50) {
      const chunkText = buildChunkText(metadataText, bodySlice);

      chunks.push({
        body: bodySlice,
        metadataText,
        chunkText,
        chunkIndex: startIndex + chunks.length,
        sourceType,
        startOffset: offset,
        endOffset: end,
        tokenCount: estimateTokenCount(chunkText),
        charLength: chunkText.length,
      });
    }

    if (end === trimmedBody.length) {
      break;
    }

    offset += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

export function buildStructuredChunks(
  bodyText: string,
  metadataText: string,
  sourceType: string,
  startChunkIndex = 0
): StructuredChunk[] {
  const trimmedMetadata = metadataText.trim();
  const trimmedBody = bodyText.trim();

  if (!trimmedBody) {
    if (!trimmedMetadata) {
      return [];
    }

    return [buildMetadataOnlyChunk(trimmedMetadata, sourceType, startChunkIndex)];
  }

  const bodyChunks = buildBodyChunks(trimmedBody, trimmedMetadata, sourceType, startChunkIndex);

  if (bodyChunks.length > 0) {
    return bodyChunks;
  }

  if (!trimmedMetadata) {
    return [];
  }

  return [buildMetadataOnlyChunk(trimmedMetadata, sourceType, startChunkIndex)];
}

export function chunkText(text: string, metadata: string): string[] {
  return buildStructuredChunks(text, metadata, "mixed").map((chunk) => chunk.chunkText);
}
