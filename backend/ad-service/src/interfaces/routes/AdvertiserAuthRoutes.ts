import express, { Request, Response } from 'express';
import { AdvertiserAuthController } from '../controllers/AdvertiserAuthController';
import { AdvertiserAuthUseCase } from '../../application/use-cases/AdvertiserAuthUseCase';
import { AdvertiserRepositoryImpl } from '../../infrastructure/repositories/AdvertiserRepositoryImpl';
import multer from 'multer';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage });

// Initialize dependencies
const advertiserRepository = new AdvertiserRepositoryImpl();
const advertiserAuthUseCase = new AdvertiserAuthUseCase(advertiserRepository);
const advertiserAuthController = new AdvertiserAuthController(advertiserAuthUseCase);

// Define route handlers
const registerHandler = async (req: Request, res: Response) => {
    return advertiserAuthController.register(req, res);
};

const loginHandler = async (req: Request, res: Response) => {
    return advertiserAuthController.login(req, res);
};

const verifyOtpHandler = async (req: Request, res: Response) => {
    return advertiserAuthController.verifyOtp(req, res);
};

// Routes
router.post('/register', upload.single('logo'), registerHandler);
router.post('/login', loginHandler);
router.post('/verify-otp', verifyOtpHandler);

export default router;