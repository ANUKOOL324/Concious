import type { RetrievalType, SearchItem } from "../types/search.js";
import {
  type ContentCategoryFilter,
  isStrongSearchCategoryQuery,
  matchesContentCategory,
} from "./contentQuery.js";

function escapeRegex(value: string) {
  return value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function queryTokens(query: string) {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

export function computeDirectMatchScore(
  query: string,
  item: Pick<SearchItem, "title" | "link" | "type" | "snippet">
): number {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return 0;
  }

  const title = item.title?.trim() ?? "";
  const link = item.link?.trim() ?? "";
  const type = item.type?.trim() ?? "";
  const snippet = item.snippet?.trim() ?? "";

  if (normalized.length < 2) {
    return 0;
  }

  const wholeRegex = new RegExp(escapeRegex(normalized), "i");

  if (title && title.toLowerCase() === normalized) {
    return 1;
  }
  if (title && wholeRegex.test(title)) {
    return 0.97;
  }
  if (link && wholeRegex.test(link)) {
    return 0.93;
  }
  if (type && wholeRegex.test(type)) {
    return 0.91;
  }
  if (snippet && wholeRegex.test(snippet)) {
    return 0.86;
  }

  const tokens = queryTokens(normalized);
  if (tokens.length === 0) {
    return 0;
  }

  const searchable = [title, link, type, snippet].join(" ").toLowerCase();
  let matched = 0;

  for (const token of tokens) {
    if (searchable.includes(token)) {
      matched += 1;
    }
  }

  if (matched === tokens.length) {
    return 0.82;
  }
  if (matched > 0) {
    return 0.55 + (matched / tokens.length) * 0.2;
  }

  return 0;
}

function isRelevantForCategory(
  item: SearchItem,
  category: ContentCategoryFilter,
  query: string
) {
  return (
    matchesContentCategory(
      { type: item.type ?? null, link: item.link ?? null },
      category
    ) || computeDirectMatchScore(query, item) >= 0.8
  );
}

function blendSearchScore(
  query: string,
  item: SearchItem,
  category: ContentCategoryFilter | null
) {
  const directScore = computeDirectMatchScore(query, item);
  const semanticScore =
    typeof item.similarity === "number" ? item.similarity : 0;
  const categoryMatch = category
    ? matchesContentCategory(
        { type: item.type ?? null, link: item.link ?? null },
        category
      )
    : false;

  if (directScore >= 0.9) {
    return directScore;
  }

  if (category && categoryMatch) {
    return Math.max(directScore, semanticScore, 0.84);
  }

  if (directScore >= 0.55) {
    return Math.max(directScore, directScore * 0.65 + semanticScore * 0.35);
  }

  if (category && !categoryMatch) {
    return semanticScore * 0.22;
  }

  return Math.max(directScore * 0.45 + semanticScore * 0.55, semanticScore * 0.4);
}

export function finalizeSearchResults(
  query: string,
  results: SearchItem[],
  limit: number
): SearchItem[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery || results.length === 0) {
    return [];
  }

  const category = isStrongSearchCategoryQuery(trimmedQuery);

  const ranked: SearchItem[] = results
    .map((item) => {
      const directScore = computeDirectMatchScore(trimmedQuery, item);
      const finalScore = blendSearchScore(trimmedQuery, item, category);
      let retrievalType: RetrievalType = item.retrievalType ?? "vector";

      if (directScore >= 0.85) {
        retrievalType = "lexical";
      } else if (
        category &&
        matchesContentCategory(
          { type: item.type ?? null, link: item.link ?? null },
          category
        )
      ) {
        retrievalType = item.retrievalType ?? "hybrid";
      }

      return {
        ...item,
        similarity: Math.min(0.99, Number(finalScore.toFixed(4))),
        retrievalType,
      };
    })
    .sort((left, right) => (right.similarity ?? 0) - (left.similarity ?? 0));

  if (category) {
    const relevant = ranked.filter((item) =>
      isRelevantForCategory(item, category, trimmedQuery)
    );
    if (relevant.length > 0) {
      return relevant.slice(0, limit);
    }
  }

  const directHits = ranked.filter(
    (item) => computeDirectMatchScore(trimmedQuery, item) >= 0.8
  );
  if (directHits.length > 0 && queryTokens(trimmedQuery).length <= 3) {
    const focused = ranked.filter((item) => {
      const directScore = computeDirectMatchScore(trimmedQuery, item);
      return directScore >= 0.55 || (item.similarity ?? 0) >= 0.82;
    });
    if (focused.length > 0) {
      return focused.slice(0, limit);
    }
  }

  if (directHits.length === 0 && queryTokens(trimmedQuery).length <= 2) {
    return [];
  }

  const semanticMatches = ranked.filter((item) => (item.similarity ?? 0) >= 0.55);
  if (semanticMatches.length > 0) {
    return semanticMatches.slice(0, limit);
  }

  return [];
}
