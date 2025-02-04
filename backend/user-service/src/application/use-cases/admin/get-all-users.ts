import { IUserRepository } from '../../../domain/repositories/user-repository';

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const users = await this.userRepository.findAll(skip, limit);
        const total = await this.userRepository.count();
        const totalPages = Math.ceil(total / limit);
          
        return {
            status: 'success',
            data: {
                users,
                currentPage: page, 
                totalPages,
                total
            }
        };
    }
} 

