export class PostDto {
  constructor(
    public title: string,
    public content: string,
    public media: string | null,
    public mediaType: 'image' | 'video' | null,
    public scheduledPublishDate: Date | null,
    public channelId: string,
    public category: string
  ) {}
  validate(): boolean {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!this.content || this.content.trim().length < 10) {
      throw new Error('Content must be at least 10 characters');
    }
    if (this.scheduledPublishDate && new Date(this.scheduledPublishDate) < new Date()) {
      throw new Error('Scheduled publish date must be in the future');
    }
    if (!this.channelId) {
      throw new Error('Channel ID is required');
    }
    if (!this.category) {
      throw new Error('Category is required');
    }
    
    return true;
  }
}
