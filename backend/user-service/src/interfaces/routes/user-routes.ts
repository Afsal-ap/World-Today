import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user-controller';
import { authMiddleware } from '../middlewares/auth-middleware';
import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';
import { getPostsByIds } from '../../infrastructure/grpc/grpcClient';
import { log } from 'console';

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
      
      const savedPostIds = await savedPostRepository.getSavedPosts(userId);
      console.log('Found saved post IDs:', savedPostIds);

      if (!savedPostIds || savedPostIds.length === 0) {
        res.json({ status: 'success', data: [] });
        return;
      }
  
      const postIds = savedPostIds.map(id => id.toString());
      console.log('postIdssssssssssssssssss:', postIds);
      if (!postIds.every(id => id && id.length > 0)) {
        console.error('Invalid post IDs:', postIds);
        res.status(400).json({ status: 'error', message: 'Invalid post IDs' });
        return;
      }
  
      try {
        console.log('Sending gRPC request with postIds:', postIds);
        const posts = await getPostsByIds(postIds);
        res.json({ status: 'success', data: posts });
      } catch (grpcError) { 
        console.log('gRPC client from user routess:');
        console.error('gRPC client error:', grpcError);
        res.status(500).json({ status: 'error', message: 'Failed to fetch post details' });
      }
    } catch (error: any) {
      console.error('Error fetching saved posts:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  return router;
};
