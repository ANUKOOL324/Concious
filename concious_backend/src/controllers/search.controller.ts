import type { Request, Response } from "express";
import { searchUserContent } from "../services/search.service.js";

export async function search(req: Request, res: Response) {
  const query = String(req.body.query ?? "").trim();
  const limit = Math.min(Math.max(Number(req.body.limit ?? 6), 1), 10);
  const result = await searchUserContent(String(req.userId), query, limit);
  return res.json(result);
}
