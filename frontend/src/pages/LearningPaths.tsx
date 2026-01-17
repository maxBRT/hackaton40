
// Imports React + navigation
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";


// Imports UI (shadcn)
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";


// Imports API + gestion d’erreurs
import api from "@/utils/axiosRequestInterceptor";
import { handleApiError } from "@/utils/handleApiError";

// -------------------------------
// Typage d’un parcours d’apprentissage
// -------------------------------
interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  author: string;
}

// -------------------------------
// Typage de la réponse API
// -------------------------------
interface ApiResponse {
  success: boolean;
  data: LearningPath[];
}

// -------------------------------
// Icônes par id de parcours
// -------------------------------
const PATH_ICONS: Record<string, string> = {
  lp_mobile: "📱",
  lp_web: "🌐",
  lp_backend: "⚙️",
  lp_frontend: "🎨",
  lp_ai: "🤖",
  lp_science: "🧠",
  lp_devops_cloud: "☁️",
  lp_security: "🛡️",
};

// ============================================
// Composant principal
// ============================================
export default function LearningPaths() {
  const navigate = useNavigate();

  // -------------------------------
  // State: data + UI states
  // -------------------------------
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------
  // Progression temporaire (front-only)
  // -------------------------------
  const fakeProgress = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of paths) {
      map.set(p.id, Math.floor(15 + Math.random() * 75)); // 15..89
    }
    return map;
  }, [paths]);

  // -------------------------------
  // Chargement initial: auth + fetch API
  // -------------------------------
  useEffect(() => {
    const load = async () => {
      // --- Auth guard ---
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setError(null);

      try {
        // --- Requête API ---
        const response = await api.get<ApiResponse>("/learning-paths");

        // --- Mise à jour du state ---
        setPaths(response.data.data ?? []);
      } catch (e) {
        // --- Gestion centralisée des erreurs ---
        handleApiError(e, setError);
      } finally {
        // --- Stop loading dans tous les cas ---
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  // ============================================
  // Rendu UI
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-5xl p-6">
        {/* ============================================
            Header
           ============================================ */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning paths</h1>
            <p className="text-muted-foreground mt-1">
              Choisis un parcours pour voir les cours disponibles.
            </p>
          </div>

          {/* compteur */}
          <div className="text-sm text-muted-foreground">
            {paths.length > 0 ? `${paths.length} parcours` : ""}
          </div>
        </div>

        {/* ============================================
            Bloc d’erreur
           ============================================ */}
        {error && (
          <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* ============================================
            Skeleton
           ============================================ */}
        {loading && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ============================================
            Grille des parcours
           ============================================ */}
        {!loading && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {paths.map((p) => {
              // --- Progression temporaire ---
              const progress = fakeProgress.get(p.id) ?? 0;

              // --- Icône hardcodée ---
              const title = p.title.toLowerCase();

              const icon =
                PATH_ICONS[p.id] ??
                (title.includes("devops") && title.includes("cloud") ? "☁️" : null) ??
                (title.includes("cloud") ? "☁️" : null) ??
                (title.includes("devops") ? "🚀" : null) ??
                (title.includes("data") || title.includes("science") ? "🧠" : null) ??
                (title.includes("sécurité") || title.includes("securite") ? "🛡️" : null) ??
                "📘";


              return (
                <Link
                  key={p.id}
                  to={`/learning-path/${p.id}`}
                  className="no-underline"
                >
                  <Card
                    className="
                      group h-full cursor-pointer transition
                      hover:-translate-y-0.5 hover:shadow-lg
                      border-muted/60 hover:border-primary/30
                    "
                  >
                    <CardHeader className="space-y-3">
                      {/* --------------------------------------------
                          Icon + Titre + Description + badge % à droite
                         -------------------------------------------- */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-xl transition group-hover:scale-105">
                            {icon}
                          </div>

                          {/* Text */}
                          <div>
                            <CardTitle className="leading-tight group-hover:text-primary transition">
                              {p.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {p.description ?? "Aucune description"}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Badge % */}
                        <div className="rounded-full border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                          {progress}%
                        </div>
                      </div>

                      {/* --------------------------------------------
                          Barre de progression
                         -------------------------------------------- */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progression</span>
                          <span>parcours</span>
                        </div>
                        <Progress value={progress} />
                      </div>

                      {/* --------------------------------------------
                          Métadonnées
                         -------------------------------------------- */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <span>Par {p.author}</span>
                        <span className="group-hover:text-primary transition">
                          Voir détails →
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* ============================================
            État vide
           ============================================ */}
        {!loading && paths.length === 0 && (
          <div className="mt-10 rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">Aucun parcours trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}
