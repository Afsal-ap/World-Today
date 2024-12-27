export class Post {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public media: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
} 