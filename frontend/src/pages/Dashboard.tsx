import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

interface UserDataResponse {
    id: string;
    username: string;
    email: string;
    role: string;
    currentExp: number;
    userCourses: Record<string, any>[];
    lessonProgress: Record<string, any>[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserDataResponse | null>(null);
  
  useEffect(() => {
      const fetchUserData = async () => {
          setError(null); 
          setLoading(true);
          try {
              const token = localStorage.getItem("token");
              if (!token) {
                  navigate("/login");
                  return;
              }
              const response = await axios.get<UserDataResponse>("/api/auth/me", {
                  headers: {Authorization: `Bearer ${token}`}
              });
              setData(response.data);
          } catch (error: any) {
              console.error(error.message)
              setError(error.message)
          }finally {
              setLoading(false);
          }
      }
      fetchUserData();
  }, [])
  
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={{ padding: 24 }}>
        <h1>Dashboard</h1>
        <div>
            <h3>User Data</h3>
            {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
            {!loading ? "" : <p style={{ marginTop: 12 }}>Loading...</p>}
           <pre>{!data ? "Loading..." : JSON.stringify(data, null, 2)}</pre>
        </div>
      <p>Connecté ✅</p>

      <button onClick={logout} style={{ marginTop: 16 }}>
        Se déconnecter
      </button>
    </div>
  );
}