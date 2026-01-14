import type { Request, Response } from "express";
import prisma from "../database/prisma";

// ======================================================
// GET /lessons – Liste des leçons avec filtres
// ======================================================
export async function getLessons(req: Request, res: Response) {
  try {
    // Lecture et validation des query params
    const courseId =
      typeof req.query.courseId === "string" ? req.query.courseId : undefined;

    const published =
      typeof req.query.published === "string"
        ? req.query.published === "true"
        : undefined;

    const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined;

    // Construction dynamique du WHERE
    const where: any = {};

    if (courseId) where.courseId = courseId;
    if (published !== undefined) where.published = published;

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
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

    if (!title || !content || !moduleId || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "title, content, moduleId et difficulty sont requis",
      });
    }

    const allowed = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    if (!allowed.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: `difficulty invalide (valeurs: ${allowed.join(", ")})`,
      });
    }

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
