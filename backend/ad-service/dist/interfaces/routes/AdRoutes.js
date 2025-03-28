"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdController_1 = require("../controllers/AdController");
const authenticateAdvertiser_1 = require("../middlewares/authenticateAdvertiser");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.get("/active-ads", AdController_1.AdController.getActiveAds);
router.post("/create-payment-intent", authenticateAdvertiser_1.authenticateAdvertiser, AdController_1.AdController.createPaymentIntent);
router.post("/create-ad", authenticateAdvertiser_1.authenticateAdvertiser, AdController_1.AdController.create);
router.get("/:advertiserId", authenticateAdvertiser_1.authenticateAdvertiser, AdController_1.AdController.getByAdvertiser);
router.delete("/delete-ad/:adId", authenticateAdvertiser_1.authenticateAdvertiser, AdController_1.AdController.deleteAd);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.resolve(process.cwd(), "uploads/");
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
    },
});
router.post("/upload-image", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ error: "File too large. Max size is 5MB." });
            }
            return res.status(400).json({ error: `Multer error: ${err.message}` });
        }
        else if (err) {
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        }
        next();
    });
}, AdController_1.AdController.uploadImage);
exports.default = router;
//# sourceMappingURL=AdRoutes.js.map