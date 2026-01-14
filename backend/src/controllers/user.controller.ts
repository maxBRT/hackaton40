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
        if (data.username || !data.email || !data.password) {
            return res.status(400).json({message: "All fields are required"});
        }

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
        const token = createJWT(newUser.id, newUser.email);

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
        if (!data.email || !data.password) {
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await prisma.user.findUnique({where: {email: data.email}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid password"});
        }
        const token = createJWT(user.id, user.email);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                user: user,
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
            const user = await prisma.user.findUnique({where: {id: userPayload.userId}});

            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            res.status(200).json({
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
};



const createJWT = (userId: string, userEmail: string): string => {
    return jwt.sign(
        {
            userId: userId,
            userEmail: userEmail
        },
        process.env.JWT_SECRET || "super_secret_key",
        {expiresIn: '1h'}
    )  
};