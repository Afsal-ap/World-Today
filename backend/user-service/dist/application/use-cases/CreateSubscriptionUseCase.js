"use strict";
// import { IUserRepository } from '../../domain/repositories/user-repository';
// import { StripeService } from '../../infrastructure/payment/StripeService';
// import { CreateSubscriptionDTO } from '../dto/CreateSubscriptionDTO';
// import { User } from '../../domain/entities/user';
// export class CreateSubscriptionUseCase {
//     constructor(
//         private userRepository: IUserRepository,
//         private stripeService: StripeService
//     ) {}
//     async execute(dto: CreateSubscriptionDTO): Promise<{ clientSecret: string }> {
//         let user = await this.userRepository.findById(dto.userId);
//         if (!user) {
//           throw new Error('User not found');
//         }
//         if (!user.stripeCustomerId) {
//           const customer = await this.stripeService.createCustomer(dto.userId, dto.paymentMethodId);
//           user.stripeCustomerId = customer.id;
//         }
//         const subscription = await this.stripeService.createSubscription(user.stripeCustomerId!);
//         user.subscriptionId = subscription.id;
//         user.subscriptionStatus = subscription.status as User['subscriptionStatus'];
//         await this.userRepository.update(user.id!, {
//           stripeCustomerId: user.stripeCustomerId,
//           subscriptionId: user.subscriptionId,
//           subscriptionStatus: user.subscriptionStatus,
//         });
//         const latestInvoice = subscription.latest_invoice;
//         if (typeof latestInvoice === 'string' || !latestInvoice?.payment_intent) {
//           throw new Error('Payment intent not available');
//         }
//         const clientSecret = (latestInvoice.payment_intent as { client_secret: string }).client_secret;
//         if (!clientSecret) {
//           throw new Error('Client secret not found in payment intent');
//         }
//         return { clientSecret };
//       }
//     }
