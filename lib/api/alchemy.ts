import { getAlchemyApiKey } from "@/lib/env";
import type { WalletData } from "@/lib/types/analytics";

/** Alchemy JSON-RPC base URL for Base mainnet (API key appended per request). */
export const ALCHEMY_BASE_URL = "https://base-mainnet.g.alchemy.com/v2/";

function getAlchemyUrl(): string {
  return `${ALCHEMY_BASE_URL}${getAlchemyApiKey()}`;
}

type JsonRpcError = {
  code?: number;
  message?: string;
};

type JsonRpcResponse<T> = {
  result?: T;
  error?: JsonRpcError;
};

/**
 * Shared request helper for Alchemy JSON-RPC calls.
 */
export async function alchemyRequest<T>(
  method: string,
  params: unknown[] = [],
): Promise<T> {
  const response = await fetch(getAlchemyUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Alchemy API request failed (${response.status} ${response.statusText})`,
    );
  }

  const json = (await response.json()) as JsonRpcResponse<T>;

  if (json.error) {
    const message = json.error.message?.trim() || "Unknown Alchemy API error";
    throw new Error(`Alchemy API error: ${message}`);
  }

  if (json.result === undefined) {
    throw new Error("Alchemy API returned an empty result.");
  }

  return json.result;
}

/** Fetch aggregated wallet data for an address. Stub — no network calls yet. */
export async function getWalletData(address: string): Promise<WalletData> {
  void address;
  return Promise.reject(
    new Error("getWalletData is not implemented yet."),
  );
}
