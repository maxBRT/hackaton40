import { Router } from 'express';
import {
    createForumThread,
    listForumThreads,
    getForumThread,
    updateForumThread, deleteForumThread, listForumPosts, createForumPost, updateForumPost, deleteForumPost
} from "../controllers/forum.controller";

const router = Router();

//Forum Threads
router.get("/courses/:id", listForumThreads);
router.get("/:id", getForumThread);
router.post("/courses/:id", createForumThread);
router.put("/:id", updateForumThread);
router.delete("/:id", deleteForumThread);

//Forum post
router.get("/:id/posts", listForumPosts);
router.post("/:id/posts", createForumPost);
router.put("/posts/:postId", updateForumPost);
router.delete("/posts/:postId", deleteForumPost)



export default router;