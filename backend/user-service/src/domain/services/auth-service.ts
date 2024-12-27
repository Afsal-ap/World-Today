import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export interface IAuthService {
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    generateTokens(userId: string): Promise<AuthTokens>;
    verifyAccessToken(token: string): Promise<any>;
    verifyRefreshToken(token: string): Promise<any>;
    generateAccessTokenFromRefreshToken(refreshToken: string): Promise<string>;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export class AuthService implements IAuthService {
    private readonly SALT_ROUNDS = 10;
    private readonly ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
    private readonly REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
    private readonly ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
    private readonly REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

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

    async generateTokens(userId: string): Promise<AuthTokens> {
        const accessToken = jwt.sign(
            { userId },
            this.ACCESS_TOKEN_SECRET,
            { expiresIn: this.ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { userId },
            this.REFRESH_TOKEN_SECRET,
            { expiresIn: this.REFRESH_TOKEN_EXPIRY }
        );

        return { accessToken, refreshToken };
    }

    async verifyAccessToken(token: string): Promise<any> {
        try {
            return jwt.verify(token, this.ACCESS_TOKEN_SECRET);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    async verifyRefreshToken(token: string): Promise<any> {
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
}
