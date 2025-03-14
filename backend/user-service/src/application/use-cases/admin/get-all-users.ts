import { IUserRepository } from '../../../domain/repositories/user-repository';

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const users = await this.userRepository.findAll(skip, limit);
        const { totalUsers } = await this.userRepository.count();  // Destructure totalUsers
        const totalPages = Math.ceil(totalUsers / limit);  // Use totalUsers instead of total
          
        return {
            status: 'success',
            data: {
                users,
                currentPage: page, 
                totalPages,
                total: totalUsers  // Return totalUsers instead of total
            }
        };
    }
}
