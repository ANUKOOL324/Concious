export const PORT = Number(process.env.PORT ?? 3000);
export const MONGO_URI =
  process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/concious";
export const JWT_PASSWORD =
  process.env.JWT_PASSWORD ?? "dev-only-secret-change-me";
export const HF_API_KEY = process.env.HF_API_KEY ?? "";
export const HF_EMBEDDING_MODEL =
  process.env.HF_EMBEDDING_MODEL ?? "intfloat/e5-small-v2";
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";
export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "mistralai/mistral-small-3.1-24b-instruct";
