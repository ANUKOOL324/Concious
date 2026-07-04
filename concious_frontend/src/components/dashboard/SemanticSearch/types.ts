export type SemanticSearchMode = "vector" | "lexical-fallback";

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
