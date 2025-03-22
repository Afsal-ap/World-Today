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
 

  export const getPostsByIds = async (call: any, callback: any) => {
  try {
    const  post_ids  = call.request.post_ids; 

    console.log('Received post_ids:', post_ids);
    console.log("Type of received post_ids:", typeof post_ids);
    console.log("Is received post_ids an array?", Array.isArray(post_ids));
// 
    // Validate if post_ids is an array
    if (!Array.isArray(post_ids)) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'post_ids must be an array',
      });
    }

    // If post_ids is empty, return an empty list
    if (post_ids.length === 0) {
      return callback(null, { posts: [] });
    }

    // Fetch posts from database
    const posts = await PostModel.find({ 
      _id: { $in: post_ids.map(id => new Types.ObjectId(id)) } 
    }).populate<{ channelId: IChannel }>('channelId', 'channelName');

    console.log(`Found ${posts.length} posts`);

    // Fetch likes and comments count
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const [likesCount, commentsCount] = await Promise.all([
          LikeModel.countDocuments({ postId: post._id }),
          CommentModel.countDocuments({ postId: post._id })
        ]);
        
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
  
  const serviceImplementation = {
    getPostsByIds
  };

  server.addService((protoDescriptor as any).post.PostService.service, serviceImplementation);
  server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('Failed to start gRPC server:', error);
      return;
    }
    server.start();
    console.log(`gRPC server running on port ${port}`);
  });
};
