import express from 'express';
import { AdvertiserAuthController } from '../controllers/AdvertiserAuthController';
import { AdvertiserAuthUseCase } from '../../application/use-cases/AdvertiserAuthUseCase';
import { AdvertiserRepositoryImpl } from '../../infrastructure/repositories/AdvertiserRepositoryImpl';

const router = express.Router();
const advertiserRepository = new AdvertiserRepositoryImpl();
const advertiserAuthUseCase = new AdvertiserAuthUseCase(advertiserRepository);
const advertiserAuthController = new AdvertiserAuthController(advertiserAuthUseCase);

router.post('/register', (req, res) => advertiserAuthController.register(req, res));
router.post('/login', (req, res) => advertiserAuthController.login(req, res));

export default router; 