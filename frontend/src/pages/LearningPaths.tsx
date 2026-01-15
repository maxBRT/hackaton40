import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

interface LearningPath {
    id: string;
    title: string;
    description: string;
}

interface LearningPathResponse {
    learningPaths: LearningPath[];
}

export default function LearningPaths() {
    const navigate = useNavigate();
    const [data, setData] = useState<LearningPathResponse | null>(null);
     
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                const response = await axios.get("/api/learning-paths", {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const responseData = response.data
                setData(responseData);
                console.log(responseData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])
    
    
  return (
    <div>
      <h1>Learning paths</h1>
      <p>Choisis un parcours pour voir les cours disponibles.</p>
          
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {data?.learningPaths?.map((p: LearningPath) => (
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
