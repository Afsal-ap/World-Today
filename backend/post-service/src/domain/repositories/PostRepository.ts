import { Post } from '../entities/Post';

export interface PostRepository {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAll(query?: any): Promise<Post[]>;
  findByIds(ids: string[]): Promise<Post[]>;
  findPostsByIds(postIds: string[]): Promise<any[]>;
  getPostCountsByDate(period: 'daily' | 'weekly'): Promise<{ date: string; count: number }[]> 
  getChannelStats(channelId: string, period: 'daily' | 'weekly'): Promise<{
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    postCounts?: { date: string; count: number }[];
  }>;
}