import type { Request, Response } from "express";
import prisma from "../database/prisma";

// ============================================
// GET /modules – Liste des modules (filtre: courseId)
// ============================================

// Récupère tous les modules, avec possibilité de filtrer par cours associé
export async function getModules(req: Request, res: Response) {
  try {

    // Lecture et validation du paramètre de requête courseId
    const courseId =
      typeof req.query.courseId === "string" ? req.query.courseId : undefined;

    // Construction dynamique de la clause WHERE pour Prisma
    const where: any = {};
    if (courseId) where.courseId = courseId;

    // Récupération des modules depuis la base de données
    const modules = await prisma.module.findMany({
      where,
      orderBy: [{ position: "asc" }, { createdAt: "desc" } as any], 
      include: {
        course: true,
        lessons: true,
      },
    });

    // Envoi de la réponse en cas de succès
    return res.json({
      success: true,
      data: modules,
    });
  } catch (error) {

    // Gestion des erreurs serveur
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}

// ============================================
// GET /modules/:id – Détail d'un module
// ============================================

// Récupère un module précis à partir de son identifiant
export async function getModuleById(req: Request, res: Response) {
  try {

    // Récupération et typage de l'identifiant du module
    const id = req.params.id as string;

    // Recherche du module dnas la base de données
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        course: true,
        lessons: { orderBy: { position: "asc" } },
      },
    });

    // Vérification de l'existence du module
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }

    // Envoi du module trouvé
    return res.json({
      success: true,
      data: module,
    });
  } catch (error) {

    // Gestion des erreurs serveur
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
}

// ============================================
// POST /modules – Création d'un module (ADMIN)
// body: { title, position, courseId }
// ============================================

// Crée un nouveau module associé à un cours (admin)
export async function createModule(req: Request, res: Response) {
  try {

    // Vérification du rôle administrateur
    const role = (req as any).user?.role;
    if (role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin seulement",
      });
    }

    // Extraction des données envoyées dans le body
    const { title, position, courseId } = req.body;

    // Validation du titre
    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "title requis",
      });
    }

    // Validation de la position
    if (typeof position !== "number" || !Number.isInteger(position)) {
      return res.status(400).json({
        success: false,
        message: "position doit être un entier",
      });
    }

    // Validation de l'identifiant du cours
    if (!courseId || typeof courseId !== "string") {
      return res.status(400).json({
        success: false,
        message: "courseId est requis",
      });
    }

    // Vérification de l'existence du cours associé
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course non trouvé",
      });
    }

    // Création du module dans la base de données
    const module = await prisma.module.create({
      data: { title, position, courseId },
    });

    return res.status(201).json({
      success: true,
      message: "Module créé avec succès",
      data: module,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message ?? "Erreur serveur",
    });
  }
}

// ============================================
// PATCH /modules/:id – Modifier un module (ADMIN)
// body: { title, position, courseId }
// ============================================

// Met à jour partiellement les informations d’un module existant
export async function updateModule(req: Request, res: Response) {
  try {

    // Vérification du rôle administrateur
    const role = (req as any).user?.role;
    if (role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin seulement",
      });
    }

    // Récupération de l'identifiant du module
    const id = req.params.id as string;

    // Extraction des champs à modifier
    const { title, position, courseId } = req.body;

    // Vérification de l'existence du module
    const existing = await prisma.module.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }

    // Validation du courseId s'il est fourni
    if (courseId !== undefined) {
      if (typeof courseId !== "string") {
        return res.status(400).json({
          success: false,
          message: "courseId invalide",
        });
      }
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course non trouvé",
        });
      }
    }

    // Validation de la position si fournie
    if (position !== undefined) {
      if (typeof position !== "number" || !Number.isInteger(position)) {
        return res.status(400).json({
          success: false,
          message: "position doit être un entier",
        });
      }
    }

    // Validation du titre si fourni
    if (title !== undefined && typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "title invalide",
      });
    }

    // Mise à jour du module dans la base de données
    const updated = await prisma.module.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(position !== undefined ? { position } : {}),
        ...(courseId !== undefined ? { courseId } : {}),
      },
    });

    // Envoi de la réponse de mise à jour
    return res.json({
      success: true,
      message: "Module modifié avec succès",
      data: updated,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message ?? "Erreur serveur",
    });
  }
}

// ============================================
// DELETE /modules/:id – Supprimer un module (ADMIN)
// ============================================

// Supprime définitivement un module à partir de son identifiant
export async function deleteModule(req: Request, res: Response) {
  try {
    // Vérification du rôle administrateur
    const role = (req as any).user?.role;
    if (role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin seulement",
      });
    }

    // Récupération de l'identifiant du module
    const id = req.params.id as string;

    // Vérification de l'existence du module
    const existing = await prisma.module.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Module non trouvé",
      });
    }

    // Suppression du module dans la base de données
    await prisma.module.delete({ where: { id } });
    
    // Envoi de la réponse de suppression
    return res.json({
      success: true,
      message: "Module supprimé avec succès",
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message ?? "Erreur serveur",
    });
  }
}
