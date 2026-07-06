import mongoose from "mongoose";
import { ContentModel } from "../db.js";
import { getHfEmbedding } from "../providers.js";
import {
  chunkToSearchItem,
  fuseChunksWithRrf,
  retrieveLexicalChunksForUser,
  retrieveRelevantChunksForUser,
} from "../rag/index.js";
import type { SearchItem, SearchResponse } from "../types/search.js";
import {
  type ContentCategoryFilter,
  isStrongSearchCategoryQuery,
  matchesContentCategory,
} from "../utils/contentQuery.js";
import { finalizeSearchResults } from "../utils/searchRanking.js";

const LEXICAL_QUERY_STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "my",
  "me",
  "i",
  "you",
  "we",
  "do",
  "did",
  "does",
  "have",
  "has",
  "had",
  "is",
  "are",
  "was",
  "were",
  "can",
  "what",
  "which",
  "when",
  "where",
  "who",
  "how",
  "why",
  "about",
  "any",
  "anything",
  "something",
  "saved",
  "save",
  "tell",
  "show",
  "give",
  "find",
  "search",
  "know",
  "get",
  "see",
  "from",
  "in",
  "on",
  "for",
  "to",
  "of",
  "with",
  "this",
  "that",
  "these",
  "those",
  "please",
  "would",
  "like",
  "could",
  "should",
  "will",
  "just",
  "also",
  "else",
]);

const LEXICAL_QUERY_PREFIXES = [
  /^what did i save about\s+/,
  /^what do i have about\s+/,
  /^what have i saved about\s+/,
  /^do i have anything about\s+/,
  /^tell me about\s+/,
  /^what did i save on\s+/,
  /^what did i save regarding\s+/,
  /^anything about\s+/,
  /^something about\s+/,
  /^info(?:rmation)? about\s+/,
  /^details about\s+/,
];

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractLexicalQueryCandidates(message: string): string[] {
  const normalized = message
    .trim()
    .toLowerCase()
    .replace(/[!?.…,]+$/g, "")
    .replace(/\s+/g, " ");

  if (!normalized) {
    return [];
  }

  const candidates = new Set<string>();
  candidates.add(normalized);

  let stripped = normalized;
  for (const prefix of LEXICAL_QUERY_PREFIXES) {
    stripped = stripped.replace(prefix, "").trim();
  }
  if (stripped.length >= 3) {
    candidates.add(stripped);
  }

  const tokens = stripped
    .split(" ")
    .filter((token) => token.length > 2 && !LEXICAL_QUERY_STOP_WORDS.has(token));

  if (tokens.length >= 2) {
    candidates.add(tokens.join(" "));
  }

  for (let size = Math.min(4, tokens.length); size >= 2; size -= 1) {
    for (let index = 0; index <= tokens.length - size; index += 1) {
      candidates.add(tokens.slice(index, index + size).join(" "));
    }
  }

  for (const token of tokens) {
    if (token.length >= 4) {
      candidates.add(token);
    }
  }

  return [...candidates]
    .filter((candidate) => candidate.length >= 3)
    .sort((left, right) => right.length - left.length);
}

