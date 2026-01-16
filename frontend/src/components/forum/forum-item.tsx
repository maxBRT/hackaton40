import type {ForumThread} from "@/types/Forum";
import React, {useEffect, useState} from "react";
import {Item, ItemActions, ItemContent, ItemDescription, ItemHeader, ItemTitle} from "@/components/ui/item.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import api from "@/utils/axiosRequestInterceptor.ts";
import {handleApiError} from "@/utils/handleApiError.ts";
import {ArrowRightIcon} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";
import UserAvatar from "@/components/user/user-avatar.tsx";

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
    
    return (
        <Item variant={"outline"} className="my-2 w-full max-w-4xl hover:bg-gray-50 hover:scale-101 transition-transform duration-200">
            <ItemHeader>
                <UserAvatar userId={thread.userId}/> 
                <span>
                    {user ? user.username : <Spinner/>} 
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