/**
 * @fileoverview HTTP controller for authentication endpoints.
 * @module auth/presentation/auth-controller
 */

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { GoogleAuthUseCase } from '../application/usecases/google-auth.usecase';
import { RefreshTokenUseCase } from '../application/usecases/refresh-token.usecase';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * REST controller handling authentication HTTP requests.
 * Delegates business logic to application layer use cases.
 *
 * @route /auth
 */
@Controller('auth')
export class AuthController {
  /**
   * Creates a new AuthController instance.
   *
   * @param googleAuthUseCase - Use case for Google OAuth authentication
   * @param refreshTokenUseCase - Use case for refreshing access tokens
   */
  constructor(
    private readonly googleAuthUseCase: GoogleAuthUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  /**
   * Authenticates a user using Google OAuth.
   * Exchanges a Google ID token for JWT access and refresh tokens.
   *
   * @route POST /auth/google
   * @param dto - Contains the Google ID token
   * @returns Success response with user data and tokens
   *
   * @example
   * POST /auth/google
   * { "idToken": "google-id-token-from-client" }
   */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleAuth(@Body() dto: GoogleAuthDto) {
    const result = await this.googleAuthUseCase.execute({
      idToken: dto.idToken,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Refreshes an expired access token.
   * Uses the refresh token to generate a new access token.
   *
   * @route POST /auth/refresh
   * @param dto - Contains the refresh token
   * @returns Success response with new access token
   *
   * @example
   * POST /auth/refresh
   * { "refreshToken": "refresh-token-from-client" }
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: RefreshTokenDto) {
    const result = await this.refreshTokenUseCase.execute({
      refreshToken: dto.refreshToken,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Gets the current authenticated user's profile.
   * Requires a valid JWT access token in the Authorization header.
   *
   * @route GET /auth/me
   * @returns Success response with user data
   *
   * @example
   * GET /auth/me
   * Authorization: Bearer <access-token>
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: { user: { id: string; email: string } }) {
    return {
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
      },
    };
  }
}
