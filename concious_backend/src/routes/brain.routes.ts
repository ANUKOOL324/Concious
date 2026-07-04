import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as brainController from "../controllers/brain.controller.js";

const router = Router();

router.post("/share", auth, brainController.share);
router.get("/:shareLink", brainController.getShared);

export default router;
