import {useEffect, useState} from "react";
import {handleApiError} from "@/utils/handleApiError.ts";
import api from "@/utils/axiosRequestInterceptor.ts";
import type {ForumThread, ForumThreadResponse} from "@/types/Forum";
import ForumItem from "@/components/forum/forum-item.tsx";

export default function ForumThreadList() {
    
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<ForumThreadResponse>("/forum-threads");
                const responseData = response.data;
                setThreads(responseData.data)
            } catch (error){
                handleApiError(error, setError)
            }
        }
        fetchData();
    }, [])
    
    return (
     <>
         <div className="flex flex-col items-center mb-4">
         {threads.map((thread: ForumThread) => (
             <ForumItem key={thread.id} thread={thread}/>
         ))}
         {error && <p>{error}</p>}
         </div>
     </>   
    )
}