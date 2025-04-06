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
exports.AdminController = void 0;
class AdminController {
    constructor(getAllUsersUseCase, updateUserStatusUseCase, adminLoginUseCase, createCategoryUseCase, categoryRepository, updateUserBlockStatusUseCase, userRepository, updateCategoryUseCase, deleteCategoryUseCase) {
        this.getAllUsersUseCase = getAllUsersUseCase;
        this.updateUserStatusUseCase = updateUserStatusUseCase;
        this.adminLoginUseCase = adminLoginUseCase;
        this.createCategoryUseCase = createCategoryUseCase;
        this.categoryRepository = categoryRepository;
        this.updateUserBlockStatusUseCase = updateUserBlockStatusUseCase;
        this.userRepository = userRepository;
        this.updateCategoryUseCase = updateCategoryUseCase;
        this.deleteCategoryUseCase = deleteCategoryUseCase;
    }
    // async getAllUsers(req: Request, res: Response): Promise<void> {
    //     try {
    //         const page = parseInt(req.query.page as string) || 1;
    //         const limit = parseInt(req.query.limit as string) || 10;
    //         console.log('Fetching users with page:', page, 'limit:', limit);
    //         const result = await this.getAllUsersUseCase.execute(page, limit);
    //         console.log('Users fetched successfully:', result);
    //         res.status(200).json(result);
    //     } catch (error: any) {
    //         console.error('Error in getAllUsers:', error);
    //         res.status(500).json({ 
    //             status: 'error',
    //             message: error.message || 'Internal server error',
    //             stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    //         });
    //     }
    // }
    updateUserStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, isAdmin } = req.body;
                yield this.updateUserStatusUseCase.execute(userId, isAdmin);
                res.status(200).json({ message: 'User status updated successfully' });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.adminLoginUseCase.execute(email, password);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('Admin login error:', error);
                res.status(401).json({
                    message: error.message || 'Invalid credentials'
                });
            }
        });
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.createCategoryUseCase.execute(req.body);
                res.status(201).json(category);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.categoryRepository.findAll();
                res.status(200).json(categories);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.deleteCategoryUseCase.execute(id);
                res.status(200).json({ message: 'Category deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    updateUserBlockStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { isBlocked } = req.body;
                yield this.updateUserBlockStatusUseCase.execute(userId, isBlocked);
                res.status(200).json({
                    status: 'success',
                    message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield this.updateCategoryUseCase.execute(id, req.body);
                res.status(200).json(category);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.AdminController = AdminController;
