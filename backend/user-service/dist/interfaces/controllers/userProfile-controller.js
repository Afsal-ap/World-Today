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
exports.ProfileController = void 0;
class ProfileController {
    constructor(getUserProfileUseCase, userRepository, updateUserProfileUseCase, savedPostRepository, getSavePostUseCase) {
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.userRepository = userRepository;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.savedPostRepository = savedPostRepository;
        this.getSavePostUseCase = getSavePostUseCase;
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                console.log(req.user, "req.user");
                if (!userId) {
                    res.status(401).json({ status: 'error', message: 'Unauthorized - No user ID' });
                    return;
                }
                const profile = yield this.getUserProfileUseCase.execute(userId);
                res.status(200).json({
                    status: 'success',
                    data: profile
                });
            }
            catch (error) {
                console.error('Profile fetch error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to fetch profile'
                });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized - No user ID' });
                    return;
                }
                const updateData = {
                    name: req.body.name,
                    phone: req.body.phone
                };
                const updatedProfile = yield this.updateUserProfileUseCase.execute(userId, updateData);
                res.json({
                    status: 'success',
                    data: updatedProfile
                });
            }
            catch (error) {
                console.error('Profile update error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to update profile'
                });
            }
        });
    }
    getSavedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({
                        status: 'error',
                        message: 'Unauthorized - No user ID'
                    });
                    return;
                }
                const savedPosts = yield this.getSavePostUseCase.execute(userId);
                res.json({
                    status: 'success',
                    data: savedPosts
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'Failed to fetch saved posts'
                });
            }
        });
    }
}
exports.ProfileController = ProfileController;
