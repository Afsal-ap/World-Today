import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  advertiserId: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      advertiserId?: string;
    }
  }
}

export const authenticateAdvertiser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new Error('JWT secret is not configured');
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.advertiserId = decoded.advertiserId;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Authentication failed' });
  }
};
