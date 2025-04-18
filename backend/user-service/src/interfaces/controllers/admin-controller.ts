import { Request, Response } from 'express';
import { GetAllUsersUseCase } from '../../application/use-cases/admin/get-all-users';
import { UpdateUserStatusUseCase } from '../../application/use-cases/admin/update-user-status';
import { AdminLoginUseCase } from '../../application/use-cases/admin/admin-login';
import { CreateCategoryUseCase } from '../../application/use-cases/admin/category-usecase';
import { ICategoryRepository } from '../../domain/repositories/category-repository';
import { UpdateUserBlockStatusUseCase } from '../../application/use-cases/admin/updateUserBlockStatus';
import { IUserRepository } from '../../domain/repositories/user-repository';
import { UpdateCategoryUseCase } from '../../application/use-cases/admin/category-usecase';
import { DeleteCategoryUseCase } from '../../application/use-cases/admin/category-usecase';

export class AdminController {
    constructor(
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,
        private readonly adminLoginUseCase: AdminLoginUseCase,
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly categoryRepository: ICategoryRepository,
        private readonly updateUserBlockStatusUseCase: UpdateUserBlockStatusUseCase,
        private readonly userRepository: IUserRepository,
        private readonly updateCategoryUseCase: UpdateCategoryUseCase,
        private readonly deleteCategoryUseCase: DeleteCategoryUseCase
    ) {}

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

    async updateUserStatus(req: Request, res: Response): Promise<void> {
        try {
            const { userId, isAdmin } = req.body;
            await this.updateUserStatusUseCase.execute(userId, isAdmin);
            res.status(200).json({ message: 'User status updated successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.adminLoginUseCase.execute(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            console.error('Admin login error:', error);
            res.status(401).json({ 
                message: error.message || 'Invalid credentials'
            });
        }
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const category = await this.createCategoryUseCase.execute(req.body);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.categoryRepository.findAll();
           
            res.status(200).json(categories);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.deleteCategoryUseCase.execute(id);
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateUserBlockStatus(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { isBlocked } = req.body;
            await this.updateUserBlockStatusUseCase.execute(userId, isBlocked);
            res.status(200).json({ 
                status: 'success',
                message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` 
            });
        } catch (error: any) {
            res.status(500).json({ 
                status: 'error',
                message: error.message 
            });
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const category = await this.updateCategoryUseCase.execute(id, req.body);
            res.status(200).json(category);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}    