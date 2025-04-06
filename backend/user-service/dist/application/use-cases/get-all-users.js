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
    execute(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const users = yield this.userRepository.findAll(skip, limit);
            console.log(users, "usersdaaaaaaaa");
            const total = yield this.userRepository.count();
            const totalPages = Math.ceil(total.totalUsers / limit);
            return {
                status: 'success',
                data: {
                    users,
                    currentPage: page,
                    totalPages,
                    totalUsers: total.totalUsers,
                    activeUsers: total.activeUsers
                }
            };
        });
    }
}
exports.GetAllUsersUseCase = GetAllUsersUseCase;
