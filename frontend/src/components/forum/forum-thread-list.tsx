import {useEffect, useState} from "react";
import {handleApiError} from "@/utils/handleApiError.ts";
import api from "@/utils/axiosRequestInterceptor.ts";
import type {ForumThread, ForumThreadResponse} from "@/types/Forum";
import ForumItem from "@/components/forum/forum-item.tsx";
import {ForumSearchBar} from "@/components/forum/forum-search.tsx";
import {Button} from "@/components/ui/button.tsx";
import {PlusIcon} from "lucide-react";

export default function ForumThreadList() {
    
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    
    
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
    
    const filteredThreads = threads.filter((thread) => {
        if (search === "") return true;
        return thread.title.toLowerCase().includes(search.toLowerCase());
    });
    
    return (
     <>
        <div className="flex flex-row justify-between"> 
         <h1 className="ml-4 mb-4 text-2xl">Forum</h1>
         <Button variant="secondary" className="hover:scale-101">
             <PlusIcon className="w-5 h-5"/>
             Nouvelle Question
         </Button>
        </div>
         <ForumSearchBar value={search} onChange={setSearch}/>
         <div className="flex flex-col w-full max-w-4xl items-center justify-between mx-auto mb-4">
             
         {filteredThreads.map((thread: ForumThread) => (
             <ForumItem key={thread.id} thread={thread}/>
         ))}
             {filteredThreads.length === 0 && search !== "" && (
                 <p className="text-gray-500 mt-4">Aucun résultat trouvé.</p>
             )}
         {error && <p>{error}</p>}
         </div>
     </>   
    )
}