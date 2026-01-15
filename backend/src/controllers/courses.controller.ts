import type { Request, Response } from "express";
import prisma from "../database/prisma";

// ============================================
// GET /courses – Liste des cours avec filtres
// ============================================
export async function getCourses(req: Request, res: Response) {
  try {
    // Lecture et validation des paramètres de requête
    const { pathId, category, level, published, q } = req.query as any;

    // Construction dynamique de la clause WHERE pour Prisma
    const where: any = {};

    if (pathId) where.learningPathId = pathId;
    if (category) where.category = category;
    if (level) where.level = level;
    if (published === "true") where.isPublished = true;
    if (published === "false") where.isPublished = false;

    // Recherche textuelle sur le titre et la description
    if (q) {
      const search = q.trim();
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Récupération des cours depuis la base de données
    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { learningPath: true },
    });

    // Réponse succès
    return res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}

// ============================================
// POST /courses – Création d’un cours (ADMIN)
// ============================================
export async function createCourse(req: Request, res: Response) {
  try {
    // Vérification du rôle administrateur
    const role = (req as any).user?.role;
    if (role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin seulement",
      });
    }

    // Extraction des données
    const {
      title,
      description,
      category,
      level,
      isPublished,
      learningPathId,
    } = req.body;

    // Vérification de l’existence du learning path associé
    const path = await prisma.learningPath.findUnique({
      where: { id: learningPathId },
    });

    if (!path) {
      return res.status(404).json({
        success: false,
        message: "LearningPath non trouvé",
      });
    }

    // Création du cours
    const course = await prisma.course.create({
      data: {
        title,
        description,
        category: category ?? null,
        level: level ?? "BEGINNER",
        isPublished: isPublished ?? false,
        learningPathId,
      },
    });

    // Réponse succès
    return res.status(201).json({
      success: true,
      message: "Cours créé avec succès",
      data: course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}



