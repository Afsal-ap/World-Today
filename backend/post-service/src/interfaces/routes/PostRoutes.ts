import { Router, Request, Response, NextFunction } from 'express';
import { PostController } from '../controllers/PostController';
import { CreatePostUseCase } from '../../application/use-cases/CreatePostUseCase';
import { PostRepositoryImpl } from '../../infrastructure/repositories/PostRepositoryImpl';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { upload } from '../../infrastructure/utils/postFileUpload';
import fs from 'fs';
import path from 'path';
import { LikeModel } from '../../infrastructure/db/model/LikeModel';
import { PostModel } from '../../infrastructure/db/model/PostModel';
import { CommentModel } from '../../infrastructure/db/model/CommentModel';

const router = Router();
const postRepository = new PostRepositoryImpl();
const createPostUseCase = new CreatePostUseCase(postRepository);
const postController = new PostController(createPostUseCase);
const authMiddleware = new AuthMiddleware();

router.post('/',
  authMiddleware.verifyToken.bind(authMiddleware),
  upload.single('media'),
  async (req, res, next) => {
    try {
      await postController.createPost(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    const posts = await postRepository.findAll();
    
    // Map posts with user-specific like status and comments count
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await LikeModel.countDocuments({ postId: post.id });
        const commentsCount = await CommentModel.countDocuments({ postId: post.id });
        const userLike = await LikeModel.findOne({ 
          postId: post.id, 
          userId: userId
        });
        
        return {
          ...post,
          likesCount,
          commentsCount,
          isLiked: !!userLike
        };
      })
    );

    res.status(200).json(postsWithDetails);
  } catch (error) {
    next(error);
  }
});

router.get('/debug/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../../public/uploads/posts', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.json({ exists: true, path: filePath });
  } else {
    res.json({ exists: false, path: filePath });
  }
});

router.get('/test-image/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../../public/uploads/posts', req.params.filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif'
    }[ext] || 'application/octet-stream';
    
    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

router.post('/:postId/like', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.channelId;
    const postId = req.params.postId; 
    
    const { userId: bodyUserId } = req.body;
    
    // Check if user already liked the post
    const existingLike = await LikeModel.findOne({ 
      userId: bodyUserId,
      postId: postId 
    });

    if (existingLike) {
      // If like exists, remove it (unlike)
      await LikeModel.deleteOne({ userId: bodyUserId, postId: postId });
      const likesCount = await LikeModel.countDocuments({ postId });
      res.status(200).json({ liked: false, likesCount });
    } else {
      // If no like exists, create new like
      await LikeModel.create({ 
        userId: bodyUserId,
        postId: postId 
      });
      const likesCount = await LikeModel.countDocuments({ postId });
      res.status(200).json({ liked: true, likesCount });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:postId/like', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.channelId;
    const { postId } = req.params;
    const { userId: bodyUserId } = req.body;
    // Remove like
    await LikeModel.findOneAndDelete({ postId, userId: bodyUserId });
    const likesCount = await LikeModel.countDocuments({ postId });
    
    res.status(200).json({ message: 'Post unliked successfully', likesCount });
  } catch (error) {
    next(error);
  }
});

router.get('/posts', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.channelId;
    const posts = await PostModel.find();
    
    // Get like status for each post for the current user
    const postsWithLikeStatus = await Promise.all(posts.map(async (post) => {
      const isLiked = await LikeModel.exists({ 
        userId: userId,
        postId: post._id 
      });
      return {
        ...post.toObject(),
        isLiked: !!isLiked
      };
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await postRepository.findById(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.post('/batch', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response): Promise<void> => {
  try {
    const { postIds } = req.body;
    
    if (!Array.isArray(postIds)) {
      res.status(400).json({
        status: 'error',
        message: 'postIds must be an array'
      });
      return;
    }

    const posts = await PostModel.find({ _id: { $in: postIds } })
      .populate('channel', 'channelName');

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await LikeModel.countDocuments({ postId: post._id });
        const commentsCount = await CommentModel.countDocuments({ postId: post._id });
        
        return {
          ...post.toObject(),
          likesCount,
          commentsCount
        };
      })
    );

    res.json({
      status: 'success',
      data: postsWithDetails
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/channel/posts', authMiddleware.verifyToken.bind(authMiddleware), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const channelId = (req as any).user.channelId; 
    console.log(channelId, "channelId");
    
    const posts = await PostModel.find({ channelId: channelId })
      .sort({ createdAt: -1 })
      .populate('channel', 'channelName');
      
    console.log(posts, "posts found");
       
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await LikeModel.countDocuments({ postId: post._id });
        const commentsCount = await CommentModel.countDocuments({ postId: post._id });
        
        return {
          ...post.toObject(),
          likesCount,
          commentsCount
        };
      })
    );

    res.json({
      status: 'success',
      data: postsWithDetails
    });
  } catch (error) {
    next(error);
  }
});

export default router; 
