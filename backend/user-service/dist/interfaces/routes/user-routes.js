"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUserRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const setupUserRoutes = (userController, savedPostRepository, profileController) => {
    const router = (0, express_1.Router)();
    router.post('/posts/save', auth_middleware_1.authMiddleware, (req, res) => userController.toggleSavePost(req, res));
    router.delete('/posts/save', auth_middleware_1.authMiddleware, (req, res) => userController.toggleSavePost(req, res));
    return router;
};
exports.setupUserRoutes = setupUserRoutes;
