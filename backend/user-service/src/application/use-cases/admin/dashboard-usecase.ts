import { status } from '@grpc/grpc-js';
import { IUserRepository } from '../../../domain/repositories/user-repository'; 


export class getUserStatsUsecase{
   constructor(private readonly userRepository: IUserRepository){}

   async execute(){
      const { totalUsers , activeUsers} = await this.userRepository.count();
        
      return {
        status: 'success',
        totalUsers,
        activeUsers
      }
   } 
}
