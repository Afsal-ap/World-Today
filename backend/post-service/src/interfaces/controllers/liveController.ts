import { Request, Response } from "express";
import { LiveService } from "../../live/live.service";

const liveService = new LiveService();

export const startLivePost = async (req: Request, res: Response) => {
    const { postId, channelId } = req.body;
    try {
        const roomId = await liveService.createLivePost(postId, channelId);
        res.status(201).json({ success: true, roomId });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getLivePosts = async (req: Request, res: Response) => {
    try {
        const livePosts = await liveService.getActiveLivePosts();
        res.json({ success: true, livePosts });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const endLivePost = async (req: Request, res: Response) => {
    const { roomId } = req.body;
    try {
        if (!roomId) {
            throw new Error('Room ID is required');
        }
        console.log('Received request to end live stream for room:', roomId); // Debug log
        const success = await liveService.endLivePost(roomId);
        res.json({ success });
    } catch (error) {
        console.error('Error in endLivePost controller:', error); // Debug log
        res.status(500).json({ 
            success: false, 
            message: (error as Error).message 
        });
    }
};
