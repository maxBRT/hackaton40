import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import api from "@/utils/axiosRequestInterceptor";
import { handleApiError } from "@/utils/handleApiError";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// -------------------------------
// Types
// -------------------------------
interface Course {
  id: string;
  title: string;
  description: string | null;
}

interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  author: string;
  courses?: Course[]; // optionnel = plus safe
}

interface ApiResponse {
  success: boolean;
  data: LearningPath;
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

// -------------------------------
// Utils: progression stable à partir d'un id
// -------------------------------
function stablePercentFromId(seed: string, min = 10, max = 95) {
  if (!seed) return 0;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  const range = max - min + 1;
  return min + (hash % range);
}

// ============================================
// Component
// ============================================
export default function PathDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // -------------------------------
  // State
  // -------------------------------
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------
  // Progression temporaire (parcours)
  // -------------------------------
  const pathProgress = useMemo(() => {
    return id ? stablePercentFromId(id, 15, 90) : 0;
  }, [id]);

  // -------------------------------
  // Fetch data
  // -------------------------------
  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const res = await api.get<ApiResponse>(`/learning-paths/${id}`);
        setPath(res.data.data);
      } catch (e) {
        handleApiError(e, setError);
        setPath(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  // ============================================
  // UI: Loading
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-5xl p-6 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="rounded-lg border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-full" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // UI: Not found
  // ============================================
  if (!path) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Learning path introuvable</h1>
        <p className="text-muted-foreground mt-2">Ce parcours n’existe pas.</p>
        <Link className="text-primary mt-4 inline-block" to="/learning-paths">
          ← Retour aux learning paths
        </Link>
      </div>
    );
  }

  const courses = path.courses ?? [];
  const title = path.title.toLowerCase();

  const icon =

    PATH_ICONS[path.id] ??
    (title.includes("devops") && title.includes("cloud") ? "☁️" : null) ??
    (title.includes("cloud") ? "☁️" : null) ??
    (title.includes("devops") ? "🚀" : null) ??
    (title.includes("data") || title.includes("science") ? "🧠" : null) ??
    (title.includes("sécurité") || title.includes("securite") ? "🛡️" : null) ??
    "📘";


  // ============================================
  // UI: Main
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-5xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-xl">
              {icon}
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">{path.title}</h1>
              <p className="text-muted-foreground mt-1">
                {path.description ?? "Aucune description"}
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">{courses.length} cours</div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Progression parcours */}
        <div className="mt-6 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Progression du parcours</p>
            <div className="rounded-full border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
              {pathProgress}%
            </div>
          </div>

          <div className="mt-3">
            <Progress value={pathProgress} className="h-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              *Progression temporaire (à remplacer par les données réelles du backend).
            </p>
          </div>
        </div>

        {/* Liste des cours */}
        <h2 className="text-xl font-semibold mt-8">Cours</h2>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {courses.length === 0 ? (
            <p className="text-muted-foreground">Aucun cours pour ce parcours.</p>
          ) : (
            courses.map((c) => {
              const courseProgress = stablePercentFromId(c.id, 10, 95);

              return (
                <Link key={c.id} to={`/course/${c.id}`} className="no-underline">
                  <Card className="group h-full cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg border-muted/60 hover:border-primary/30">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="group-hover:text-primary transition">
                            {c.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {c.description ?? "Aucune description"}
                          </CardDescription>
                        </div>

                        <div className="shrink-0 rounded-full border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                          {courseProgress}%
                        </div>
                      </div>

                      {/* Progress cours (fake) */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Progression du cours
                        </p>
                        <Progress value={courseProgress} className="h-2" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link className="text-primary" to="/learning-paths">
            ← Retour aux learning paths
          </Link>
        </div>
      </div>
    </div>
  );
}
