import express from 'express';    
import dotenv from 'dotenv';   
import cors from 'cors';     
dotenv.config();  
import { connectDatabase } from './infrastructure/db/mongoose-connection';
import { UserRepositoryImpl } from './infrastructure/repositories/user-repository-impl';
import { RegisterUserUseCase } from './application/use-cases/register-user';
import { LoginUserUseCase } from './application/use-cases/login-user';
import { AuthController } from './interfaces/controllers/auth-controller';
import { AuthService } from './domain/services/auth-service';
import { OTPController } from './interfaces/controllers/otp-controller';
import { SendOtpUseCase } from './application/use-cases/sendOtpUsecase';
import { VerifyOtpUseCase } from './application/use-cases/verify-otp';
import { OTPRepositoryImpl } from './infrastructure/repositories/otp-repository-impl';
import { EmailService } from './infrastructure/services/email-service';
import { CompleteRegistrationUseCase } from './application/use-cases/complete-registration';
import { setupAdminRoutes } from './interfaces/routes/admin-routes';
import { AdminController } from './interfaces/controllers/admin-controller';
import { GetAllUsersUseCase } from './application/use-cases/admin/get-all-users';
import { UpdateUserStatusUseCase } from './application/use-cases/admin/update-user-status';
import { AdminLoginUseCase } from './application/use-cases/admin/admin-login';
import { CategoryRepositoryImpl } from './infrastructure/repositories/category-repository-impl';
import { CreateCategoryUseCase } from './application/use-cases/admin/category-usecase';
import categoryRoutes from './interfaces/routes/category-routes';
import { log } from 'console';
import { GetUserProfileUseCase } from './application/use-cases/getUserProfile';
import { ProfileController } from './interfaces/controllers/userProfile-controller';
import { setupProfileRoutes } from './interfaces/routes/profile-routes';

console.log('JWT Secret loaded:', process.env.JWT_SECRET); 
const app = express();
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
})); 
app.use(express.json());  

const userRepository = new UserRepositoryImpl(); 
const authService = new AuthService();  
const otpRepository = new OTPRepositoryImpl(); 
const emailService = new EmailService();   
const categoryRepository = new CategoryRepositoryImpl();  

// Initialize use cases
const completeRegistrationUseCase = new CompleteRegistrationUseCase(userRepository, authService);
const verifyOtpUseCase = new VerifyOtpUseCase(
    otpRepository,
    completeRegistrationUseCase
);
const registerUseCase = new RegisterUserUseCase(authService);
const loginUseCase = new LoginUserUseCase(userRepository, authService);
const sendOtpUseCase = new SendOtpUseCase(otpRepository, emailService);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);
const adminLoginUseCase = new AdminLoginUseCase(userRepository, authService);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const profileController = new ProfileController(getUserProfileUseCase);

// Initialize controllers
const authController = new AuthController(  
    registerUseCase, 
    loginUseCase,   
    authService,
    sendOtpUseCase,
    verifyOtpUseCase
);


const otpController = new OTPController(
    sendOtpUseCase,
    verifyOtpUseCase
);

const adminController = new AdminController(getAllUsersUseCase, updateUserStatusUseCase, adminLoginUseCase, createCategoryUseCase, categoryRepository);

const PORT = process.env.PORT || 3000;


     connectDatabase();
          
    app.listen(PORT, () => {
        console.log(`HTTP server running on port ${PORT}`);  
    });  
     
// Routes 
app.post('/auth/register', (req, res) => authController.register(req, res));  
app.post('/auth/login', (req, res) => authController.login(req, res));  
app.post('/auth/refresh-token', (req, res) => authController.refreshToken(req, res));  
app.post('/auth/send-otp', (req, res) => otpController.sendOtp(req, res)); 
app.post('/auth/verify-otp', (req, res) => otpController.verifyOtp(req, res));  
app.use('/api/admin', setupAdminRoutes(adminController));  
app.use('/api/categories', categoryRoutes);
app.use('/api/users', setupProfileRoutes(profileController)); 

