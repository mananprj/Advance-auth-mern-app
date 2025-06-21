import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // allow to parse in coming request as json : req.body
app.use(cookieParser());
app.use(cors({origin:"http://localhost:5173", credentials: true}));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port ' + PORT);
});