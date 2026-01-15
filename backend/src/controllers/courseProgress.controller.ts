import type { Request, Response } from "express";
import prisma from "../database/prisma";

// GET /courses/:id/progress 
// Retourne la progression d’un cours pour l’utilisateur connecté
export async function getCourseProgress(req: Request, res: Response) {
  try {

    // Lecture des paramètres (courseId) et identification de l’utilisateur (JWT)
    const courseId = req.params.id as string;
    const userId = (req as any).user?.id as string | undefined;

    // Validation d’accès : l’utilisateur doit être authentifié
    if (!userId) {
      return res.status(401).json({ success: false, message: "Pas autorisé" });
    }

    // Calcul du nombre total de leçons dans le cours (module => courseId)
    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId } },
    });

    // Calcul du nombre de leçons complétées par l’utilisateur dans ce cours
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: { module: { courseId } },
      },
    });

    // Calcul du pourcentage de progression
    const percent =
      totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

    // Détermination du statut global
    // COMPLETED si tout est terminé
    const status = totalLessons > 0 && completedLessons === totalLessons
      ? "COMPLETED"
      : "IN_PROGRESS";

    // Réponse succès avec métriques de progression du cours
    return res.status(200).json({
      success: true,
      data: {
        courseId,
        totalLessons,
        completedLessons,
        percent,
        status,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Erreur Serveur" });
  }
}
