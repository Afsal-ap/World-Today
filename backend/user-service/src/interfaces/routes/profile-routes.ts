import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import { ProfileController } from '../controllers/userProfile-controller';
import { GetUserProfileUseCase } from '../../application/use-cases/getUserProfile';
import { UpdateUserProfileUseCase } from '../../application/use-cases/updateUserUsecase';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user-repository-impl';

// Initialize dependencies
const userRepository = new UserRepositoryImpl();
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

// Initialize controller
const profileController = new ProfileController(
  getUserProfileUseCase,
  userRepository,
  updateUserProfileUseCase
);

const router = Router();

// Apply routes
router.get('/profile', authMiddleware, (req, res) => profileController.getProfile(req, res));
router.put('/profile', authMiddleware, (req, res) => profileController.updateProfile(req, res));

export default router;
