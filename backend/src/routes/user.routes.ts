import { Router } from 'express';
import {getUserInfo, login, register, userInfo} from "../controllers/user.controller";
import {authMiddleware} from "../middleware/authMiddleware";
import { validate } from '../middleware/validate';
import { LoginSchema, RegisterSchema } from '../schemas/auth.schema';
import {IdParamSchema} from "../schemas/common.schema";

const router = Router();

router.post("/login", validate(LoginSchema), login);
router.post("/register", validate(RegisterSchema), register);
router.get("/me", authMiddleware, userInfo)
router.get("/:id", validate(IdParamSchema, "params"), getUserInfo);
export default router;
