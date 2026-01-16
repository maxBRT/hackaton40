import { Link } from "react-router-dom";
import {useEffect, useState} from "react";

export default function Header() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };
        
        window.addEventListener("auth-change", handleStorageChange);
        
        return () => {
            window.removeEventListener("auth-change", handleStorageChange);
        };
    }, []);
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