import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import postRoutes from './interfaces/routes/PostRoutes';
import { connectToDatabase } from './infrastructure/db/db-connection';
import dotenv from "dotenv";
import path from "path";
import ChannelAuthRoutes from "./interfaces/routes/ChannelAuthRoutes";
import ChannelDashboardRoutes from "./interfaces/routes/ChannelDashboardRoutes";
import { ChannelRepositoryImpl } from './infrastructure/repositories/ChannelRepositoryImpl';
import { Request, Response, NextFunction } from 'express';
import commentRoutes from './interfaces/routes/CommentRoutes';
const app = express();
      
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());    
 
connectToDatabase();     

import fs from 'fs';

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../public/uploads/posts');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}



// Add this new line to serve all static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
    

// Initialize repository
const channelRepository = new ChannelRepositoryImpl();

  
app.use("/auth", ChannelAuthRoutes);
app.use("/dashboard", ChannelDashboardRoutes); 

app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/auth', ChannelAuthRoutes);
app.use('/api/channel/dashboard', ChannelDashboardRoutes);

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Create a separate error handler middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
    return;
  }
  
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
    return;
  }
     
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

// Register the error handler middleware
app.use(errorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
