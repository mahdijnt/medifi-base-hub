import "server-only";

/**
 * Server-only environment accessors for secrets that must never be inlined
 * into client bundles (Next.js inlines any `process.env.NEXT_PUBLIC_*`
 * reference found in client-reachable code).
 *
 * NEXT_PUBLIC_BASESCAN_API_KEY / NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN keep
 * their historical names but are only ever read here, server-side, via
 * `/api/*` route handlers.
 */

const ENV_KEYS = {
  basescanPublic: "NEXT_PUBLIC_BASESCAN_API_KEY",
  basescanServer: "BASESCAN_API_KEY",
  blockscoutPro: "BLOCKSCOUT_PRO_API_KEY",
  githubPublic: "NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN",
  githubServer: "GITHUB_PERSONAL_ACCESS_TOKEN",
} as const;

function missingKeyError(key: string): Error {
  return new Error(
    `Missing required environment variable "${key}". ` +
      `Copy .env.example to .env.local and set the value before using analytics clients.`,
  );
}

export function hasBasescanApiKey(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_BASESCAN_API_KEY?.trim() ||
      process.env.BASESCAN_API_KEY?.trim(),
  );
}

/**
 * Etherscan API V2 key for Base mainnet (chainid 8453).
 * Prefers NEXT_PUBLIC_BASESCAN_API_KEY; falls back to BASESCAN_API_KEY.
 */
export function getBasescanApiKey(): string {
  const publicKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY?.trim();
  if (publicKey) {
    return publicKey;
  }

  const serverKey = process.env.BASESCAN_API_KEY?.trim();
  if (serverKey) {
    return serverKey;
  }

  throw missingKeyError(
    `${ENV_KEYS.basescanPublic} (or ${ENV_KEYS.basescanServer})`,
  );
}

/**
 * Prefers NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN and falls back to
 * GITHUB_PERSONAL_ACCESS_TOKEN. Read server-side only.
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

export function hasBlockscoutApiKey(): boolean {
  return Boolean(process.env.BLOCKSCOUT_PRO_API_KEY?.trim());
}

/** Blockscout PRO API key — server-only, never exposed to the client. */
export function getBlockscoutApiKey(): string {
  const key = process.env.BLOCKSCOUT_PRO_API_KEY?.trim();
  if (key) {
    return key;
  }

  throw missingKeyError(ENV_KEYS.blockscoutPro);
}
