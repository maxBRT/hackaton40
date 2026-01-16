import { Router } from "express";
import { getCourses, createCourse, getCourseById } from "../controllers/courses.controller";
import { validate } from "../middleware/validate";
import { CreateCourseSchema } from "../schemas/course.schema";

const router = Router();

// GET /courses
router.get("/", getCourses);

router.get("/:id", getCourseById);

// POST /courses (Admin)
router.post("/", validate(CreateCourseSchema), createCourse);

export default router;
