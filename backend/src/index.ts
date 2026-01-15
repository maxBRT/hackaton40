import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import  swaggerRouter from "./routes/swagger.routes";
import "./schemas/course.schema";
import "./schemas/path.schema";
import "./schemas/module.schema";
import "./schemas/lesson.schema";
import "./schemas/auth.schema";
import "./schemas/quiz.schema";
import "./schemas/enroll.schema";
import "./schemas/forum.schema";
import "./schemas/progress.schema";
import { authMiddleware } from "./middleware/authMiddleware";

import UserRoutes from "./routes/user.routes";
import CoursesRoutes from "./routes/courses.routes";
import LearningPathsRoutes from "./routes/path.routes";
import ModulesRoutes from "./routes/modules.routes";
import LessonsRoutes from "./routes/lessons.routes";
import EnrollRoutes from "./routes/enroll.routes";
import QuizRoutes from "./routes/quiz.routes";
import forumRoutes from "./routes/forum.routes";
import ProgressRoutes from "./routes/progress.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Auth
app.use("/api/auth", UserRoutes);

// API
app.use("/api/courses", CoursesRoutes);
app.use("/api/learning-paths", LearningPathsRoutes);
app.use("/api/modules", ModulesRoutes);
app.use("/api/lessons", LessonsRoutes);
app.use("/api/enroll", EnrollRoutes);
app.use("/api/quiz", QuizRoutes);
app.use("/api/forum-threads", authMiddleware, forumRoutes);
app.use("/api/progress", authMiddleware, ProgressRoutes);
app.use("/api", swaggerRouter);


app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
