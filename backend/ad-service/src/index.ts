import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AdvertiserAuthRoutes from "./interfaces/routes/AdvertiserAuthRoutes";
import connectToMongoDB from "./infrastructure/db/db-connection/mongoose.connection";
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

connectToMongoDB();

app.use("/", AdvertiserAuthRoutes);

app.post('/advertiser/register', upload.single('logo'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Received registration data:', {
      body: req.body,
      file: req.file
    });

    const requiredFields = ['companyName', 'contactPersonName', 'email', 'phoneNumber', 'password'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        res.status(400).json({
          message: `${field} is required`
        });
        return;
      }
    }


    res.status(201).json({
      message: 'Registration successful'
    });
    return;
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Ad service running on port ${PORT}`);
});
