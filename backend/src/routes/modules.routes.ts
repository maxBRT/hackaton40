import { Router } from "express";
import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from "../controllers/modules.controller";


const router = Router();

// GET /modules
router.get("/", getModules);

// GET /modules/:id
router.get("/:id", getModuleById);

// POST /modules (ADMIN)
router.post("/", createModule);

// PATCH /modules/:id
router.patch("/:id", updateModule);


// DELETE /modules/:id
router.delete("/:id", deleteModule);

export default router;
