import { Post } from '../entities/Post';

export interface PostService {
  createPost(post: Post): Promise<Post>;
  getPost(id: string): Promise<Post | null>;
  getAllPosts(): Promise<Post[]>;
} 