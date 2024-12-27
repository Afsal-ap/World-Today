export class PostDto {
  constructor(
    public title: string,
    public content: string,
    public media: string
  ) {}

  validate(): boolean {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!this.content || this.content.trim().length < 10) {
      throw new Error('Content must be at least 10 characters');
    }
    return true;
  }
}
