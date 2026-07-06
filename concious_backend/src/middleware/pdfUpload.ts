import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { PDF_MAX_BYTES } from "../config.js";

const pdfStorage = multer.memoryStorage();

export const pdfUpload = multer({
  storage: pdfStorage,
  limits: {
    fileSize: PDF_MAX_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const isPdfMime = file.mimetype === "application/pdf";
    const isPdfName = file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdfMime || !isPdfName) {
      callback(new Error("Only PDF files are allowed"));
      return;
    }

    callback(null, true);
  },
});

export function handlePdfUploadError(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (!error) {
    next();
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "PDF file exceeds the maximum allowed size of 10MB",
      });
    }

    return res.status(400).json({ message: error.message });
  }

  if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(400).json({ message: "PDF upload failed" });
}
