import type { Request, Response } from "express";
import { prisma } from "../database/prisma";


// ============================================
// GET /paths – Liste des learning paths
// ============================================
export async function getPaths(req: Request, res: Response) {
  try {
    // Récupération des learning paths de la DB
    const paths = await prisma.learningPath.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Envoi de la liste des paths au client
    res.json(paths);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
}
