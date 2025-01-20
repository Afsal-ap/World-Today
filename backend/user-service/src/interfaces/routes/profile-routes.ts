import { Router, Request, Response, NextFunction } from 'express';
import { ProfileController } from '../controllers/userProfile-controller';
import { authMiddleware } from '../middlewares/auth-middleware';

export const setupProfileRoutes = (profileController: ProfileController) => {
  const router = Router();

  router.get('/profile', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await profileController.getProfile(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.put('/profile', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await profileController.updateProfile(req, res);
    } catch (error) {
      next(error);
    }
  });

  return router;  
};
