import express from 'express';
import {authMiddleware} from "./middleware/authMiddleware";
import dotenv from "dotenv";
import UserRoutes from "./routes/user.routes";
import CoursesRoutes from "./routes/courses.routes";
import ModulesRoutes from "./routes/modules.routes";
import LessonsRoutes from "./routes/lessons.routes";

dotenv.config();

const app = express();

// Auth
app.use(express.json());
app.use("/auth", UserRoutes);

// API
app.use("/api/courses", CoursesRoutes);
app.use("/api/modules", ModulesRoutes);
app.use("/api/lessons", LessonsRoutes);


app.get('/', authMiddleware, (req, res) => {
    console.log(req.user);
    res.send('Hello World');
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});