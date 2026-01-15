import type { Request, Response } from 'express';
import prisma from "../database/prisma";

export const listForumThreads = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.id;
        const forumThreads = await prisma.forumThread.findMany({
            orderBy: { createdAt: "asc" },
            where: { courseId: courseId },
        });
        return res.status(200).json({ status: "success", data: forumThreads });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

export const getForumThread = async (req: Request, res: Response) => {
    const forumThreadId = req.params.id;
    try {
        const forumThread = await prisma.forumThread.findUnique(
            { where: { id: forumThreadId } }
        );
        return res.status(200).json({ status: "success", data: forumThread });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    } 
}

interface CreateForumThreadBody {
    title: string;
    content: string;
    courseId: string;
}

export const createForumThread = async (req: Request<any,  CreateForumThreadBody>, res: Response) => {
    try {
        const userPayload = req.user as { userId: string, userEmail: string };
        const user = await prisma.user.findUnique({where: {id: userPayload.userId}});
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        const lessonId = req.params.id;
        const data: CreateForumThreadBody = req.body;
        const forumThread = await prisma.forumThread.create({ 
            data: {
                title: data.title,
                content: data.content,
                courseId: data.courseId || lessonId,
                userId: user.id
            }});
        return res.status(201).json({ status: "success", data: forumThread });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

interface UpdateForumThreadBody {
    title: string;
    content: string;
}

export const updateForumThread = async (req: Request<any,  UpdateForumThreadBody>, res: Response) => {
    try {
        const forumThreadId = req.params.id;
        const data: UpdateForumThreadBody = req.body;
        
        const forumThread = await prisma.forumThread.update({ 
            where: { id: forumThreadId }, 
            data: { title: data.title, content: data.content } 
        });
        
        res.status(200).json({ status: "success", data: forumThread }); 
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message }); 
    }
}

export const deleteForumThread = async (req: Request, res: Response) => {
    try {
        const forumThreadId = req.params.id;
        await prisma.forumThread.delete({ where: { id: forumThreadId } });
        return res.status(200).json({ status: "success" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

export const listForumPosts = async (req: Request, res: Response) => {
    try {
        const threadId = req.params.id;
        const thread = await prisma.forumThread.findUnique({ where: { id: threadId }, include: { posts : true } });
        return res.status(200).json({ status: "success", data: { thread: thread}})
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

interface CreateForumPostBody {
    title: string;
    content: string;
}

export const createForumPost = async (req: Request<any, CreateForumThreadBody>, res: Response) => {
    try {
        const userPayload = req.user as { userId: string, userEmail: string };
        const user = await prisma.user.findUnique({where: {id: userPayload.userId}});
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        const threadId = req.params.id; 
        const thread = await prisma.forumThread.findUnique({where: {id: threadId}});
        if (!thread){
            return res.status(404).json({ status: "error", message: "Thread not found" });
        }
        const data: CreateForumPostBody = req.body;
        const post = await prisma.forumPost.create({
            data: {
                title: data.title,
                content: data.content,
                userId: user.id,
                threadId: threadId
            }
        })
        return res.status(201).json({ status: "success", data: post});
    }catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

interface UpdateForumPostBody {
    title: string;
    content: string;
}

export const updateForumPost = async (req: Request<any, UpdateForumPostBody>, res: Response) => {
    try {
        const userPayload = req.user as { userId: string, userEmail: string };
        const user = await prisma.user.findUnique({where: {id: userPayload.userId}});
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        } 
        
        const postId = req.params.postId;
        const post = await prisma.forumPost.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ status: "error", message: "Post not found" });
        }
        if (user.id != post.userId){
            return res.status(403).json({ status: "error", message: "Unauthorized" });
        } 
        const data: UpdateForumPostBody = req.body;
        const newPost = await prisma.forumPost.update({ 
            where: { id: postId }, 
            data: { title: data.title, content: data.content } 
        })
        return res.status(200).json({ status: "success", data: newPost }); 
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

export const deleteForumPost = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user as { userId: string, userEmail: string };
        const user = await prisma.user.findUnique({where: {id: userPayload.userId}});
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        } 
        const postId = req.params.postId;
        await prisma.forumPost.delete({ where: { id: postId } });
        return res.status(200).json({ status: "success" }); 
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });   
    }
}