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
exports.SavedPostRepositoryImpl = void 0;
const savePostModel_1 = require("../db/models/savePostModel");
class SavedPostRepositoryImpl {
    savePost(userId, postId, postTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedPost = new savePostModel_1.SavedPostModel({
                userId,
                postId,
                postTitle,
                savedAt: new Date()
            });
            yield savedPost.save();
        });
    }
    getSavedPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield savePostModel_1.SavedPostModel.find({ userId });
            return posts.map(post => ({
                userId: post.userId,
                postId: post.postId,
                postTitle: post.postTitle,
                savedAt: post.savedAt
            }));
        });
    }
    removeSavedPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield savePostModel_1.SavedPostModel.deleteOne({ userId, postId });
        });
    }
    isSaved(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield savePostModel_1.SavedPostModel.findOne({ userId, postId });
            return !!post;
        });
    }
}
exports.SavedPostRepositoryImpl = SavedPostRepositoryImpl;
