import { Request, Response, NextFunction } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary (using environment variables)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Add this function to test Cloudinary connectivity
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.v2.api.ping();
    console.log("✅ Cloudinary connection successful:", result);
    return true;
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error);
    return false;
  }
};

// Configure Multer for temporary local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(process.cwd(), "uploads/");
    // Ensure the uploads directory exists with proper permissions
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Multer instance with improved error handling
const multerUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
  },
}).single("image");