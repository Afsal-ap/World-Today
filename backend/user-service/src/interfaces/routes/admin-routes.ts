import { Router } from 'express';
import { AdminController } from '../controllers/admin-controller';
import { adminAuthMiddleware } from '../middlewares/admin-authMiddleware';
import { IUserRepository } from '../../domain/repositories/user-repository';

export const adminRouter = Router();

export const setupAdminRoutes = (
  adminController: AdminController,
  userRepository: IUserRepository
) => {
  const adminAuth = adminAuthMiddleware(userRepository);

  adminRouter.post('/login', (req, res) => adminController.login(req, res));
  adminRouter.post('/create-category', adminAuth, (req, res) => adminController.createCategory(req, res));
  adminRouter.get('/categories', adminAuth, (req, res) => adminController.getCategories(req, res));
  adminRouter.delete('/categories/:id', adminAuth, (req, res) => adminController.deleteCategory(req, res));
  // adminRouter.get('/users', adminAuth, (req, res) => adminController.getAllUsers(req, res));
  adminRouter.patch('/users/:userId/status', adminAuth, (req, res) => adminController.updateUserStatus(req, res));
  adminRouter.patch('/users/:userId/block', adminAuth, (req, res) => adminController.updateUserBlockStatus(req, res));
  adminRouter.put('/categories/:id', adminController.updateCategory.bind(adminController));

  return adminRouter;
}; 