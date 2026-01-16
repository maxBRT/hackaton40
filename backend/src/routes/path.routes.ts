import { Router } from "express";
import { getPaths, getLearningPathById } from "../controllers/path.controller";
import { validate } from "../middleware/validate";
import { z } from "zod";

const router = Router();

// GET /paths
router.get("/", getPaths);
router.get("/:id", getLearningPathById);


export default router;
