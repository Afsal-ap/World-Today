import { PostRepository } from '../../domain/repositories/PostRepository';
import { Post } from '../../domain/entities/Post';
import { PostModel, IPostDocument } from '../db/model/PostModel';
import mongoose, { Types } from 'mongoose';

// ... existing imports ...

export class PostRepositoryImpl implements PostRepository {
  async create(post: Post): Promise<Post> {
    const postDoc = new PostModel({
      title: post.title,
      content: post.content,
      media: post.mediaUrl,      
      mediaType: post.mediaType,
      status: post.status,
      channelId: post.channelId,
      category: post.category,
      scheduledPublishDate: post.scheduledPublishDate,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    });

    const savedPost = await postDoc.save();
    
    return new Post(
      savedPost._id.toString(),
      savedPost.title,
      savedPost.content,
      savedPost.media || '',
      savedPost.mediaType || null,
      savedPost.scheduledPublishDate ? new Date(savedPost.scheduledPublishDate) : null,
      savedPost.status as 'draft' | 'scheduled' | 'published',
      savedPost.createdAt,
      savedPost.updatedAt,
      savedPost.channelId,
      savedPost.category,
      'Unknown Channel'
    );
  }

  async findById(id: string): Promise<Post | null> {
    const postDocument = await PostModel.findById(id).populate<{ channel: { channelName: string } }>('channel', 'channelName');
    if (!postDocument) return null;
    
    return new Post(
      postDocument._id.toString(),
      postDocument.title,
      postDocument.content,
      postDocument.media || '',
      postDocument.mediaType as 'image' | 'video' | null,
      postDocument.scheduledPublishDate ? new Date(postDocument.scheduledPublishDate) : null,
      postDocument.status as 'draft' | 'scheduled' | 'published',
      postDocument.createdAt,
      postDocument.updatedAt,
      postDocument.channelId,
      postDocument.category,
      postDocument.channel?.channelName || 'Unknown Channel'
    );
  }

  async findAll(): Promise<Post[]> {
    try {
      const postDocuments = await PostModel.find()
        .populate<{ channel: { channelName: string } }>('channel', 'channelName');
        
      return postDocuments.map(postDocument => {
        const mediaPath = postDocument.media || '';
        const channelName = postDocument.channel?.channelName || 'Unknown Channel';
          
        return new Post(
          postDocument._id.toString(),
          postDocument.title,
          postDocument.content,
          mediaPath,
          postDocument.mediaType as 'image' | 'video' | null,
          postDocument.scheduledPublishDate ? new Date(postDocument.scheduledPublishDate) : null,
          postDocument.status as 'draft' | 'scheduled' | 'published',
          postDocument.createdAt,
          postDocument.updatedAt,
          postDocument.channelId,    
          postDocument.category,
          channelName
        );
      });
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }
}
