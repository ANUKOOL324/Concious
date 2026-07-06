import { getHfRerankScores } from "../providers.js";
import { RERANK_CANDIDATE_LIMIT } from "../config.js";
import type { RetrievedChunk } from "../types/search.js";

export type RerankOptions = {
  candidateLimit?: number;
  topK?: number;
};

function fallbackFinalScore(chunk: RetrievedChunk) {
  return chunk.rrfScore ?? chunk.similarity ?? chunk.lexicalScore ?? 0;
}

export function chunkTextForRerank(chunk: RetrievedChunk) {
  return chunk.body?.trim() || chunk.chunkText?.trim() || chunk.snippet?.trim() || "";
}

function applyRrfFallbackRanking(chunks: RetrievedChunk[], topK: number) {
  return chunks
    .map((chunk) => {
      const ranked: RetrievedChunk = {
        ...chunk,
        finalScore: fallbackFinalScore(chunk),
      };
      return ranked;
    })
    .sort((left, right) => (right.finalScore ?? 0) - (left.finalScore ?? 0))
    .slice(0, topK);
}

export async function rerankChunksForQuery(
  query: string,
  chunks: RetrievedChunk[],
  options?: RerankOptions
): Promise<RetrievedChunk[]> {
  const candidateLimit = options?.candidateLimit ?? RERANK_CANDIDATE_LIMIT;
  const topK = options?.topK ?? chunks.length;
  const candidates = chunks.slice(0, candidateLimit);

  if (candidates.length === 0) {
    return [];
  }

  const passages = candidates.map(chunkTextForRerank);
  const rerankable = candidates
    .map((chunk, index) => ({ chunk, index, passage: passages[index] ?? "" }))
    .filter((entry) => entry.passage.length > 0);

  if (rerankable.length === 0) {
    console.warn("Reranker skipped: no chunk text available; using RRF order.");
    return applyRrfFallbackRanking(candidates, topK);
  }

  const rerankScores = await getHfRerankScores(
    query,
    rerankable.map((entry) => entry.passage)
  );

  if (!rerankScores) {
    return applyRrfFallbackRanking(candidates, topK);
  }

  const scoreByCandidateIndex = new Map<number, number>();
  rerankable.forEach((entry, rerankIndex) => {
    const score = rerankScores[rerankIndex];
    if (typeof score === "number") {
      scoreByCandidateIndex.set(entry.index, score);
    }
  });

  return candidates
    .map((chunk, index) => {
      const rerankScore = scoreByCandidateIndex.get(index);
      const ranked: RetrievedChunk = { ...chunk };

      if (typeof rerankScore === "number") {
        ranked.rerankScore = rerankScore;
        ranked.finalScore = rerankScore;
      } else {
        ranked.finalScore = fallbackFinalScore(chunk);
      }

      return ranked;
    })
    .sort((left, right) => (right.finalScore ?? 0) - (left.finalScore ?? 0))
    .slice(0, topK);
}
