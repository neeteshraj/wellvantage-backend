/**
 * @fileoverview DTO for creating a new client.
 * @module client/presentation/dto/create-client
 */

import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, IsDateString } from 'class-validator';

/**
 * Data transfer object for creating a new client.
 */
export class CreateClientDto {
  /** Client's full name */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  /** Client's email address */
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  /** Client's phone number (optional) */
  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  /** Total sessions in the client's package */
  @IsInt()
  @Min(1)
  sessionsTotal!: number;

  /** Package expiry date in ISO format (YYYY-MM-DD) */
  @IsDateString()
  @IsNotEmpty()
  packageExpiryDate!: string;
}
