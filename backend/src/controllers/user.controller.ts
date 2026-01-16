import type {Request, Response} from 'express';
import prisma from "../database/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTER HANDLER
interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export const register = async (req: Request<any, RegisterBody>, res: Response) => {
    try {
        const data: RegisterBody = req.body;

        const existingUser = await prisma.user.findUnique({where: {email: data.email}});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                hashedPassword: hashedPassword
            }
        });
        const token = createJWT(newUser.id, newUser.email, newUser.role);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user: newUser,
                token: token
            }
        });
    }  catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// LOGIN HANDLER

interface LoginBody {
    email: string;
    password: string;
}

export const login = async (req: Request<any, LoginBody>, res: Response) => {
    try {
        const data: LoginBody = req.body;
        const user = await prisma.user.findUnique({where: {email: data.email}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid password"});
        }
        const token = createJWT(user.id, user.email, user.role);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                token: token
            }
        });
    }catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const userInfo = async (req: Request, res: Response) => {
        try {
            const userPayload = req.user as { userId: string, userEmail: string };
            const user = await prisma.user.findUnique({
                where: {id: userPayload.userId}, 
                include: { 
                    courseUsers: true,  
                    lessonProgresses: true,
                }
            });
            if (!user) {
                console.log("User not found");
                return res.status(404).json({message: "User not found"});
            }
            
            const data = {
                userId: user.id,
                username: user.username,
                userEmail: user.email,
                role: user.role,
                currentExp: user.currentExp,
                userCourses: user.courseUsers,
                lessonProgresses: user.lessonProgresses
            }

            res.status(200).json({
                success: true,
                message: "User info fetched successfully",
                data 
            });
        }catch (error: any) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
};

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id as string;
        const user = await prisma.user.findUnique({where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        return res.status(200).json({
            success: true,
            message: "User info fetched successfully",
            data: user
        });
    }catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const createJWT = (userId: string, userEmail: string, role: string): string => {
    return jwt.sign(
        {
            userId: userId,
            userEmail: userEmail,
            role: role
        },
        process.env.JWT_SECRET || "super_secret_key",
        {expiresIn: '1h'}
    )  
};