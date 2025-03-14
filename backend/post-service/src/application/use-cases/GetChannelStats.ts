import { status } from '@grpc/grpc-js';
import { ChannelRepository } from '../../domain/repositories/ChannelRepository'


export class getChannelStatsUsecase{
   constructor(private readonly channelRepository: ChannelRepository){}

   async execute(){
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
}
