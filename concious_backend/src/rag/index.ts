// RAG pipeline — public entry points for the rest of the backend
//
// Flow: metadata → scraper → chunker → indexer (on save)
//       retrieval (on search/chat)
export { buildMetadataText } from "./metadata.js";
export { extractReadableTextFromUrl } from "./scraper.js";
export { chunkText } from "./chunker.js";
export { indexContentForRag } from "./indexer.js";
export { retrieveRelevantChunksForUser } from "./retrieval.js";
