import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as contentController from "../controllers/content.controller.js";
import authRoutes from "./auth.routes.js";
import contentRoutes from "./content.routes.js";
import searchRoutes from "./search.routes.js";
import chatRoutes from "./chat.routes.js";
import brainRoutes from "./brain.routes.js";

const router = Router();

router.use("/", authRoutes);
router.use("/content", contentRoutes);
router.use("/search", searchRoutes);
router.use("/chat", chatRoutes);
router.post("/reindex-embeddings", auth, contentController.reindexAll);
router.use("/brain", brainRoutes);

export default router;
