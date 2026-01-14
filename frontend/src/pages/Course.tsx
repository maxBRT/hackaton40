import { useParams, Link } from "react-router-dom";
import { courses, modules, lessons } from "../data/mockLearningPaths";

export default function Course() {
  const { id } = useParams<{ id: string }>();

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div>
        <h1>Cours introuvable</h1>
        <Link to="/learning-paths">← Retour aux learning paths</Link>
      </div>
    );
  }

  const courseModules = modules
    .filter((m) => m.courseId === course.id)
    .sort((a, b) => a.position - b.position);

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <h2 style={{ marginTop: 24 }}>Modules</h2>

      {courseModules.length === 0 ? (
        <p>Aucun module pour ce cours.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {courseModules.map((mod) => {
            const modLessons = lessons
              .filter((l) => l.moduleId === mod.id)
              .sort((a, b) => a.position - b.position);

            return (
              <div
                key={mod.id}
                style={{
                  padding: 16,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {mod.position}. {mod.title}
                </h3>

                {modLessons.length === 0 ? (
                  <p style={{ marginTop: 8 }}>Aucune leçon.</p>
                ) : (
                  <ul style={{ marginTop: 8 }}>
                    {modLessons.map((l) => (
                      <li key={l.id}>
                        <Link to={`/lesson/${l.id}`}>
                          {l.position}. {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Link to={`/path/${course.pathId}`}>← Retour au learning path</Link>
      </div>
    </div>
  );
}
