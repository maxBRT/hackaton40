import { Router } from "express";
import {
  getLessons,
  getLessonById,
  createLesson,
} from "../controllers/lessons.controller";
import { completeLesson } from "../controllers/lessons.controller";
import { authMiddleware } from "../middleware/authMiddleware";


const router = Router();

router.get("/", getLessons);
router.get("/:id", getLessonById);
router.post("/", createLesson);
router.post("/lessons/:id/complete", authMiddleware, completeLesson);

export default router;
