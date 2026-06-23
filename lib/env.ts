/**
 * Lazy environment accessors for wallet analytics.
 *
 * Validation runs only when a getter is called — not at module import —
 * so `npm run build` succeeds without `.env.local` while analytics clients
 * are unused.
 *
 * NEXT_PUBLIC_ALCHEMY_API_KEY and NEXT_PUBLIC_BASESCAN_API_KEY may be used
 * client-side (static export / GitHub Pages). Exposing API keys in the browser
 * is acceptable for read-only analytics but allows quota abuse — restrict keys
 * by domain where the provider supports it.
 *
 * BASESCAN_API_KEY is a server-only fallback for future API routes or SSR.
 */

const ENV_KEYS = {
  alchemy: "NEXT_PUBLIC_ALCHEMY_API_KEY",
  basescanPublic: "NEXT_PUBLIC_BASESCAN_API_KEY",
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
  return Boolean(
    process.env.NEXT_PUBLIC_BASESCAN_API_KEY?.trim() ||
      process.env.BASESCAN_API_KEY?.trim(),
  );
}

export function getAlchemyApiKey(): string {
  const key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.trim();
  if (!key) {
    throw missingKeyError(ENV_KEYS.alchemy);
  }
  return key;
}

/**
 * Prefers NEXT_PUBLIC_BASESCAN_API_KEY (client dashboard) and falls back to
 * BASESCAN_API_KEY for server-side use.
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
