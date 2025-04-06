"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const mongoose_connection_1 = require("./infrastructure/db/mongoose-connection");
const user_repository_impl_1 = require("./infrastructure/repositories/user-repository-impl");
const register_user_1 = require("./application/use-cases/register-user");
const login_user_1 = require("./application/use-cases/login-user");
const auth_controller_1 = require("./interfaces/controllers/auth-controller");
const auth_service_1 = require("./domain/services/auth-service");
const otp_controller_1 = require("./interfaces/controllers/otp-controller");
const sendOtpUsecase_1 = require("./application/use-cases/sendOtpUsecase");
const verify_otp_1 = require("./application/use-cases/verify-otp");
const otp_repository_impl_1 = require("./infrastructure/repositories/otp-repository-impl");
const complete_registration_1 = require("./application/use-cases/complete-registration");
const admin_routes_1 = require("./interfaces/routes/admin-routes");
const admin_controller_1 = require("./interfaces/controllers/admin-controller");
const get_all_users_1 = require("./application/use-cases/admin/get-all-users");
const update_user_status_1 = require("./application/use-cases/admin/update-user-status");
const admin_login_1 = require("./application/use-cases/admin/admin-login");
const category_repository_impl_1 = require("./infrastructure/repositories/category-repository-impl");
const category_usecase_1 = require("./application/use-cases/admin/category-usecase");
const getUserProfile_1 = require("./application/use-cases/getUserProfile");
const userProfile_controller_1 = require("./interfaces/controllers/userProfile-controller");
const profile_routes_1 = __importDefault(require("./interfaces/routes/profile-routes"));
const updateUserUsecase_1 = require("./application/use-cases/updateUserUsecase");
const savePostUsecase_1 = require("./application/use-cases/savePostUsecase");
const savePost_impl_1 = require("./infrastructure/repositories/savePost-impl");
const user_controller_1 = require("./interfaces/controllers/user-controller");
const user_routes_1 = require("./interfaces/routes/user-routes");
const updateUserBlockStatus_1 = require("./application/use-cases/admin/updateUserBlockStatus");
const sms_service_1 = require("./infrastructure/services/sms-service");
const rabbitMqService_1 = require("./infrastructure/services/rabbitMqService");
const category_usecase_2 = require("./application/use-cases/admin/category-usecase");
const category_usecase_3 = require("./application/use-cases/admin/category-usecase");
const getSavePost_usecase_1 = require("./application/use-cases/getSavePost-usecase");
const dashboarRoutes_1 = __importDefault(require("./interfaces/routes/dashboarRoutes"));
// import subscriptionRoutes from './interfaces/routes/subscriptionRoutes';
const stripe_1 = __importDefault(require("stripe"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
const userRepository = new user_repository_impl_1.UserRepositoryImpl();
const authService = new auth_service_1.AuthService();
const otpRepository = new otp_repository_impl_1.OTPRepositoryImpl();
const categoryRepository = new category_repository_impl_1.CategoryRepositoryImpl();
const savedPostRepository = new savePost_impl_1.SavedPostRepositoryImpl();
const smsService = new sms_service_1.SmsService();
// Initialize use cases
const registerUseCase = new register_user_1.RegisterUserUseCase(authService, userRepository);
const completeRegistrationUseCase = new complete_registration_1.CompleteRegistrationUseCase(userRepository, authService);
const verifyOtpUseCase = new verify_otp_1.VerifyOtp(otpRepository);
const loginUseCase = new login_user_1.LoginUserUseCase(userRepository, authService);
const sendOtpUseCase = new sendOtpUsecase_1.SendOtpUseCase(otpRepository, smsService);
const updateUserProfileUseCase = new updateUserUsecase_1.UpdateUserProfileUseCase(userRepository);
const getAllUsersUseCase = new get_all_users_1.GetAllUsersUseCase(userRepository);
const updateUserStatusUseCase = new update_user_status_1.UpdateUserStatusUseCase(userRepository);
const adminLoginUseCase = new admin_login_1.AdminLoginUseCase(userRepository, authService);
const createCategoryUseCase = new category_usecase_1.CreateCategoryUseCase(categoryRepository);
const getUserProfileUseCase = new getUserProfile_1.GetUserProfileUseCase(userRepository);
const profileController = new userProfile_controller_1.ProfileController(getUserProfileUseCase, userRepository, updateUserProfileUseCase, savedPostRepository, new getSavePost_usecase_1.GetSavePostUseCase(savedPostRepository));
const toggleSavePostUseCase = new savePostUsecase_1.ToggleSavePostUseCase(savedPostRepository);
const updateUserBlockStatusUseCase = new updateUserBlockStatus_1.UpdateUserBlockStatusUseCase(userRepository);
const updateCategoryUseCase = new category_usecase_2.UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new category_usecase_3.DeleteCategoryUseCase(categoryRepository);
// Initialize controllers
const authController = new auth_controller_1.AuthController(registerUseCase, loginUseCase, authService, sendOtpUseCase, verifyOtpUseCase, completeRegistrationUseCase);
const userController = new user_controller_1.UserController(toggleSavePostUseCase);
const otpController = new otp_controller_1.OTPController(sendOtpUseCase, verifyOtpUseCase);
const adminController = new admin_controller_1.AdminController(getAllUsersUseCase, updateUserStatusUseCase, adminLoginUseCase, createCategoryUseCase, categoryRepository, updateUserBlockStatusUseCase, userRepository, updateCategoryUseCase, deleteCategoryUseCase);
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const router = express_1.default.Router();
router.post('/webhook', body_parser_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;
            // TODO: Update your database subscription status to "active"
            console.log(`Subscription ${subscriptionId} is now active`);
            yield userRepository.update(subscriptionId, { subscriptionStatus: 'active' });
        }
        res.status(200).send('Webhook received');
    }
    catch (err) {
        console.error('Webhook Error:', err);
        res.status(400).send('Webhook Error');
    }
}));
const PORT = process.env.PORT || 3001;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_connection_1.connectDatabase)();
            yield rabbitMqService_1.RabbitMQService.connect();
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    });
}
startServer();
// Routes 
app.post('/auth/register', (req, res) => authController.register(req, res));
app.post('/auth/login', (req, res) => authController.login(req, res));
app.post('/auth/refresh-token', (req, res) => authController.refreshToken(req, res));
app.post('/auth/send-otp', (req, res) => otpController.sendOtp(req, res));
app.post('/auth/verify-otp', (req, res) => otpController.verifyOtp(req, res));
app.use('/api/admin', (0, admin_routes_1.setupAdminRoutes)(adminController, userRepository));
app.use('/api/users', profile_routes_1.default);
app.use('/api/users', (0, user_routes_1.setupUserRoutes)(userController, savedPostRepository, profileController));
app.use('/api/dashboard', dashboarRoutes_1.default);
// app.use('/api/subscription', subscriptionRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
