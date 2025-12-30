/**
 * @fileoverview Service for verifying Google OAuth ID tokens.
 * @module auth/infrastructure/services/google
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

/**
 * Payload returned after successful Google token verification.
 */
export interface GoogleUserPayload {
  /** Google user ID (sub claim) */
  googleId: string;
  /** User's email address */
  email: string;
  /** User's display name */
  name: string;
  /** User's profile picture URL */
  avatar?: string;
}

/**
 * Service for verifying Google OAuth ID tokens.
 * Uses the official google-auth-library to validate tokens.
 */
@Injectable()
export class GoogleService {
  private readonly client: OAuth2Client;
  private readonly clientId: string;

  /**
   * Creates a new GoogleService instance.
   *
   * @param configService - NestJS ConfigService for accessing environment variables
   */
  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID');
    this.client = new OAuth2Client(this.clientId);
  }

  /**
   * Verifies a Google ID token and extracts user information.
   *
   * @param idToken - The ID token from Google Sign-In
   * @returns The verified user payload
   * @throws {UnauthorizedException} If token verification fails
   */
  async verifyIdToken(idToken: string): Promise<GoogleUserPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      const payload: TokenPayload | undefined = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Invalid Google token: no payload');
      }

      if (!payload.sub || !payload.email || !payload.name) {
        throw new UnauthorizedException('Invalid Google token: missing required claims');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify Google token');
    }
  }
}
