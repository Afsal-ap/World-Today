import express from "express";
import { AdController } from "../controllers/AdController";
import { authenticateAdvertiser } from "../middlewares/authenticateAdvertiser";
import {  } from "../middlewares/uploadMiddleware";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/create-payment-intent", authenticateAdvertiser, AdController.createPaymentIntent);
router.post("/create-ad", authenticateAdvertiser, AdController.create);
router.get("/ads/:advertiserId", authenticateAdvertiser, AdController.getByAdvertiser);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.resolve(process.cwd(), "uploads/");
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
  
  // Create multer upload instance
  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      }
      cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
    },
  });
  
  // Define routes with error handling
  router.post(
    "/upload-image",
    (req, res, next) => {
      upload.single("image")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large. Max size is 5MB." });
          }
          return res.status(400).json({ error: `Multer error: ${err.message}` });
        } else if (err) {
          // An unknown error occurred
          return res.status(400).json({ error: `Upload error: ${err.message}` });
        }
        // No errors, proceed to next middleware
        next();
      });
    },
    AdController.uploadImage
  );
  export default router;
