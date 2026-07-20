import type { Request, Response } from "express";
import {
  createContent,
  createPdfContent,
  ContentValidationError,
  deleteContent,
  getPdfStreamSource,
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
    if (error instanceof ContentValidationError) {
      return res.status(400).json({ message: error.message });
    }

    console.error("content create failed", error);
    return res.status(500).json({ message: "failed to add content" });
  }
}

export async function uploadPdf(req: Request, res: Response) {
  try {
    const result = await createPdfContent(
      String(req.userId),
      req.file as Express.Multer.File,
      req.body as Record<string, unknown>
    );
    return res.json(result);
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return res.status(400).json({ message: error.message });
    }

    if (error instanceof Error && error.message === "Cloudinary is not configured") {
      return res.status(500).json({ message: "PDF upload service is not configured" });
    }

    console.error("pdf upload failed", error);
    return res.status(500).json({ message: "failed to upload PDF" });
  }
}

export async function list(req: Request, res: Response) {
  const content = await listUserContent(String(req.userId));
  return res.json({ content });
}

export async function streamPdf(req: Request, res: Response) {
  const source = await getPdfStreamSource(
    String(req.userId),
    String(req.params.id)
  );

  if (!source) {
    return res.status(404).json({ message: "PDF not found or unauthorized" });
  }

  try {
    const upstream = await fetch(source.secureUrl);//

    if (!upstream.ok) {
      return res.status(502).json({ message: "Failed to retrieve PDF file" });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",//telling the browser to display the PDF inline and provide a filename for download
      `inline; filename="${encodeURIComponent(source.filename)}"`
    );
    res.setHeader("Cache-Control", "private, max-age=3600");

    return res.send(buffer);
  } catch (error) {
    console.error("pdf stream failed", error);
    return res.status(500).json({ message: "Failed to stream PDF" });
  }
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

//these two are for manual testing or reindexing all content for a user, not exposed in routes yet

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
