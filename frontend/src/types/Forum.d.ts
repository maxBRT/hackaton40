import { Course } from "./Course";

export interface ForumThread {
    id: string;
    title: string;
    content: string;
    userId: string;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
    course?: Course;
}

export interface ForumThreadResponse {
    success: boolean;
    message: string;
    data: ForumThread[];
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