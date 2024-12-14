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
        const user = await UserModel.findOne({ email });
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
}
