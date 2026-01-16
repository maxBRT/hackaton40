
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface LearningPathDTO {
  id: string;
  title: string;
  description: string | null;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDTO {
  id: string;
  title: string;
  description: string;
  category: string | null;
  level: Difficulty;
  isPublished: boolean;
  learningPathId: string;
  createdAt: string;
  updatedAt: string;
}
