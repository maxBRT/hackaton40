import express from 'express';
import {authMiddleware} from "./middleware/authMiddleware";
import dotenv from "dotenv";
import UserRoutes from "./routes/user.routes";
import EnrollRoutes from "./routes/enroll.routes";
import QuizRoutes from "./routes/quiz.routes";
import forumThreadsRoutes from "./routes/forum.routes";
import CoursesRoutes from "./routes/courses.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth", UserRoutes);
app.use("/enroll", EnrollRoutes);
app.use("/quiz", QuizRoutes);
app.use("/forum-treads", authMiddleware, forumThreadsRoutes);
app.use("/courses", CoursesRoutes);

app.get('/', authMiddleware, (req, res) => {
    console.log(req.user);
    res.send('Hello World');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});