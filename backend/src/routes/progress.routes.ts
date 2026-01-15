import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getCourseProgress } from "../controllers/courseProgress.controller";

const router = Router();

// GET /api/courses/:id/progress
router.get("/courses/:id/progress", authMiddleware, getCourseProgress);

export default router;
