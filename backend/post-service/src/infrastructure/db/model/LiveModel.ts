import mongoose, { Schema, Document } from 'mongoose';

interface ILive extends Document {
  channelId: string;
  roomId: string;
  startedAt: Date;
  viewers: string[];
  isActive: boolean;
}

const LiveSchema: Schema = new Schema({
  channelId: { type: String, required: true },
  roomId: { type: String, required: true, unique: true },
  startedAt: { type: Date, default: Date.now },
  viewers: [{ type: String }],
  isActive: { type: Boolean, default: true }
});

export default mongoose.model<ILive>('Live', LiveSchema);
