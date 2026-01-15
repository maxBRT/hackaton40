import type { Request, Response } from "express";
import prisma from "../database/prisma"


// Configuration XP selon la difficulté de la leçon
const XP_BY_DIFFICULTY = {
    BEGINNER: 10,
    INTERMEDIATE: 20,
    ADVANCED: 30,
} as const;

// ======================================================
// POST /lessons/:id/complete – Compléter une leçon
// ======================================================
export async function completeLessons(req: Request, res: Response) {
    try {

        // Identification de l’utilisateur et validation JWT
        const lessonId = req.params.id as string;
        const userId = (req as any).user?.id as string | undefined;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Pas autorisé" });
        }

        // Vérification de l’existence de la leçon
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { id: true, difficulty: true },
        });

        if (!lesson) {
             return res.status(404).json({ success: false, message: "Leçon introuvable" });
        }
        
        // Calcul de l’XP à attribuer selon la difficulté
        const xp = XP_BY_DIFFICULTY[lesson.difficulty];
        
        // Vérification si la leçon est déjà complétée
        const existing = await prisma.lessonProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId } },
            select: { isCompleted: true },
            });

            if (existing?.isCompleted) {
            return res.status(200).json({
                success: true,
                message: "Déjà completé",
            });
        }
        
        // Transaction progression et XP utilisateur
        const result = await prisma.$transaction(async (tx) => {

        // Création ou mise à jour de la progression de la leçon
        const progress = await tx.lessonProgress.upsert({
            where: { userId_lessonId: { userId, lessonId } },
            create: {
            userId,
            lessonId,
            isCompleted: true,
            completedAt: new Date(),
            xpEarned: xp,
            },
            update: {
            isCompleted: true,
            completedAt: new Date(),
            xpEarned: xp,
            },
        });
        
        // Incrémentation de l’expérience de l’utilisateur
        const user = await tx.user.update({
            where: { id: userId },
            data: { currentExp: { increment: xp } },
            select: { id: true, currentExp: true },
        });

        return { progress, user, xpAdded: xp };
        });

        // Réponse de succès après complétion
        return res.status(200).json({
        success: true,
        message: "Leçon completé",
        data: result,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "erreur serveur" });
    }
    }
