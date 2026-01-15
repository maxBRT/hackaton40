import { Router } from "express";
import {
  getLessons,
  getLessonById,
  createLesson,
} from "../controllers/lessons.controller";
import { completeLesson } from "../controllers/lessons.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { CreateLessonSchema, GetLessonsQuerySchema } from "../schemas/lesson.schema";
import { IdParamSchema } from "../schemas/common.schema";

const router = Router();

router.get("/", validate(GetLessonsQuerySchema, "query"), getLessons);
router.get("/:id", validate(IdParamSchema, "params"), getLessonById);
router.post("/", authMiddleware, validate(CreateLessonSchema), createLesson);
router.post("/:id/complete", authMiddleware, validate(IdParamSchema, "params"), completeLesson);

export default router;
