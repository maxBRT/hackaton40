import { Router } from "express";
import { getCourses, createCourse } from "../controllers/courses.controller";
import { authMiddleware } from "../middleware/authMiddleware";


import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

// GET /courses
router.get("/", getCourses);
// POST /courses (Admin)
router.post("/", authMiddleware, createCourse);

export default router;
