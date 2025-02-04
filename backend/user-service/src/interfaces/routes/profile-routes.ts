import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/auth-middleware';
import { UserModel } from '../../infrastructure/db/mongoose-connection';

const router = Router();

// Get profile route handler
const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    
    const userProfile = await UserModel.findById(userId).select([
      'name',
      'email',
      'phone',
      'profilePicture',
      'createdAt'
    ]);

    if (!userProfile) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '',
        createdAt: userProfile.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update profile route handler
const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { name, phone } = req.body;

    const updatedProfile = await UserModel.findByIdAndUpdate(
      userId,
      { 
        name,
        phone
      },
      { new: true }
    ).select(['name', 'email', 'phone', 'createdAt']);

    if (!updatedProfile) {
      res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone || '',
        createdAt: updatedProfile.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Apply routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Export the router directly
export default router;
