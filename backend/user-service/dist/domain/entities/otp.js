"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
class OTP {
    constructor(phoneNumber, email, otp, expiryTime = new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    lastSentAt = new Date()) {
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.otp = otp;
        this.expiryTime = expiryTime;
        this.lastSentAt = lastSentAt;
    }
    isExpired() {
        return this.expiryTime.getTime() < Date.now();
    }
    canResend(cooldownPeriod) {
        const secondsSinceLastSent = (Date.now() - this.lastSentAt.getTime()) / 1000;
        return secondsSinceLastSent >= cooldownPeriod;
    }
}
exports.OTP = OTP;
