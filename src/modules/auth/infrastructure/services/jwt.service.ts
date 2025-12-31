/**
 * @fileoverview Service for JWT token generation and validation.
 * @module auth/infrastructure/services/jwt
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';

/** Default token expiry times in seconds */
const DEFAULT_EXPIRY = {
  ACCESS: 900, // 15 minutes
  REFRESH: 604800, // 7 days
};

/**
 * JWT token pair for authentication.
 */
export interface TokenPair {
  /** Short-lived access token */
  accessToken: string;
  /** Long-lived refresh token */
  refreshToken: string;
}

/**
 * JWT payload structure for signing.
 */
export interface JwtPayload {
  /** User ID (subject) */
  sub: string;
  /** User email */
  email: string;
  /** Token type: 'access' | 'refresh' */
  type: 'access' | 'refresh';
}

/**
 * Converts a time string (e.g., "15m", "7d") to seconds.
 */
function parseTimeToSeconds(time: string, defaultValue: number = DEFAULT_EXPIRY.ACCESS): number {
  const match = time.match(/^(\d+)([smhd])$/);
  if (!match) return defaultValue;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return defaultValue;
  }
}

/**
 * Service for generating and validating JWT tokens.
 * Handles both access tokens (short-lived) and refresh tokens (long-lived).
 */
@Injectable()
export class JwtAuthService {
  private readonly accessExpirySeconds: number;
  private readonly refreshExpirySeconds: number;

  /**
   * Creates a new JwtAuthService instance.
   *
   * @param jwtService - NestJS JWT service
   * @param configService - NestJS ConfigService for accessing environment variables
   */
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    const accessExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m');
    const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY', '7d');
    this.accessExpirySeconds = parseTimeToSeconds(accessExpiry, DEFAULT_EXPIRY.ACCESS);
    this.refreshExpirySeconds = parseTimeToSeconds(refreshExpiry, DEFAULT_EXPIRY.REFRESH);
  }

  /**
   * Generates a token pair (access + refresh) for a user.
   *
   * @param user - The authenticated user
   * @returns Token pair containing access and refresh tokens
   */
  async generateTokens(user: User): Promise<TokenPair> {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      type: 'access' as const,
    };

    const refreshPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh' as const,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: this.accessExpirySeconds,
      }),
      this.jwtService.signAsync(refreshPayload, {
        expiresIn: this.refreshExpirySeconds,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Generates new token pair (access + refresh) using a refresh token.
   * Implements refresh token rotation for enhanced security.
   * The old refresh token is implicitly invalidated by issuing a new one.
   *
   * @param refreshToken - The refresh token
   * @returns New token pair (access token + new refresh token)
   * @throws If refresh token is invalid or expired
   */
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const accessPayload = {
      sub: payload.sub,
      email: payload.email,
      type: 'access' as const,
    };

    const newRefreshPayload = {
      sub: payload.sub,
      email: payload.email,
      type: 'refresh' as const,
    };

    const [accessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: this.accessExpirySeconds,
      }),
      this.jwtService.signAsync(newRefreshPayload, {
        expiresIn: this.refreshExpirySeconds,
      }),
    ]);

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Verifies an access token and returns the payload.
   *
   * @param token - The access token to verify
   * @returns The JWT payload
   * @throws If token is invalid or expired
   */
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

    if (payload.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return payload;
  }
}
