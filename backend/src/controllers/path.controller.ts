import type { Request, Response } from "express";
import prisma from "../database/prisma";

// ============================================
// GET /paths – Liste des learning paths
// ============================================
export async function getPaths(req: Request, res: Response) {
  try {
    console.log("Hello")
    // Récupération des learning paths depuis la DB
    const paths = await prisma.learningPath.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Réponse succès
    return res.json({
      success: true,
      data: paths,
    });
  } catch (error) {
    console.error(error);

    // Réponse erreur
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}

// ============================================
// GET /learning-paths/:id – Détail d’un learning path
// ============================================
export async function getLearningPathById(req: Request, res: Response) {
  try {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Paramètre id invalide",
      });
    }

    const path = await prisma.learningPath.findUnique({
      where: { id },
      include: {
        courses: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!path) {
      return res.status(404).json({
        success: false,
        message: "Learning path introuvable",
      });
    }

    return res.json({
      success: true,
      data: path,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}
