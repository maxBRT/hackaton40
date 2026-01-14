import { Router } from "express";
import {
  getLessons,
  getLessonById,
  createLesson,
} from "../controllers/lessons.controller";

const router = Router();

router.get("/", getLessons);
router.get("/:id", getLessonById);
router.post("/", createLesson);

export default router;
