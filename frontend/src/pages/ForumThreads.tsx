import ForumThreadList from "@/components/forum/forum-thread-list.tsx";
import {useEffect, useState} from "react";
import type {ForumThread, ForumThreadResponse} from "@/types/Forum";
import api from "@/utils/axiosRequestInterceptor.ts";
import {handleApiError} from "@/utils/handleApiError.ts";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";

export default function ForumThreads() {
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            setLoading(true);
            try {
                const response = await api.get<ForumThreadResponse>("/forum-threads");
                const responseData = response.data;
                setThreads(responseData.data)
            } catch (error){
                handleApiError(error, setError)
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])
    
    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="ml-4 mb-4 text-2xl">Forum</h1>
                <Button variant="secondary" className="hover:scale-101">
                    <PlusIcon className="w-5 h-5"/>
                    Nouvelle Question
                </Button>
            </div> 
            {error && <p className="text-red-500">{error}</p>}
            <ForumThreadList threads={threads} loading={loading}></ForumThreadList>
        </>
    )
    
}
