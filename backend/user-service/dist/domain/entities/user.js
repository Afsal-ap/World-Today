"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(user) {
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
    validate() {
        if (this.password) {
            return (this.email.includes('@') &&
                this.password.length >= 8 &&
                this.name.length > 0 &&
                this.phone.length > 0);
        }
        return (this.email.includes('@') &&
            this.name.length > 0 &&
            this.phone.length > 0);
    }
    // Optional: Add a method to check subscription status
    isSubscribed() {
        return this.subscriptionStatus === 'active';
    }
}
exports.User = User;
