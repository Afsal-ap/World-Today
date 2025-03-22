import { status } from '@grpc/grpc-js';
import { ChannelRepository } from '../../domain/repositories/ChannelRepository'
import { PostRepository } from '../../domain/repositories/PostRepository';

export class getChannelStatsUsecase{
   constructor(private readonly channelRepository: ChannelRepository,
     private readonly postRepository: PostRepository){}


   async getChannelStatsAdmin(){
      const { 
         totalChannel, 
         totalComments, 
         totalLikes, 
         totalPosts, 
         totalLives,
         popularCategory
        } = await this.channelRepository.count();
               
      return {
        status: 'success',
        totalChannel,
        totalComments,
        totalLikes,
        totalPosts,
        totalLives,
        popularCategory
      }
   }  

   async getChannelStats(channelId: string, period?: 'daily' | 'weekly'): Promise<{
      totalPosts: number;
      totalLikes: number;
      totalComments: number;
      postCounts?: { date: string; count: number }[];
    }> {
      try {
        if (!channelId) {
          throw new Error('Channel ID is required');
        }
    
        // If period is optional in the repository too, we can handle it this way
        const stats = period 
          ? await this.postRepository.getChannelStats(channelId, period)
          : await this.postRepository.getChannelStats(channelId, 'daily'); // default period
    
        const { totalPosts, totalLikes, totalComments } = stats;
    
        // Check if postCounts exists in the stats (it might only be returned when period is specified)
        if ('postCounts' in stats && period) {
          return {
            totalPosts,
            totalLikes,
            totalComments,
            postCounts: stats.postCounts
          };
        }
    
        return {
          totalPosts,
          totalLikes,
          totalComments
        };
      } catch (error) {
        console.error('Error in getChannelStats:', error);
        throw new Error('Failed to fetch channel statistics');
      }
    }
}
