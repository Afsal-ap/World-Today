import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../domain/services/auth-service';

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: { id: string; userId?: string };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
       res.status(400).json({ message: 'No token provided' });
       return 
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      // Verify access token
      const decoded = jwt.verify(token, secret) as { userId: string };
      req.user = { id: decoded.userId, userId: decoded.userId };
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
           res.status(401).json({ message: 'Access token expired, no refresh token provided' });
           return
        }

        // Generate new access token using refresh token
        const authService = new AuthService();
        const newAccessToken = await authService.generateAccessTokenFromRefreshToken(refreshToken);

        // Verify the new access token
        const decoded = jwt.verify(newAccessToken, secret) as { userId: string };
        req.user = { id: decoded.userId, userId: decoded.userId };

        // Attach the new access token to the response
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        return next();
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
     res.status(401).json({ message: 'Invalid token' });
     return
  }
};


