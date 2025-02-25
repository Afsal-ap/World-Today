import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import { ProfileController } from '../controllers/userProfile-controller';
import { GetUserProfileUseCase } from '../../application/use-cases/getUserProfile';
import { UpdateUserProfileUseCase } from '../../application/use-cases/updateUserUsecase';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user-repository-impl';
import { SavedPostRepositoryImpl } from '../../infrastructure/repositories/savePost-impl';
import { GetSavePostUseCase } from '../../application/use-cases/getSavePost-usecase';

// Initialize dependencies
const userRepository = new UserRepositoryImpl();
const savedPostRepository = new SavedPostRepositoryImpl();
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
const getSavePostUseCase = new GetSavePostUseCase(savedPostRepository);

// Initialize controller
const profileController = new ProfileController(
  getUserProfileUseCase,
  userRepository,
  updateUserProfileUseCase,
  savedPostRepository,  
  getSavePostUseCase
);

const router = Router();

// Apply routes
router.get('/profile', authMiddleware, (req, res) => profileController.getProfile(req, res));
router.put('/profile', authMiddleware, (req, res) => profileController.updateProfile(req, res));
router.get('/posts/saved', authMiddleware, (req, res) => profileController.getSavedPosts(req, res));
export default router;
