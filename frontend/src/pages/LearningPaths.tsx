import { Link } from "react-router-dom";
import { learningPaths } from "../data/mockLearningPaths";

export default function LearningPaths() {
  return (
    <div>
      <h1>Learning paths</h1>
      <p>Choisis un parcours pour voir les cours disponibles.</p>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {learningPaths.map((p) => (
          <Link
            key={p.id}
            to={`/path/${p.id}`}
            style={{
              display: "block",
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 8,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <h3 style={{ margin: 0 }}>{p.title}</h3>
            <p style={{ marginTop: 8 }}>{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
