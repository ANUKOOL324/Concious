import type { SearchItem } from "../types/search.js";

function normalizeMessage(message: string) {
  return message
    .trim()
    .toLowerCase()
    .replace(/[!?.…,]+$/g, "")
    .replace(/\s+/g, " ");
}

const EXPLAIN_VERBS =
  /\b(explain|describe|summarize|summary|tell me about|walk me through|break down|what does|what is|what was|overview of|help me understand|help me with)\b/;

const LIST_INTENT =
  /\b(list|show|give|display|all|my|get|see|fetch|everything)\b/;

export type ContentCategoryFilter = {
  label: string;
  type?: string;
  linkIncludes?: string;
  postLike?: boolean;
};

const CONTENT_CATEGORIES: Array<{
  patterns: RegExp[];
  filter: ContentCategoryFilter;
}> = [
  {
    patterns: [/linkedin/, /linked\s*in/, /linkdin/],
    filter: {
      label: "LinkedIn posts",
      type: "other",
      linkIncludes: "linkedin.com",
    },
  },
  {
    patterns: [/\byoutube\b/, /\bvideo(s)?\b/],
    filter: {
      label: "YouTube videos",
      type: "youtube",
      linkIncludes: "youtu",
    },
  },
  {
    patterns: [
      /\bspotify\b/,
      /\bplaylist(s)?\b/,
      /\bsong(s)?\b/,
      /\bsinger(s)?\b/,
      /\bartist(s)?\b/,
      /\bmusic\b/,
      /\btrack(s)?\b/,
      /\balbum(s)?\b/,
    ],
    filter: {
      label: "Spotify saves",
      type: "spotify",
      linkIncludes: "spotify.com",
    },
  },
  {
    patterns: [/\btwitter\b/, /\btweet(s)?\b/, /\bx post(s)?\b/],
    filter: {
      label: "Twitter/X posts",
      type: "twitter",
      linkIncludes: "twitter.com",
    },
  },
  {
    patterns: [/\barticle(s)?\b/, /\bblog(s)?\b/],
    filter: { label: "articles", type: "article" },
  },
  {
    patterns: [/\bpdf(s)?\b/, /\bdocument(s)?\b/],
    filter: { label: "PDFs", type: "pdf" },
  },
  {
    patterns: [/\bpost(s)?\b/],
    filter: { label: "posts", postLike: true },
  },
];

function detectCategory(message: string): ContentCategoryFilter | null {
  const normalized = normalizeMessage(message);
  if (!normalized) {
    return null;
  }

  for (const entry of CONTENT_CATEGORIES) {
    if (entry.patterns.some((pattern) => pattern.test(normalized))) {
      return entry.filter;
    }
  }

  return null;
}

export function detectContentCategory(message: string) {
  return detectCategory(message);
}

const SEARCH_CATEGORY_STOP_WORDS = new Set([
  "my",
  "the",
  "a",
  "an",
  "all",
  "show",
  "list",
  "get",
  "see",
  "give",
  "display",
  "find",
  "search",
  "saved",
  "from",
  "in",
]);

export function isStrongSearchCategoryQuery(message: string) {
  const category = detectCategory(message);
  if (!category) {
    return null;
  }

  const normalized = normalizeMessage(message);
  const tokens = normalized
    .split(" ")
    .filter((word) => word.length > 0 && !SEARCH_CATEGORY_STOP_WORDS.has(word));

  if (tokens.length <= 2) {
    return category;
  }

  return null;
}

