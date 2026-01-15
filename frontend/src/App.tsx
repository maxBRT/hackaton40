import {useEffect, useState} from "react";
import axios from "axios";

interface ApiResponse {
    message: string;
}

export default function App() {
    const [data, setData] = useState<ApiResponse| null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get<ApiResponse>("/api/")
                setData(result.data);
            } catch (error: any) {
                console.log(error);
            } 
        };
        fetchData();
    }, []) 
    
  return (
    <div>
      <h1>Frontend LearnHub</h1>
      <p>{!data ? "Loading..." : data.message}</p>
    </div>
  );
}
