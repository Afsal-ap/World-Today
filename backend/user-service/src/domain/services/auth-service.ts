import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface IAuthService {
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    verifyAccessToken(token: string): Promise<any>;
    verifyRefreshToken(token: string): Promise<any>;
    generateAccessTokenFromRefreshToken(refreshToken: string): Promise<string>;
    getUserByPhoneNumber(phoneNumber: string): Promise<any>;
    generateTokens(user: any): Promise<AuthTokens>;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export class AuthService implements IAuthService {
    private readonly SALT_ROUNDS = 10;
    private readonly ACCESS_TOKEN_SECRET: string;
    private readonly REFRESH_TOKEN_SECRET: string;
    private readonly ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
    private readonly REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

    constructor() {
        // Initialize secrets in constructor
        const accessSecret = process.env.JWT_SECRET;
        const refreshSecret = process.env.JWT_REFRESH_SECRET;

        if (!accessSecret || !refreshSecret) {
            throw new Error('JWT secrets not configured properly');
        }

        this.ACCESS_TOKEN_SECRET = accessSecret;
        this.REFRESH_TOKEN_SECRET = refreshSecret;
        
        console.log('Auth service initialized with secrets');
    }

    async hashPassword(password: string): Promise<string> {
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
        return hashedPassword;
    }  
              
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        console.log('Comparing passwords...');
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            console.log('Password comparison result:', isMatch);
            return isMatch;
        } catch (error) {
            console.error('Password comparison error:', error);
            return false;
        }
    }

    async generateTokens(user: any): Promise<AuthTokens> {
        if (!this.ACCESS_TOKEN_SECRET) {
            throw new Error('JWT secrets not configured');
        }

        // Handle both user object and userId string
        const userId = typeof user === 'string' ? user : user._id;
        const email = typeof user === 'string' ? undefined : user.email;

        const accessToken = jwt.sign(
            { userId, email },
            this.ACCESS_TOKEN_SECRET,
            { expiresIn: this.ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { userId, email },
            this.REFRESH_TOKEN_SECRET,
            { expiresIn: this.REFRESH_TOKEN_EXPIRY }
        );

        return { accessToken, refreshToken };
    }

    async verifyAccessToken(token: string): Promise<any> {
        if (!this.ACCESS_TOKEN_SECRET) {
            throw new Error('Access token secret not configured');
        }
        try {
            return jwt.verify(token, this.ACCESS_TOKEN_SECRET);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    async verifyRefreshToken(token: string): Promise<any> {
        if (!this.REFRESH_TOKEN_SECRET) {
            throw new Error('Refresh token secret not configured');
        }
        try {
            return jwt.verify(token, this.REFRESH_TOKEN_SECRET);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async generateAccessTokenFromRefreshToken(refreshToken: string): Promise<string> {
        try {
            const decoded = await this.verifyRefreshToken(refreshToken);
            const accessToken = jwt.sign(
                { userId: decoded.userId },
                this.ACCESS_TOKEN_SECRET,
                { expiresIn: this.ACCESS_TOKEN_EXPIRY }
            );
            return accessToken;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async getUserByPhoneNumber(phoneNumber: string): Promise<any> {
        // Implement this method to fetch user by phone number
        // You'll need to inject the user repository
        // Example:
        // return this.userRepository.findByPhoneNumber(phoneNumber);
        throw new Error('Method not implemented');
    }
}
