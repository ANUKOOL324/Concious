import mongoose from "mongoose";
import { ContentChunkModel } from "../db.js";
import { RERANK_CANDIDATE_LIMIT } from "../config.js";
import { getHfEmbedding } from "../providers.js";
import type { RetrievedChunk } from "../types/search.js";
import { rerankChunksForQuery } from "./12_reranker.js";
import { fuseChunksWithRrf } from "./11_rrf.js";

const SNIPPET_MAX_LENGTH = 280;

function chunkSnippet(chunk: { body?: string | null; chunkText?: string | null }) {
  const text = chunk.body?.trim() || chunk.chunkText?.trim() || "";
  if (text.length <= SNIPPET_MAX_LENGTH) {
    return text;
  }
  return `${text.slice(0, SNIPPET_MAX_LENGTH)}...`;
}

function escapeRegex(value: string) {
  return value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeLexicalScore(rawScore: number) {
  return Math.min(0.99, 0.72 + rawScore * 0.05);
}

function scoreRegexMatch(
  queryRegex: RegExp,
  fields: {
    title?: string | null;
    type?: string | null;
    body?: string | null;
    metadataText?: string | null;
    chunkText?: string | null;
  }
) {
  if (fields.title && queryRegex.test(fields.title)) {
    return 0.99;
  }
  if (fields.chunkText && queryRegex.test(fields.chunkText)) {
    return 0.94;
  }
  if (fields.body && queryRegex.test(fields.body)) {
    return 0.9;
  }
  if (fields.metadataText && queryRegex.test(fields.metadataText)) {
    return 0.87;
  }
  if (fields.type && queryRegex.test(fields.type)) {
    return 0.86;
  }

  return 0.72;
}

function mapChunkDocument(
  chunk: Record<string, unknown>,
  retrievalType: RetrievedChunk["retrievalType"],
  score: number
): RetrievedChunk {
  const body = typeof chunk.body === "string" ? chunk.body : null;
  const chunkText = typeof chunk.chunkText === "string" ? chunk.chunkText : null;
  const mapped: RetrievedChunk = {
    contentId: String(chunk.contentId),
    title: typeof chunk.title === "string" ? chunk.title : null,
    link: typeof chunk.link === "string" ? chunk.link : null,
    type: typeof chunk.type === "string" ? chunk.type : null,
    body,
    metadataText: typeof chunk.metadataText === "string" ? chunk.metadataText : null,
    chunkText,
    sourceType: typeof chunk.sourceType === "string" ? chunk.sourceType : null,
    snippet: chunkSnippet({ body, chunkText }),
    similarity: score,
    retrievalType,
  };

  if (chunk._id) {
    mapped._id = String(chunk._id);
  }

  if (retrievalType === "lexical") {
    mapped.lexicalScore = score;
  }

  return mapped;
}

export async function retrieveRelevantChunksForUser(
  userId: string,
  query: string,
  limit: number
): Promise<RetrievedChunk[]> {
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
          _id: 1,
          contentId: 1,
          title: 1,
          link: 1,
          type: 1,
          body: 1,
          metadataText: 1,
          chunkText: 1,
          sourceType: 1,
          similarity: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    return results.map((chunk) =>
      mapChunkDocument(chunk, "vector", Number(chunk.similarity ?? 0))
    );
  } catch (error) {
    console.error("Chunk-level Atlas vector search query failed:", error);
    return [];
  }
}

