import { Router } from 'express';
import { AdminController } from '../controllers/admin-controller';

export const adminRouter = Router();

export const setupAdminRoutes = (adminController: AdminController) => {
    adminRouter.post('/login', (req, res) => adminController.login(req, res));
    adminRouter.post('/create-category', (req, res) => adminController.createCategory(req, res));
    adminRouter.get('/categories', (req, res) => adminController.getCategories(req, res));
    adminRouter.delete('/categories/:id', (req, res) => adminController.deleteCategory(req, res));
    return adminRouter;
}; 