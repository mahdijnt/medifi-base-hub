import "server-only";

import { getBlockscoutApiKey, hasBlockscoutApiKey } from "@/lib/env.server";

/** Base mainnet (chain ID 8453) — PRO API REST base per Blockscout docs. */
export const BLOCKSCOUT_PRO_BASE = "https://api.blockscout.com/8453/api/v2";

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;
const MIN_REQUEST_INTERVAL_MS = 200;

export type BlockscoutNormalizedError =
  | "invalid_api_key"
  | "rate_limited"
  | "network"
  | "api_error"
  | "no_records";

type BlockscoutAddressParam = {
  hash: string;
  name?: string | null;
  is_contract?: boolean;
  is_verified?: boolean;
};

export type BlockscoutAddressInfo = {
  hash: string;
  is_contract: boolean;
  name?: string | null;
  is_verified?: boolean;
  creator_address_hash?: string | null;
  creation_transaction_hash?: string | null;
};

export type BlockscoutTransaction = {
  hash: string;
  timestamp: string;
  from: BlockscoutAddressParam;
  to: BlockscoutAddressParam | null;
  created_contract: BlockscoutAddressParam | null;
  contract_address?: string | null;
};

type BlockscoutTransactionsPage = {
  items: BlockscoutTransaction[];
  next_page_params: Record<string, string | number> | null;
};

export type BlockscoutSmartContractMetadata = {
  name?: string | null;
  compiler_version?: string | null;
  is_verified?: boolean;
  optimization_enabled?: boolean;
  source_code?: string | null;
};

export type BlockscoutContractCreation = {
  address: string;
  deployedAt: Date;
  transactionHash: string;
};

let lastRequestAt = 0;
let requestQueue: Promise<void> = Promise.resolve();

function logPrefix(): string {
  return "[blockscout]";
}

async function enforceRateLimit(): Promise<void> {
  const run = async () => {
    const now = Date.now();
    const elapsed = now - lastRequestAt;
    const waitMs = Math.max(0, MIN_REQUEST_INTERVAL_MS - elapsed);

    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    lastRequestAt = Date.now();
  };

  const queued = requestQueue.then(run, run);
  requestQueue = queued.then(
    () => undefined,
    () => undefined,
  );
  await queued;
}

function toUserFacingError(
  kind: BlockscoutNormalizedError,
  detail?: string,
): Error {
  switch (kind) {
    case "invalid_api_key":
      return new Error("Invalid or missing Blockscout PRO API key");
    case "rate_limited":
      return new Error(
        "Blockscout rate limit reached. Please wait a moment and try again.",
      );
    case "network":
      return new Error(
        detail ??
          "Blockscout API request failed (network error). Check your connection and try again.",
      );
    case "no_records":
      return new Error(detail ?? "No records found.");
    default:
      return new Error(
        detail ? `Blockscout API error: ${detail}` : "Blockscout API error.",
      );
  }
}

