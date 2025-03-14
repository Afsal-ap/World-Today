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
        password: string; 
        name: string; 
        phone: string; 
    }): Promise<AuthResponseDto> {
        console.log('📝 Starting registration for:', userData.email);

        // Hash the password
        const hashedPassword = await this.authService.hashPassword(userData.password);

        // Create new user
        const user = new User({
            email: userData.email,
            password: hashedPassword,
            name: userData.name,
            phone: userData.phone
        });

        // Save user
        const createdUser = await this.userRepository.create(user);
        console.log('✅ User created successfully:', createdUser.email);

        // Generate tokens
        const tokens = await this.authService.generateTokens(createdUser.id!);

        return {
            user: {
                id: createdUser.id!,
                email: createdUser.email,
                name: createdUser.name,
                phone: createdUser.phone,
                lastLogin: user.lastLogin || null,
                createdAt: createdUser.createdAt!,
                isBlocked: false
            },
            tokens
        };
        
    }
} 