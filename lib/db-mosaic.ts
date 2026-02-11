// Database layer using Mosaic Platform (PostgreSQL)
// This replaces the in-memory db.ts with real database storage

import { mosaic } from "./mosaic";

const PROJECT_SLUG = process.env.MOSAIC_PROJECT_SLUG || "superrichie";

export interface User {
  id: string;
  email: string;
  created_at: Date;
  last_login?: Date;
}

export interface MagicLinkToken {
  token: string;
  email: string;
  expires_at: Date;
  used: boolean;
}

export const db = {
  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    const result = await mosaic.executeSQL(
      PROJECT_SLUG,
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.ok && result.data?.rows?.length > 0) {
      return result.data.rows[0] as User;
    }

    return null;
  },

  async createUser(email: string): Promise<User> {
    const result = await mosaic.executeSQL(
      PROJECT_SLUG,
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [email]
    );

    if (!result.ok || !result.data?.rows?.length) {
      throw new Error("Failed to create user");
    }

    return result.data.rows[0] as User;
  },

  async updateUserLastLogin(email: string): Promise<void> {
    await mosaic.executeSQL(
      PROJECT_SLUG,
      "UPDATE users SET last_login = NOW() WHERE email = $1",
      [email]
    );
  },

  // Token operations
  async createMagicLinkToken(email: string): Promise<string> {
    const result = await mosaic.executeSQL(
      PROJECT_SLUG,
      `INSERT INTO magic_link_tokens (email, expires_at)
       VALUES ($1, NOW() + INTERVAL '15 minutes')
       RETURNING token`,
      [email]
    );

    if (!result.ok || !result.data?.rows?.length) {
      throw new Error("Failed to create magic link token");
    }

    return result.data.rows[0].token;
  },

  async verifyMagicLinkToken(token: string): Promise<string | null> {
    // Check if token exists and is valid
    const checkResult = await mosaic.executeSQL(
      PROJECT_SLUG,
      `SELECT email FROM magic_link_tokens
       WHERE token = $1
       AND used = FALSE
       AND expires_at > NOW()`,
      [token]
    );

    if (!checkResult.ok || !checkResult.data?.rows?.length) {
      return null;
    }

    const email = checkResult.data.rows[0].email;

    // Mark token as used
    await mosaic.executeSQL(
      PROJECT_SLUG,
      "UPDATE magic_link_tokens SET used = TRUE WHERE token = $1",
      [token]
    );

    return email;
  },

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<User[]> {
    const result = await mosaic.executeSQL(
      PROJECT_SLUG,
      "SELECT * FROM users ORDER BY created_at DESC"
    );

    if (result.ok && result.data?.rows) {
      return result.data.rows as User[];
    }

    return [];
  },
};
