import { IUserRepository } from '../../../domain/repositories/user-repository';
import { IAuthService } from '../../../domain/services/auth-service';

interface AdminLoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        isAdmin: boolean;
    };  
}

export class AdminLoginUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly authService: IAuthService
    ) {}

    async execute(email: string, password: string): Promise<AdminLoginResponse> {
        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        
        console.log('Raw user from database:', {
            id: user?.id,
            email: user?.email,
            isAdmin: user?.isAdmin,
            _isAdmin: user?.isAdmin // Access isAdmin directly
        });
        
        // Check if user exists
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password first
        const isPasswordValid = await this.authService.comparePassword(
            password,
            user.password
        );

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Check admin status after verifying credentials
        if (!user.isAdmin) {
            throw new Error('Not authorized as admin');
        }

        // Generate admin token
        const { accessToken } = await this.authService.generateTokens(user.id!);

        return {
            token: accessToken,
            user: {
                id: user.id!,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            }
        };
    }
} 