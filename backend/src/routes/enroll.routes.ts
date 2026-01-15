import { Router } from 'express';
import {enroll, enrolledList, unenroll} from "../controllers/enroll.controller";
import {authMiddleware} from "../middleware/authMiddleware";
import { validate } from '../middleware/validate';
import { IdParamSchema } from '../schemas/common.schema';

const router = Router();

router.get("/me", authMiddleware, enrolledList);
router.post("/unenroll/:id", authMiddleware, validate(IdParamSchema, "params"), unenroll)
router.post("/:id", authMiddleware, validate(IdParamSchema, "params"), enroll);

export default router;