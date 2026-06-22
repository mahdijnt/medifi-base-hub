import { getAlchemyApiKey } from "@/lib/env";
import type { WalletData } from "@/lib/types/analytics";

/** Alchemy JSON-RPC base URL for Base mainnet (API key appended per request). */
export const ALCHEMY_BASE_URL = "https://base-mainnet.g.alchemy.com/v2/";

/** Alchemy NFT REST API base URL for Base mainnet (API key appended per request). */
export const ALCHEMY_NFT_BASE_URL = "https://base-mainnet.g.alchemy.com/nft/v3/";

function getAlchemyUrl(): string {
  return `${ALCHEMY_BASE_URL}${getAlchemyApiKey()}`;
}

function getAlchemyNftUrl(
  endpoint: string,
  params?: Record<string, string>,
): string {
  const path = `${ALCHEMY_NFT_BASE_URL}${getAlchemyApiKey()}/${endpoint}`;
  if (!params || Object.keys(params).length === 0) {
    return path;
  }

  const search = new URLSearchParams(params);
  return `${path}?${search.toString()}`;
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

/**
 * Shared request helper for Alchemy NFT REST endpoints (v3).
 */
export async function alchemyNftRequest<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T> {
  const response = await fetch(getAlchemyNftUrl(endpoint, params));

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { message?: string };
      detail = body.message?.trim() ?? "";
    } catch {
      // Response body may not be JSON.
    }

    const suffix = detail ? `: ${detail}` : "";
    throw new Error(
      `Alchemy NFT API request failed (${response.status} ${response.statusText})${suffix}`,
    );
  }

  return (await response.json()) as T;
}

/** Fetch aggregated wallet data for an address. Stub — no network calls yet. */
export async function getWalletData(address: string): Promise<WalletData> {
  void address;
  return Promise.reject(
    new Error("getWalletData is not implemented yet."),
  );
}
