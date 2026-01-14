import { Router } from "express";
import { getPaths } from "../src/controllers/path.controller";


const router = Router();

// GET /paths
router.get("/", getPaths);

export default router;
