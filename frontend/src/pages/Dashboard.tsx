import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Connecté ✅</p>

      <button onClick={logout} style={{ marginTop: 16 }}>
        Se déconnecter
      </button>
    </div>
  );
}