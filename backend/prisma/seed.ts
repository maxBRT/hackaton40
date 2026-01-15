// import bcrypt from "bcryptjs";
// import { PrismaClient, Difficulty, Role } from "../src/generated/prisma";

// const prisma = new PrismaClient();

// type SeedLesson = {
//   title: string;
//   difficulty: Difficulty;
//   content: string;
//   quiz?: {
//     title: string;
//     description?: string;
//     status?: boolean;
//     questions: Array<{
//       answers: string[];
//       correctAnswer: number;
//     }>;
//   };
// };

// async function main() {
//   // ============================================================
//   // RESET DE LA BASE
//   // Supprime toutes les données en respectant l’ordre des FK
//   // ============================================================
//   await prisma.forumPost.deleteMany();
//   await prisma.forumThread.deleteMany();
//   await prisma.lessonProgress.deleteMany();
//   await prisma.courseUser.deleteMany();
//   await prisma.question.deleteMany();
//   await prisma.quiz.deleteMany();
//   await prisma.lesson.deleteMany();
//   await prisma.module.deleteMany();
//   await prisma.course.deleteMany();
//   await prisma.learningPath.deleteMany();
//   await prisma.user.deleteMany();

//   // ============================================================
//   // USERS
//   // Création d’utilisateurs avec mots de passe hashés
//   // ============================================================
//   const hashedAdmin = await bcrypt.hash("Admin123!", 10);
//   const hashedUser = await bcrypt.hash("User123!", 10);

//   const admin = await prisma.user.create({
//     data: {
//       username: "admin",
//       email: "admin@learnhub.dev",
//       role: Role.ADMIN,
//       hashedPassword: hashedAdmin,
//       currentExp: 2500,
//     },
//   });

//   const alice = await prisma.user.create({
//     data: {
//       username: "alice",
//       email: "alice@learnhub.dev",
//       role: Role.USER,
//       hashedPassword: hashedUser,
//       currentExp: 350,
//     },
//   });

//   const bob = await prisma.user.create({
//     data: {
//       username: "bob",
//       email: "bob@learnhub.dev",
//       role: Role.USER,
//       hashedPassword: hashedUser,
//       currentExp: 120,
//     },
//   });

  
//   // ============================================================
//   // LEARNING PATHS
//   // Représente les grandes trajectoires pédagogiques
//   // ============================================================
//   const pathWeb = await prisma.learningPath.create({
//     data: {
//       title: "Full-Stack TypeScript",
//       description: "From TS fundamentals to backend APIs and databases.",
//       author: "LearnHub Team",
//     },
//   });

//   const pathGame = await prisma.learningPath.create({
//     data: {
//       title: "Game Dev Foundations",
//       description: "Learn game loops, assets, and basic engine patterns.",
//       author: "LearnHub Team",
//     },
//   });

//   // ============================================================
//   // COURSES
//   // Cours rattachés à un learning path
//   // ============================================================
//   const courseTs = await prisma.course.create({
//     data: {
//       title: "TypeScript Essentials",
//       description: "Types, interfaces, generics, and real-world patterns.",
//       category: "TypeScript",
//       level: Difficulty.BEGINNER,
//       isPublished: true,
//       learningPathId: pathWeb.id,
//     },
//   });

//   const courseApi = await prisma.course.create({
//     data: {
//       title: "REST API with Express + Prisma",
//       description: "Build a clean REST API with auth, Prisma, and Postgres.",
//       category: "Backend",
//       level: Difficulty.INTERMEDIATE,
//       isPublished: true,
//       learningPathId: pathWeb.id,
//     },
//   });

//   const courseGame = await prisma.course.create({
//     data: {
//       title: "2D Game Architecture Basics",
//       description: "Scenes, entities, input, collisions, and saving data.",
//       category: "GameDev",
//       level: Difficulty.BEGINNER,
//       isPublished: true,
//       learningPathId: pathGame.id,
//     },
//   });

//   // ============================================================
//   // DONNÉES PÉDAGOGIQUES
//   // Définition des modules, lessons et quizzes (structure en mémoire)
//   // ============================================================
//   const tsModules: Array<{ title: string; lessons: SeedLesson[] }> = [
//     {
//       title: "TS Basics",
//       lessons: [
//         {
//           title: "Types: string/number/boolean",
//           difficulty: Difficulty.BEGINNER,
//           content:
//             "Learn basic TS types and how they catch errors early.\n\n- primitives\n- type inference\n- unions",
//           quiz: {
//             title: "Quick check: Types",
//             description: "Basic TS types and inference",
//             status: true,
//             questions: [
//               {
//                 answers: ["number", "int", "float", "decimal"],
//                 correctAnswer: 0,
//               },
//               {
//                 answers: [
//                   "TypeScript runs in the browser directly",
//                   "TypeScript compiles to JavaScript",
//                   "TypeScript replaces JavaScript",
//                   "TypeScript is only for backend",
//                 ],
//                 correctAnswer: 1,
//               },
//             ],
//           },
//         },
//         {
//           title: "Interfaces vs Types",
//           difficulty: Difficulty.BEGINNER,
//           content:
//             "Understand when to use interface vs type.\n\n- structural typing\n- extension\n- unions & intersections",
//         },
//       ],
//     },
//     {
//       title: "Practical Patterns",
//       lessons: [
//         {
//           title: "Generics in practice",
//           difficulty: Difficulty.INTERMEDIATE,
//           content:
//             "Generics help you write reusable strongly-typed code.\n\n- <T>\n- constraints\n- inference",
//           quiz: {
//             title: "Quick check: Generics",
//             status: true,
//             questions: [
//               {
//                 answers: ["<T>", "{T}", "(T)", "[T]"],
//                 correctAnswer: 0,
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ];

