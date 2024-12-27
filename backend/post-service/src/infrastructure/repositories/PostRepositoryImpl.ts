import { PostRepository } from '../../domain/repositories/PostRepository';
import { Post } from '../../domain/entities/Post';
import { PostModel } from '../db/model/PostModel';

export class PostRepositoryImpl implements PostRepository {
  // Create a new post
  async create(post: Post): Promise<Post> {
   
    const postDocument = new PostModel(post);
    await postDocument.save();  

   
    const savedPost = new Post(
      postDocument._id.toString(),  
      postDocument.title,
      postDocument.content,
      postDocument.media,
      postDocument.createdAt,
      postDocument.updatedAt
    );

    return savedPost; 
  }

  // Find a post by its ID 
  async findById(id: string): Promise<Post | null> {
    const postDocument = await PostModel.findById(id).exec();  
    if (!postDocument) {
      return null;
    }

   
    const post = new Post(
      postDocument._id.toString(),
      postDocument.title,
      postDocument.content,
      postDocument.media,
      postDocument.createdAt,
      postDocument.updatedAt
    );

    return post;  
  }

  
  async findAll(): Promise<Post[]> {
    const postDocuments = await PostModel.find().exec();  

   
    const posts = postDocuments.map(postDocument => 
      new Post(
        postDocument._id.toString(),
        postDocument.title,
        postDocument.content,
        postDocument.media,
        postDocument.createdAt,
        postDocument.updatedAt
      )
    );

    return posts; 
  }
}
