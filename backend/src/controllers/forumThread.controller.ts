import type { Request, Response } from 'express';
import prisma from "../database/prisma";

export const listForumThreads = async (req: Request, res: Response) => {
    try {
        const lessonId = req.params.id;
        const forumThreads = await prisma.forumThread.findMany({
            where: { courseId: lessonId }
        });
        return res.status(200).json({ status: "success", data: forumThreads });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

export const getForumThread = async (req: Request, res: Response) => {
    const forumThreadId = req.params.id;
    if (!forumThreadId || typeof forumThreadId !== 'string') {
        return res.status(400).json({ status: "error", message: "Valid forumThread ID is required" });
    }
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
        if (!data.title || !data.content || !data.courseId) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }  
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
        
        if (!forumThreadId || typeof forumThreadId !== 'string') {
            return res.status(400).json({ status: "error", message: "Valid forumThread ID is required" });
        }
        
        const data: UpdateForumThreadBody = req.body;
        
        if (!data.title || !data.content) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }
        
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
        if (!forumThreadId || typeof forumThreadId !== 'string') {
            return res.status(400).json({ status: "error", message: "Valid forumThread ID is required" });
        }
        await prisma.forumThread.delete({ where: { id: forumThreadId } });
        return res.status(200).json({ status: "success" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}