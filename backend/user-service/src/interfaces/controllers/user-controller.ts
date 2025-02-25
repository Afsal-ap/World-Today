import { Request, Response } from 'express';
import { ToggleSavePostUseCase } from '../../application/use-cases/savePostUsecase';

export class UserController {
    constructor(
     
      private readonly toggleSavePostUseCase: ToggleSavePostUseCase
    ) {}
  
    async toggleSavePost(req: Request, res: Response): Promise<void> {
      try {
        const userId = req.user?.id;
        const { postId, postTitle } = req.body;
        
        if (!userId) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }
  
        const result = await this.toggleSavePostUseCase.execute(userId, postId, postTitle);
        res.json({
          status: 'success',
          data: result
        });
      } catch (error: any) {
        console.error('Save post error:', error);
        res.status(500).json({ 
          status: 'error',
          message: error.message 
        });
      }
    }
  }