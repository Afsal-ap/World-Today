import { Router, Response } from 'express';
import { UserController } from '../controllers/user-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';
import { ProfileController } from '../controllers/userProfile-controller';

export const setupUserRoutes = (
  userController: UserController,
  savedPostRepository: ISavedPostRepository,
  profileController: ProfileController
) => {
  const router = Router();  

  router.post('/posts/save', authMiddleware, (req, res) => 
    userController.toggleSavePost(req, res)
  );

  router.delete('/posts/save', authMiddleware, (req, res) => 
    userController.toggleSavePost(req, res)
  );

  return router;
};
