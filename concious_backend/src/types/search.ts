export type SearchItem = {
  _id?: string;
  title?: string | null;
  link?: string | null;
  type?: string | null;
  similarity?: number;
  snippet?: string;
};

export type SearchMode = "vector-chunk" | "vector" | "lexical-fallback";

export interface SearchResponse {
  query: string;
  count: number;
  mode: SearchMode;
  results: SearchItem[];
}
