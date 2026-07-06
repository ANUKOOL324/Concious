export type AshqnorRetrievalMode =
  | "vector-chunk"
  | "lexical-fallback"
  | "conversational"
  | "inventory-list"
  | "content-picker";

export interface AshqnorSource {
  title?: string | null;
  link?: string | null;
  type?: string | null;
  similarity?: number;
}

export interface AshqnorChatResponse {
  mode: AshqnorRetrievalMode;
  response: string;
  sources: AshqnorSource[];
  listLabel?: string;
}

export interface AshqnorMessage {
  role: "user" | "assistant";
  content: string;
  mode?: AshqnorRetrievalMode;
  sources?: AshqnorSource[];
  listLabel?: string;
}
