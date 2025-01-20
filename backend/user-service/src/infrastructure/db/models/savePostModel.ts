import mongoose from 'mongoose';

const SavedPostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  savedAt: { type: Date, default: Date.now }
});

// Compound index to ensure a user can't save the same post twice
SavedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const SavedPostModel = mongoose.model('SavedPost', SavedPostSchema);
