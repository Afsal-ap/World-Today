import { IUserRepository } from '../../domain/repositories/user-repository';
import { IPaymentService } from '../../domain/services/payment-service';
import { User } from '../../domain/entities/user';

export class GetSubscriptionStatusUseCase {
    constructor(
      private userRepository: IUserRepository,
      private stripeService: IPaymentService
    ) {}
  
    async execute(userId: string): Promise<boolean> {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
  
      // If user has subscription status in database, use that
      if (user.subscriptionStatus === 'active') {
        return true;
      }
  
      // If user has a Stripe subscription ID, verify with Stripe
      if (user.subscriptionId) {
        const isActive = await this.stripeService.isSubscriptionActive(user.subscriptionId);
        
        // Update user's subscription status in database if needed
        if (isActive && user.subscriptionStatus !== 'active') {
          await this.userRepository.update(user.id!, {
            subscriptionStatus: 'active'
          });
        } else if (!isActive && user.subscriptionStatus === 'active') {
          await this.userRepository.update(user.id!, {
            subscriptionStatus: 'inactive'
          });
        }
        
        return isActive;
      }
  
      return false;
    }
  }