import { getBasescanApiKey } from "@/lib/env";
import type { Transaction } from "@/lib/types/analytics";

/**
 * BaseScan REST API base URL for Base mainnet.
 * @see https://docs.basescan.org/
 */
export const BASESCAN_API_URL = "https://api.basescan.org/api";

type BasescanApiResponse<T> = {
  status: string;
  message: string;
  result: T;
};

const NO_RECORD_MESSAGES = [
  "no transactions found",
  "no records found",
  "query returned null",
] as const;

function isNoRecordsResponse(message: string): boolean {
  const normalized = message.trim().toLowerCase();
  return NO_RECORD_MESSAGES.some((entry) => normalized.includes(entry));
}

/**
 * Shared GET helper for BaseScan REST calls (Etherscan-compatible v1 API).
 * Works in the browser when NEXT_PUBLIC_BASESCAN_API_KEY is set; Basescan may
 * block cross-origin requests — callers should surface fetch/CORS errors clearly.
 */
export async function basescanRequest<T>(
  params: Record<string, string>,
): Promise<T> {
  const searchParams = new URLSearchParams({
    ...params,
    apikey: getBasescanApiKey(),
  });

  let response: Response;

  try {
    response = await fetch(`${BASESCAN_API_URL}?${searchParams.toString()}`);
  } catch {
    throw new Error(
      "Basescan API request failed (network or CORS). Set NEXT_PUBLIC_BASESCAN_API_KEY in .env.local, or use a server proxy for static export.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `Basescan API request failed (${response.status} ${response.statusText})`,
    );
  }

  const json = (await response.json()) as BasescanApiResponse<T>;

  if (json.status === "1") {
    return json.result;
  }

  if (json.status === "0" && isNoRecordsResponse(json.message)) {
    return (Array.isArray(json.result) ? json.result : []) as T;
  }

  const detail = json.message?.trim() || "Unknown Basescan API error";
  throw new Error(`Basescan API error: ${detail}`);
}

/** Fetch transactions for an address. Stub — no network calls yet. */
export async function getTransactions(address: string): Promise<Transaction[]> {
  void address;
  return Promise.reject(
    new Error("getTransactions is not implemented yet."),
  );
}
