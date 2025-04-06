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
exports.UpdateUserBlockStatusUseCase = void 0;
class UpdateUserBlockStatusUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userId, isBlocked) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error('User ID is required');
            }
            try {
                console.log(`Attempting to ${isBlocked ? 'block' : 'unblock'} user:`, userId);
                yield this.userRepository.updateUserBlockStatus(userId, isBlocked);
                console.log(`Successfully ${isBlocked ? 'blocked' : 'unblocked'} user:`, userId);
            }
            catch (error) {
                console.error('Error updating user block status:', error);
                throw new Error(`Failed to ${isBlocked ? 'block' : 'unblock'} user`);
            }
        });
    }
}
exports.UpdateUserBlockStatusUseCase = UpdateUserBlockStatusUseCase;
