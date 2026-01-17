import type {Request, Response} from 'express';
import prisma from "../database/prisma";

export const getQuiz = async (req: Request, res: Response) => {
    try{
        const lessonId = req.params.id;
        const lesson = await prisma.lesson.findUnique({
            where: {id: lessonId}, 
            include: {
                quizzes: {
                    include: {
                        questions: true
                    }
                }
            }
        });
        if (!lesson) {
            return res.status(404).json({success: false, message: "Lesson not found"});
        }
        return res.status(200).json({success: true, data: lesson.quizzes[0] || null});
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({success: false, message: error.message});
    }
}

interface CreateQuizBody {
    title: string;
    description: string;
    questions: {
        question: string;
        answers: string[];
        correctAnswer: number;
    }[];
}

export const createQuiz = async (req: Request, res: Response) => {
    try {
        const userPayload = req.user as { userId: string, userEmail: string };
        const user = await prisma.user.findUnique({where: {id: userPayload.userId}});
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }  
        if (user.role != "ADMIN"){
            return res.status(403).json({success: false, message: "Admin only"});   
        }
        const lessonId = req.params.id;
        const data: CreateQuizBody = req.body;
        const quiz = await prisma.quiz.create({
            data: {
               title : data.title,
               description : data.description, 
               lessonId : lessonId,
               questions : {
                   create : data.questions
                }
            }
        })
        return res.status(201).json({success: true, data: quiz});
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({success: false, message: error.message});
    }
}