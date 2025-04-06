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
exports.RegisterUserUseCase = void 0;
const user_1 = require("../../domain/entities/user");
class RegisterUserUseCase {
    constructor(authService, userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }
    execute(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🔐 Hashing password for:', userData.email);
            // Hash password
            const hashedPassword = yield this.authService.hashPassword(userData.password);
            console.log('Password hashed successfully');
            // Create user entity
            const user = new user_1.User({
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
                phone: userData.phone
            });
            return {
                email: userData.email,
                name: userData.name,
                phone: userData.phone
            };
        });
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
