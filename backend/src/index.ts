import express from 'express';
import {authMiddleware} from "../middleware/authMiddleware";
import dotenv from "dotenv";
import UserRoutes from "../routes/User.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth", UserRoutes);


app.get('/', authMiddleware, (req, res) => {
    console.log(req.user);
    res.send('Hello World');
})
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});