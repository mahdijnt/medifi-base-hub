/**
 * Lazy environment accessors for wallet analytics.
 *
 * Validation runs only when a getter is called — not at module import —
 * so `npm run build` succeeds without `.env.local` while analytics clients
 * are unused.
 *
 * BASESCAN_API_KEY is server-only (no NEXT_PUBLIC_ prefix). In this static
 * export app it is not available in the browser; use it only from server-side
 * or build-time code paths. NEXT_PUBLIC_ALCHEMY_API_KEY may be used client-side.
 */

const ENV_KEYS = {
  alchemy: "NEXT_PUBLIC_ALCHEMY_API_KEY",
  basescan: "BASESCAN_API_KEY",
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

/**
 * Server-only secret. Throws in environments where the key is unset.
 * Not available in the browser for this static-export site.
 */
export function getBasescanApiKey(): string {
  const key = process.env.BASESCAN_API_KEY?.trim();
  if (!key) {
    throw missingKeyError(ENV_KEYS.basescan);
  }
  return key;
}
