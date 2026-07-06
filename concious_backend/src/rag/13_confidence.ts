import type { SearchItem } from "../types/search.js";

export const MIN_CONTEXT_SCORE_VECTOR = 0.65;
export const MIN_CONTEXT_SCORE_LEXICAL = 0.86;

export const NO_CONTEXT_MESSAGE =
  "I don't have enough relevant information in your saved knowledge base to answer that confidently.";

type ContextCandidate = SearchItem & {
  chunkText?: string;
  body?: string;
  lexicalScore?: number;
  retrievalType?: "vector" | "lexical" | "hybrid";
};

function scoreForCandidate(item: ContextCandidate) {
  return item.similarity ?? item.lexicalScore ?? 0;
}

export function hasEnoughContextForChat(items: ContextCandidate[]): boolean {
  if (items.length === 0) {
    return false;
  }

  const topItem = items[0];
  if (!topItem) {
    return false;
  }

  const retrievalType = topItem.retrievalType;
  const topScore = scoreForCandidate(topItem);

  if (retrievalType === "hybrid" || retrievalType === "vector") {
    return topScore >= MIN_CONTEXT_SCORE_VECTOR;
  }

  if (retrievalType === "lexical") {
    return topScore >= MIN_CONTEXT_SCORE_LEXICAL;
  }

  if (typeof topItem.similarity === "number") {
    const minimumScore =
      topScore >= MIN_CONTEXT_SCORE_LEXICAL
        ? MIN_CONTEXT_SCORE_LEXICAL
        : MIN_CONTEXT_SCORE_VECTOR;
    return topScore >= minimumScore;
  }

  return false;
}
