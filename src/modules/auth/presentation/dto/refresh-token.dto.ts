/**
 * @fileoverview DTO for token refresh requests.
 * @module auth/presentation/dto/refresh-token
 */

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Request DTO for refreshing access tokens.
 */
export class RefreshTokenDto {
  /**
   * JWT refresh token from the client.
   */
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
