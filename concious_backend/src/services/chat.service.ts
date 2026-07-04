import { askOpenRouter, getHfEmbedding } from "../providers.js";
import { retrieveRelevantChunksForUser } from "../rag/index.js";
import { lexicalSearch } from "./search.service.js";
import type { SearchItem } from "../types/search.js";

export async function chatWithAshqnor(userId: string, message: string) {
  const queryVector = await getHfEmbedding(message, "query");
  let mode: "vector-chunk" | "lexical-fallback" = "lexical-fallback";
  let sources: SearchItem[] = [];
  let context = "";

  if (queryVector) {
    try {
      const chunks = await retrieveRelevantChunksForUser(userId, message, 6);

      if (chunks.length > 0) {
        mode = "vector-chunk";
        sources = chunks.map((chunk) => ({
          _id: String(chunk.contentId),
          title: chunk.title ?? null,
          link: chunk.link ?? null,
          type: chunk.type ?? null,
          similarity: chunk.similarity,
          snippet: chunk.chunkText,
        }));

        context = chunks
          .map((chunk, index) => {
            const title = chunk.title?.trim() || `Saved item ${index + 1}`;
            const type = chunk.type || "content";
            const link = chunk.link || "no external link";
            const snippetText = chunk.chunkText || "";
            return `- ${title} (${type}) -> ${link}\n  Context snippet: "${snippetText}"`;
          })
          .join("\n\n");
      }
    } catch (error) {
      console.error("chat vector retrieval failed", error);
    }
  }

  if (sources.length === 0) {
    const lexicalItems = await lexicalSearch(userId, message, 4);
    sources = lexicalItems;
    mode = "lexical-fallback";
    context = lexicalItems.length
      ? lexicalItems
          .map((item, index) => {
            const title = item.title?.trim() || `Saved item ${index + 1}`;
            const type = item.type || "content";
            const link = item.link || "no external link";
            return `- ${title} (${type}) -> ${link}`;
          })
          .join("\n")
      : "No saved content matched strongly.";
  }

  const llmResponse = await askOpenRouter(message, context);

  return {
    mode,
    response:
      llmResponse ??
      (sources.length
        ? `I found ${sources.length} relevant items. The strongest match is "${sources[0]?.title || "an untitled item"}". What aspect would you like to discuss?`
        : "I couldn't locate any strong matching context in your dashboard. Let me know if you would like me to try another search term!"),
    sources,
  };
}
