import { Router } from "express";
import { getCourses, createCourse } from "../controllers/courses.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { CreateCourseSchema, GetCoursesQuerySchema } from "../schemas/course.schema";

const router = Router();

// GET /courses
router.get("/", validate(GetCoursesQuerySchema, "query"), getCourses);
// POST /courses (Admin)
router.post("/", authMiddleware, validate(CreateCourseSchema), createCourse);

export default router;
