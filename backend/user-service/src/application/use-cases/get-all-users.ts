import { IUserRepository } from '../../domain/repositories/user-repository';

export class GetAllUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const users = await this.userRepository.findAll(skip, limit);
        console.log(users,"usersdaaaaaaaa");
        const total = await this.userRepository.count();
        const totalPages = Math.ceil(total.totalUsers / limit);

        return {
            status: 'success',
            data: {
                users,
                currentPage: page,
                totalPages,
                totalUsers: total.totalUsers,
                activeUsers: total.activeUsers
            }
        };
        
    }
} 