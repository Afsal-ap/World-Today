import { IUserRepository } from '../../../domain/repositories/user-repository';

export class UpdateUserStatusUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(userId: string, isAdmin: boolean): Promise<void> {
        return await this.userRepository.updateUserStatus(userId, isAdmin);
    }
} 