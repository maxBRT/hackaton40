import type { Request, Response } from "express";
import prisma from "../database/prisma";

// ============================================
// GET /paths – Liste des learning paths
// ============================================
export async function getPaths(req: Request, res: Response) {
  try {
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
