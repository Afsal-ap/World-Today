import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PostModel } from '../../infrastructure/db/model/PostModel';
import { LikeModel } from '../../infrastructure/db/model/LikeModel';
import { CommentModel } from '../../infrastructure/db/model/CommentModel';
import { Document, Types } from 'mongoose';
import path from 'path';
import { log } from 'console';

const PROTO_PATH = path.resolve(__dirname, '../../../proto/post.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

interface IChannel {
  _id: Types.ObjectId;
  channelName: string;
}

interface IPost {
  _id: Types.ObjectId;
  title: string;
  content: string;
  media?: string;
  mediaType?: string;
  channelId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IPopulatedPost extends Omit<IPost, 'channelId'> {
  channelId: IChannel;
}

const getPostsByIds = async (call: any, callback: any) => {
  try {
    const { post_ids } = call.request; 

    if(!post_ids){
      console.log('post_ids is empty');
    }
      
    if (!post_ids || !Array.isArray(post_ids) || post_ids.length === 0) {
        throw new Error('post_ids must be a non-empty array');
    }

    const posts = await PostModel.find({ 
      _id: { $in: post_ids.map(id => id.toString()) } 
    }).populate<{ channelId: IChannel }>('channelId', 'channelName');

    console.log(`Found ${posts.length} posts`);

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await LikeModel.countDocuments({ postId: post._id });
        const commentsCount = await CommentModel.countDocuments({ postId: post._id });
        
        return {
          id: post._id.toString(),
          title: post.title,
          content: post.content,
          media_url: post.media || '',
          media_type: post.mediaType || '',
          channel_name: post.channelId?.channelName || 'Unknown Channel',
          likes_count: likesCount,
          comments_count: commentsCount,
          created_at: post.createdAt.toISOString(),
          updated_at: post.updatedAt.toISOString()
        };
      })
    );

    callback(null, { posts: postsWithDetails });
  } catch (error: any) {
    console.error('gRPC server error:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

export const startGrpcServer = () => {
  const server = new grpc.Server();
  server.addService((protoDescriptor as any).post.PostService.service, { getPostsByIds });
  
  server.bindAsync(
    'localhost:50051',
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('Failed to start gRPC server:', error);
        return;
      }
      server.start();
      console.log(`gRPC server running on port ${port}`);
    }
  );
};
