import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Course {
  id: string;
  title: string;
  description: string;
}

interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  author: string;
  courses: Course[];
}

interface ApiResponse {
  success: boolean;
  data: LearningPath;
}

export default function PathDetails() {
  const { id } = useParams<{ id: string }>(); // pathId
  const navigate = useNavigate();

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get<ApiResponse>(`/api/learning-paths/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPath(res.data.data);
      } catch (e: any) {
        console.error("API ERROR data:", e?.response?.data);
        setPath(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div className="p-6">Chargement...</div>;

  if (!path) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Learning path introuvable</h1>
        <p className="text-muted-foreground mt-2">Ce parcours n’existe pas.</p>
        <Link className="text-blue-500 mt-4 inline-block" to="/learning-paths">
          ← Retour aux learning paths
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{path.title}</h1>
      <p className="text-muted-foreground mt-2">
        {path.description ?? "Aucune description"}
      </p>

      <h2 className="text-xl font-semibold mt-6">Cours</h2>

      <div className="grid gap-3 mt-3">
        {path.courses.length === 0 ? (
          <p className="text-muted-foreground">Aucun cours pour ce parcours.</p>
        ) : (
          path.courses.map((c) => (
            <Link key={c.id} to={`/course/${c.id}`} className="no-underline">
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>
                    {c.description ?? "Aucune description"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        )}
      </div>

      <div className="mt-6">
        <Link to="/learning-paths">← Retour aux learning paths</Link>
      </div>
    </div>
  );
}
