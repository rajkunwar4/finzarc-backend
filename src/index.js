import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import prisma from "./utils/prisma.js";
import authRoutes from './routes/auth.route.js';
import taskRoutes from './routes/task.route.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

 // Lib middlewares
app.use(cors({ origin: ['http://localhost:5173', 'https://finzarc-assignment.vercel.app/', 'https://finzarc-assignment.vercel.app'], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use('/', (req, res)=>{
  res.send('Hello World');
})

// Start the server
const start = async () => {
    try {
      await prisma.$connect();
      console.log('Connected to database');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to connect to database:', error);
      process.exit(1);
    }
  };
  
  start();