import { IUserRepository } from '../../../domain/repositories/user-repository'; 

export class GetUserChartUsecase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(period: "daily" | "weekly") {
        return await this.userRepository.getActiveUsers(period);
    }
}
