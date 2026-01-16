interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    currentExp: number;
    createdAt: Date;
    updatedAt: Date;
    userCourses?: [];
    lessonProgress?: []; 
}