
import express from 'express';
import bodyParser from 'body-parser'; 
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import rewardRoutes from './routes/rewardRoutes.js';
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Server is ready'));


app.use('/api/users', userRoutes);
app.use('/api/reward', rewardRoutes);
app.use("/api/appointments", appointmentRoutes);



app.use(notFound);
app.use(errorHandler);

app.listen(() => {
  console.log(`Server is up and running on port: ${PORT}`);
  connectDB();
});
