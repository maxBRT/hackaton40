import express from 'express';
import {authMiddleware} from "../middleware/authMiddleware";
const app = express();

app.use(express.json());



app.get('/', authMiddleware, (req, res) => {
    console.log(req.user);
    res.send('Hello World');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});