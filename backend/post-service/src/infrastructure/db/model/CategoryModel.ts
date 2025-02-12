import mongoose, { Document } from 'mongoose';

export interface ICategory {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryDocument extends ICategory, Document {}

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
categorySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', categorySchema);
