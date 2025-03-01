import { Request, Response } from "express";
import { CreateAdUseCase } from "../../application/use-cases/CreateAd";
import { AdRepositoryImpl } from "../../infrastructure/repositories/AdRepositoryImpl";
import { StripePaymentService } from "../../infrastructure/payment/StripePaymentService";
import multer from "multer";
import cloudinary from "cloudinary";
import path from "path";
import fs from "fs";
import { testCloudinaryConnection } from "../middlewares/uploadMiddleware";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for temporary local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

const adRepository = new AdRepositoryImpl();
const paymentService = new StripePaymentService();
const createAdUseCase = new CreateAdUseCase(adRepository, paymentService);

export class AdController {
  static async createPaymentIntent(req: Request, res: Response) {
    try {
      const { amount, placement } = req.body;
      const paymentIntent = await paymentService.createPaymentIntent(amount, "usd");
      res.json(paymentIntent);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { adData, paymentIntentId } = req.body;
      const isPaymentConfirmed = await paymentService.confirmPayment(paymentIntentId);
      if (!isPaymentConfirmed) {
        throw new Error("Payment not confirmed");
      }
      const ad = await createAdUseCase.execute(adData, paymentIntentId);
      res.status(201).json({ message: "Ad created successfully", ad });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getByAdvertiser(req: Request, res: Response) {
    try {
      const { advertiserId } = req.params;
      const ads = await adRepository.getAdsByAdvertiser(advertiserId);
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ads" });
    }
  }

  static async uploadImage(req: Request, res: Response) {
    try {
      // First verify Cloudinary connection
      const isConnected = await testCloudinaryConnection();
      if (!isConnected) {
        return res.status(503).json({ 
          error: "Cloudinary service unavailable. Please try again later." 
        });
      }

      // Check if Multer successfully processed the file
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      console.log("File received:", {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      // Make sure the file exists before uploading
      if (!fs.existsSync(req.file.path)) {
        return res.status(400).json({ 
          error: "File was processed but cannot be found on server" 
        });
      }

      // Get absolute path to the file
      const absolutePath = path.resolve(req.file.path);
      console.log("Uploading file from path:", absolutePath);

      // Upload to Cloudinary with detailed error handling
      try {
        const result = await cloudinary.v2.uploader.upload(absolutePath, {
          folder: "ads",
          resource_type: "image",
          // Add some debugging options
          use_filename: true,
          unique_filename: true,
        });

        console.log("Cloudinary upload successful:", {
          url: result.secure_url,
          public_id: result.public_id
        });

        // Delete the local file after successful upload
        try {
          fs.unlinkSync(absolutePath);
        } catch (unlinkError) {
          console.warn("Warning: Could not delete temporary file:", unlinkError);
          // Continue anyway, this isn't critical
        }

        // Return the image URL
        return res.status(200).json({ 
          imageUrl: result.secure_url,
          public_id: result.public_id
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({ 
          error: "Failed to upload image to Cloudinary", 
          details: (cloudinaryError as Error).message 
        });
      }
    } catch (error) {
      console.error("Server error during upload:", error);
      return res.status(500).json({ 
        error: "Server error processing upload", 
        details: (error as Error).message 
      });
    }
  }
}

// Export multer middleware for the route
export const uploadMiddleware = upload.single("image");