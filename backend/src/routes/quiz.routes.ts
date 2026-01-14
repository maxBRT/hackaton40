import { Router } from 'express';
import {authMiddleware} from "../middleware/authMiddleware";
import {createQuiz, getQuiz} from "../controllers/quiz.controller";

const router = Router();

router.get("/lessons/{:id}", authMiddleware, getQuiz);
router.post("/lessons/{:id}", authMiddleware, createQuiz);

export default router;