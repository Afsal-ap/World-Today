import { PostDto } from '../dto/PostDto';
import { PostRepository } from '../../domain/repositories/PostRepository';
import { Post } from '../../domain/entities/Post';

export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(postDto: PostDto): Promise<Post> {
    const post = new Post(
      'generated-id',  // You can replace this with an actual ID generation logic
      postDto.title,
      postDto.content,
      postDto.media,
      new Date(),
      new Date()
    );

    return this.postRepository.create(post);
  }
}
