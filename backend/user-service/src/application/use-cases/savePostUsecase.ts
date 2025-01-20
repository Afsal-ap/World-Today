import { ISavedPostRepository } from '../../domain/repositories/savePost-repository';

export class ToggleSavePostUseCase {
  constructor(private readonly savedPostRepository: ISavedPostRepository) {}

  async execute(userId: string, postId: string): Promise<{ saved: boolean }> {
    const isSaved = await this.savedPostRepository.isPostSaved(userId, postId);
    
    if (isSaved) {
      await this.savedPostRepository.unsavePost(userId, postId);
      return { saved: false };
    } else {
      await this.savedPostRepository.savePost(userId, postId);
      return { saved: true };
    }
  }
}
