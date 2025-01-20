import { IUserRepository } from '../../domain/repositories/user-repository';
import { ProfileResponseDto } from '../dto/userProfile-dto';

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!
    };
  }
}
