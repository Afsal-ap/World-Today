import mongoose, { Schema, Document } from "mongoose";

export interface IAdModel extends Document {
  advertiserId: string;
  title: string;
  description: string;
  imageUrl: string;
  placement: "popup" | "card";
  price: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema: Schema = new Schema({
  advertiserId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  placement: { type: String, enum: ["popup" , "card"], required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const AdModel = mongoose.model<IAdModel>("Ad", AdSchema);
