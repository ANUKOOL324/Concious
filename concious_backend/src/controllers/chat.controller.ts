import type { Request, Response } from "express";
import { chatWithAshqnor } from "../services/chat.service.js";

export async function chat(req: Request, res: Response) {
  try {
    const message = String(req.body.message ?? "").trim();

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const result = await chatWithAshqnor(String(req.userId), message);
    return res.json(result);
  } catch (error) {
    console.error("chat request failed", error);
    return res.status(500).json({
      message: "Ashqnor could not respond right now. Please try again.",
    });
  }
}
