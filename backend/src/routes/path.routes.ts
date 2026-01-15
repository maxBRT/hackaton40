import { Router } from "express";
import { getPaths } from "../controllers/path.controller";
import { validate } from "../middleware/validate";
import { z } from "zod";

const router = Router();

// GET /paths
router.get("/", validate(z.object({}), "query"), getPaths);

export default router;
