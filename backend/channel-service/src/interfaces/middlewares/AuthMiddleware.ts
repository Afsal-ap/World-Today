import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

      const token = authHeader.split(' ')[1]; // Bearer <token>
      
      if (!token) {
        res.status(401).json({
          success: false,
          message: "No token provided"
        });
        return;
      }

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
      (req as any).user = decoded;
      
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token"
      });
      return;
    }
  }
}
