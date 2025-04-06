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
exports.CompleteRegistrationUseCase = void 0;
const user_1 = require("../../domain/entities/user");
class CompleteRegistrationUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    execute(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('📝 Starting registration for:', userData.email);
            // Hash the password
            const hashedPassword = yield this.authService.hashPassword(userData.password);
            // Create new user
            const user = new user_1.User({
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                phone: userData.phone
            });
            // Save user
            const createdUser = yield this.userRepository.create(user);
            console.log('✅ User created successfully:', createdUser.email);
            // Generate tokens
            const tokens = yield this.authService.generateTokens(createdUser.id);
            return {
                user: {
                    id: createdUser.id,
                    email: createdUser.email,
                    name: createdUser.name,
                    phone: createdUser.phone,
                    lastLogin: user.lastLogin || null,
                    createdAt: createdUser.createdAt,
                    isBlocked: false
                },
                tokens
            };
        });
    }
}
exports.CompleteRegistrationUseCase = CompleteRegistrationUseCase;
