import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AdvertiserAuthRoutes from "./interfaces/routes/AdvertiserAuthRoutes";
import connectToMongoDB from "./infrastructure/db/db-connection/mongoose.connection";
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import AdRoutes from "./interfaces/routes/AdRoutes";
import AdminDashboardRoutes from './interfaces/routes/AdminDashboardRoutes.ts'

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to MongoDB
connectToMongoDB();

// Check required environment variables
const requiredEnvVars = ['MONGODB_URI', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file');
   
    if (process.env.NODE_ENV !== 'development') {
        process.exit(1);
    }
}

// Routes
app.use('/advertiser', AdvertiserAuthRoutes);
app.use('/api/ads', AdRoutes);
app.use('/api/dashboard',AdminDashboardRoutes)

app.get('/', (req, res) => {
    res.send('Ad Service is running');
});


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3002;  
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Ad service running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Log development mode settings
    if (process.env.NODE_ENV === 'development') {
        console.log('Development settings:');
        console.log(`- Skip email sending: ${process.env.SKIP_EMAIL === 'true' ? 'Yes' : 'No'}`);
        console.log(`- Allow registration without email: ${process.env.ALLOW_REGISTRATION_WITHOUT_EMAIL === 'true' ? 'Yes' : 'No'}`);
        console.log(`- Auto verify accounts: ${process.env.AUTO_VERIFY === 'true' ? 'Yes' : 'No'}`);
    }
});
