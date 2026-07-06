import { Router, type NextFunction, type Request, type Response } from "express";
import { auth } from "../middleware/auth.js";
import { handlePdfUploadError, pdfUpload } from "../middleware/pdfUpload.js";
import * as contentController from "../controllers/content.controller.js";

const router = Router();

function runPdfUpload(req: Request, res: Response, next: NextFunction) {
  pdfUpload.single("file")(req, res, (error) => {
    if (error) {
      handlePdfUploadError(error, req, res, next);
      return;
    }
    next();
  });
}

router.post("/pdf", auth, runPdfUpload, contentController.uploadPdf);
router.post("/", auth, contentController.create);
router.get("/", auth, contentController.list);
router.get("/:id/pdf", auth, contentController.streamPdf);
router.patch("/:id", auth, contentController.update);
router.delete("/:id", auth, contentController.remove);
router.post("/:id/reindex", auth, contentController.reindexOne);

export default router;
