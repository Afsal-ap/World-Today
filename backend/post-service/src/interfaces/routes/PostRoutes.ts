import { Router, Request, Response, NextFunction, query } from 'express';
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
import { error } from 'console';
import { CategoryModel } from '../../infrastructure/db/model/CategoryModel';
import { IPostDocument } from '../../infrastructure/db/model/PostModel';

const router = Router();
const postRepository = new PostRepositoryImpl();
const createPostUseCase = new CreatePostUseCase(postRepository);
const postController = new PostController(createPostUseCase);
const authMiddleware = new AuthMiddleware();

router.get('/categories', authMiddleware.verifyToken.bind(authMiddleware), 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await CategoryModel.find().select('name description');
      res.json({
        status: 'success',
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  authMiddleware.verifyToken.bind(authMiddleware),
  upload.single('media'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await postController.createPost(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/', authMiddleware.verifyToken.bind(authMiddleware), 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      // Only filter out blocked posts
      const query: any = { isBlocked: false };

      const posts = await PostModel.find(query)
        .populate('channel', 'channelName')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
          const likesCount = await LikeModel.countDocuments({ postId: post._id });
          const commentsCount = await CommentModel.countDocuments({ postId: post._id });
          const userLike = await LikeModel.findOne({ 
            postId: post._id, 
            userId: userId
          });
          
          return {
            ...post.toObject(),
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
  }
);

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
    const categories = await CategoryModel.find();
    
    // Get like status for each post for the current user
    const postsWithLikeStatus = await Promise.all(posts.map(async (post) => {
      const isLiked = await LikeModel.exists({ 
        userId: userId,
        postId: post._id 
      });
      return {
        ...post.toObject(),
        isLiked: !!isLiked,
        categories: categories.map(category => category.name)
      };
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authMiddleware.verifyToken.bind(authMiddleware), 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.params.id;
      const post = await PostModel.findById(postId)
        .populate('channel', 'channelName');
     

      if (!post) {
        res.status(404).json({
          status: 'error',
          message: 'Post not found'
        });
        return;
      }

      const likesCount = await LikeModel.countDocuments({ postId });
      const commentsCount = await CommentModel.countDocuments({ postId });

      const postWithDetails = {
        ...post.toObject(),
        likesCount,
        commentsCount
      };

      res.json({
        status: 'success',
        data: postWithDetails
      });
    } catch (error) {
      next(error);
    }
  }
);

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
    
    const posts = await PostModel.find({ channelId: channelId })
      .sort({ createdAt: -1 })
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
  } catch (error) {
    next(error);
  }
});

router.put('/:postId', authMiddleware.verifyToken.bind(authMiddleware), 
  upload.single('media'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const channelId = (req as any).user.channelId; 
      const postId = req.params.postId; 
      const post = await PostModel.findOne({ _id: postId, channelId });
      
      if (!post) {
        res.status(404).json({
          status: 'error',
          message: 'Post not found'
        });
        return;
      }

      // Create update data from request body
      const updateData: any = {
        ...req.body,
        updatedAt: new Date()
      };
      
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('channel', 'channelName');
        
      console.log(updatedPost,"updatedPostttttt");
      res.json({
        status: 'success',
        data: updatedPost
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:postId', authMiddleware.verifyToken.bind(authMiddleware), 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const channelId = (req as any).user.channelId; 
      const postId = req.params.postId;
      
      const post = await PostModel.findOne({ _id: postId, channelId });
      
      if (!post) {
        res.status(404).json({
          status: 'error',
          message: 'Post not found'
        });
        return;
      }

      // Delete associated likes and comments
      await Promise.all([
        LikeModel.deleteMany({ postId }),
        CommentModel.deleteMany({ postId }),
        PostModel.findByIdAndDelete(postId)
      ]);

      res.json({
        status: 'success',
        message: 'Post deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:postId/comments', authMiddleware.verifyToken.bind(authMiddleware),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.params.postId;
      const comments = await CommentModel.find({ postId })
        .populate('userId', 'channelName')
        .sort({ createdAt: -1 });

      res.json({
        status: 'success',
        data: comments
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/channel/:channelId/posts', authMiddleware.verifyToken.bind(authMiddleware), 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { channelId } = req.params;
      
      const posts = await PostModel.find({ channelId })
        .sort({ createdAt: -1 })
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
    } catch (error) {
      next(error);
    }
  }
);

router.put('/:postId/toggle-block', authMiddleware.verifyToken.bind(authMiddleware), 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.params.postId;
      const post = await PostModel.findById(postId);
      
      if (!post) {
        res.status(404).json({
          status: 'error',
          message: 'Post not found'
        });
        return;
      }

      // Toggle the isBlocked status
      (post as IPostDocument).isBlocked = !(post as IPostDocument).isBlocked;
      await post.save();

      res.json({
        status: 'success',
        data: post
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 
