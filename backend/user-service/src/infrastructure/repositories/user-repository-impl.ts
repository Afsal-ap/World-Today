import { IUserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user';
import { UserModel } from '../db/mongoose-connection';

export class UserRepositoryImpl implements IUserRepository {
    async create(user: User): Promise<User> {
        const newUser = await UserModel.create({
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone
        });

        return new User({
            id: newUser._id.toString(),
            email: newUser.email,
            password: newUser.password,
            name: newUser.name,
            phone: newUser.phone,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const userDoc = await UserModel.findOne({ email });
        
        if (!userDoc) {
            return null;
        }

        return new User({
            id: userDoc._id.toString(),
            email: userDoc.email,
            password: userDoc.password,
            name: userDoc.name,
            phone: userDoc.phone,
            isAdmin: userDoc.isAdmin,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt
        });
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        if (!user) return null;

        return new User({
            id: user._id.toString(),
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }

    async findAll(page: number, limit: number): Promise<User[]> {
        const skip = (page - 1) * limit;
        const users = await UserModel.find()
            .skip(skip)
            .limit(limit);

        return users.map(user => new User({
            id: user._id.toString(),
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
    }

    async count(): Promise<number> {
        return await UserModel.countDocuments();
    }

    async updateUserStatus(userId: string, isAdmin: boolean): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { isAdmin });
    }
}
