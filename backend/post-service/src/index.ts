import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import postRoutes from './interfaces/routes/PostRoutes';
import { connectToDatabase } from './infrastructure/db/db-connection';
import dotenv from "dotenv";
import path from "path";
import ChannelAuthRoutes from "./interfaces/routes/ChannelAuthRoutes";
import ChannelDashboardRoutes from "./interfaces/routes/ChannelDashboardRoutes";
import { ChannelRepositoryImpl } from './infrastructure/repositories/ChannelRepositoryImpl';
import commentRoutes from './interfaces/routes/CommentRoutes';
import adminRoutes from './interfaces/routes/adminRoutes';
import { CategoryListener } from './infrastructure/services/categoryListener';
import { RabbitMQService } from './infrastructure/services/rabbitMQService';
import liveRoutes from './interfaces/routes/liveRoutes';
import http from 'http';
import { Server } from "socket.io";
import { LiveService } from './live/live.service';
import AdminDashboardRoutes from './interfaces/routes/AdminDashboardRoutes'


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const server = http.createServer(app); // Create an HTTP server

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json()); 

// Connect to the database
connectToDatabase();

// Initialize repository
const channelRepository = new ChannelRepositoryImpl();

// Routes
app.use("/auth", ChannelAuthRoutes);
app.use("/dashboard", ChannelDashboardRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/auth', ChannelAuthRoutes);
app.use('/api/channel/dashboard', ChannelDashboardRoutes);
app.use('/api/posts/admin', adminRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/dashboard',AdminDashboardRoutes)

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    socket.on('join-room', (roomId, isViewer = false) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}, isViewer: ${isViewer}`);
      if (!isViewer) {
        socket.broadcast.to(roomId).emit('broadcaster-joined', socket.id);
      } else {
        io.to(roomId).emit('viewer-joined', socket.id);
        console.log(`Notified room ${roomId} of viewer ${socket.id}`);
      }
    });
  
    socket.on('signal', ({ roomId, signal, from, to }) => {
      console.log(`Signal from ${from} to ${to || 'broadcast'} in room ${roomId}`);
      if (to) {
        io.to(to).emit('signal', { signal, from });
      } else {
        io.to(roomId).emit('signal', { signal, from });
      }
    });
  
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      socket.rooms.forEach((roomId) => {
        socket.to(roomId).emit('user-left', socket.id);
      });
    });
  });

// Error handler middleware
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

// Register error handler
app.use(errorHandler);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        message: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start the category listener
CategoryListener.startListening()
    .then(() => {
        console.log('Category listener started successfully');
    })
    .catch((error) => {
        console.error('Failed to start category listener:', error);
    });

// Graceful shutdown for RabbitMQ
process.on('SIGINT', async () => {
    await RabbitMQService.closeConnection();
    process.exit(0);
});

// Start the Express and WebRTC server
const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
    console.log(`Post Service with WebRTC Signaling running on port ${PORT}`);
});
