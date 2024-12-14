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


const app = express();
app.use(cors());
app.use(express.json());

const userRepository = new UserRepositoryImpl();
const authService = new AuthService();
const otpRepository = new OTPRepositoryImpl();
const emailService = new EmailService();

// Initialize use cases
const completeRegistrationUseCase = new CompleteRegistrationUseCase(userRepository, authService);
const verifyOtpUseCase = new VerifyOtpUseCase(otpRepository, completeRegistrationUseCase);
const registerUseCase = new RegisterUserUseCase(authService);
const loginUseCase = new LoginUserUseCase(userRepository, authService);
const sendOtpUseCase = new SendOtpUseCase(otpRepository, emailService);

// Initialize controllers
const authController = new AuthController(  
    registerUseCase, 
    loginUseCase,   
    authService,
    sendOtpUseCase,
    verifyOtpUseCase
);


const otpController = new OTPController(sendOtpUseCase, verifyOtpUseCase);


const PORT = process.env.PORT || 3000;

async function startServer() {
    await connectDatabase();
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} 
     
startServer().catch(console.error); 
// Routes 
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/refresh-token', (req, res) => authController.refreshToken(req, res));
app.post('/api/auth/send-otp', (req, res) => otpController.sendOtp(req, res));
app.post('/api/auth/verify-otp', (req, res) => otpController.verifyOtp(req, res));

