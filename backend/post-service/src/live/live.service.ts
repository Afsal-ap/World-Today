import LiveModel from '../infrastructure/db/model/LiveModel';

export class LiveService {
    private liveStreams: Map<string, { channelId: string, viewers: string[] }> = new Map();

    async createLivePost(postId: string, channelId: string): Promise<string> {
        try {
            const live = new LiveModel({
                channelId,
                roomId: postId,
                isActive: true,
                startedAt: new Date(),
                viewers: []
            });
            
            const savedLive = await live.save();
            if (!savedLive) {
                throw new Error('Failed to save live stream');
            }
            
            return savedLive.roomId;
        } catch (error) {
            console.error('Error creating live post:', error);
            throw error;
        }
    }

    async joinLivePost(roomId: string, userId: string): Promise<boolean> {
        const livePost = await LiveModel.findOne({ roomId });
        if (livePost) {
            livePost.viewers.push(userId);
            await livePost.save();
            return true;
        }
        return false;
    }

    async getActiveLivePosts() {
        return await LiveModel.find({ isActive: true })
            .select('roomId channelId startedAt viewers')
            .lean()
            .exec();
    }

    async endLivePost(roomId: string) {
        try {
            const result = await LiveModel.updateOne(
                { roomId },
                { $set: { isActive: false, viewers: [] } }
            );
            
            if (result.modifiedCount === 0) {
                throw new Error('No live stream found to end');
            }
            
            console.log('Live stream ended successfully for room:', roomId);
            return true;
        } catch (error) {
            console.error('Error ending live post:', error);
            throw error;
        }
    }
}
