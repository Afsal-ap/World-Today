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
exports.UpdateUserProfileUseCase = void 0;
class UpdateUserProfileUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const updatedUser = yield this.userRepository.update(userId, updateData);
            if (!updatedUser) {
                throw new Error('Failed to update user');
            }
            return {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            };
        });
    }
}
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
