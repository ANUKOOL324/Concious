import mongoose from "mongoose";
import { ContentModel } from "../db.js";
import { getHfEmbedding } from "../providers.js";
import { retrieveRelevantChunksForUser } from "../rag/index.js";
import type { SearchItem, SearchResponse } from "../types/search.js";

async function lexicalSearch(userId: string, query: string, limit: number) {
  const regex = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const results = await ContentModel.find({
    userId,
    $or: [{ title: regex }, { link: regex }, { type: regex }],
  })
    .sort({ _id: -1 })
    .limit(limit)
    .lean();

  return results.map((item, index): SearchItem => {
    const title = item.title ?? null;
    const link = item.link ?? null;
    const type = item.type ?? null;

    let similarity = 0.72;

    if (title && regex.test(title)) {
      similarity = 0.99;
    } else if (link && regex.test(link)) {
      similarity = 0.92;
    } else if (type && regex.test(type)) {
      similarity = 0.86;
    }

    similarity = Math.max(0.6, similarity - index * 0.02);

    return {
      _id: String(item._id),
      title,
      link,
      type,
      similarity,
    };
  });
}

function mergeSearchResults(
  vectorResults: SearchItem[],
  lexicalResults: SearchItem[],
  limit: number
) {
  const merged = new Map<string, SearchItem>();
  const getKey = (item: SearchItem) => {
    const normalizedLink = item.link?.trim().toLowerCase();
    const normalizedTitle = item.title?.trim().toLowerCase();
    return (
      normalizedLink ||
      normalizedTitle ||
      (item._id ? String(item._id) : `fallback-${Math.random()}`)
    );
  };

  for (const item of vectorResults) {
    merged.set(getKey(item), item);
  }

  for (const item of lexicalResults) {
    const key = getKey(item);
    const current = merged.get(key);

    if (!current) {
      merged.set(key, item);
      continue;
    }

    merged.set(key, {
      ...current,
      similarity: Math.max(current.similarity ?? 0, item.similarity ?? 0),
    });
  }

  return [...merged.values()]
    .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
    .slice(0, limit);
}

export async function searchUserContent(
  userId: string,
  query: string,
  limit: number
): Promise<SearchResponse> {
  const lexicalResults = await lexicalSearch(userId, query, limit);

  if (!query) {
    return { query, count: 0, mode: "lexical-fallback", results: [] };
  }

  const queryVector = await getHfEmbedding(query, "query");

  if (!queryVector) {
    return {
      query,
      count: lexicalResults.length,
      mode: "lexical-fallback",
      results: lexicalResults,
    };
  }

  try {
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const chunks = await retrieveRelevantChunksForUser(userId, query, limit * 3);
    const uniqueContentIds = new Set<string>();
    const chunkResults: SearchItem[] = [];

    for (const chunk of chunks) {
      const cid = String(chunk.contentId);
      if (!uniqueContentIds.has(cid)) {
        uniqueContentIds.add(cid);
        chunkResults.push({
          _id: cid,
          title: chunk.title ?? null,
          link: chunk.link ?? null,
          type: chunk.type ?? null,
          similarity: chunk.similarity,
          snippet: chunk.chunkText,
        });
      }
      if (chunkResults.length >= limit) {
        break;
      }
    }

    let mergedResults = chunkResults;
    let mode: SearchResponse["mode"] = "vector-chunk";

    if (mergedResults.length === 0) {
      const legacyVectorResults = await ContentModel.aggregate([
        {
          $vectorSearch: {
            index: "vector_idx",
            path: "embedding",
            queryVector,
            numCandidates: 50,
            limit,
          },
        },
        { $match: { userId: userIdObj } },
        {
          $project: {
            title: 1,
            link: 1,
            type: 1,
            similarity: { $meta: "vectorSearchScore" },
          },
        },
      ]);

      const mappedLegacy = legacyVectorResults.map(
        (item): SearchItem => ({
          _id: String(item._id),
          title: item.title ?? null,
          link: item.link ?? null,
          type: item.type ?? null,
          similarity: item.similarity,
        })
      );

      mergedResults = mergeSearchResults(mappedLegacy, lexicalResults, limit);
      mode = "vector";
    } else {
      mergedResults = mergeSearchResults(chunkResults, lexicalResults, limit);
    }

    return { query, count: mergedResults.length, mode, results: mergedResults };
  } catch (error) {
    console.error("vector search failed", error);
    return {
      query,
      count: lexicalResults.length,
      mode: "lexical-fallback",
      results: lexicalResults,
    };
  }
}

// Exported for chat service lexical fallback
export { lexicalSearch };
