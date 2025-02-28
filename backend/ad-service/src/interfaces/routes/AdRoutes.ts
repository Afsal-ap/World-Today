import express from "express";
import { AdController } from "../controllers/AdController";

const router = express.Router();

router.post("/create-ad", AdController.create);
router.get("/ads/:advertiserId", AdController.getByAdvertiser);

export default router;
