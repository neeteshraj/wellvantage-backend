/**
 * @fileoverview Client domain entity representing a trainer's client.
 * @module client/domain/entities/client
 */

/**
 * Domain entity representing a client (member/trainee).
 * Clients are associated with trainers and have session packages.
 */
export class Client {
  constructor(
    public readonly id: string,
    public readonly trainerId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly sessionsTotal: number,
    public readonly sessionsUsed: number,
    public readonly packageExpiryDate: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Get the number of sessions remaining.
   */
  get sessionsRemaining(): number {
    return Math.max(0, this.sessionsTotal - this.sessionsUsed);
  }

  /**
   * Check if the client's package has expired.
   */
  get isExpired(): boolean {
    return new Date() > this.packageExpiryDate;
  }

  /**
   * Check if the client has sessions available.
   */
  get hasAvailableSessions(): boolean {
    return this.sessionsRemaining > 0 && !this.isExpired;
  }
}
