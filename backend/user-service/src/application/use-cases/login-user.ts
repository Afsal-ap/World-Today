import { AuthResponseDto } from '../dto/user-dto';
import { IUserRepository } from '../../domain/repositories/user-repository';
import { IAuthService } from '../../domain/services/auth-service';

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthService
    ) {}

    async execute(credentials: { email: string; password: string }): Promise<AuthResponseDto> {
        console.log('👤 Login attempt for:', credentials.email);

        // Find user by email
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            console.log('❌ User not found:', credentials.email);
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await this.authService.comparePassword(
            credentials.password,
            user.password
        );

        console.log('🔐 Password validation:', { 
            email: credentials.email, 
            isValid: isPasswordValid 
        });

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate tokens
        const tokens = await this.authService.generateTokens(user.id!);

        // Return response
        return {
            user: {
                id: user.id!,
                email: user.email,
                name: user.name,
                phone: user.phone,
                createdAt: user.createdAt!
            },
            tokens
        };
    }
}
