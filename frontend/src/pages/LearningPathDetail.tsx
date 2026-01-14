import { useParams, Link } from "react-router-dom";
import { learningPaths, courses } from "../data/mockLearningPaths";

export default function LearningPathDetail() {
  const { id } = useParams<{ id: string }>();

  const path = learningPaths.find((p) => p.id === id);

  if (!path) {
    return (
      <div>
        <h1>Learning path introuvable</h1>
        <p>Ce parcours n’existe pas.</p>
        <Link to="/learning-paths">← Retour aux learning paths</Link>
      </div>
    );
  }

  const pathCourses = courses.filter((c) => c.pathId === path.id);

  return (
    <div>
      <h1>{path.title}</h1>
      <p>{path.description}</p>

      <h2 style={{ marginTop: 24 }}>Cours</h2>

      {pathCourses.length === 0 ? (
        <p>Aucun cours pour ce parcours.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {pathCourses.map((c) => (
            <div
              key={c.id}
              style={{
                padding: 16,
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            >
              <h3 style={{ margin: 0 }}>{c.title}</h3>
              <p style={{ marginTop: 8 }}>{c.description}</p>

              <Link to={`/course/${c.id}`}>Voir le cours →</Link>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Link to="/learning-paths">← Retour aux learning paths</Link>
      </div>
    </div>
  );
}
