import { IUserRepository } from '../../domain/repositories/user-repository';
import { User } from '../../domain/entities/user';
import { IAuthService } from '../../domain/services/auth-service';
import { AuthResponseDto } from '../dto/user-dto';

export class CompleteRegistrationUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthService
    ) {}

    async execute(userData: { 
        email: string; 
        hashedPassword: string; 
        name: string; 
        phone: string; 
    }): Promise<AuthResponseDto> {
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create new user
        const user = new User({
            email: userData.email,
            password: userData.hashedPassword,
            name: userData.name,
            phone: userData.phone
        });

        // Save user
        const createdUser = await this.userRepository.create(user);

        // Generate tokens
        const tokens = await this.authService.generateTokens(createdUser.id!);

        // Return response
        return {
            user: {
                id: createdUser.id!,
                email: createdUser.email,
                name: createdUser.name,
                phone: createdUser.phone,
                createdAt: createdUser.createdAt!
            },
            tokens
        };
    }
} 