import { NullExpression } from "mongoose";

export interface IUser {
    id?: string;
    email: string;
    password?: string;
    name: string;
    phone: string;
    lastLogin?: Date | null;
    isAdmin?: boolean;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    stripeCustomerId?: string; // Stripe customer ID for payment
    subscriptionId?: string;   // Stripe subscription ID
    subscriptionStatus?: 'active' | 'inactive' | 'pending' | 'canceled'; // Subscription state
}

export class User implements IUser {
    id?: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    lastLogin?: Date | null;
    isAdmin: boolean;
    isBlocked: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    stripeCustomerId?: string;
    subscriptionId?: string;
    subscriptionStatus: 'active' | 'inactive' | 'pending' | 'canceled';

    constructor(user: IUser) {
        this.id = user.id;
        this.email = user.email;
        this.password = user.password || '';
        this.name = user.name;
        this.phone = user.phone;
        this.lastLogin = user.lastLogin || null; 
        this.isAdmin = Boolean(user.isAdmin);
        this.isBlocked = Boolean(user.isBlocked);
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
        this.stripeCustomerId = user.stripeCustomerId;
        this.subscriptionId = user.subscriptionId;
        this.subscriptionStatus = user.subscriptionStatus || 'inactive'; // Default to 'inactive'
    }

    validate(): boolean {
        if (this.password) {
            return (
                this.email.includes('@') &&
                this.password.length >= 8 &&
                this.name.length > 0 &&
                this.phone.length > 0
            );
        }
        return (
            this.email.includes('@') &&
            this.name.length > 0 &&
            this.phone.length > 0
        );
    }

    // Optional: Add a method to check subscription status
    isSubscribed(): boolean {
        return this.subscriptionStatus === 'active';
    }
}