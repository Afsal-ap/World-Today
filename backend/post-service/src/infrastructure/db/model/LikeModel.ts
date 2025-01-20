import mongoose from 'mongoose';

export interface ILike {
  postId: string;
  userId: string;
  createdAt: Date;
}

const likeSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Add compound index to ensure uniqueness
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const LikeModel = mongoose.model<ILike & mongoose.Document>('Like', likeSchema);
