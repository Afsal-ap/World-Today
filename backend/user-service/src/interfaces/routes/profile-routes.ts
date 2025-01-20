import { Router, Request, Response, NextFunction } from 'express';
import { ProfileController } from '../controllers/userProfile-controller';
import { authMiddleware } from '../middlewares/auth-middleware';

export const setupProfileRoutes = (profileController: ProfileController) => {
  const router = Router();

  router.get('/profile', authMiddleware, (req: Request, res: Response, next: NextFunction): void => { 
    profileController.getProfile(req, res)
      .then(() => {
        
      })
      .catch(next);
  });

  return router;  
};
