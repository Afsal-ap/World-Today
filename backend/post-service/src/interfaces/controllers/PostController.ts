import { Request, Response } from 'express';
import { CreatePostUseCase } from '../../application/use-cases/CreatePostUseCase';
import { PostDto } from '../../application/dto/PostDto';

export class PostController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
  ) {
    this.createPost = this.createPost.bind(this);
   
  }   

 

  async createPost(req: Request, res: Response) {
    try {
      const { title, content, scheduledPublishDate, categoryName } = req.body;
      const channelId = (req as any).user.channelId;
      
      if (!channelId) {
        return res.status(400).json({ error: 'Channel ID is required' });
      }

      if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      const file = req.file;
      let mediaPath = null;
      let mediaType = null;  
      
      if (file) {
        mediaPath = `/uploads/posts/${file.filename}`;
        mediaType = file.mimetype.startsWith('image/') ? 'image' : 'video';
        console.log('File saved at:', mediaPath);
      }

      const postDto = new PostDto(
        title,
        content,
        mediaPath,
        mediaType as "image" | "video" | null,
        scheduledPublishDate ? new Date(scheduledPublishDate) : null,
        channelId,
        categoryName
      );

      postDto.validate();
      const post = await this.createPostUseCase.execute(postDto);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }    

} 