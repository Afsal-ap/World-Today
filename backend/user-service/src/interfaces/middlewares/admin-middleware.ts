import { Request, Response, NextFunction } from 'express';
import { IUserRepository } from '../../domain/repositories/user-repository';
import { AuthService } from '../../domain/services/auth-service';

export const adminMiddleware = (userRepository: IUserRepository, authService: AuthService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = await authService.verifyAccessToken(token);
            
            const user = await userRepository.findById(decoded.userId);
            if (!user || !user.isAdmin) {
                return res.status(403).json({ message: 'Access denied: Admin only' });
            }

            if (!user.id) {
                throw new Error('User ID is required');
            }
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
}; 