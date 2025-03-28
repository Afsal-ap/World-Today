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
    cb(null, "uploads/"); 
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
      
      res.json({
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.paymentIntentId
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { adData, paymentIntentId } = req.body;
      console.log("Request body:", req.body) 
      // Check payment status directly from Stripe
      const paymentStatus = await paymentService.checkPaymentStatus(paymentIntentId);
      
      if (paymentStatus !== 'succeeded') {
        return res.status(400).json({ 
          error: `Payment not completed. Status: ${paymentStatus}` 
        });
      }
      
      // Create the ad without trying to confirm the payment again
      const ad = await adRepository.createAd({
        id: "",
        advertiserId: adData.advertiserId,
        title: adData.title,
        description: adData.description,
        imageUrl: adData.imageUrl,
        placement: adData.placement,
        price: adData.price,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.status(201).json({ 
        message: "Ad created successfully", 
        ad,
        paymentIntentId
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  } 
   
  static async deleteAd(req: Request, res: Response) {
    try {
      const { adId } = req.params;
      await adRepository.deleteAd(adId);
      res.status(200).json({ message: "Ad deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete ad" });
    }
  }

  static async getByAdvertiser(req: Request, res: Response) {
    try {
      const { advertiserId } = req.params; 
      console.log(advertiserId, "Advertiser ID backendil ethi");
      const ads = await adRepository.getAdsByAdvertiser(advertiserId);
      console.log(ads, "Ads backendil ethi");
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ads" });
    }
  } 

  static async getActiveAds(req: Request, res: Response) {
    try {
      const ads = await adRepository.getActiveAds();
      console.log("Active adseeeyeye", ads);
      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active ads" });
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