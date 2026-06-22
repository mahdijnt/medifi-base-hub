import { getBasescanApiKey } from "@/lib/env";
import type { Transaction } from "@/lib/types/analytics";

/**
 * BaseScan REST API base URL for Base mainnet.
 * @see https://docs.basescan.org/
 */
export const BASESCAN_API_URL = "https://api.basescan.org/api";

function assertServerContext(): void {
  if (typeof window !== "undefined") {
    throw new Error(
      "BaseScan client is server-only. BASESCAN_API_KEY is not available in the browser.",
    );
  }
}

/**
 * Shared request helper for BaseScan REST calls.
 * Not implemented — structure only for future onchain analytics.
 */
export async function basescanRequest<T>(
  params: Record<string, string>,
): Promise<T> {
  void params;
  assertServerContext();
  void getBasescanApiKey();
  void BASESCAN_API_URL;
  throw new Error("BaseScan API requests are not implemented yet.");
}

/** Fetch transactions for an address. Stub — no network calls yet. */
export async function getTransactions(address: string): Promise<Transaction[]> {
  void address;
  return Promise.reject(
    new Error("getTransactions is not implemented yet."),
  );
}
