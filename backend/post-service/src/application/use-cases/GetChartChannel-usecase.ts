import { PostRepository } from "../../domain/repositories/PostRepository";

export class GetChannelChartUsecase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(period: 'daily' | 'weekly') {  
        return await this.postRepository.getPostCountsByDate(period);
    }
}
