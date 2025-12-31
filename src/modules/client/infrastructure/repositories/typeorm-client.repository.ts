/**
 * @fileoverview TypeORM implementation of the client repository.
 * @module client/infrastructure/repositories/typeorm-client
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../domain/entities/client.entity';
import { IClientRepository, CreateClientData, UpdateClientData } from '../../domain/repositories/client.repository';
import { ClientOrmEntity } from '../entities/client.orm-entity';

/**
 * TypeORM implementation of the client repository.
 * Handles database operations for clients using TypeORM.
 */
@Injectable()
export class TypeOrmClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repository: Repository<ClientOrmEntity>,
  ) {}

  /**
   * Maps a TypeORM entity to a domain entity.
   */
  private toDomain(orm: ClientOrmEntity): Client {
    return new Client(
      orm.id,
      orm.trainerId,
      orm.name,
      orm.email,
      orm.phone ?? null,
      orm.sessionsTotal,
      orm.sessionsUsed,
      orm.packageExpiryDate,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  async findById(id: string): Promise<Client | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByTrainerId(trainerId: string): Promise<Client[]> {
    const entities = await this.repository.find({
      where: { trainerId },
      order: { name: 'ASC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async findByEmailAndTrainer(email: string, trainerId: string): Promise<Client | null> {
    const entity = await this.repository.findOne({
      where: { email, trainerId },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async create(data: CreateClientData): Promise<Client> {
    const entity = this.repository.create({
      trainerId: data.trainerId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      sessionsTotal: data.sessionsTotal,
      sessionsUsed: 0,
      packageExpiryDate: data.packageExpiryDate,
    });
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async update(id: string, data: UpdateClientData): Promise<Client> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async incrementSessionsUsed(id: string): Promise<Client> {
    await this.repository.increment({ id }, 'sessionsUsed', 1);
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return this.toDomain(updated);
  }
}
