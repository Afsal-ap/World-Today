import mongoose, { Schema, Document } from "mongoose";

export interface ChannelDocument extends Document {
  channelName: string;
  email: string;
  phoneNumber: string;
  governmentId: string;
  logo: {
    path: string;
    filename: string;
  };
  websiteOrSocialLink: string;
  password: string;
  refreshToken?: string;
  isVerified: boolean;
}

const ChannelSchema = new Schema<ChannelDocument>({
  channelName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  governmentId: { type: String, required: true },
  logo: {
    path: { type: String, required: true },
    filename: { type: String, required: true }
  },
  websiteOrSocialLink: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model<ChannelDocument>("Channel", ChannelSchema);
