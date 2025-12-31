/**
 * @fileoverview HTTP controller for client management endpoints.
 * @module client/presentation/client-controller
 */

import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { CreateClientUseCase } from '../application/usecases/create-client.usecase';
import { DeleteClientUseCase } from '../application/usecases/delete-client.usecase';
import { GetClientsUseCase } from '../application/usecases/get-clients.usecase';
import { CreateClientDto } from './dto/create-client.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

/**
 * REST controller handling client management HTTP requests.
 * Delegates business logic to application layer use cases.
 * All routes are protected by JWT authentication.
 *
 * @route /clients
 */
@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(
    private readonly getClientsUseCase: GetClientsUseCase,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase,
  ) {}

  /**
   * Retrieves all clients for the authenticated trainer.
   *
   * @route GET /clients
   * @param req - The authenticated request containing user info
   * @returns Success response with list of clients
   *
   * @example
   * GET /clients
   * Authorization: Bearer <access-token>
   */
  @Get()
  async getClients(@Req() req: AuthenticatedRequest) {
    const result = await this.getClientsUseCase.execute({
      trainerId: req.user.id,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Creates a new client for the authenticated trainer.
   *
   * @route POST /clients
   * @param req - The authenticated request containing user info
   * @param dto - The client creation data
   * @returns Success response with created client
   *
   * @example
   * POST /clients
   * {
   *   "name": "John Doe",
   *   "email": "john@example.com",
   *   "phone": "+1234567890",
   *   "sessionsTotal": 20,
   *   "packageExpiryDate": "2026-06-24"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClient(@Req() req: AuthenticatedRequest, @Body() dto: CreateClientDto) {
    const result = await this.createClientUseCase.execute({
      trainerId: req.user.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      sessionsTotal: dto.sessionsTotal,
      packageExpiryDate: dto.packageExpiryDate,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * Deletes a client by ID.
   *
   * @route DELETE /clients/:id
   * @param req - The authenticated request containing user info
   * @param id - The client ID to delete
   * @returns Success response
   *
   * @example
   * DELETE /clients/123e4567-e89b-12d3-a456-426614174000
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteClient(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.deleteClientUseCase.execute({
      clientId: id,
      trainerId: req.user.id,
    });

    return {
      success: true,
      message: 'Client deleted successfully',
    };
  }
}
