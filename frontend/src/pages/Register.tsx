import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface RegisterResponse {
  data?: Record<string, any>;
  message?: string;
  success?: boolean;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const request: RegisterRequest = { username, email, password };
      const response = await axios.post<RegisterResponse | null>("api/auth/register", request);
      const responseData = response.data;
      if (!responseData?.success) {
        console.error(responseData);
        setError(responseData?.message ?? "Erreur");
        return;
      }
      if (responseData.data?.token) {
        localStorage.setItem("token", responseData.data.token);
        navigate("/dashboard");
        return;
      }
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit}>
        <div> 
          <label>Nom d'utilisateur</label>
          <br />
          <input
            type={"text"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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

        <div style={{ marginTop: 12 }}>
          <label>Confirmer le mot de passe</label>
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

        <button style={{ marginTop: 16 }} disabled={loading}>
          {loading ? "Création..." : "Créer un compte"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}