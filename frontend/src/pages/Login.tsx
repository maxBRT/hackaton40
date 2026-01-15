import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface LoginResponse {
    data?: Record<string, string>;
    message?: string;
    success?: boolean;
}

interface LoginRequest {
    email: string;
    password: string;
}

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setLoading(true);
    try {
        const request: LoginRequest = { email, password };
        const response = await axios.post<LoginResponse>("/api/auth/login", request);
        const responseData = response.data;
        if (!responseData.success) {
          setError(responseData.message ?? null);
        }
        if (responseData.data?.token) {
            localStorage.setItem("token", responseData.data.token);
            setLoading(false);
            navigate("/dashboard");
          }
    }catch (error: any) {
        console.error(error);
        setError(error.message);
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

      <p style={{ marginTop: 16 }}>
        Pas de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </div>
  );
}
