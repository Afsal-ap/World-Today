import { PostRepository } from '../../domain/repositories/PostRepository';
import { Post } from '../../domain/entities/Post';
import { PostModel, IPostDocument } from '../db/model/PostModel';
import mongoose, { Types } from 'mongoose';
import { LikeModel } from '../db/model/LikeModel'; 
import { CommentModel } from '../db/model/CommentModel';
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

  async findAll(query?: any): Promise<Post[]> {
    try {
      const { skip, take } = query || {};   
      
      const postDocuments = await PostModel.find({ isBlocked: false })
        .populate<{ channel: { channelName: string } }>('channel', 'channelName')
        .skip(skip || 0)
        .limit(take || 10)
        .sort({ createdAt: -1 });

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

  async findByIds(ids: string[]): Promise<Post[]> {
    const postDocuments = await PostModel.find({
      _id: { $in: ids }
    }).populate<{ channel: { channelName: string } }>('channel', 'channelName');

    return postDocuments.map(doc => new Post(
      doc._id.toString(),
      doc.title,
      doc.content,
      doc.media || '',
      doc.mediaType as 'image' | 'video' | null,
      doc.scheduledPublishDate ? new Date(doc.scheduledPublishDate) : null,
      doc.status as 'draft' | 'scheduled' | 'published',
      doc.createdAt,
      doc.updatedAt,
      doc.channelId,
      doc.category,
      doc.channel?.channelName || 'Unknown Channel'
    ));
  }

  async findPostsByIds(postIds: string[]): Promise<any[]> {
    try {
      const posts = await PostModel.find({
        _id: { $in: postIds }
      });
      return posts;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch posts by IDs: ${error.message}`);
      }
      throw new Error('Failed to fetch posts by IDs: An unknown error occurred');
    }
  }

  async getPostCountsByDate(period: 'daily' | 'weekly'): Promise<{ date: string; count: number }[]> {
    try {
      let dateFormat = "%Y-%m-%d"; 
      if (period === "weekly") {
        dateFormat = "%Y-%U";
      }
  
      const postCounts = await PostModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      return postCounts.map(item => ({
        date: item._id,
        count: item.count
      }));
    } catch (error) {
      console.error("Error fetching post counts:", error);
      throw new Error("Failed to fetch post counts by date");
    }
  }
 
  async getChannelStats(channelId: string, period: 'daily' | 'weekly'): Promise<{
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    postCounts: { date: string; count: number }[];
  }> {
    if (!channelId || typeof channelId !== 'string') {
      throw new Error('Invalid channelId provided');
    }
  
    try {
      // Get total counts
      const totalPosts = await PostModel.countDocuments({ channelId }); 
      const posts = await PostModel.find({ channelId }).select('_id');
      const postIds = posts.map(post => post._id);
      
      const [totalLikes, totalComments] = await Promise.all([
        LikeModel.countDocuments({ postId: { $in: postIds } }),
        CommentModel.countDocuments({ postId: { $in: postIds } })
      ]);
  
      // Set date format based on period
      const dateFormat = period === "weekly" ? "%Y-%U" : "%Y-%m-%d";
  
      // Get post counts by date
      const postCounts = await PostModel.aggregate([
        {
          $match: { channelId }
        },
        {
          $group: {
            _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      return {
        totalPosts,
        totalLikes,
        totalComments,
        postCounts: postCounts.map(item => ({
          date: item._id,
          count: item.count
        }))
      };
    } catch (error) {
      console.error("Error fetching channel stats:", error);
      throw new Error("Failed to fetch channel stats");
    }
  }
}