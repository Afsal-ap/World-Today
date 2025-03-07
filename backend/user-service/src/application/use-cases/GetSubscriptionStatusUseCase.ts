import { IUserRepository } from '../../domain/repositories/user-repository';
import { StripeService } from '../../infrastructure/payment/StripeService';

export class GetSubscriptionStatusUseCase {
    constructor(
        private userRepository: IUserRepository,
        private stripeService: StripeService
    ) {}

    async execute(email: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.subscriptionId) return false;

        const subscription = await this.stripeService.createSubscription(user.subscriptionId);
        return subscription.status === 'active';
    }
}