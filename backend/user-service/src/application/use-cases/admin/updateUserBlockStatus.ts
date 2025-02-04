import { IUserRepository } from '../../../domain/repositories/user-repository';

export class UpdateUserBlockStatusUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userId: string, isBlocked: boolean): Promise<void> {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            console.log(`Attempting to ${isBlocked ? 'block' : 'unblock'} user:`, userId);
            await this.userRepository.updateUserBlockStatus(userId, isBlocked);
            console.log(`Successfully ${isBlocked ? 'blocked' : 'unblocked'} user:`, userId);
        } catch (error) {
            console.error('Error updating user block status:', error);
            throw new Error(`Failed to ${isBlocked ? 'block' : 'unblock'} user`);
        }
    }
}