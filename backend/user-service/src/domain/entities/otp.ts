export class OTP {
    constructor(
        public readonly email: string,
        public readonly otp: string,
        public readonly expiryTime: Date = new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
        public readonly lastSentAt: Date = new Date()
    ) {}

    isExpired(): boolean {
        return this.expiryTime.getTime() < Date.now();
    }

    canResend(cooldownPeriod: number): boolean {
        const secondsSinceLastSent = (Date.now() - this.lastSentAt.getTime()) / 1000;
        return secondsSinceLastSent >= cooldownPeriod;
    }
} 