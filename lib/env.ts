/**
 * Lazy environment accessors for wallet analytics.
 *
 * Validation runs only when a getter is called — not at module import —
 * so `npm run build` succeeds without `.env.local` while analytics clients
 * are unused.
 *
 * Only NEXT_PUBLIC_ALCHEMY_API_KEY lives here: it is intentionally
 * client-reachable (transaction analytics calls Alchemy JSON-RPC from the
 * browser). The Basescan key and GitHub PAT are server-only — see
 * lib/env.server.ts — so they are never inlined into client bundles.
 */

const ALCHEMY_ENV_KEY = "NEXT_PUBLIC_ALCHEMY_API_KEY";

function missingKeyError(key: string): Error {
  return new Error(
    `Missing required environment variable "${key}". ` +
      `Copy .env.example to .env.local and set the value before using analytics clients.`,
  );
}

export function hasAlchemyApiKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.trim());
}

export function getAlchemyApiKey(): string {
  const key = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.trim();
  if (!key) {
    throw missingKeyError(ALCHEMY_ENV_KEY);
  }
  return key;
}
