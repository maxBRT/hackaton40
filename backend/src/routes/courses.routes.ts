import { Router } from "express";
import { getCourses, createCourse } from "../controllers/courses.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

// GET /courses
router.get("/", getCourses);

// POST /courses (Admin)
router.post("/", requireAuth, createCourse);

export default router;