//   // ============================================================
//   // DONNÉES PÉDAGOGIQUES
//   // Définition des modules, lessons et quizzes (structure en mémoire)
//   // ============================================================
//   const apiModules: Array<{ title: string; lessons: SeedLesson[] }> = [
//     {
//       title: "Express & Routing",
//       lessons: [
//         {
//           title: "Controllers and routes",
//           difficulty: Difficulty.BEGINNER,
//           content:
//             "Split your API into routes and controllers.\n\n- express.Router\n- controllers\n- validation basics",
//         },
//       ],
//     },
//     {
//       title: "Prisma & DB",
//       lessons: [
//         {
//           title: "Modeling relations",
//           difficulty: Difficulty.INTERMEDIATE,
//           content:
//             "Learn 1-N and N-N relationships with Prisma.\n\n- relation fields\n- cascading deletes\n- indexes",
//         },
//         {
//           title: "Seeding strategies",
//           difficulty: Difficulty.INTERMEDIATE,
//           content:
//             "Seed with upserts, createMany, and deterministic fixtures.",
//         },
//       ],
//     },
//   ];

//   const gameModules: Array<{ title: string; lessons: SeedLesson[] }> = [
//     {
//       title: "Core Loop",
//       lessons: [
//         {
//           title: "Game loop: update & render",
//           difficulty: Difficulty.BEGINNER,
//           content:
//             "A game loop is often: input → update → render.\n\n- delta time\n- fixed vs variable timestep",
//           quiz: {
//             title: "Quick check: Game loop",
//             status: true,
//             questions: [
//               {
//                 answers: ["update -> render", "render -> update", "sleep -> stop", "compile -> run"],
//                 correctAnswer: 0,
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ];

//   // ============================================================
//   // HELPER
//   // Crée dynamiquement modules → lessons → quizzes → questions
//   // ============================================================
//   async function createCourseStructure(
//     courseId: string,
//     modulesData: Array<{ title: string; lessons: SeedLesson[] }>
//   ) {
//     for (let i = 0; i < modulesData.length; i++) {
//       const mod = modulesData[i];

//       const createdModule = await prisma.module.create({
//         data: {
//           title: mod.title,
//           position: i + 1,
//           courseId,
//         },
//       });

//       for (let j = 0; j < mod.lessons.length; j++) {
//         const lesson = mod.lessons[j];

//         const createdLesson = await prisma.lesson.create({
//           data: {
//             title: lesson.title,
//             difficulty: lesson.difficulty,
//             content: lesson.content,
//             position: j + 1,
//             moduleId: createdModule.id,
//           },
//         });

//         if (lesson.quiz) {
//           const createdQuiz = await prisma.quiz.create({
//             data: {
//               title: lesson.quiz.title,
//               description: lesson.quiz.description ?? null,
//               status: lesson.quiz.status ?? false,
//               lessonId: createdLesson.id,
//             },
//           });

//           if (lesson.quiz.questions.length) {
//             await prisma.question.createMany({
//               data: lesson.quiz.questions.map((q) => ({
//                 answers: q.answers,
//                 correctAnswer: q.correctAnswer,
//                 quizId: createdQuiz.id,
//               })),
//             });
//           }
//         }
//       }
//     }
//   }

//   // ============================================================
//   // CRÉATION DES STRUCTURES DE COURS
//   // ============================================================
//   await createCourseStructure(courseTs.id, tsModules);
//   await createCourseStructure(courseApi.id, apiModules);
//   await createCourseStructure(courseGame.id, gameModules);

//   // ============================================================
//   // INSCRIPTIONS & PROGRESSION
//   // Simule l’avancement réel des utilisateurs
//   // ============================================================
//   await prisma.courseUser.createMany({
//     data: [
//       { userId: alice.id, courseId: courseTs.id, completed: false },
//       { userId: alice.id, courseId: courseApi.id, completed: false },
//       { userId: bob.id, courseId: courseTs.id, completed: false },
//     ],
//   });

//   const tsLessons = await prisma.lesson.findMany({
//     where: { module: { courseId: courseTs.id } },
//     orderBy: [{ module: { position: "asc" } }, { position: "asc" }],
//   });

//   await prisma.lessonProgress.createMany({
//     data: tsLessons.slice(0, 2).map((l, idx) => ({
//       userId: alice.id,
//       lessonId: l.id,
//       isCompleted: true,
//       completedAt: new Date(Date.now() - (idx + 1) * 86400000),
//       xpEarned: 50,
//     })),
//   });

//   // ============================================================
//   // FORUM
//   // Création d’un thread avec réponses
//   // ============================================================
//   const thread = await prisma.forumThread.create({
//     data: {
//       title: "How do you structure modules and lessons?",
//       content:
//         "I’m not sure if I should keep modules small or make fewer bigger ones. Any tips?",
//       userId: alice.id,
//       courseId: courseApi.id,
//     },
//   });

//   await prisma.forumPost.createMany({
//     data: [
//       {
//         title: "My approach",
//         content:
//           "I keep modules short and focused. Each lesson should have one goal and one exercise.",
//         userId: admin.id,
//         threadId: thread.id,
//       },
//       {
//         title: null,
//         content:
//           "Same. I also like numbering positions so ordering is stable in UI.",
//         userId: bob.id,
//         threadId: thread.id,
//       },
//     ],
//   });

//   console.log("✅ Seed completed!");
// }

// // ============================================================
// // POINT DE DÉMARRAGE DU PROGRAMME
// // Lance le seed et gère erreurs + fermeture Prisma
// // ============================================================
// main()
//   .catch((e) => {
//     console.error("❌ Seed failed:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
