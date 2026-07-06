export type RetrievalType = "vector" | "lexical" | "hybrid";

export type SearchMode =
  | "vector-chunk"
  | "vector"
  | "lexical-fallback"
  | "hybrid";

export type SearchItem = {
  _id?: string;
  title?: string | null;
  link?: string | null;
  type?: string | null;
  similarity?: number;
  snippet?: string;
  retrievalType?: RetrievalType;
};

export interface RetrievedChunk {
  _id?: string | undefined;
  contentId: string;
  title?: string | null;
  link?: string | null;
  type?: string | null;
  body?: string | null;
  metadataText?: string | null;
  chunkText?: string | null;
  sourceType?: string | null;
  snippet?: string;
  similarity?: number;
  lexicalScore?: number;
  rrfScore?: number;
  rerankScore?: number;
  finalScore?: number;
  retrievalType: RetrievalType;
}

export interface SearchResponse {
  query: string;
  count: number;
  mode: SearchMode;
  results: SearchItem[];
}
