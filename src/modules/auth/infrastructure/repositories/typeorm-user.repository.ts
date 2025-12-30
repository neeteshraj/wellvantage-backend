/**
 * @fileoverview TypeORM implementation of the UserRepository port.
 * @module auth/infrastructure/repositories/typeorm-user
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../application/ports/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

/**
 * TypeORM-based implementation of the UserRepository interface.
 * Provides PostgreSQL persistence for users using TypeORM.
 * Implements the repository port defined in the application layer.
 *
 * @implements {UserRepository}
 */
@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  /**
   * Creates a new TypeOrmUserRepository instance.
   *
   * @param ormRepository - TypeORM repository for UserOrmEntity
   */
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  /**
   * Persists a user to the database (create or update).
   *
   * @param user - The domain user to save
   * @returns The saved user with generated ID if new
   */
  async save(user: User): Promise<User> {
    const entity = this.toOrmEntity(user);
    const saved = await this.ormRepository.save(entity);
    return this.toDomainEntity(saved);
  }

  /**
   * Finds a user by their Google OAuth ID.
   *
   * @param googleId - The user's Google OAuth ID
   * @returns The user if found, null otherwise
   */
  async findByGoogleId(googleId: string): Promise<User | null> {
    const entity = await this.ormRepository.findOne({ where: { googleId } });
    if (!entity) return null;
    return this.toDomainEntity(entity);
  }

  /**
   * Finds a user by their email address.
   *
   * @param email - The user's email address
   * @returns The user if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepository.findOne({ where: { email } });
    if (!entity) return null;
    return this.toDomainEntity(entity);
  }

  /**
   * Finds a user by their unique identifier.
   *
   * @param id - The user's UUID
   * @returns The user if found, null otherwise
   */
  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomainEntity(entity);
  }

  /**
   * Converts a domain entity to an ORM entity for persistence.
   *
   * @param domain - The domain user
   * @returns The ORM entity representation
   * @private
   */
  private toOrmEntity(domain: User): Partial<UserOrmEntity> {
    return {
      id: domain.id || undefined,
      email: domain.email,
      name: domain.name,
      googleId: domain.googleId,
      avatar: domain.avatar,
    };
  }

  /**
   * Converts an ORM entity to a domain entity.
   *
   * @param orm - The ORM entity from the database
   * @returns The domain user
   * @private
   */
  private toDomainEntity(orm: UserOrmEntity): User {
    return User.fromRecord({
      id: orm.id,
      email: orm.email,
      name: orm.name,
      googleId: orm.googleId,
      avatar: orm.avatar ?? undefined,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