async function retrieveLexicalChunksWithTextIndex(
  userId: string,
  query: string,
  limit: number
): Promise<RetrievedChunk[]> {
  const userIdObj = new mongoose.Types.ObjectId(userId);

  const results = await ContentChunkModel.find(
    {
      userId: userIdObj,
      $text: { $search: query },
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .lean();

  return results.map((chunk, index) => {
    const scoredChunk = chunk as typeof chunk & { score?: number };
    const textScore = typeof scoredChunk.score === "number" ? scoredChunk.score : 0;
    const lexicalScore = normalizeLexicalScore(textScore) - index * 0.02;
    return mapChunkDocument(scoredChunk, "lexical", Math.max(0.6, lexicalScore));
  });
}

async function retrieveLexicalChunksWithRegex(
  userId: string,
  query: string,
  limit: number
): Promise<RetrievedChunk[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const queryRegex = new RegExp(escapeRegex(trimmedQuery), "i");

  const results = await ContentChunkModel.find({
    userId,
    $or: [
      { body: queryRegex },
      { metadataText: queryRegex },
      { chunkText: queryRegex },
      { title: queryRegex },
      { type: queryRegex },
    ],
  })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();

  return results.map((chunk, index) => {
    const lexicalScore =
      scoreRegexMatch(queryRegex, {
        title: chunk.title ?? null,
        type: chunk.type ?? null,
        body: chunk.body ?? null,
        metadataText: chunk.metadataText ?? null,
        chunkText: chunk.chunkText ?? null,
      }) -
      index * 0.02;

    return mapChunkDocument(chunk, "lexical", Math.max(0.6, lexicalScore));
  });
}

export async function retrieveLexicalChunksForUser(
  userId: string,
  query: string,
  limit: number
): Promise<RetrievedChunk[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  try {
    const textResults = await retrieveLexicalChunksWithTextIndex(
      userId,
      trimmedQuery,
      limit
    );
    if (textResults.length > 0) {
      return textResults;
    }
  } catch (error) {
    console.error("Chunk text index search failed, using regex fallback:", error);
  }

  return retrieveLexicalChunksWithRegex(userId, trimmedQuery, limit);
}

export async function retrieveHybridChunksForUser(
  userId: string,
  query: string,
  limit: number
): Promise<RetrievedChunk[]> {
  const searchLimit = Math.max(limit * 2, limit);

  const [vectorChunks, lexicalChunks] = await Promise.all([
    retrieveRelevantChunksForUser(userId, query, searchLimit),
    retrieveLexicalChunksForUser(userId, query, searchLimit),
  ]);

  return fuseChunksWithRrf(vectorChunks, lexicalChunks, limit);
}

export async function retrieveRerankedChunksForUser(
  userId: string,
  query: string,
  limit: number
): Promise<RetrievedChunk[]> {
  const rrfCandidates = await retrieveHybridChunksForUser(
    userId,
    query,
    RERANK_CANDIDATE_LIMIT
  );

  return rerankChunksForQuery(query, rrfCandidates, {
    candidateLimit: RERANK_CANDIDATE_LIMIT,
    topK: limit,
  });
}

export function selectDiverseChunksForChat(
  chunks: RetrievedChunk[],
  limit: number,
  maxPerContent = 2
): RetrievedChunk[] {
  const selected: RetrievedChunk[] = [];
  const deferred: RetrievedChunk[] = [];
  const counts = new Map<string, number>();

  for (const chunk of chunks) {
    const contentId = String(chunk.contentId);
    const used = counts.get(contentId) ?? 0;

    if (used < maxPerContent) {
      selected.push(chunk);
      counts.set(contentId, used + 1);
    } else {
      deferred.push(chunk);
    }
  }

  for (const chunk of deferred) {
    if (selected.length >= limit) {
      break;
    }
    selected.push(chunk);
  }

  return selected.slice(0, limit);
}

export function dedupeSourcesByContent(sources: import("../types/search.js").SearchItem[]) {
  const seen = new Set<string>();
  const deduped: import("../types/search.js").SearchItem[] = [];

  for (const source of sources) {
    const key =
      source._id?.trim() ||
      source.link?.trim().toLowerCase() ||
      source.title?.trim().toLowerCase() ||
      "";

    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(source);
  }

  return deduped;
}

export function buildChunkContextLine(chunk: RetrievedChunk, index: number) {
  const title = chunk.title?.trim() || `Saved item ${index + 1}`;
  const type = chunk.type || "content";
  const link = chunk.link || "no external link";
  const contextText = chunk.chunkText?.trim() || chunk.body?.trim() || chunk.snippet || "";
  return `- ${title} (${type}) -> ${link}\n  Context snippet: "${contextText}"`;
}

function contextConfidenceScore(chunk: RetrievedChunk): number | undefined {
  const scores = [chunk.rerankScore, chunk.similarity, chunk.lexicalScore].filter(
    (score): score is number => typeof score === "number"
  );

  if (scores.length === 0) {
    return undefined;
  }

  return Math.max(...scores);
}

export function chunkToSearchItem(chunk: RetrievedChunk): import("../types/search.js").SearchItem {
  const item: import("../types/search.js").SearchItem = {
    _id: chunk.contentId,
    title: chunk.title ?? null,
    link: chunk.link ?? null,
    type: chunk.type ?? null,
    retrievalType: chunk.retrievalType,
  };

  const score = contextConfidenceScore(chunk);
  if (typeof score === "number") {
    item.similarity = score;
  }

  if (chunk.snippet) {
    item.snippet = chunk.snippet;
  }

  return item;
}
