import { Request, Response } from 'express';
import { CreateSubscriptionUseCase } from '../../application/use-cases/CreateSubscriptionUseCase';
import { GetSubscriptionStatusUseCase } from '../../application/use-cases/GetSubscriptionStatusUseCase';
import { UserRepositoryImpl } from '../../infrastructure/repositories/user-repository-impl';
import { StripeService } from '../../infrastructure/payment/StripeService';

const userRepository = new UserRepositoryImpl();
const stripeService = new StripeService();
const createSubscriptionUseCase = new CreateSubscriptionUseCase(userRepository, stripeService);
const getSubscriptionStatusUseCase = new GetSubscriptionStatusUseCase(userRepository, stripeService);

export class SubscriptionController {
    static async createSubscription(req: Request, res: Response) {
        try {
            const { userId, paymentMethodId } = req.body;

            console.log(userId,"body too")
            const result = await createSubscriptionUseCase.execute({ userId, paymentMethodId });
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getSubscriptionStatus(req: Request, res: Response) {
        try {
            const email = req.query.email as string; // Assume email from auth middleware or query
            if (!email) throw new Error('Email required');
            const isSubscribed = await getSubscriptionStatusUseCase.execute(email);
            res.json({ isSubscribed });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}