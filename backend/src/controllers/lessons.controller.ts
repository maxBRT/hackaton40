import type { Request, Response } from "express";
import prisma from "../database/prisma";

// ======================================================
// GET /lessons – Liste des leçons avec filtres
// ======================================================
export async function getLessons(req: Request, res: Response) {
  try {
    // Lecture et validation des query params
    const { courseId, published, q } = req.query as any;

    const isPublished = published !== undefined ? published === "true" : undefined;
    const searchQuery = typeof q === "string" ? q.trim() : undefined;

    // Construction dynamique du WHERE
    const where: any = {};

    if (courseId) where.courseId = courseId;
    if (isPublished !== undefined) where.published = isPublished;

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { content: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // Requête Prisma
    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: { position: "asc" },
      include: {
        module: {
          select: { id: true, title: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: lessons,
      count: lessons.length,
    });
  } catch (error) {
    console.error("GET /lessons error:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des leçons",
    });
  }
}

// ======================================================
// POST /lessons – Créer une leçon (admin)
// ======================================================
export async function createLesson(req: Request, res: Response) {
  try {
    const { title, content, moduleId, position, difficulty } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        moduleId,
        position,
        difficulty,
      },
    });

    return res.status(201).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error("POST /lessons error:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la leçon",
    });
  }
}


// ======================================================
// GET /lessons/:id – Détails d’une leçon
// ======================================================
export async function getLessonById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          select: { id: true, title: true },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Leçon introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error("GET /lessons/:id error:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}

// Configuration XP selon la difficulté de la leçon
const XP_BY_DIFFICULTY = {
      BEGINNER: 10,
      INTERMEDIATE: 20,
      ADVANCED: 30,
  } as const;

// ======================================================
// POST /lessons/:id/complete – Compléter une leçon
// ======================================================
export async function completeLesson(req: Request, res: Response) {
    try {

        // Identification de l’utilisateur et validation JWT
        const lessonId = req.params.id as string;
        const userId = (req as any).user?.userId as string;

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
