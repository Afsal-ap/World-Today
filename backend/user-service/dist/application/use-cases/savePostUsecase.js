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
exports.ToggleSavePostUseCase = void 0;
class ToggleSavePostUseCase {
    constructor(savedPostRepository) {
        this.savedPostRepository = savedPostRepository;
    }
    execute(userId, postId, postTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSaved = yield this.savedPostRepository.isSaved(userId, postId);
            if (isSaved) {
                yield this.savedPostRepository.removeSavedPost(userId, postId);
                return { saved: false };
            }
            else {
                yield this.savedPostRepository.savePost(userId, postId, postTitle);
                return { saved: true };
            }
        });
    }
}
exports.ToggleSavePostUseCase = ToggleSavePostUseCase;
