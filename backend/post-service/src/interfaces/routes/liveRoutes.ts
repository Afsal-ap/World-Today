import express from 'express';
import { startLivePost, getLivePosts, endLivePost } from "../controllers/liveController";

const router = express.Router();

router.post("/start", startLivePost);
router.get("/live-posts", getLivePosts);
router.post("/end", endLivePost);
router.post('/stop', endLivePost);

export default router;
