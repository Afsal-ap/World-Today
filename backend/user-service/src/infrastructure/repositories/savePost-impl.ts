import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';
import { SavedPost } from '../../domain/models/savedPost';
import { SavedPostModel } from '../db/models/savePostModel';

export class SavedPostRepositoryImpl implements ISavedPostRepository {
  async savePost(userId: string, postId: string, postTitle: string): Promise<void> {
    const savedPost = new SavedPostModel({
      userId,
      postId,
      postTitle,
      savedAt: new Date()
    });
    await savedPost.save();
  }

  async getSavedPosts(userId: string): Promise<SavedPost[]> {
    const posts = await SavedPostModel.find({ userId });
    return posts.map(post => ({
      userId: post.userId,
      postId: post.postId,
      postTitle: post.postTitle,
      savedAt: post.savedAt
    }));
  }

  async removeSavedPost(userId: string, postId: string): Promise<void> {
    await SavedPostModel.deleteOne({ userId, postId });
  }

  async isSaved(userId: string, postId: string): Promise<boolean> {
    const post = await SavedPostModel.findOne({ userId, postId });
    return !!post;
  }
}
