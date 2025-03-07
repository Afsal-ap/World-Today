import { IUserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user';
import { UserModel } from '../db/mongoose-connection';

export class UserRepositoryImpl implements IUserRepository {
    async create(user: User): Promise<User> {
        const newUser = await UserModel.create({
            email: user.email,
            password: user.password,
            name: user.name,
            phone: user.phone,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked,
            stripeCustomerId: user.stripeCustomerId,
            subscriptionId: user.subscriptionId,
            subscriptionStatus: user.subscriptionStatus,
        });

        return new User({
            id: newUser._id.toString(),
            email: newUser.email,
            password: newUser.password || undefined,
            name: newUser.name,
            phone: newUser.phone,
            isAdmin: newUser.isAdmin,
            isBlocked: newUser.isBlocked,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            stripeCustomerId: newUser.stripeCustomerId || undefined,
            subscriptionId: newUser.subscriptionId || undefined,
            subscriptionStatus: newUser.subscriptionStatus,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const userDoc = await UserModel.findOne({ email }).exec();

        if (!userDoc) {
            return null;
        }

        return new User({
            id: userDoc._id.toString(),
            email: userDoc.email,
            password: userDoc.password || undefined,
            name: userDoc.name,
            phone: userDoc.phone,
            isAdmin: userDoc.isAdmin,
            isBlocked: userDoc.isBlocked,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt,
            stripeCustomerId: userDoc.stripeCustomerId || undefined,
            subscriptionId: userDoc.subscriptionId || undefined,
            subscriptionStatus: userDoc.subscriptionStatus,
        });
    }

    async findById(id: string): Promise<User | null> {
        const userDoc = await UserModel.findById(id).exec();
        if (!userDoc) return null;

        return new User({
            id: userDoc._id.toString(),
            email: userDoc.email,
            password: userDoc.password || undefined,
            name: userDoc.name,
            phone: userDoc.phone,
            isAdmin: userDoc.isAdmin,
            isBlocked: userDoc.isBlocked,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt,
            stripeCustomerId: userDoc.stripeCustomerId || undefined,
            subscriptionId: userDoc.subscriptionId || undefined,
            subscriptionStatus: userDoc.subscriptionStatus,
        });
    }

    async findAll(skip: number, limit: number): Promise<User[]> {
        try {
            const users = await UserModel.find()
                .select('-password') // Exclude password from results
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();

            return users.map((user) => new User({
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phone: user.phone,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                stripeCustomerId: user.stripeCustomerId || undefined,
                subscriptionId: user.subscriptionId || undefined,    
                subscriptionStatus: user.subscriptionStatus,
                password: undefined, // Explicitly set to undefined since excluded
            }));
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    async count(): Promise<number> {
        return await UserModel.countDocuments().exec();
    }

    async updateUserStatus(userId: string, isAdmin: boolean): Promise<void> {
        const result = await UserModel.findByIdAndUpdate(
            userId,
            { isAdmin, updatedAt: new Date() },
            { new: true }
        ).exec();

        if (!result) {
            throw new Error('User not found');
        }
    }

    async updateUserBlockStatus(userId: string, isBlocked: boolean): Promise<void> {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isBlocked, updatedAt: new Date() },
            { new: true }
        ).exec();

        if (!updatedUser) {
            throw new Error('User not found');
        }
    }

    async update(userId: string, updateData: Partial<User>): Promise<User | null> {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        ).exec();

        if (!updatedUser) return null;

        return new User({
            id: updatedUser._id.toString(),
            email: updatedUser.email,
            password: updatedUser.password || undefined,
            name: updatedUser.name,
            phone: updatedUser.phone,
            isAdmin: updatedUser.isAdmin,
            isBlocked: updatedUser.isBlocked,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
            stripeCustomerId: updatedUser.stripeCustomerId || undefined,
            subscriptionId: updatedUser.subscriptionId || undefined,
            subscriptionStatus: updatedUser.subscriptionStatus,
        });
    }
}