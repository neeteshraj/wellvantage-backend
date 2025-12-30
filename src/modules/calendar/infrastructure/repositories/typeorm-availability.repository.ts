/**
 * @fileoverview TypeORM implementation of the AvailabilityRepository port.
 * @module calendar/infrastructure/repositories/typeorm-availability
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { AvailabilityRepository } from '../../application/ports/availability.repository';
import { AvailabilityBlock } from '../../domain/entities/availability-block.entity';
import { AvailabilityBlockOrmEntity } from '../entities/availability-block.orm-entity';

/**
 * TypeORM-based implementation of the AvailabilityRepository interface.
 * Provides PostgreSQL persistence for availability blocks using TypeORM.
 * Implements the repository port defined in the application layer.
 *
 * @implements {AvailabilityRepository}
 */
@Injectable()
export class TypeOrmAvailabilityRepository implements AvailabilityRepository {
  /**
   * Creates a new TypeOrmAvailabilityRepository instance.
   *
   * @param ormRepository - TypeORM repository for AvailabilityBlockOrmEntity
   */
  constructor(
    @InjectRepository(AvailabilityBlockOrmEntity)
    private readonly ormRepository: Repository<AvailabilityBlockOrmEntity>,
  ) {}

  /**
   * Persists an availability block to the database.
   *
   * @param block - The domain availability block to save
   * @returns The saved availability block
   */
  async save(block: AvailabilityBlock): Promise<AvailabilityBlock> {
    const entity = this.toOrmEntity(block);
    await this.ormRepository.save(entity);
    return block;
  }

  /**
   * Finds all availability blocks for a trainer on a specific date.
   *
   * @param trainerId - The trainer's unique identifier
   * @param date - Date in "YYYY-MM-DD" format
   * @returns Array of availability blocks, sorted by start time
   */
  async findByTrainerAndDate(trainerId: string, date: string): Promise<AvailabilityBlock[]> {
    const entities = await this.ormRepository.find({
      where: { trainerId, date },
      order: { startTime: 'ASC' },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Finds all availability blocks for a trainer within a date range.
   *
   * @param trainerId - The trainer's unique identifier
   * @param fromDate - Start date in "YYYY-MM-DD" format (inclusive)
   * @param toDate - End date in "YYYY-MM-DD" format (inclusive)
   * @returns Array of availability blocks, sorted by date and start time
   */
  async findByTrainerAndDateRange(trainerId: string, fromDate: string, toDate: string): Promise<AvailabilityBlock[]> {
    const entities = await this.ormRepository.find({
      where: {
        trainerId,
        date: Between(fromDate, toDate),
      },
      order: { date: 'ASC', startTime: 'ASC' },
    });
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  /**
   * Finds a specific availability block by its unique identifier.
   *
   * @param id - The availability block's unique identifier
   * @returns The availability block if found, null otherwise
   */
  async findById(id: string): Promise<AvailabilityBlock | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomainEntity(entity);
  }

  /**
   * Deletes an availability block from the database.
   *
   * @param id - The availability block's unique identifier
   */
  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  /**
   * Converts a domain entity to an ORM entity for persistence.
   *
   * @param domain - The domain availability block
   * @returns The ORM entity representation
   * @private
   */
  private toOrmEntity(domain: AvailabilityBlock): AvailabilityBlockOrmEntity {
    const entity = new AvailabilityBlockOrmEntity();
    entity.id = domain.id;
    entity.trainerId = domain.trainerId;
    entity.date = domain.date;
    entity.startTime = domain.startTime;
    entity.endTime = domain.endTime;
    return entity;
  }

  /**
   * Converts an ORM entity to a domain entity.
   *
   * @param orm - The ORM entity from the database
   * @returns The domain availability block
   * @private
   */
  private toDomainEntity(orm: AvailabilityBlockOrmEntity): AvailabilityBlock {
    return AvailabilityBlock.create(orm.id, orm.trainerId, orm.date, orm.startTime, orm.endTime);
  }
}
