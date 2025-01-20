import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';

export const setupUserRoutes = (userController: UserController, savedPostRepository: ISavedPostRepository) => {
  const router = Router();

  router.post('/posts/save', authMiddleware, (req, res) => 
    userController.toggleSavePost(req, res)
  );

  router.delete('/posts/save', authMiddleware, (req, res) => 
    userController.toggleSavePost(req, res)
  );

  router.get('/posts/saved', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      // Get saved post IDs
      const savedPostIds = await savedPostRepository.getSavedPosts(userId);
      
      // Fetch post details from post-service
      const postServiceUrl = process.env.POST_SERVICE_URL || 'http://localhost:3004';
      const postsResponse = await fetch(`${postServiceUrl}/api/posts/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': req.headers.authorization || '',  
        }, 
        body: JSON.stringify({ postIds: savedPostIds }) 
      }); 

      const posts = await postsResponse.json();
      
      res.json({
        status: 'success',
        data: posts
      });
    } catch (error: any) {        
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  });

  return router;
};
