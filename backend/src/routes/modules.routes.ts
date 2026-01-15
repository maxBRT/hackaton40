import { Router } from "express";
import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from "../controllers/modules.controller";
import { validate } from "../middleware/validate";
import { CreateModuleSchema, GetModulesQuerySchema, UpdateModuleSchema } from "../schemas/module.schema";
import { authMiddleware } from "../middleware/authMiddleware";
import { IdParamSchema } from "../schemas/common.schema";

const router = Router();

// GET /modules
router.get("/", validate(GetModulesQuerySchema, "query"), getModules);

// GET /modules/:id
router.get("/:id", validate(IdParamSchema, "params"), getModuleById);

// POST /modules (ADMIN)
router.post("/", authMiddleware, validate(CreateModuleSchema), createModule);

// PATCH /modules/:id
router.patch("/:id", authMiddleware, validate({ params: IdParamSchema, body: UpdateModuleSchema }), updateModule);

// DELETE /modules/:id
router.delete("/:id", authMiddleware, validate(IdParamSchema, "params"), deleteModule);

export default router;
