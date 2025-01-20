import { IUserRepository } from '../../domain/repositories/user-repository';
import { ProfileResponseDto } from '../dto/userProfile-dto';

export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, updateData: {
    name?: string;
    phone?: string;
  }): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.userRepository.update(userId, updateData);

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return {
      id: updatedUser.id!,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      createdAt: updatedUser.createdAt!,
      updatedAt: updatedUser.updatedAt!
    };
  }
}
