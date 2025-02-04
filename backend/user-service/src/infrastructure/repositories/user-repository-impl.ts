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

    async findAll(skip: number, limit: number): Promise<User[]> {
        try {
            const users = await UserModel.find()
                .select('-password')
                .skip(skip)
                .limit(limit)
                .lean();

            return users.map(user => new User({
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phone: user.phone,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                password: ''
            }));
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    async count(): Promise<number> {
        return await UserModel.countDocuments();
    }

    async updateUserStatus(userId: string, isAdmin: boolean): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { isAdmin });
    } 
    async updateUserBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isBlocked },
            { new: true }  // Return the updated document
        );
        
        if (!updatedUser) {
            throw new Error('User not found');
        }
    }

    async update(userId: string, updateData: Partial<User>): Promise<User | null> {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedUser) return null;

        return new User({
            id: updatedUser._id.toString(),
            email: updatedUser.email,
            password: updatedUser.password,
            name: updatedUser.name,
            phone: updatedUser.phone,
            isAdmin: updatedUser.isAdmin,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        });
    }
}
