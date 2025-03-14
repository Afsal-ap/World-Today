import { User } from '../entities/user';
import { IUser } from '../entities/user';

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(skip: number, limit: number): Promise<IUser[]>;
    count(): Promise<{ totalUsers: number; activeUsers: number }>;
    getActiveUsers(period: "daily" | "weekly"): Promise<{ _id: any; count: number }[]>;
    updateUserStatus(userId: string, isAdmin: boolean): Promise<void>;
    update(userId: string, updateData: Partial<User>): Promise<User | null>;
    updateUserBlockStatus(userId: string, isBlocked: boolean): Promise<void>;

}  
