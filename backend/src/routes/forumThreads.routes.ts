import { Router } from 'express';
import {
    createForumThread,
    listForumThreads,
    getForumThread,
    updateForumThread, deleteForumThread
} from "../controllers/forumThread.controller";

const router = Router();

router.get("/lessons/:id", listForumThreads);
router.get("/:id", getForumThread);
router.post("/lessons/:id", createForumThread);
router.put("/:id", updateForumThread);
router.delete("/:id", deleteForumThread);

export default router;