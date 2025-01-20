import { User } from '../entities/user';

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(page: number, limit: number): Promise<User[]>;
    count(): Promise<number>;
    updateUserStatus(userId: string, isAdmin: boolean): Promise<void>;
}
