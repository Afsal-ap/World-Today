import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import ChannelAuthRoutes from "./interfaces/routes/ChannelAuthRoutes";
import ChannelDashboardRoutes from "./interfaces/routes/ChannelDashboardRoutes";
import connectToMongoDB from "./infrastructure/db/db-connection/mongoose.connection"

dotenv.config();                       

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files
app.use('/public', express.static(path.join(__dirname, '../public')));
 
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../public/uploads/logos');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}
    
connectToMongoDB()               
  
app.use("/auth", ChannelAuthRoutes);
app.use("/dashboard", ChannelDashboardRoutes);
         
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Channel service running on port ${PORT}`);
});
