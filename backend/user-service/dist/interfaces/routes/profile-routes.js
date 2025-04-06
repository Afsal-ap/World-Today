"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const userProfile_controller_1 = require("../controllers/userProfile-controller");
const getUserProfile_1 = require("../../application/use-cases/getUserProfile");
const updateUserUsecase_1 = require("../../application/use-cases/updateUserUsecase");
const user_repository_impl_1 = require("../../infrastructure/repositories/user-repository-impl");
const savePost_impl_1 = require("../../infrastructure/repositories/savePost-impl");
const getSavePost_usecase_1 = require("../../application/use-cases/getSavePost-usecase");
// Initialize dependencies
const userRepository = new user_repository_impl_1.UserRepositoryImpl();
const savedPostRepository = new savePost_impl_1.SavedPostRepositoryImpl();
const getUserProfileUseCase = new getUserProfile_1.GetUserProfileUseCase(userRepository);
const updateUserProfileUseCase = new updateUserUsecase_1.UpdateUserProfileUseCase(userRepository);
const getSavePostUseCase = new getSavePost_usecase_1.GetSavePostUseCase(savedPostRepository);
// Initialize controller
const profileController = new userProfile_controller_1.ProfileController(getUserProfileUseCase, userRepository, updateUserProfileUseCase, savedPostRepository, getSavePostUseCase);
const router = (0, express_1.Router)();
// Apply routes
router.get('/profile', auth_middleware_1.authMiddleware, (req, res) => profileController.getProfile(req, res));
router.put('/profile', auth_middleware_1.authMiddleware, (req, res) => profileController.updateProfile(req, res));
router.get('/posts/saved', auth_middleware_1.authMiddleware, (req, res) => profileController.getSavedPosts(req, res));
exports.default = router;
