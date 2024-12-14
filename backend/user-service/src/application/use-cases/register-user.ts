import { RegisterUserDto } from '../dto/user-dto';
import { User } from '../../domain/entities/user';
import { IAuthService } from '../../domain/services/auth-service';

export class RegisterUserUseCase {
    constructor(
        private readonly authService: IAuthService
    ) {}

    async execute(userData: RegisterUserDto): Promise<{ email: string, hashedPassword: string, name: string, phone: string }> {
        // Hash password
        const hashedPassword = await this.authService.hashPassword(userData.password);

        // Return user data without saving
        return {
            email: userData.email,
            hashedPassword,
            name: userData.name,
            phone: userData.phone
        };
    }
}
