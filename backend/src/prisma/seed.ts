import prisma from "../database/prisma";
import UserData from "./data/users.json"
import CoursesData from "./data/courses.json"
import LearningPathsData from "./data/learningPaths.json"
import ModulesData from "./data/modules.json"
import LessonsData from "./data/lessons.json"
import QuizzesData from "./data/quizzes.json"
import ForumThreadsData from "./data/forumThreads.json"
import ForumPostsData from "./data/forumPosts.json"
import LessonProgressesData from "./data/lessonProgresses.json"
import CourseUsersData from "./data/courseUsers.json"
import QuestionsData from "./data/questions.json"
import {Prisma} from "../generated/prisma/client";

async function main() {
  console.log("Seeding...");
  
  // Supprime toutes les données en respectant l’ordre des FK
  await prisma.forumPost.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.courseUser.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.user.deleteMany();
  
  // Créé les données
  await prisma.user.createMany({
    data: UserData as Prisma.UserCreateManyInput[],
  });
  
  await prisma.learningPath.createMany({
    data: LearningPathsData as Prisma.LearningPathCreateManyInput[],
  })

  await prisma.course.createMany({
    data: CoursesData as Prisma.CourseCreateManyInput[],
  })
  
  await prisma.module.createMany({
    data: ModulesData as Prisma.ModuleCreateManyInput[],
  })

  await prisma.lesson.createMany({
    data: LessonsData as Prisma.LessonCreateManyInput[],
  })

  await prisma.quiz.createMany({
    data: QuizzesData as Prisma.QuizCreateManyInput[],
  })
  
  await prisma.question.createMany({
    data: QuestionsData as Prisma.QuestionCreateManyInput[],
  })
  
  await prisma.courseUser.createMany({
    data: CourseUsersData as Prisma.CourseUserCreateManyInput[],
  })
  
  await prisma.lessonProgress.createMany({
    data: LessonProgressesData as Prisma.LessonProgressCreateManyInput[],
  })
  
  await prisma.forumThread.createMany({
    data: ForumThreadsData as Prisma.ForumThreadCreateManyInput[],
  })
  
  await prisma.forumPost.createMany({
    data: ForumPostsData as Prisma.ForumPostCreateManyInput[],
  })
   
  console.log("Seed completed!");
}

// Lance le seed et gère erreurs + fermeture Prisma
main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
