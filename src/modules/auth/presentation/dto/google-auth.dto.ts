/**
 * @fileoverview DTO for Google authentication requests.
 * @module auth/presentation/dto/google-auth
 */

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Request DTO for Google OAuth authentication.
 */
export class GoogleAuthDto {
  /**
   * Google ID token from the mobile client.
   * Obtained from GoogleSignin.signIn() in React Native.
   */
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
