import { Router, Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { CommentModel } from '../../infrastructure/db/model/CommentModel';

const router = Router();
const authMiddleware = new AuthMiddleware();

// Create a comment
router.post('/:postId/comments', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content, userId } = req.body;
    const channeluserId = (req as any).user.channelId; 
      
    const comment = await CommentModel.create({
      postId,
      userId,
      content
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

// Get comments for a post
router.get('/:postId/comments', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.find({ postId })
      .sort({ createdAt: -1 })
      .limit(50);
   
    
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
});

// Update a comment
router.put('/comments/:commentId', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.channelId;

    const comment = await CommentModel.findOneAndUpdate(
      { _id: commentId, userId },
      { content, updatedAt: new Date() },
      { new: true }
    );

    if (!comment) {
      res.status(404).json({ message: 'Comment not found or unauthorized' });
      return;
    }

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
});

// Delete a comment
router.delete('/comments/:commentId', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user.channelId;

    const comment = await CommentModel.findOneAndDelete({ _id: commentId, userId });

    if (!comment) {
      res.status(404).json({ message: 'Comment not found or unauthorized' });
      return;
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
