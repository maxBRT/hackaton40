import ForumThreadList from "@/components/forum/forum-thread-list.tsx";
import {useEffect, useState} from "react";
import type {ForumThread, ForumThreadResponse} from "@/types/Forum";
import api from "@/utils/axiosRequestInterceptor.ts";
import {handleApiError} from "@/utils/handleApiError.ts";
import NewForumThreadForm from "@/components/forum/new-forum-thread-form.tsx";
import type {Course, CourseResponse} from "@/types/Course";

export default function ForumThreads() {
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            // Fetch threads from API
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
            
            setLoading(false);
            try {
                const response = await api.get<CourseResponse>("/courses"); 
                const responseData = response.data
                setCourses(responseData.data)
            } catch (e) {
                handleApiError(e, setError)
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])
    
    const handleThreadCreated = (newThread: ForumThread) => {
        setThreads([newThread, ...threads]);
    }
    
    return (
        <>
            <div className="flex flex-row justify-between">
                <h1 className="ml-4 mb-4 text-2xl">Forum</h1>
            </div> 
            {error && <p className="text-red-500">{error}</p>}
            <NewForumThreadForm courses={courses} onThreadCreated={handleThreadCreated}></NewForumThreadForm>
            <ForumThreadList threads={threads} loading={loading}></ForumThreadList>
        </>
    )
    
}
