import { Router } from 'express';
import {enroll, enrolledList, unenroll} from "../controllers/enroll.controller";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, enrolledList);
router.post("/unenroll/:id", authMiddleware, unenroll)
router.post("/:id", authMiddleware, enroll);

export default router;