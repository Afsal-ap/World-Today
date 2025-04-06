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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
class LoginUserUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    execute(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('👤 Login attempt for:', credentials.email);
            // Find user by email
            const user = yield this.userRepository.findByEmail(credentials.email);
            if (!user) {
                console.log('❌ User not found:', credentials.email);
                throw new Error('Invalid email or password');
            }
            if (user.isBlocked) {
                throw new Error('Your account has been blocked. Please contact support.');
            }
            // Verify password
            const isPasswordValid = yield this.authService.comparePassword(credentials.password, user.password);
            console.log('🔐 Password validation:', {
                email: credentials.email,
                isValid: isPasswordValid
            });
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }
            // Update lastLogin in the database
            user.lastLogin = new Date();
            yield this.userRepository.update(user.id, { lastLogin: user.lastLogin });
            // Generate tokens
            const tokens = yield this.authService.generateTokens(user.id);
            console.log(user.id, "user id");
            // Return response
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                    isBlocked: user.isBlocked
                },
                tokens: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken
                }
            };
        });
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
