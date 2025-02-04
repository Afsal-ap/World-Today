import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the JWT payload interface
interface JWTPayload {
  id: string;
  email: string;
  // add other fields that are in your JWT payload
}

declare global {
  namespace Express {
    interface Request {
      user: JWTPayload;
    }
  }
}

export class AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: "No token provided"
        });
        return;
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: "No token provided"
        });
        return;
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JWTPayload;
      req.user = decoded;
      
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
  }
}
