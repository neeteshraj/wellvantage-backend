/**
 * @fileoverview Use case for refreshing access tokens.
 * @module auth/application/usecases/refresh-token
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from '../../infrastructure/services/jwt.service';

/**
 * Input DTO for the RefreshToken use case.
 */
export interface RefreshTokenInput {
  /** JWT refresh token */
  refreshToken: string;
}

/**
 * Output DTO for the RefreshToken use case.
 * Implements refresh token rotation - returns both new access and refresh tokens.
 */
export interface RefreshTokenOutput {
  /** New JWT access token */
  accessToken: string;
  /** New JWT refresh token (rotation) */
  refreshToken: string;
}

/**
 * Use case for refreshing expired access tokens.
 * Implements refresh token rotation for enhanced security:
 * - Validates the old refresh token
 * - Generates a new access token
 * - Generates a new refresh token (invalidating the old one)
 *
 * @example
 * ```typescript
 * const result = await refreshTokenUseCase.execute({
 *   refreshToken: 'old-refresh-token',
 * });
 * // Returns: { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' }
 * ```
 */
@Injectable()
export class RefreshTokenUseCase {
  /**
   * Creates a new RefreshTokenUseCase instance.
   *
   * @param jwtService - Service for JWT token operations
   */
  constructor(private readonly jwtService: JwtAuthService) {}

  /**
   * Executes the token refresh flow with rotation.
   *
   * @param input - Contains the refresh token
   * @returns New access token and new refresh token
   * @throws {UnauthorizedException} If refresh token is invalid or expired
   */
  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    try {
      const tokens = await this.jwtService.refreshTokens(input.refreshToken);
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
