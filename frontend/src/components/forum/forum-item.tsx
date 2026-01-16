import type {ForumThread} from "@/types/Forum";
import React from "react";
import {Item, ItemActions, ItemContent, ItemDescription, ItemHeader, ItemTitle} from "@/components/ui/item.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {ArrowRightIcon} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";
import UserAvatar from "@/components/user/user-avatar.tsx";

interface ForumItemProps {
    thread: ForumThread
}

const ForumItem: React.FC<ForumItemProps> = ({ thread }) => {
    const navigate = useNavigate();
    
    return (
        <Item variant={"outline"} className="my-2 w-full max-w-4xl hover:bg-muted hover:scale-101 transition-transform duration-200">
            <ItemHeader>
                <UserAvatar userId={thread.userId}/> 
                <span>
                    {thread.user ? thread.user.username : <Spinner/>} 
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