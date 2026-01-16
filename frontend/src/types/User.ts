import type { Course } from "./Course";

export type MePayload = {
  userId: string;
  username: string;
  userEmail: string;
  role: string;
  currentExp: number;
  userCourses: {
    courseId: string;
    userId: string;
    completed: boolean;
    course: Course;
  }[];
  lessonProgresses: {
    userId: string;
    lessonId: string;
    isCompleted: boolean;
    lesson: {
      id: string;
      title: string;
    };
  }[];
};

export type MeResponse = {
  success: boolean;
  message: string;
  data: MePayload;
};
