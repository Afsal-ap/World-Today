import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';

export class ToggleSavePostUseCase {
  constructor(private readonly savedPostRepository: ISavedPostRepository) {}

  async execute(userId: string, postId: string, postTitle: string): Promise<{ saved: boolean }> {
    const isSaved = await this.savedPostRepository.isSaved(userId, postId);
    
    if (isSaved) {
      await this.savedPostRepository.removeSavedPost(userId, postId);
      return { saved: false };
    } else {
      await this.savedPostRepository.savePost(userId, postId, postTitle);
      return { saved: true };
    }
  }
}
