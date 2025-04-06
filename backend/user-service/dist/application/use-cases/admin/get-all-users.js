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
exports.GetAllUsersUseCase = void 0;
class GetAllUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const users = yield this.userRepository.findAll(skip, limit);
            const { totalUsers } = yield this.userRepository.count(); // Destructure totalUsers
            const totalPages = Math.ceil(totalUsers / limit); // Use totalUsers instead of total
            return {
                status: 'success',
                data: {
                    users,
                    currentPage: page,
                    totalPages,
                    total: totalUsers // Return totalUsers instead of total
                }
            };
        });
    }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
