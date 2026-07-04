import type { Request, Response } from "express";
import { getSharedBrain, toggleShareLink } from "../services/brain.service.js";

export async function share(req: Request, res: Response) {
  const status = req.body.status;
  const result = await toggleShareLink(String(req.userId), Boolean(status));
  return res.json(result);
}

export async function getShared(req: Request, res: Response) {
  const result = await getSharedBrain(String(req.params.shareLink));

  if ("error" in result) {
    return res.json({ message: result.error });
  }

  return res.json(result);
}
