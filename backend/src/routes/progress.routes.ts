import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getCourseProgress } from "../controllers/courseProgress.controller";
import { validate } from "../middleware/validate";
import { IdParamSchema } from "../schemas/common.schema";

const router = Router();

// GET /api/courses/:id/progress
router.get("/courses/:id/progress", authMiddleware, validate(IdParamSchema, "params"), getCourseProgress);

export default router;
