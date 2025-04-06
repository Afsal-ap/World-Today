"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAdminRoutes = exports.adminRouter = void 0;
const express_1 = require("express");
const admin_authMiddleware_1 = require("../middlewares/admin-authMiddleware");
exports.adminRouter = (0, express_1.Router)();
const setupAdminRoutes = (adminController, userRepository) => {
    const adminAuth = (0, admin_authMiddleware_1.adminAuthMiddleware)(userRepository);
    exports.adminRouter.post('/login', (req, res) => adminController.login(req, res));
    exports.adminRouter.post('/create-category', adminAuth, (req, res) => adminController.createCategory(req, res));
    exports.adminRouter.get('/categories', adminAuth, (req, res) => adminController.getCategories(req, res));
    exports.adminRouter.delete('/categories/:id', adminAuth, (req, res) => adminController.deleteCategory(req, res));
    // adminRouter.get('/users', adminAuth, (req, res) => adminController.getAllUsers(req, res));
    exports.adminRouter.patch('/users/:userId/status', adminAuth, (req, res) => adminController.updateUserStatus(req, res));
    exports.adminRouter.patch('/users/:userId/block', adminAuth, (req, res) => adminController.updateUserBlockStatus(req, res));
    exports.adminRouter.put('/categories/:id', adminController.updateCategory.bind(adminController));
    return exports.adminRouter;
};
exports.setupAdminRoutes = setupAdminRoutes;
