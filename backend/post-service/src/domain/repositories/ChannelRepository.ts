import { Channel } from "../entities/Channel";

export interface ChannelRepository {
  createChannel(channel: Channel): Promise<Channel>;
  findByEmail(email: string): Promise<Channel | null>;
  findById(channelId: string): Promise<Channel | null>;
  updateChannel(channelId: string, channel: Partial<Channel>): Promise<void>;
  count(): Promise<{
    totalChannel:number;
    totalComments:number;
    totalLikes:number;
    totalPosts:number;
    totalLives:number;
    popularCategory:string}>;
}