function classifyHttpError(status: number): BlockscoutNormalizedError {
  if (status === 401 || status === 403) {
    return "invalid_api_key";
  }
  if (status === 429) {
    return "rate_limited";
  }
  if (status === 404) {
    return "no_records";
  }
  return "api_error";
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw toUserFacingError(
        "network",
        "Blockscout API request timed out after 15 seconds.",
      );
    }

    throw toUserFacingError(
      "network",
      error instanceof Error ? error.message : undefined,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

async function blockscoutGet<T>(
  path: string,
  extraParams: Record<string, string> = {},
): Promise<T> {
  if (!hasBlockscoutApiKey()) {
    throw toUserFacingError(
      "invalid_api_key",
      "Missing BLOCKSCOUT_PRO_API_KEY.",
    );
  }

  const searchParams = new URLSearchParams({
    apikey: getBlockscoutApiKey(),
    ...extraParams,
  });

  const url = `${BLOCKSCOUT_PRO_BASE}${path}?${searchParams.toString()}`;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      await enforceRateLimit();

      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        const kind = classifyHttpError(response.status);
        const detail = `HTTP ${response.status} ${response.statusText}`;

        if (kind === "rate_limited" && attempt < MAX_RETRIES - 1) {
          const backoffMs = 2 ** attempt * 500;
          console.warn(
            `${logPrefix()} rate limited, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
          );
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }

        throw toUserFacingError(kind, detail);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Blockscout API request failed.");

      const isRetryable =
        lastError.message.includes("rate limit") ||
        lastError.message.includes("timed out") ||
        lastError.message.includes("network");

      if (isRetryable && attempt < MAX_RETRIES - 1) {
        const backoffMs = 2 ** attempt * 500;
        console.warn(
          `${logPrefix()} ${lastError.message}, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      throw lastError;
    }
  }

  throw lastError ?? new Error("Blockscout API request failed.");
}

function parseTimestamp(timestamp: string): Date | null {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isContractCreationTx(tx: BlockscoutTransaction): boolean {
  return (
    tx.to === null ||
    tx.created_contract !== null ||
    Boolean(tx.contract_address?.trim())
  );
}

function extractContractAddress(tx: BlockscoutTransaction): string | null {
  const fromCreated = tx.created_contract?.hash?.trim();
  if (fromCreated) {
    return fromCreated;
  }

  const fromField = tx.contract_address?.trim();
  if (fromField) {
    return fromField;
  }

  return null;
}

function dedupeContractCreations(
  creations: BlockscoutContractCreation[],
): BlockscoutContractCreation[] {
  const byAddress = new Map<string, BlockscoutContractCreation>();

  for (const creation of creations) {
    const key = creation.address.toLowerCase();
    const existing = byAddress.get(key);

    if (!existing || creation.deployedAt < existing.deployedAt) {
      byAddress.set(key, creation);
    }
  }

  return [...byAddress.values()].sort(
    (a, b) => a.deployedAt.getTime() - b.deployedAt.getTime(),
  );
}

/** GET /addresses/{address} — contract vs EOA detection and address metadata. */
export async function getBlockscoutAddressInfo(
  address: string,
): Promise<BlockscoutAddressInfo> {
  const normalizedAddress = address.trim();
  return blockscoutGet<BlockscoutAddressInfo>(
    `/addresses/${normalizedAddress}`,
  );
}

async function fetchAllAddressTransactions(
  address: string,
): Promise<BlockscoutTransaction[]> {
  const normalizedAddress = address.trim();
  const items: BlockscoutTransaction[] = [];
  let pageParams: Record<string, string> = { filter: "from" };

  while (true) {
    const page = await blockscoutGet<BlockscoutTransactionsPage>(
      `/addresses/${normalizedAddress}/transactions`,
      pageParams,
    );

    if (Array.isArray(page.items) && page.items.length > 0) {
      items.push(...page.items);
    }

    if (!page.next_page_params) {
      break;
    }

    pageParams = Object.fromEntries(
      Object.entries(page.next_page_params).map(([key, value]) => [
        key,
        String(value),
      ]),
    );
  }

  return items;
}

/** GET /addresses/{address}/transactions — paginated via next_page_params. */
export async function getBlockscoutTransactions(
  address: string,
): Promise<BlockscoutTransaction[]> {
  return fetchAllAddressTransactions(address);
}

/** GET /smart-contracts/{contractAddress} — verified contract metadata. */
export async function getBlockscoutContractMetadata(
  contractAddress: string,
): Promise<BlockscoutSmartContractMetadata | null> {
  const normalizedAddress = contractAddress.trim();

  try {
    return await blockscoutGet<BlockscoutSmartContractMetadata>(
      `/smart-contracts/${normalizedAddress}`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Blockscout metadata unavailable";

    if (message.includes("No records") || message.includes("HTTP 404")) {
      return null;
    }

    throw error;
  }
}

/**
 * Aggregates contract creations from outgoing address transactions.
 * Creation rules: to is null, created_contract set, or contract_address set.
 */
export async function getBlockscoutContractCreations(
  address: string,
): Promise<BlockscoutContractCreation[]> {
  const normalizedAddress = address.trim().toLowerCase();
  const transactions = await getBlockscoutTransactions(normalizedAddress);
  const creations: BlockscoutContractCreation[] = [];

  for (const tx of transactions) {
    const fromHash = tx.from?.hash?.toLowerCase();
    if (fromHash !== normalizedAddress) {
      continue;
    }

    if (!isContractCreationTx(tx)) {
      continue;
    }

    const contractAddress = extractContractAddress(tx);
    if (!contractAddress) {
      continue;
    }

    const deployedAt = parseTimestamp(tx.timestamp);
    if (!deployedAt) {
      continue;
    }

    creations.push({
      address: contractAddress,
      deployedAt,
      transactionHash: tx.hash?.trim() ?? "",
    });
  }

  return dedupeContractCreations(creations);
}

export type BlockscoutTransactionAnalytics = {
  total: number;
  firstTx: Date | null;
  lastTx: Date | null;
};

/**
 * Optional fallback transaction analytics derived from Blockscout address txs.
 * Not wired by default — transactions.ts uses Alchemy as primary.
 */
export async function getBlockscoutTransactionAnalytics(
  address: string,
): Promise<BlockscoutTransactionAnalytics> {
  const transactions = await getBlockscoutTransactions(address);

  if (transactions.length === 0) {
    return { total: 0, firstTx: null, lastTx: null };
  }

  let firstTx: Date | null = null;
  let lastTx: Date | null = null;
  const uniqueHashes = new Set<string>();

  for (const tx of transactions) {
    const hash = tx.hash?.toLowerCase();
    if (hash) {
      uniqueHashes.add(hash);
    }

    const date = parseTimestamp(tx.timestamp);
    if (!date) {
      continue;
    }

    if (!firstTx || date < firstTx) {
      firstTx = date;
    }
    if (!lastTx || date > lastTx) {
      lastTx = date;
    }
  }

  return {
    total: uniqueHashes.size,
    firstTx,
    lastTx,
  };
}
