import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Pour l’instant, on laisse "any" tant que le backend n’est pas final
      const data: any = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Supporte plusieurs formats possibles selon le backend
      const token = data?.token ?? data?.accessToken ?? data?.jwt;

      if (!token) {
        throw new Error("Réponse invalide : token manquant");
      }

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Mot de passe</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

        <button style={{ marginTop: 16 }} disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
