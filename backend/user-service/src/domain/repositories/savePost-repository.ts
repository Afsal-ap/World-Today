export interface ISavedPostRepository {
  savePost(userId: string, postId: string): Promise<void>;
  unsavePost(userId: string, postId: string): Promise<void>;
  getSavedPosts(userId: string): Promise<string[]>;
  isPostSaved(userId: string, postId: string): Promise<boolean>;
}
