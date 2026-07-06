export type SemanticSearchMode =
  | "vector"
  | "vector-chunk"
  | "lexical-fallback"
  | "hybrid";

export interface SemanticSearchResult {
  _id?: string;
  title?: string | null;
  link?: string | null;
  type?: string | null;
  similarity?: number;
}

export interface SemanticSearchResponse {
  query: string;
  count: number;
  mode: SemanticSearchMode;
  results: SemanticSearchResult[];
}
