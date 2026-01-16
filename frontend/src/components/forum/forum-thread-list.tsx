import React, {useState} from "react";
import type {ForumThread } from "@/types/Forum";
import ForumItem from "@/components/forum/forum-item.tsx";
import {ForumSearchBar} from "@/components/forum/forum-search.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";

interface ForumThreadProps {
    threads: ForumThread[];
    loading?: boolean;
}

const ForumThreadList: React.FC<ForumThreadProps> = ({threads, loading}) => {
    
    const [search, setSearch] = useState<string>("");
    
    const filteredThreads = threads.filter((thread: ForumThread) => {
        if (search === "") return true;
        return thread.title.toLowerCase().includes(search.toLowerCase());
    });
    
    return (
     <>
         <ForumSearchBar value={search} onChange={setSearch}/>
         <div className="flex flex-col w-full max-w-4xl items-center justify-between mx-auto mb-4">
             {loading ? <Spinner className="mt-5"/> : (<>
         {filteredThreads.map((thread: ForumThread) => (
             <ForumItem key={thread.id} thread={thread}/>
         ))}
             {filteredThreads.length === 0 && search !== "" && (
                 <p className="text-gray-500 mt-4">Aucun résultat trouvé.</p>
             )}
             </>)}
         </div>
     </>   
    )
}

export default ForumThreadList;