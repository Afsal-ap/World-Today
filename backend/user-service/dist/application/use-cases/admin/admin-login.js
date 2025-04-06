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
exports.AdminLoginUseCase = void 0;
class AdminLoginUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user by email
            const user = yield this.userRepository.findByEmail(email);
            console.log('Raw user from database:', {
                id: user === null || user === void 0 ? void 0 : user.id,
                email: user === null || user === void 0 ? void 0 : user.email,
                isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
                _isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin // Access isAdmin directly
            });
            // Check if user exists
            if (!user) {
                throw new Error('Invalid credentials');
            }
            // Verify password first
            const isPasswordValid = yield this.authService.comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            // Check admin status after verifying credentials
            if (!user.isAdmin) {
                throw new Error('Not authorized as admin');
            }
            // Generate admin token
            const { accessToken } = yield this.authService.generateTokens(user.id);
            return {
                token: accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin
                }
            };
        });
    }
}
exports.AdminLoginUseCase = AdminLoginUseCase;
