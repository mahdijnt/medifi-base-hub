import { getAlchemyApiKey } from "@/lib/env";
import type { WalletData } from "@/lib/types/analytics";

/** Alchemy JSON-RPC base URL for Base mainnet (API key appended per request). */
export const ALCHEMY_BASE_URL = "https://base-mainnet.g.alchemy.com/v2/";

function getAlchemyUrl(): string {
  return `${ALCHEMY_BASE_URL}${getAlchemyApiKey()}`;
}

/**
 * Shared request helper for Alchemy JSON-RPC calls.
 * Not implemented — structure only for future onchain analytics.
 */
export async function alchemyRequest<T>(
  method: string,
  params: unknown[] = [],
): Promise<T> {
  void method;
  void params;
  void getAlchemyUrl();
  throw new Error("Alchemy API requests are not implemented yet.");
}

/** Fetch aggregated wallet data for an address. Stub — no network calls yet. */
export async function getWalletData(address: string): Promise<WalletData> {
  void address;
  return Promise.reject(
    new Error("getWalletData is not implemented yet."),
  );
}
