/**
 * @fileoverview NestJS module for the authentication feature.
 * @module auth/auth-module
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from './application/ports/user.repository';
import { GoogleAuthUseCase } from './application/usecases/google-auth.usecase';
import { RefreshTokenUseCase } from './application/usecases/refresh-token.usecase';
import { UserOrmEntity } from './infrastructure/entities/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/typeorm-user.repository';
import { GoogleService } from './infrastructure/services/google.service';
import { JwtAuthService } from './infrastructure/services/jwt.service';
import { AuthController } from './presentation/auth.controller';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';

/**
 * NestJS module that wires together all authentication feature components.
 * Follows Clean Architecture principles with proper layer separation.
 *
 * Layer Structure:
 * - Presentation: AuthController handles HTTP requests
 * - Application: Use cases contain business logic orchestration
 * - Domain: User entity (framework-agnostic)
 * - Infrastructure: TypeORM repository, Google & JWT services
 *
 * Dependency Injection:
 * - Uses symbols as injection tokens for repositories
 * - Application layer depends on interfaces (ports)
 * - Infrastructure layer provides concrete implementations
 *
 * @example
 * ```typescript
 * // Import in AppModule
 * import { AuthModule } from './modules/auth/auth.module';
 *
 * @Module({
 *   imports: [AuthModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          issuer: 'wellvantage',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use cases
    GoogleAuthUseCase,
    RefreshTokenUseCase,
    // Infrastructure services
    GoogleService,
    JwtAuthService,
    JwtAuthGuard,
    // Repository
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [JwtAuthGuard, JwtAuthService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthModule {}
