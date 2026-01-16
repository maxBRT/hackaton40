import { Router } from 'express';
import {
    createForumThread,
    listForumThreads,
    getForumThread,
    updateForumThread, deleteForumThread, listForumPosts, createForumPost, updateForumPost, deleteForumPost,
    listForumThreadsForCourse
} from "../controllers/forum.controller";
import { validate } from '../middleware/validate';
import { IdParamSchema, PostIdParamSchema } from '../schemas/common.schema';
import {CreateForumPostSchema, CreateForumThreadSchema} from "../schemas/forum.schema";

const router = Router();

//Forum Threads
router.get("/", listForumThreads);
router.get("/courses/:id", validate(IdParamSchema, "params"), listForumThreadsForCourse);
router.get("/:id", validate(IdParamSchema, "params"), getForumThread);
router.post("/courses/:id", validate({ params: IdParamSchema, body: CreateForumThreadSchema }), createForumThread);
router.put("/:id", validate({ params: IdParamSchema, body: CreateForumThreadSchema.partial() }), updateForumThread);
router.delete("/:id", validate(IdParamSchema, "params"), deleteForumThread);

//Forum post
router.get("/:id/posts", validate(IdParamSchema, "params"), listForumPosts);
router.post("/:id/posts", validate({ params: IdParamSchema, body: CreateForumPostSchema }), createForumPost);
router.put("/posts/:postId", validate({ params: PostIdParamSchema, body: CreateForumPostSchema.partial() }), updateForumPost);
router.delete("/posts/:postId", validate(PostIdParamSchema, "params"), deleteForumPost)

export default router;