   import mongoose from "mongoose"; 

  const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const CategoryModel = mongoose.model('Category', CategorySchema);