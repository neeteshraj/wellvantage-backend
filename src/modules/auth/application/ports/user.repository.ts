/**
 * @fileoverview Repository interface for user persistence.
 * @module auth/application/ports/user-repository
 */

import { User } from '../../domain/entities/user.entity';

/**
 * Repository interface defining the contract for user persistence.
 * Infrastructure layer provides concrete implementations (e.g., TypeORM).
 * This follows the Dependency Inversion Principle of Clean Architecture.
 */
export interface UserRepository {
  /**
   * Persists a user (create or update).
   *
   * @param user - The user to save
   * @returns The saved user
   */
  save(user: User): Promise<User>;

  /**
   * Finds a user by their Google ID.
   *
   * @param googleId - The user's Google OAuth ID
   * @returns The user if found, null otherwise
   */
  findByGoogleId(googleId: string): Promise<User | null>;

  /**
   * Finds a user by their email address.
   *
   * @param email - The user's email address
   * @returns The user if found, null otherwise
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by their unique identifier.
   *
   * @param id - The user's UUID
   * @returns The user if found, null otherwise
   */
  findById(id: string): Promise<User | null>;
}

/**
 * Dependency injection token for UserRepository.
 * Use this symbol when injecting the repository in NestJS providers.
 *
 * @example
 * ```typescript
 * constructor(
 *   @Inject(USER_REPOSITORY)
 *   private readonly userRepository: UserRepository,
 * ) {}
 * ```
 */
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
