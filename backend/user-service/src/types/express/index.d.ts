import { IUser } from '../../domain/entities/user';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        email?: string;
      };
    }
  }
}

export {}; 