import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as contentController from "../controllers/content.controller.js";

const router = Router();

router.post("/", auth, contentController.create);
router.get("/", auth, contentController.list);
router.patch("/:id", auth, contentController.update);
router.delete("/:id", auth, contentController.remove);
router.post("/:id/reindex", auth, contentController.reindexOne);

export default router;
