import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';
import { SavedPost } from '../../domain/models/savedPost';

export class GetSavePostUseCase {
  constructor(private readonly savedPostRepository: ISavedPostRepository) {}

  async execute(userId: string): Promise<SavedPost[]> {
    try {
      const savedPosts = await this.savedPostRepository.getSavedPosts(userId);
      return savedPosts;
    } catch (error) {
      throw new Error('Failed to get saved posts');
    }
  }
}   