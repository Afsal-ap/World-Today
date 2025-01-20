import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';
import { SavedPostModel } from '../db/models/savePostModel';

export class SavedPostRepositoryImpl implements ISavedPostRepository {
  async savePost(userId: string, postId: string): Promise<void> {
    try {
      await SavedPostModel.create({ userId, postId });
    } catch (error: any) {
      if (error.code === 11000) { // Duplicate key error
        throw new Error('Post already saved');
      }
      throw error;
    }
  }

  async unsavePost(userId: string, postId: string): Promise<void> {
    const result = await SavedPostModel.deleteOne({ userId, postId });
    if (result.deletedCount === 0) {
      throw new Error('Post not found or already unsaved');
    }
  }

  async getSavedPosts(userId: string): Promise<string[]> {
    const savedPosts = await SavedPostModel.find({ userId });
    return savedPosts.map(post => post.postId);
  }

  async isPostSaved(userId: string, postId: string): Promise<boolean> {
    const savedPost = await SavedPostModel.findOne({ userId, postId });
    return !!savedPost;
  }
}
