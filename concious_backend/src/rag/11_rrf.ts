import type { RetrievedChunk, RetrievalType } from "../types/search.js";

export const RRF_K = 60;

function rrfContribution(rank: number, k = RRF_K) {
  return 1 / (k + rank);
}

type RrfAccumulator = {
  chunk: RetrievedChunk;
  rrfScore: number;
  inVector: boolean;
  inLexical: boolean;
};

function resolveRetrievalType(inVector: boolean, inLexical: boolean): RetrievalType {
  if (inVector && inLexical) {
    return "hybrid";
  }
  if (inVector) {
    return "vector";
  }
  return "lexical";
}

export function fuseChunksWithRrf(
  vectorChunks: RetrievedChunk[],
  lexicalChunks: RetrievedChunk[],
  limit: number
): RetrievedChunk[] {
  const byId = new Map<string, RrfAccumulator>();

  vectorChunks.forEach((chunk, index) => {
    if (!chunk._id) {
      return;
    }

    const rank = index + 1;
    const contribution = rrfContribution(rank);
    const existing = byId.get(chunk._id);

    if (existing) {
      existing.rrfScore += contribution;
      existing.inVector = true;
      const mergedChunk: RetrievedChunk = {
        ...existing.chunk,
        ...chunk,
        retrievalType: existing.chunk.retrievalType,
      };
      if (typeof chunk.similarity === "number") {
        mergedChunk.similarity = chunk.similarity;
      }
      existing.chunk = mergedChunk;
      return;
    }

    byId.set(chunk._id, {
      chunk: { ...chunk, retrievalType: "vector" },
      rrfScore: contribution,
      inVector: true,
      inLexical: false,
    });
  });

  lexicalChunks.forEach((chunk, index) => {
    if (!chunk._id) {
      return;
    }

    const rank = index + 1;
    const contribution = rrfContribution(rank);
    const lexicalScore = chunk.lexicalScore ?? chunk.similarity ?? 0;
    const existing = byId.get(chunk._id);

    if (existing) {
      existing.rrfScore += contribution;
      existing.inLexical = true;
      existing.chunk = {
        ...existing.chunk,
        lexicalScore,
        retrievalType: "hybrid",
      };
      return;
    }

    byId.set(chunk._id, {
      chunk: {
        ...chunk,
        retrievalType: "lexical",
        lexicalScore,
      },
      rrfScore: contribution,
      inVector: false,
      inLexical: true,
    });
  });

  return [...byId.values()]
    .map(({ chunk, rrfScore, inVector, inLexical }) => ({
      ...chunk,
      retrievalType: resolveRetrievalType(inVector, inLexical),
      rrfScore,
    }))
    .sort((left, right) => (right.rrfScore ?? 0) - (left.rrfScore ?? 0))
    .slice(0, limit);
}
