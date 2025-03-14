import { Request, Response } from 'express';
import { GetUserProfileUseCase } from '../../application/use-cases/getUserProfile';
import { IUserRepository } from '../../domain/repositories/user-repository';
import { UpdateUserProfileUseCase } from '../../application/use-cases/updateUserUsecase';
import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';
import { GetSavePostUseCase } from '../../application/use-cases/getSavePost-usecase';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    // add other user properties if needed
  };
}

export class ProfileController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly userRepository: IUserRepository,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly savedPostRepository: ISavedPostRepository,
    private readonly getSavePostUseCase: GetSavePostUseCase
  ) {}

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      console.log(req.user,"req.user")
      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized - No user ID' });
        return;
      }
  
      

      const profile = await this.getUserProfileUseCase.execute(userId);
       res.status(200).json({
        status: 'success',
        data: profile
      });
    } catch (error: any) {
      console.error('Profile fetch error:', error);
       res.status(500).json({ 
        status: 'error',
        message: error.message || 'Failed to fetch profile' 
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized - No user ID' });
        return;
      }

      const updateData = {
        name: req.body.name,
        phone: req.body.phone
      };

      const updatedProfile = await this.updateUserProfileUseCase.execute(userId, updateData);
      res.json({
        status: 'success',
        data: updatedProfile
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      res.status(500).json({ 
        status: 'error',
        message: error.message || 'Failed to update profile' 
      });
    }
  }

  async getSavedPosts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ 
          status: 'error', 
          message: 'Unauthorized - No user ID' 
        });
        return;
      }
      const savedPosts = await this.getSavePostUseCase.execute(userId);
      res.json({ 
        status: 'success', 
        data: savedPosts 
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch saved posts'
      });
    }
  }

}
