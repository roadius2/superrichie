// Simple in-memory database for demo purposes
// In production, replace with a real database like PostgreSQL, MongoDB, etc.

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface MagicLinkToken {
  token: string;
  email: string;
  expiresAt: Date;
  used: boolean;
}

// In-memory storage (will reset on server restart)
const users: Map<string, User> = new Map();
const tokens: Map<string, MagicLinkToken> = new Map();

export const db = {
  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  },

  async createUser(email: string): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      email,
      createdAt: new Date(),
    };
    users.set(user.id, user);
    return user;
  },

  async updateUserLastLogin(email: string): Promise<void> {
    for (const user of users.values()) {
      if (user.email === email) {
        user.lastLogin = new Date();
        break;
      }
    }
  },

  // Token operations
  async createMagicLinkToken(email: string): Promise<string> {
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    tokens.set(token, {
      token,
      email,
      expiresAt,
      used: false,
    });

    return token;
  },

  async verifyMagicLinkToken(token: string): Promise<string | null> {
    const magicLink = tokens.get(token);

    if (!magicLink) {
      return null;
    }

    if (magicLink.used) {
      return null;
    }

    if (new Date() > magicLink.expiresAt) {
      return null;
    }

    // Mark token as used
    magicLink.used = true;
    tokens.set(token, magicLink);

    return magicLink.email;
  },

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<User[]> {
    return Array.from(users.values());
  },
};
