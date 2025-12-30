/**
 * @fileoverview User domain entity representing an authenticated user.
 * @module auth/domain/entities/user
 */

/**
 * Domain entity representing an authenticated user.
 * This is a pure domain object with no infrastructure dependencies.
 *
 * @example
 * ```typescript
 * const user = User.create({
 *   id: 'uuid',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   googleId: 'google-123',
 *   avatar: 'https://...',
 * });
 * ```
 */
export class User {
  /**
   * Creates a new User instance.
   *
   * @param id - Unique identifier for the user (UUID)
   * @param email - User's email address
   * @param name - User's display name
   * @param googleId - Google OAuth ID
   * @param avatar - Optional avatar URL from Google
   * @param createdAt - Timestamp when the user was created
   * @param updatedAt - Timestamp when the user was last updated
   */
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly googleId: string,
    public readonly avatar?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  /**
   * Factory method to create a new User from Google OAuth data.
   *
   * @param props - User properties from Google OAuth
   * @returns New User instance
   */
  static create(props: { id: string; email: string; name: string; googleId: string; avatar?: string }): User {
    return new User(props.id, props.email, props.name, props.googleId, props.avatar);
  }

  /**
   * Creates a User instance from database record.
   *
   * @param record - Database record
   * @returns User instance
   */
  static fromRecord(record: {
    id: string;
    email: string;
    name: string;
    googleId: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      record.id,
      record.email,
      record.name,
      record.googleId,
      record.avatar,
      record.createdAt,
      record.updatedAt,
    );
  }

  /**
   * Returns a plain object representation for API responses.
   */
  toJSON(): {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  } {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
    };
  }
}
