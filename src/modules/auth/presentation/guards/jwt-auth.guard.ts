/**
 * @fileoverview JWT authentication guard for protecting routes.
 * @module auth/presentation/guards/jwt-auth
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthService } from '../../infrastructure/services/jwt.service';

/**
 * Guard that protects routes by validating JWT access tokens.
 * Extracts the token from the Authorization header (Bearer scheme).
 * Attaches the decoded user payload to the request object.
 *
 * @example
 * ```typescript
 * @Get('protected')
 * @UseGuards(JwtAuthGuard)
 * async protectedRoute(@Request() req) {
 *   return req.user; // { id: '...', email: '...' }
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  /**
   * Creates a new JwtAuthGuard instance.
   *
   * @param jwtService - Service for JWT token validation
   */
  constructor(private readonly jwtService: JwtAuthService) {}

  /**
   * Validates the JWT token and allows/denies access.
   *
   * @param context - Execution context containing the request
   * @returns True if token is valid, throws otherwise
   * @throws {UnauthorizedException} If token is missing, invalid, or expired
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    try {
      const payload = await this.jwtService.verifyAccessToken(token);

      // Attach user info to request
      (request as Request & { user: { id: string; email: string } }).user = {
        id: payload.sub,
        email: payload.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  /**
   * Extracts the JWT token from the Authorization header.
   *
   * @param request - The incoming HTTP request
   * @returns The token string or undefined if not present
   * @private
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
