// Step 3 of RAG: split scraped text into overlapping chunks with metadata prefix
export function chunkText(text: string, metadata: string): string[] {
  const chunks: string[] = [];
  const chunkSize = 900;
  const overlap = 120;
  const maxChunks = 10;

  if (!text || text.trim().length === 0) {
    return [metadata];
  }

  let index = 0;
  while (index < text.length && chunks.length < maxChunks) {
    let end = index + chunkSize;
    if (end > text.length) {
      end = text.length;
    }

    const chunkContent = text.slice(index, end).trim();
    if (chunkContent.length > 50) {
      chunks.push(`Context: ${metadata}\n\nChunk Content:\n${chunkContent}`);
    }

    if (end === text.length) {
      break;
    }

    index += chunkSize - overlap;
  }

  if (chunks.length === 0) {
    chunks.push(metadata);
  }

  return chunks;
}
