import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../../domain/repositories/user-repository';

export const adminAuthMiddleware = (userRepository: IUserRepository) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
         res.status(401).json({ message: 'No token provided' });
         return
      }

      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }

      const decoded = jwt.verify(token, secret) as { userId: string };
      const user = await userRepository.findById(decoded.userId);
       console.log(user, "admin");
       
      if (!user || !user.isAdmin) {
         res.status(403).json({ message: 'Not authorized as admin' });
         return
      }

      if (!user?.id) {
        throw new Error('User ID is undefined');
      }
      req.user = { id: user.id };
      next();
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
