import type { Request, Response } from "express";
import {
  createContent,
  deleteContent,
  listUserContent,
  reindexAllUserContent,
  reindexSingleContent,
  updateContent,
} from "../services/content.service.js";

export async function create(req: Request, res: Response) {
  try {
    const result = await createContent(String(req.userId), req.body);
    return res.json(result);
  } catch (error) {
    console.error("content create failed", error);
    return res.status(500).json({ message: "failed to add content" });
  }
}

export async function list(req: Request, res: Response) {
  const content = await listUserContent(String(req.userId));
  return res.json({ content });
}

export async function update(req: Request, res: Response) {
  const updated = await updateContent(
    String(req.userId),
    String(req.params.id),
    req.body
  );

  if (!updated) {
    return res.status(404).json({ message: "Content not found or unauthorized" });
  }

  return res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const deleted = await deleteContent(String(req.userId), String(req.params.id));

  if (!deleted) {
    return res.status(403).json({ message: "Content not found or unauthorized" });
  }

  return res.json({ message: "content is delete" });
}

export async function reindexOne(req: Request, res: Response) {
  try {
    const refreshed = await reindexSingleContent(
      String(req.userId),
      String(req.params.id)
    );

    if (!refreshed) {
      return res.status(404).json({ message: "Content not found or unauthorized" });
    }

    return res.json({
      message: "Content indexing triggered successfully",
      content: refreshed,
    });
  } catch (error) {
    console.error("single reindexing failed", error);
    return res.status(500).json({ message: "failed to reindex content" });
  }
}

export async function reindexAll(req: Request, res: Response) {
  try {
    const updated = await reindexAllUserContent(String(req.userId));
    return res.json({ message: "Embeddings refreshed", updated });
  } catch (error) {
    console.error("Bulk reindexing failed", error);
    return res.status(500).json({ message: "failed to reindex embeddings" });
  }
}
