import { Request, Response } from 'express';
import { GetUserProfileUseCase } from '../../application/use-cases/getUserProfile';

export class ProfileController {
  constructor(private readonly getUserProfileUseCase: GetUserProfileUseCase) {}

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      console.log('Auth header:', req.headers.authorization);
      console.log('User object:', req.user);
    
      const userId = req.user?.id;
      
      if (!userId) {
        console.log('No userId found in request');
        res.status(401).json({ message: 'Unauthorized - No user ID' });
        return;
      }

      const profile = await this.getUserProfileUseCase.execute(userId);
      res.json({
        status: 'success',
        data: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt
        }
      });
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ 
        status: 'error',
        message: error.message || 'Failed to fetch profile' 
      });
    }
  }
}
