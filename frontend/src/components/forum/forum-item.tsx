import type {ForumThread} from "@/types/Forum";
import React, {useEffect, useMemo, useState} from "react";
import {Item, ItemActions, ItemContent, ItemDescription, ItemHeader, ItemTitle} from "@/components/ui/item.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {createAvatar} from "@dicebear/core";
import {thumbs} from "@dicebear/collection";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import api from "@/utils/axiosRequestInterceptor.ts";
import {handleApiError} from "@/utils/handleApiError.ts";
import {ArrowRightIcon} from "lucide-react";

interface ForumItemProps {
    thread: ForumThread
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: User;
}


const ForumItem: React.FC<ForumItemProps> = ({ thread }) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
        
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get<ApiResponse>(`/auth/${thread.userId}`)
                const responseData = response.data
                setUser(responseData.data)
            }catch (e) {
                handleApiError(e, setError)
                console.error(error)
            }
        }
      
        fetchUser();
    }, [thread.userId, error]);
    
    const avatar = useMemo(() => {
       return createAvatar(thumbs, { seed: thread.userId }).toDataUri() 
    }, [thread.userId]) 
    
    return (
        <Item variant={"outline"} className="my-2 w-full max-w-2xl hover:bg-gray-50 hover:scale-101 transition-transform duration-200">
            <ItemHeader>
                <Avatar className="w-8 h-8">
                    <AvatarImage src={avatar} className="rounded-full" /> 
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>
                    {user ? user.username : "Loading..."} 
                </span>
            </ItemHeader> 
            <ItemContent>
                <ItemTitle>{thread.title}</ItemTitle>
                <ItemDescription className="flex items-center gap-2">
                <span className="font-medium">{thread.course?.title}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {thread.course?.category}
                </span>
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button size="sm" onClick={() => navigate(`/forum/${thread.id}`)}>
                    <ArrowRightIcon className="w-4 h-4"/> 
                </Button>
            </ItemActions>
        </Item> 
        
    )
    
}
export default ForumItem