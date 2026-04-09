export const PORT = Number(process.env.PORT ?? 3000);
export const MONGO_URI =
  process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/concious";
export const JWT_PASSWORD =
  process.env.JWT_PASSWORD ?? "dev-only-secret-change-me";
