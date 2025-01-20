export class Post {
  constructor(
    public id: string,
    public title: string,
    public content: string,
    public mediaUrl: string,
    public mediaType: 'image' | 'video' | null,
    public scheduledPublishDate: Date | null,
    public status: 'draft' | 'scheduled' | 'published',
    public createdAt: Date,
    public updatedAt: Date,
    public channelId: string,
    public category: string,
    public channelName: string = 'Unknown Channel'
  ) {}
}