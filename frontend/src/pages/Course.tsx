import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import api from "@/utils/axiosRequestInterceptor";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// -------------------------------
// Types
// -------------------------------
type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  difficulty: Difficulty;
  position: number;
}

interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  modules: Module[];
}

interface ApiResponse {
  success: boolean;
  data: CourseData;
}

// ============================================
// Component
// ============================================
export default function Course() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Progression temporaire (par id)
  const progress = useMemo(() => {
    if (!id) return 0;
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return 10 + (hash % 86); // 10..95
  }, [id]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      // Auth guard
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const res = await api.get<ApiResponse>(`/courses/${id}`);
        setCourse(res.data.data);
      } catch (e: any) {
        setError("Impossible de charger le cours. Vérifie le backend / endpoint.");
        // fallback 
        setCourse({
          id,
          title: "Cours",
          description: "Détails du cours (backend à brancher).",
          modules: [],
        });
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
          <Card className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ============================================
  // UI: Not found
  // ============================================
  if (!course) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Cours introuvable</h1>
        <p className="text-muted-foreground mt-2">Ce cours n’existe pas.</p>
        <Link className="text-primary mt-4 inline-block" to="/learning-paths">
          ← Retour aux learning paths
        </Link>
      </div>
    );
  }

  const modules = course.modules ?? [];
  const totalLessons = modules.reduce((sum, m) => sum + ((m.lessons ?? []).length), 0);

  // ============================================
  // UI: Main
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-5xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground mt-1">
              {course.description ?? "Aucune description"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {modules.length} module(s) • {totalLessons} leçon(s)
            </p>
          </div>
          <div className="text-sm text-muted-foreground">ID: {course.id}</div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Progress */}
        <div className="mt-6 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Progression du cours</p>
            <div className="rounded-full border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
              {progress}%
            </div>
          </div>
          <div className="mt-3">
            <Progress value={progress} className="h-3" />
            <p className="mt-2 text-xs text-muted-foreground">
              *Progression temporaire (à remplacer par les données réelles du backend).
            </p>
          </div>
        </div>

        {/* Modules + Lessons */}
        <h2 className="text-xl font-semibold mt-8">Leçons</h2>

        <div className="mt-3 space-y-4">
          {modules.length === 0 ? (
            <p className="text-muted-foreground">Aucun module/leçon pour ce cours.</p>
          ) : (
            modules
              .slice()
              .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
              .map((m) => {
                const lessons = (m.lessons ?? []).slice().sort((a, b) => a.position - b.position);

                return (
                  <Card key={m.id} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{m.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Module #{m.position} • {lessons.length} leçon(s)
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {lessons.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Aucune leçon dans ce module.
                        </p>
                      ) : (
                        lessons.map((l) => (
                          <div
                            key={l.id}
                            className="flex items-center justify-between gap-3 rounded-md border border-muted/50 bg-muted/20 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {l.position}. {l.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {l.difficulty}
                              </p>
                            </div>
                            <Link className="text-sm text-primary shrink-0" to={`/lesson/${l.id}`}>
                              Ouvrir →
                            </Link>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
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
