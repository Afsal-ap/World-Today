import { Channel } from "../../domain/entities/Channel";
import { ChannelRepository } from "../../domain/repositories/ChannelRepository";
import ChannelModel from "../db/model/ChannelModel";
import { CommentModel } from "../db/model/CommentModel";
import { LikeModel } from "../db/model/LikeModel"
import { PostModel } from "../db/model/PostModel";
import LiveModel from "../db/model/LiveModel";

export class ChannelRepositoryImpl implements ChannelRepository {
  async createChannel(channel: Channel): Promise<Channel> {
    const newChannel = new ChannelModel(channel);
    return (await newChannel.save()) as unknown as Channel;
  }

  async findByEmail(email: string): Promise<Channel | null> {
    return ChannelModel.findOne({ email });
  }

  async findById(channelId: string): Promise<Channel | null> {
    return ChannelModel.findById(channelId);
  }

  async updateChannel(channelId: string, channel: Partial<Channel>): Promise<void> {
    await ChannelModel.findByIdAndUpdate(channelId, channel);
  }
  async count(): Promise<{
    totalChannel: number;
    totalComments: number;
    totalLikes: number;
    totalPosts: number;
    totalLives: number;
    popularCategory: string;
  }> {
    const totalChannel = await ChannelModel.countDocuments().exec();
    const totalComments = await CommentModel.countDocuments().exec();
    const totalLikes = await LikeModel.countDocuments().exec();
    const totalPosts = await PostModel.countDocuments().exec();
    const totalLives = await LiveModel.countDocuments().exec();
  
    const categoryResult = await PostModel.aggregate([
      { $group: { _id: "$category", postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 1 }
    ]);
   
    const popularCategory: string = categoryResult.length > 0 ? categoryResult[0]._id : "No category found";
  
  
    return {
      totalChannel,
      totalComments,
      totalLikes,
      totalPosts,
      totalLives,
      popularCategory 
    };
  }
  
}
