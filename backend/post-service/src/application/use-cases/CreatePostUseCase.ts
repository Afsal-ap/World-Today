import { PostDto } from '../dto/PostDto';
import { PostRepository } from '../../domain/repositories/PostRepository';
import { Post } from '../../domain/entities/Post';

export class CreatePostUseCase {

  constructor(
    private postRepository: PostRepository
  ) {
  }

  async execute(postDto: PostDto): Promise<Post> {   
    // Verify category exists
    

    const now = new Date();
    
    const post = new Post(
      'temp-id',
      postDto.title,
      postDto.content,
      postDto.media || '',
      postDto.mediaType,
      postDto.scheduledPublishDate,
      postDto.scheduledPublishDate ? 'scheduled' : 'published',
      now,
      now,
      postDto.channelId,
      postDto.category
    );
  
    return this.postRepository.create(post);
  }
}
