import type { Request, Response } from 'express';
import prisma from "../database/prisma";

export const enroll = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user as { userId: string, userEmail: string };
        const user = await prisma.user.findUnique({where: {id: userPayload.userId}});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"});
        }
        const courseId = req.params.id;
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        await prisma.courseUser.create({
            data: {
                userId: user.id,
                courseId: course.id,
                completed: false
            }
        })
        return res.status(201).json({ success: true, message: "Course enrolled successfully" });

    }catch (error: any) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const unenroll = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.id;
        const course = await prisma.course.findUnique({where: {id: courseId}});
        if (!course) {
            return res.status(404).json({success: false, message: "Course not found"});
        }

        const userPayload = req.user as { userId: string, userEmail: string };
        const user = await prisma.user.findUnique({where: {id: userPayload.userId}});
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        const result = await prisma.courseUser.deleteMany({where: {userId: user.id, courseId: course.id}});
        if (result.count === 0) {
            return res.status(404).json({success: false, message: "Course not enrolled"});
        }
        return res.status(200).json({success: true, message: "Course unenrolled successfully"});
    }catch (error: any) {
        console.error(error);
        return res.status(500).json({success: false, message: error.message});
    } 
}

export const enrolledList = async (req: Request, res: Response) => {
    try {
       const userPayload = req.user as { userId: string, userEmail: string };
       const user = await prisma.user.findUnique({where: {id: userPayload.userId}});
       if (!user){
           return res.status(404).json({success: false, message: "User not found"});
       }
       
       const courses = await prisma.courseUser.findMany({where: {userId: user.id}, include: {course: true}});
       return res.status(200).json({success: true, data: courses});
    }catch (error: any) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
