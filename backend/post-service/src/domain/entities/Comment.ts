export class Comment {
  constructor(
    public id: string,
    public postId: string,
    public userId: string,
    public content: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