async function lexicalSearchPhrase(
  userId: string,
  phrase: string,
  limit: number
): Promise<SearchItem[]> {
  const trimmedPhrase = phrase.trim();
  if (!trimmedPhrase) {
    return [];
  }

  const regex = new RegExp(escapeRegex(trimmedPhrase), "i");
  const userIdObj = new mongoose.Types.ObjectId(userId);

  const results = await ContentModel.find({
    userId: userIdObj,
    $or: [
      { title: regex },
      { link: regex },
      { type: regex },
      { tags: regex },
      { personalNote: regex },
      { summary: regex },
      { whySaved: regex },
      { description: regex },
    ],
  })
    .sort({ _id: -1 })
    .limit(limit)
    .lean();

  return results.map((item, index): SearchItem => {
    const title = item.title ?? null;
    const link = item.link ?? null;
    const type = item.type ?? null;
    const personalNote =
      typeof item.personalNote === "string" ? item.personalNote : null;
    const summary = typeof item.summary === "string" ? item.summary : null;
    const whySaved = typeof item.whySaved === "string" ? item.whySaved : null;
    const description =
      typeof item.description === "string" ? item.description : null;
    const tags = Array.isArray(item.tags) ? item.tags : [];

    let similarity = 0.72;
    let snippet: string | undefined;

    if (title && regex.test(title)) {
      similarity = 0.99;
    } else if (whySaved && regex.test(whySaved)) {
      similarity = 0.96;
      snippet = whySaved;
    } else if (personalNote && regex.test(personalNote)) {
      similarity = 0.95;
      snippet = personalNote;
    } else if (summary && regex.test(summary)) {
      similarity = 0.94;
      snippet = summary;
    } else if (description && regex.test(description)) {
      similarity = 0.91;
      snippet = description;
    } else if (link && regex.test(link)) {
      similarity = 0.92;
    } else if (tags.some((tag) => typeof tag === "string" && regex.test(tag))) {
      similarity = 0.88;
    } else if (type && regex.test(type)) {
      similarity = 0.86;
    }

    const phraseBoost = Math.min(0.04, trimmedPhrase.split(" ").length * 0.01);
    similarity = Math.max(0.6, similarity + phraseBoost - index * 0.02);

    const result: SearchItem = {
      _id: String(item._id),
      title,
      link,
      type,
      similarity,
      retrievalType: "lexical",
    };

    if (snippet) {
      result.snippet = snippet.length > 280 ? `${snippet.slice(0, 280)}...` : snippet;
    }

    return result;
  });
}

async function lexicalSearch(userId: string, query: string, limit: number) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const phrases = extractLexicalQueryCandidates(trimmedQuery);
  const merged = new Map<string, SearchItem>();

  for (const phrase of phrases) {
    const hits = await lexicalSearchPhrase(userId, phrase, limit);
    for (const hit of hits) {
      const key = hit._id ?? "";
      if (!key) {
        continue;
      }

      const existing = merged.get(key);
      if (!existing || (hit.similarity ?? 0) > (existing.similarity ?? 0)) {
        merged.set(key, hit);
      }
    }

    if (merged.size >= limit) {
      break;
    }
  }

  return [...merged.values()]
    .sort((left, right) => (right.similarity ?? 0) - (left.similarity ?? 0))
    .slice(0, limit);
}

async function fetchCategoryContent(
  userId: string,
  filter: ContentCategoryFilter,
  limit: number
): Promise<SearchItem[]> {
  const userIdObj = new mongoose.Types.ObjectId(userId);
  const query: Record<string, unknown> = { userId: userIdObj };

  if (filter.type) {
    query.type = filter.type;
  }

  const items = await ContentModel.find(query)
    .sort({ _id: -1 })
    .limit(Math.max(limit * 3, limit))
    .lean();

  const matched = items.filter((item) =>
    matchesContentCategory(
      { type: item.type ?? null, link: item.link ?? null },
      filter
    )
  );

  return matched.slice(0, limit).map((item, index): SearchItem => ({
    _id: String(item._id),
    title: item.title ?? null,
    link: item.link ?? null,
    type: item.type ?? null,
    similarity: 0.94 - index * 0.02,
    retrievalType: "lexical",
  }));
}

async function enrichWithCategoryMatches(
  userId: string,
  query: string,
  results: SearchItem[],
  limit: number
) {
  const category = isStrongSearchCategoryQuery(query);
  if (!category) {
    return results;
  }

  const categoryResults = await fetchCategoryContent(userId, category, limit);
  if (categoryResults.length === 0) {
    return results;
  }

  return mergeSearchResults(categoryResults, results, Math.max(limit * 2, limit));
}

function buildSearchResponse(
  query: string,
  results: SearchItem[],
  limit: number,
  mode: SearchResponse["mode"]
): SearchResponse {
  const finalized = finalizeSearchResults(query, results, limit);

  return {
    query,
    count: finalized.length,
    mode,
    results: finalized,
  };
}

