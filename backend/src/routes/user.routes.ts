import { Router } from 'express';
import {login, register, userInfo} from "../controllers/user.controller";
import {authMiddleware} from "../middleware/authMiddleware";
import { validate } from '../middleware/validate';
import { LoginSchema, RegisterSchema } from '../schemas/auth.schema';

const router = Router();

router.post("/login", validate(LoginSchema), login);
router.post("/register", validate(RegisterSchema), register);
router.get("/me", authMiddleware, userInfo)

export default router;
