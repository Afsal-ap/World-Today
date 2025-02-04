import mongoose, { Document, Schema } from 'mongoose';

export interface IChannel {
  channelName: string;
  email: string;
  phoneNumber: string;
  websiteOrSocialLink: string;
  logo: string;
  password: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  bio: string;
  refreshToken?: string;
}

export interface ChannelDocument extends IChannel, Document {}

const channelSchema = new Schema<ChannelDocument>({
  channelName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  websiteOrSocialLink: { type: String },
  logo: { type: String },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  bio: { type: String, default: '' },
  refreshToken: { type: String }
});

export default mongoose.model<ChannelDocument>('Channel', channelSchema);
