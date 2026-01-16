import { Course } from "./Course";

export interface ForumThread {
    id: string;
    title: string;
    content: string;
    userId: string;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
    course?: Course;
}

export interface ForumThreadResponse {
    success: boolean;
    message: string;
    data: ForumThread[];
}
