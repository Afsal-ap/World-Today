import { RegisterUserDto } from '../dto/user-dto';
import { User } from '../../domain/entities/user';
import { IAuthService } from '../../domain/services/auth-service';
import { IUserRepository } from '../../domain/repositories/user-repository';

export class RegisterUserUseCase {
    constructor(
        private readonly authService: IAuthService,
        private readonly userRepository: IUserRepository
    ) {}

    async execute(userData: RegisterUserDto): Promise<{ email: string, hashedPassword: string, name: string, phone: string }> {
        console.log('🔐 Hashing password for:', userData.email);
        
        // Hash password
        const hashedPassword = await this.authService.hashPassword(userData.password);
        console.log('Password hashed successfully');

        // Create user entity
        const user = new User({
            email: userData.email,
            password: hashedPassword,
            name: userData.name,
            phone: userData.phone
        });

        // Save user to database
        await this.userRepository.create(user);
        console.log('✅ User saved to database:', userData.email);

        return {
            email: userData.email,
            hashedPassword,
            name: userData.name,
            phone: userData.phone
        };
    }
}
