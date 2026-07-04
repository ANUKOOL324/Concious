import mongoose from "mongoose";
import { ContentChunkModel } from "../db.js";
import { getHfEmbedding } from "../providers.js";

// Step 5 of RAG: vector-search chunks for a user query (used by search + chat)
export async function retrieveRelevantChunksForUser(
  userId: string,
  query: string,
  limit: number
) {
  const queryVector = await getHfEmbedding(query, "query");
  if (!queryVector) return [];

  try {
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const results = await ContentChunkModel.aggregate([
      {
        $vectorSearch: {
          index: "chunk_vector_idx",
          path: "embedding",
          queryVector,
          numCandidates: 50,
          limit,
          filter: {
            userId: userIdObj,
          },
        },
      },
      {
        $project: {
          contentId: 1,
          title: 1,
          link: 1,
          type: 1,
          chunkText: 1,
          similarity: { $meta: "vectorSearchScore" },
        },
      },
    ]);
    return results;
  } catch (error) {
    console.error("Chunk-level Atlas vector search query failed:", error);
    return [];
  }
}
