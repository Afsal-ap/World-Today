import mongoose from 'mongoose';

export interface IPost {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  media?: string;
  mediaType?: 'image' | 'video' | null;
  status: 'draft' | 'scheduled' | 'published';
  channelId: string;
  category: string;
  scheduledPublishDate?: Date;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDocument extends mongoose.Document<mongoose.Types.ObjectId>, IPost {}

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: String },
  mediaType: { type: String, enum: ['image', 'video', null] },
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'published'],
    required: true 
  },
  channelId: { type: String, required: true },
  category: { type: String, required: true },
  scheduledPublishDate: { type: Date },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

postSchema.virtual('channel', {
  ref: 'Channel',
  localField: 'channelId',
  foreignField: '_id',
  justOne: true
});

export const PostModel = mongoose.model<IPostDocument>('Post', postSchema);
