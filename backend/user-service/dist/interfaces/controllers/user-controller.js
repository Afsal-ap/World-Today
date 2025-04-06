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
exports.UserController = void 0;
class UserController {
    constructor(toggleSavePostUseCase) {
        this.toggleSavePostUseCase = toggleSavePostUseCase;
    }
    toggleSavePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const { postId, postTitle } = req.body;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const result = yield this.toggleSavePostUseCase.execute(userId, postId, postTitle);
                res.json({
                    status: 'success',
                    data: result
                });
            }
            catch (error) {
                console.error('Save post error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message
                });
            }
        });
    }
}
exports.UserController = UserController;
