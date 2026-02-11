// Mosaic Platform API client for SuperRichie
// Provides PostgreSQL, S3, Redis, auth, and deployment

const MOSAIC_API_BASE = "https://api.mosaic.site/v1/project";

function getApiKey(): string | undefined {
  const key = process.env.MOSAIC_API_KEY;
  if (!key) {
    console.warn("MOSAIC_API_KEY not set - Mosaic features will not work");
  }
  return key;
}

interface MosaicResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function mosaicFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<MosaicResponse<T>> {
  const API_KEY = getApiKey();
  if (!API_KEY) {
    return { ok: false, error: "MOSAIC_API_KEY not configured" };
  }

  try {
    const response = await fetch(`${MOSAIC_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return { ok: false, error };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Project Management
export async function createProject(name: string, slug?: string) {
  return mosaicFetch("/projects", {
    method: "POST",
    body: JSON.stringify({ name, slug }),
  });
}

export async function listProjects() {
  return mosaicFetch("/projects");
}

export async function getProjectInfo(slug: string) {
  return mosaicFetch(`/${slug}/info`);
}

export async function getProjectCredentials(slug: string) {
  return mosaicFetch(`/${slug}/credentials`);
}

// SQL Operations
export async function executeSQL(
  slug: string,
  query: string,
  params?: any[]
) {
  return mosaicFetch(`/${slug}/sql`, {
    method: "POST",
    body: JSON.stringify({ query, params }),
  });
}

// Database initialization for SuperRichie
export async function initializeDatabase(slug: string) {
  // Create users table
  const createUsersTable = await executeSQL(
    slug,
    `CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      last_login TIMESTAMP
    )`
  );

  if (!createUsersTable.ok) {
    return createUsersTable;
  }

  // Create magic_link_tokens table
  const createTokensTable = await executeSQL(
    slug,
    `CREATE TABLE IF NOT EXISTS magic_link_tokens (
      token UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )`
  );

  return createTokensTable;
}

// User operations
export async function findUserByEmail(slug: string, email: string) {
  const result = await executeSQL(
    slug,
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.ok && result.data?.rows?.length > 0
    ? result.data.rows[0]
    : null;
}

export async function createUser(slug: string, email: string) {
  return executeSQL(
    slug,
    "INSERT INTO users (email) VALUES ($1) RETURNING *",
    [email]
  );
}

export async function updateUserLastLogin(slug: string, email: string) {
  return executeSQL(
    slug,
    "UPDATE users SET last_login = NOW() WHERE email = $1",
    [email]
  );
}

// Magic link token operations
export async function createMagicLinkToken(slug: string, email: string) {
  const result = await executeSQL(
    slug,
    `INSERT INTO magic_link_tokens (email, expires_at)
     VALUES ($1, NOW() + INTERVAL '15 minutes')
     RETURNING token`,
    [email]
  );

  return result.ok && result.data?.rows?.length > 0
    ? result.data.rows[0].token
    : null;
}

export async function verifyMagicLinkToken(slug: string, token: string) {
  // Check if token exists and is valid
  const checkResult = await executeSQL(
    slug,
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
  await executeSQL(
    slug,
    "UPDATE magic_link_tokens SET used = TRUE WHERE token = $1",
    [token]
  );

  return email;
}

// S3 Storage operations
export async function uploadFile(
  slug: string,
  filename: string,
  content: string
) {
  return mosaicFetch(`/${slug}/s3/upload`, {
    method: "POST",
    body: JSON.stringify({ filename, content }),
  });
}

export async function getFileUrl(slug: string, filename: string) {
  return mosaicFetch(`/${slug}/s3/url/${filename}`);
}

// Git/Deploy operations
export async function pushToGit(
  slug: string,
  files: { path: string; content: string }[],
  message: string = "Deploy from API",
  deploy: boolean = true
) {
  // Convert files to base64
  const encodedFiles = files.map((file) => ({
    path: file.path,
    content: Buffer.from(file.content).toString("base64"),
  }));

  return mosaicFetch(`/${slug}/git/files/batch`, {
    method: "POST",
    body: JSON.stringify({
      files: encodedFiles,
      message,
      deploy,
    }),
  });
}

export async function triggerDeploy(slug: string) {
  return mosaicFetch(`/${slug}/deploy/trigger`, {
    method: "POST",
  });
}

export async function getDeployStatus(slug: string) {
  return mosaicFetch(`/${slug}/deploy/status`);
}

// Auth operations (using Mosaic's built-in auth)
export async function signupWithPassword(
  slug: string,
  email: string,
  password: string
) {
  return mosaicFetch(`/${slug}/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginWithPassword(
  slug: string,
  email: string,
  password: string
) {
  return mosaicFetch(`/${slug}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function sendMagicLink(slug: string, email: string) {
  return mosaicFetch(`/${slug}/auth/magic`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export const mosaic = {
  // Projects
  createProject,
  listProjects,
  getProjectInfo,
  getProjectCredentials,

  // Database
  executeSQL,
  initializeDatabase,

  // Users
  findUserByEmail,
  createUser,
  updateUserLastLogin,

  // Magic Links
  createMagicLinkToken,
  verifyMagicLinkToken,

  // S3
  uploadFile,
  getFileUrl,

  // Git/Deploy
  pushToGit,
  triggerDeploy,
  getDeployStatus,

  // Auth
  signupWithPassword,
  loginWithPassword,
  sendMagicLink,
};
