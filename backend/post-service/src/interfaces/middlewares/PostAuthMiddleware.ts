import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JWTPayload extends JwtPayload {
  id: string;
  email: string;
}

export const postAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

    if (typeof decoded !== 'object' || !decoded || !('id' in decoded) || !('email' in decoded)) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    req.user = decoded as JWTPayload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
