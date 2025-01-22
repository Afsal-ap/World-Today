import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../../../proto/post.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const PostService = (protoDescriptor as any).post.PostService;

const client = new PostService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);
//grpc

export const getPostsByIds = (postIds: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(postIds) || postIds.length === 0) {
      console.log('Invalid postIds:', postIds);
      reject(new Error('No post IDs provided'));
      return;
    }

    console.log('Sending gRPC request with postIds:', postIds); 
     
    // Note the lowercase 'g' in getPostsByIds to match proto definition
    client.getPostsByIds({ post_ids: postIds }, (error: any, response: any) => {
      if (error) {
        console.error('gRPC client error:', error);
        reject(error);
      } else {
        console.log('gRPC response:', response);
        if (!response || !response.posts) {
          console.warn('Empty or invalid response received'); 
          resolve([]); 
          return; 
        }
        resolve(response.posts); 
      } 
    });  
  });
};
