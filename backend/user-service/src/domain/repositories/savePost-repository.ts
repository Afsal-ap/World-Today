import { SavedPost } from '../models/savedPost';

export interface ISavedPostRepository {
  savePost(userId: string, postId: string, postTitle: string): Promise<void>;
  getSavedPosts(userId: string): Promise<SavedPost[]>;
  removeSavedPost(userId: string, postId: string): Promise<void>;
  isSaved(userId: string, postId: string): Promise<boolean>;
}
