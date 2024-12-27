import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { CreatePostUseCase } from '../../application/use-cases/CreatePostUseCase';
import { GetPostUseCase } from '../../application/use-cases/GetPostUseCase';
import { PostRepositoryImpl } from '../../infrastructure/repositories/PostRepositoryImpl';

const router = Router();
const postRepository = new PostRepositoryImpl();
const createPostUseCase = new CreatePostUseCase(postRepository);
const getPostUseCase = new GetPostUseCase(postRepository);
const postController = new PostController(createPostUseCase, getPostUseCase);

// Post creation route
router.post('/', async (req, res) => {
  try {
    await postController.createPost(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while creating the post.');
  }
});

// Get post by ID route
router.get('/:id', async (req, res) => {
  try {
    await postController.getPost(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong while fetching the post.');
  }
});

export default router;
