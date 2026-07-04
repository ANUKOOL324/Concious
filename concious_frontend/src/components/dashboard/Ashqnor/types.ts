export type AshqnorRetrievalMode = "vector" | "lexical-fallback";

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
}

export interface AshqnorMessage {
  role: "user" | "assistant";
  content: string;
  mode?: AshqnorRetrievalMode;
  sources?: AshqnorSource[];
}
