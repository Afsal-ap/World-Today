import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../application/use-cases/CreatePostUseCase';
import { GetPostUseCase } from '../../application/use-cases/GetPostUseCase';

export class PostController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private getPostUseCase: GetPostUseCase
  ) {}

  async createPost(req: Request, res: Response) {
    const postDto = req.body;
    const post = await this.createPostUseCase.execute(postDto);
    res.status(201).json(post);
  }

  async getPost(req: Request, res: Response) {
    const postId = req.params.id;
    const post = await this.getPostUseCase.execute(postId);
    res.status(200).json(post);
  }
} 