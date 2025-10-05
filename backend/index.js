import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './db/connectDB.js';

import authRoutes from './routes/auth.route.js'
import scoreRoutes from "./routes/score.routes.js";
import aiRoutes from "./routes/aiRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true               // if you want cookies to be sent
}));


app.use(express.json()); //allows us to parse incomming requests from req.body
app.use(cookieParser()); //allows us to parse incomming cookies

app.get("/", (req, res) => {
    res.send("Hello World!");
})

// authentication Routes
app.use("/api/auth",authRoutes);

// Score Routes
app.use("/api/scores", scoreRoutes);

// AI Routes
app.use("/api/ai", aiRoutes);

app.listen(PORT, () =>{
    connectDB();
    console.log("Server is running on port: ",PORT);
})

