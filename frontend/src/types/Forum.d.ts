import { Course } from "./Course";
import type {User} from "@/types/User.ts";

export interface ForumThread {
    id: string;
    title: string;
    content: string;
    userId: string;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    course: Course;
}

export interface ForumPost {
    id: string;
    title: string;
    content: string;
    userId: string;
    threadId: string;
    createdAt: Date;
    user: User;
}

export interface ForumThreadResponse {
    success: boolean;
    message: string;
    data: ForumThread[];
}

export interface ForumThreadDetailsResponse {
    success: boolean;
    message: string;
    data: {
        thread: ForumThread,
        posts: ForumPost[]
    }
}

export interface NewForumThreadRequest {
    title: string;
    content: string;
    courseId: string;
}

export interface NewForumThreadResponse {
    success: boolean;
    message: string;
    data: ForumThread;
}