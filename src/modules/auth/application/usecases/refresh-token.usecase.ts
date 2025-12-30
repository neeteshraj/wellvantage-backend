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
 */
export interface RefreshTokenOutput {
  /** New JWT access token */
  accessToken: string;
}

/**
 * Use case for refreshing expired access tokens.
 * Validates the refresh token and generates a new access token.
 *
 * @example
 * ```typescript
 * const result = await refreshTokenUseCase.execute({
 *   refreshToken: 'refresh-token-from-client',
 * });
 * // Returns: { accessToken: 'new-access-token' }
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
   * Executes the token refresh flow.
   *
   * @param input - Contains the refresh token
   * @returns New access token
   * @throws {UnauthorizedException} If refresh token is invalid or expired
   */
  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    try {
      const accessToken = await this.jwtService.refreshAccessToken(input.refreshToken);
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
