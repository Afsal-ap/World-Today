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
    
        if (user.isBlocked) {
            throw new Error('Your account has been blocked. Please contact support.');
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
    
        // Update lastLogin in the database
        
        user.lastLogin = new Date();
        await this.userRepository.update(user.id!, { lastLogin: user.lastLogin });
        // Generate tokens
        const tokens = await this.authService.generateTokens(user.id!);
        console.log(user.id, "user id");
    
        // Return response
        return {
            user: {
                id: user.id!,
                email: user.email,
                name: user.name,
                phone: user.phone,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt!,
                isBlocked: user.isBlocked 
            },
            tokens: {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            }
        };
    }
    }
