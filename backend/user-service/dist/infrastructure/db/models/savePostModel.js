"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedPostModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SavedPostSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    postTitle: { type: String, required: true },
    savedAt: { type: Date, default: Date.now }
});
// Compound index to ensure a user can't save the same post twice
SavedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });
exports.SavedPostModel = mongoose_1.default.model('SavedPost', SavedPostSchema);
