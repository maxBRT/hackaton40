import { useParams, Link } from "react-router-dom";
import { courses } from "../data/mockLearningPaths";

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

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <p style={{ marginTop: 24 }}>
        Modules / leçons : prochaine étape.
      </p>

      <div style={{ marginTop: 24 }}>
        <Link to={`/path/${course.pathId}`}>← Retour au learning path</Link>
      </div>
    </div>
  );
}
