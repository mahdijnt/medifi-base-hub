/**
 * Lazy environment accessors for wallet analytics.
 *
 * Validation runs only when a getter is called — not at module import —
 * so `npm run build` succeeds without `.env.local` while analytics clients
 * are unused.
 *
 * NEXT_PUBLIC_ALCHEMY_API_KEY may be used client-side (static export).
 *
 * BASESCAN_API_KEY is server-only — contract analytics use `/api/contracts/*`
 * route handlers on Vercel. Do not expose Basescan keys via NEXT_PUBLIC_*.
 */

const ENV_KEYS = {
  alchemy: "NEXT_PUBLIC_ALCHEMY_API_KEY",
  basescanServer: "BASESCAN_API_KEY",
  githubPublic: "NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN",
  githubServer: "GITHUB_PERSONAL_ACCESS_TOKEN",
} as const;

function missingKeyError(key: string): Error {
  return new Error(
    `Missing required environment variable "${key}". ` +
      `Copy .env.example to .env.local and set the value before using analytics clients.`,
  );
}

export function hasAlchemyApiKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.trim());
}

export function hasBasescanApiKey(): boolean {
  return Boolean(process.env.BASESCAN_API_KEY?.trim());
}

export function getAlchemyApiKey(): string {
  const key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.trim();
  if (!key) {
    throw missingKeyError(ENV_KEYS.alchemy);
  }
  return key;
}

/** Server-only Basescan / Etherscan V2 API key (Base mainnet via chainid 8453). */
export function getBasescanApiKey(): string {
  const serverKey = process.env.BASESCAN_API_KEY?.trim();
  if (serverKey) {
    return serverKey;
  }

  throw missingKeyError(ENV_KEYS.basescanServer);
}

/**
 * Prefers NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN (required for static export
 * client fetch) and falls back to GITHUB_PERSONAL_ACCESS_TOKEN for server use.
 */
export function hasGithubToken(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN?.trim() ||
      process.env.GITHUB_PERSONAL_ACCESS_TOKEN?.trim(),
  );
}

export function getGithubToken(): string {
  const publicToken =
    process.env.NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN?.trim();
  if (publicToken) {
    return publicToken;
  }

  const serverToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN?.trim();
  if (serverToken) {
    return serverToken;
  }

  throw missingKeyError(
    `${ENV_KEYS.githubPublic} (or ${ENV_KEYS.githubServer})`,
  );
}
