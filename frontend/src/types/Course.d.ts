export type Course = {
    id: string; 
    title: string;
    description: string;
    category: string;
    level: string;
    isPublished: boolean;
    learningPathId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type CourseResponse = {
    success: boolean;
    message: string;
    data: Course[];
}