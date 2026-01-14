import { Link } from "react-router-dom";

export default function Header() {
  const token = localStorage.getItem("token");

  return (
    <div style={{ padding: 16, borderBottom: "1px solid #ddd", display: "flex", gap: 12 }}>
      <Link to="/">Accueil</Link>

      {token ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/learning-paths">Learning paths</Link>
          <Link to="/forum">Forum</Link>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}