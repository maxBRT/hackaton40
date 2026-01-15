import { Router } from 'express';
import {authMiddleware} from "../middleware/authMiddleware";
import { createQuiz, getQuiz } from "../controllers/quiz.controller";
import { validate } from '../middleware/validate';
import { CreateQuizSchema } from '../schemas/quiz.schema';
import { IdParamSchema } from '../schemas/common.schema';

const router = Router();

router.get("/lessons/:id", authMiddleware, validate(IdParamSchema, "params"), getQuiz);
router.post("/lessons/:id", authMiddleware, validate({ params: IdParamSchema, body: CreateQuizSchema }), createQuiz);

export default router;