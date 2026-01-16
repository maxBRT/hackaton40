import {useParams} from "react-router-dom";

interface PostParams extends Record<string, string | undefined> {
    id: string;
}

export default function ForumThreadDetails() {
    
    const { id } = useParams<PostParams>() 
    
    
    return <div>{id}</div>
}