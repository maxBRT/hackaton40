import { Router } from "express";
import { getCourses, createCourse, getCourseById } from "../controllers/courses.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { CreateCourseSchema, GetCoursesQuerySchema } from "../schemas/course.schema";

const router = Router();

// GET /courses
router.get("/", getCourses);

router.get("/:id", getCourseById);

// POST /courses (Admin)
router.post("/", authMiddleware, validate(CreateCourseSchema), createCourse);

export default router;