function mergeSearchResults(
  vectorResults: SearchItem[],
  lexicalResults: SearchItem[],
  limit: number
) {
  const merged = new Map<string, SearchItem>();
  const getKey = (item: SearchItem) => {
    if (item._id) {
      return String(item._id);
    }

    const normalizedLink = item.link?.trim().toLowerCase();
    const normalizedTitle = item.title?.trim().toLowerCase();
    return (
      normalizedLink ||
      normalizedTitle ||
      `fallback-${Math.random()}`
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
      retrievalType: "hybrid",
    });
  }

  return [...merged.values()]
    .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
    .slice(0, limit);
}

function hybridChunksToSearchItems(
  chunks: import("../types/search.js").RetrievedChunk[],
  limit: number
) {
  const uniqueContentIds = new Set<string>();
  const results: SearchItem[] = [];

  for (const chunk of chunks) {
    const contentId = String(chunk.contentId);
    if (uniqueContentIds.has(contentId)) {
      continue;
    }

    uniqueContentIds.add(contentId);
    results.push(chunkToSearchItem(chunk));

    if (results.length >= limit) {
      break;
    }
  }

  return results;
}

function resolveSearchMode(
  results: SearchItem[],
  retrievalCounts: { vectorCount: number; lexicalCount: number }
): SearchResponse["mode"] {
  if (retrievalCounts.vectorCount > 0 && retrievalCounts.lexicalCount > 0) {
    return "hybrid";
  }

  if (retrievalCounts.vectorCount > 0) {
    return "vector-chunk";
  }

  if (results.some((item) => item.retrievalType === "hybrid")) {
    return "hybrid";
  }

  if (results.some((item) => item.retrievalType === "vector")) {
    return "vector-chunk";
  }

  if (results.length > 0 || retrievalCounts.lexicalCount > 0) {
    return "lexical-fallback";
  }

  return "vector-chunk";
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

  const strongCategory = isStrongSearchCategoryQuery(query);
  if (strongCategory) {
    const categoryResults = await fetchCategoryContent(userId, strongCategory, limit);
    return buildSearchResponse(
      query,
      categoryResults,
      limit,
      "lexical-fallback"
    );
  }

  try {
    const searchLimit = Math.max(limit * 3, limit);
    const [vectorChunks, lexicalChunks] = await Promise.all([
      retrieveRelevantChunksForUser(userId, query, searchLimit),
      retrieveLexicalChunksForUser(userId, query, searchLimit),
    ]);

    const retrievalCounts = {
      vectorCount: vectorChunks.length,
      lexicalCount: lexicalChunks.length,
    };

    if (retrievalCounts.vectorCount === 0) {
      const queryVector = await getHfEmbedding(query, "query");
      if (queryVector) {
        console.warn(
          `search: chunk vector search returned 0 results for query "${query.slice(0, 80)}"`
        );
      }
    }

    const hybridChunks = fuseChunksWithRrf(vectorChunks, lexicalChunks, searchLimit);
    const hybridResults = hybridChunksToSearchItems(hybridChunks, limit);

    if (hybridResults.length > 0) {
      const mergedResults = mergeSearchResults(hybridResults, lexicalResults, limit);
      const enrichedResults = await enrichWithCategoryMatches(
        userId,
        query,
        mergedResults,
        limit
      );
      return buildSearchResponse(
        query,
        enrichedResults,
        limit,
        resolveSearchMode(enrichedResults, retrievalCounts)
      );
    }

    const queryVector = await getHfEmbedding(query, "query");
    if (!queryVector) {
      return buildSearchResponse(
        query,
        lexicalResults,
        limit,
        "lexical-fallback"
      );
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
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
        retrievalType: "vector",
      })
    );

    const mergedResults = mergeSearchResults(mappedLegacy, lexicalResults, limit);
    const enrichedResults = await enrichWithCategoryMatches(
      userId,
      query,
      mergedResults,
      limit
    );

    return buildSearchResponse(
      query,
      enrichedResults,
      limit,
      enrichedResults.length > 0 ? "vector" : "lexical-fallback"
    );
  } catch (error) {
    console.error("hybrid search failed", error);
    return buildSearchResponse(query, lexicalResults, limit, "lexical-fallback");
  }
}

export { lexicalSearch };