export function isFullInventoryRequest(message: string) {
  const normalized = normalizeMessage(message);
  if (!normalized) {
    return false;
  }

  const wantsAll =
    /\b(all|every|entire|everything|full|complete)\b/.test(normalized);
  const contentNoun =
    /\b(content|saved|items?|brain|links?|posts?|things|stuff)\b/.test(
      normalized
    );
  const wantsList =
    /\b(list|show|give|display|tell|share)\b/.test(normalized);

  return (
    (wantsAll && contentNoun) ||
    (wantsList && wantsAll) ||
    /\bcontent list\b/.test(normalized) ||
    /\bwhat (do|did) i (have )?saved\b/.test(normalized) ||
    /\beverything (i've |i have )?saved\b/.test(normalized) ||
    /\bwhat'?s in my (brain|library)\b/.test(normalized)
  );
}

export function isTypeListRequest(message: string): ContentCategoryFilter | null {
  const category = detectCategory(message);
  if (!category) {
    return null;
  }

  const normalized = normalizeMessage(message);
  if (LIST_INTENT.test(normalized)) {
    return category;
  }

  if (
    /\b(posts?|videos?|songs?|articles?|pdfs?|documents?|tweets?|tracks?|playlists?)\b/.test(
      normalized
    )
  ) {
    return category;
  }

  return null;
}

export function parseExplainContentRequest(
  message: string
): ContentCategoryFilter | null {
  const normalized = normalizeMessage(message);
  if (!normalized || !EXPLAIN_VERBS.test(normalized)) {
    return null;
  }

  return detectCategory(message);
}

export function isExplainRequest(message: string) {
  const normalized = normalizeMessage(message);
  return Boolean(normalized && EXPLAIN_VERBS.test(normalized));
}

export function matchesContentCategory(
  doc: { type?: string | null; link?: string | null },
  filter: ContentCategoryFilter
) {
  if (filter.postLike) {
    const link = doc.link?.toLowerCase() ?? "";
    return (
      doc.type === "twitter" ||
      (doc.type === "other" && link.includes("linkedin.com"))
    );
  }

  if (filter.type && doc.type !== filter.type) {
    return false;
  }

  if (filter.linkIncludes) {
    const link = doc.link?.toLowerCase() ?? "";
    if (!link.includes(filter.linkIncludes.toLowerCase())) {
      return false;
    }
  }

  return true;
}

export function sanitizeSourcesForCategory(
  sources: SearchItem[],
  category: ContentCategoryFilter | null | undefined
) {
  if (!category) {
    return sources;
  }

  return filterItemsByCategory(sources, category);
}

export function filterItemsByCategory(
  items: SearchItem[],
  filter: ContentCategoryFilter
) {
  return items.filter((item) =>
    matchesContentCategory(
      { type: item.type ?? null, link: item.link ?? null },
      filter
    )
  );
}

export function responseIndicatesInsufficientContext(response: string) {
  const normalized = response.trim().toLowerCase();

  return (
    normalized.includes("don't have enough") ||
    normalized.includes("do not have enough") ||
    normalized.includes("not enough saved") ||
    normalized.includes("not enough relevant") ||
    normalized.includes("couldn't find") ||
    normalized.includes("could not find") ||
    normalized.includes("cannot answer") ||
    normalized.includes("can't answer") ||
    normalized.includes("i don't know") ||
    normalized.includes("i do not know")
  );
}

const TITLE_HINT_STOP_WORDS = new Set([
  "explain",
  "describe",
  "summarize",
  "summary",
  "tell",
  "about",
  "walk",
  "through",
  "break",
  "down",
  "what",
  "does",
  "is",
  "was",
  "overview",
  "help",
  "understand",
  "with",
  "the",
  "a",
  "an",
  "my",
  "saved",
  "i",
  "me",
  "please",
  "post",
  "posts",
  "video",
  "videos",
  "article",
  "articles",
  "linkedin",
  "linkdin",
  "linked",
  "youtube",
  "spotify",
  "twitter",
  "tweet",
  "pdf",
  "pdfs",
  "document",
  "documents",
  "one",
  "this",
  "that",
  "have",
  "had",
  "list",
  "show",
  "give",
  "all",
]);

export function findSpecificContentMatch(
  message: string,
  candidates: SearchItem[]
): SearchItem | null {
  const normalized = normalizeMessage(message);
  const hintWords = normalized
    .split(" ")
    .filter((word) => word.length > 2 && !TITLE_HINT_STOP_WORDS.has(word));

  if (!hintWords.length) {
    return null;
  }

  let bestMatch: SearchItem | null = null;
  let bestScore = 0;

  for (const item of candidates) {
    const title = item.title?.trim().toLowerCase() ?? "";
    if (!title) {
      continue;
    }

    let score = 0;
    for (const word of hintWords) {
      if (title.includes(word)) {
        score += 1;
      }
    }

    const hintPhrase = hintWords.join(" ");
    if (hintPhrase.length >= 4 && title.includes(hintPhrase)) {
      score += 5;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

export function findExactTitleMatch(
  message: string,
  candidates: SearchItem[]
): SearchItem | null {
  const normalized = normalizeMessage(message);
  if (!normalized || normalized.split(" ").length > 6) {
    return null;
  }

  const exactMatches = candidates.filter(
    (item) => item.title?.trim().toLowerCase() === normalized
  );
  if (exactMatches.length === 1) {
    return exactMatches[0] ?? null;
  }

  const partialMatches = candidates.filter((item) => {
    const title = item.title?.trim().toLowerCase() ?? "";
    return normalized.length >= 3 && title.includes(normalized);
  });

  return partialMatches.length === 1 ? (partialMatches[0] ?? null) : null;
}
