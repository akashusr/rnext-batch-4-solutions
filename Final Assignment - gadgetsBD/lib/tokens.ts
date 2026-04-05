import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || process.env.NEXTAUTH_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || process.env.NEXTAUTH_SECRET!;

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

export interface TokenPayload {
    userId: string;
    userType?: string;
    type: 'access' | 'refresh';
}

/**
 * Generate a short-lived access token (15 minutes)
 */
export function generateAccessToken(userId: string, userType?: string): string {
    return jwt.sign(
        { userId, userType, type: 'access' } as TokenPayload,
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
}

/**
 * Generate a long-lived refresh token (7 days)
 */
export function generateRefreshToken(userId: string): string {
    return jwt.sign(
        { userId, type: 'refresh' } as TokenPayload,
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
}

/**
 * Verify and decode an access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}

/**
 * Verify and decode a refresh token
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}

/**
 * Get access token expiry timestamp (15 minutes from now)
 */
export function getAccessTokenExpiry(): number {
    return Date.now() + 15 * 60 * 1000; // 15 minutes in ms
}

/**
 * Get refresh token expiry timestamp (7 days from now)
 */
export function getRefreshTokenExpiry(): number {
    return Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in ms
}
