import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config()

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const [, token] = bearer.split(' ');

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};