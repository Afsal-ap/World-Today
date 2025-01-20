import mongoose from 'mongoose';

export interface IComment {
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for faster queries
commentSchema.index({ postId: 1, createdAt: -1 });

export const CommentModel = mongoose.model<IComment & mongoose.Document>('Comment', commentSchema);
