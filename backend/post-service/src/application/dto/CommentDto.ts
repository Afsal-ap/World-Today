export class CommentDto {
  constructor(
    public postId: string,
    public userId: string,
    public content: string
  ) {}

  validate(): void {
    if (!this.postId) throw new Error('Post ID is required');
    if (!this.userId) throw new Error('User ID is required');
    if (!this.content) throw new Error('Comment content is required');
    if (this.content.length > 1000) throw new Error('Comment is too long');
  }
}
