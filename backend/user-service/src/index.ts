import express from 'express';    
import dotenv from 'dotenv';   
import cors from 'cors';     
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
dotenv.config();  
import { connectDatabase } from './infrastructure/db/mongoose-connection';
import { UserRepositoryImpl } from './infrastructure/repositories/user-repository-impl';
import { RegisterUserUseCase } from './application/use-cases/register-user';
import { LoginUserUseCase } from './application/use-cases/login-user';
import { AuthController } from './interfaces/controllers/auth-controller';
import { AuthService } from './domain/services/auth-service';
import { OTPController } from './interfaces/controllers/otp-controller';
import { SendOtpUseCase } from './application/use-cases/sendOtpUsecase';
import { VerifyOtp } from './application/use-cases/verify-otp';
import { OTPRepositoryImpl } from './infrastructure/repositories/otp-repository-impl';
import { CompleteRegistrationUseCase } from './application/use-cases/complete-registration';
import { setupAdminRoutes } from './interfaces/routes/admin-routes';
import { AdminController } from './interfaces/controllers/admin-controller';
import { GetAllUsersUseCase } from './application/use-cases/admin/get-all-users';
import { UpdateUserStatusUseCase } from './application/use-cases/admin/update-user-status';
import { AdminLoginUseCase } from './application/use-cases/admin/admin-login';
import { CategoryRepositoryImpl } from './infrastructure/repositories/category-repository-impl';
import { CreateCategoryUseCase } from './application/use-cases/admin/category-usecase';
// import categoryRoutes from './interfaces/routes/category-routes';
import { log } from 'console';
import { GetUserProfileUseCase } from './application/use-cases/getUserProfile';
import { ProfileController } from './interfaces/controllers/userProfile-controller';
import profileRoutes from './interfaces/routes/profile-routes';
import { UpdateUserProfileUseCase } from './application/use-cases/updateUserUsecase';
import { ToggleSavePostUseCase } from './application/use-cases/savePostUsecase';
import { SavedPostRepositoryImpl } from './infrastructure/repositories/savePost-impl';
import { UserController } from './interfaces/controllers/user-controller';
import { setupUserRoutes } from './interfaces/routes/user-routes';
import { UpdateUserBlockStatusUseCase } from './application/use-cases/admin/updateUserBlockStatus';
import { SmsService } from './infrastructure/services/sms-service';
import { authMiddleware } from './interfaces/middlewares/auth-middleware';
import { RabbitMQService } from './infrastructure/services/rabbitMqService';
import { UpdateCategoryUseCase } from './application/use-cases/admin/category-usecase'; 
import { DeleteCategoryUseCase } from './application/use-cases/admin/category-usecase';
import { GetSavePostUseCase } from './application/use-cases/getSavePost-usecase';
import dashboarRoutes  from './interfaces/routes/dashboarRoutes'
// import subscriptionRoutes from './interfaces/routes/subscriptionRoutes';
import Stripe from 'stripe';
import bodyParser from 'body-parser'


const app = express();   
     
// Middleware
app.use(cookieParser());
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true 
})); 
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());  

const userRepository = new UserRepositoryImpl(); 
const authService = new AuthService();  
const otpRepository = new OTPRepositoryImpl(); 
const categoryRepository = new CategoryRepositoryImpl();  
const savedPostRepository = new SavedPostRepositoryImpl();
const smsService = new SmsService();

// Initialize use cases
const registerUseCase = new RegisterUserUseCase(authService, userRepository);
const completeRegistrationUseCase = new CompleteRegistrationUseCase(userRepository, authService);
const verifyOtpUseCase = new VerifyOtp(otpRepository);
const loginUseCase = new LoginUserUseCase(userRepository, authService);
const sendOtpUseCase = new SendOtpUseCase(otpRepository, smsService);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository);
const adminLoginUseCase = new AdminLoginUseCase(userRepository, authService);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const profileController = new ProfileController(
  getUserProfileUseCase,
  userRepository,
  updateUserProfileUseCase,
  savedPostRepository,
  new GetSavePostUseCase(savedPostRepository)
);
const toggleSavePostUseCase = new ToggleSavePostUseCase(savedPostRepository);
const updateUserBlockStatusUseCase = new UpdateUserBlockStatusUseCase(userRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
// Initialize controllers
const authController = new AuthController(  
    registerUseCase, 
    loginUseCase,       
    authService,
    sendOtpUseCase,
    verifyOtpUseCase,
    completeRegistrationUseCase
);

const userController = new UserController(toggleSavePostUseCase);

const otpController = new OTPController(
    sendOtpUseCase,
    verifyOtpUseCase
);

const adminController = new AdminController(
  getAllUsersUseCase,
  updateUserStatusUseCase,
  adminLoginUseCase,
  createCategoryUseCase,
  categoryRepository,
  updateUserBlockStatusUseCase,
  userRepository,
  updateCategoryUseCase,
  deleteCategoryUseCase
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const router = express.Router();


router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {    
      const event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);

      if (event.type === 'invoice.payment_succeeded') {
          const invoice = event.data.object as Stripe.Invoice;
          const subscriptionId = invoice.subscription as string;

          // TODO: Update your database subscription status to "active"
          console.log(`Subscription ${subscriptionId} is now active`);
          await userRepository.update(subscriptionId, { subscriptionStatus: 'active' });

      }

      res.status(200).send('Webhook received');
  } catch (err) {
      console.error('Webhook Error:', err);
      res.status(400).send('Webhook Error');
  }
});





const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await connectDatabase();
        await RabbitMQService.connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);  
        });  
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }        
}      


 startServer();

// Routes 
app.post('/auth/register', (req, res) => authController.register(req, res));  
app.post('/auth/login', (req, res) => authController.login(req, res));  
app.post('/auth/refresh-token', (req, res) => authController.refreshToken(req, res));  
app.post('/auth/send-otp', (req, res) => otpController.sendOtp(req, res)); 
app.post('/auth/verify-otp', (req, res) => otpController.verifyOtp(req, res));  
app.use('/api/admin', setupAdminRoutes(adminController, userRepository));  
app.use('/api/users', profileRoutes); 
app.use('/api/users', setupUserRoutes(userController, savedPostRepository, profileController));
app.use('/api/dashboard',dashboarRoutes)
// app.use('/api/subscription', subscriptionRoutes);
 
 app.get('/',(req,res)=>{
   res.send("user service running");
   
 })

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
