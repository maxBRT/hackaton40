import { Router } from 'express';
import {login, register, userInfo} from "../controllers/user.controller";
import {authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, userInfo)

export default router;
