import { Channel } from "../../domain/entities/Channel";
import { ChannelRepository } from "../../domain/repositories/ChannelRepository";
import ChannelModel from "../db/models/channelModel";

export class ChannelRepositoryImpl implements ChannelRepository {
  async createChannel(channel: Channel): Promise<Channel> {
    const newChannel = new ChannelModel(channel);
    return (await newChannel.save()) as Channel;
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
}
