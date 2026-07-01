import "server-only";

import { getBasescanApiKey, hasBasescanApiKey } from "@/lib/env";
import type { Transaction } from "@/lib/types/analytics";
import type {
  DeployedContractRecord,
  DeployedContractsResult,
} from "@/lib/types/contract";

/** Base mainnet chain ID for Etherscan API V2 multichain requests. */
export const BASE_CHAIN_ID = 8453;

/** Unified Etherscan API V2 base URL (replaces deprecated per-chain V1 endpoints). */
export const ETHERSCAN_V2_BASE = "https://api.etherscan.io/v2/api";

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;
const MIN_REQUEST_INTERVAL_MS = 200;
const TX_PAGE_OFFSET = 1000;
const BASESCAN_ADDRESS_URL = "https://basescan.org/address";
const NO_DESCRIPTION = "No description available";

const NO_RECORD_MESSAGES = [
  "no transactions found",
  "no records found",
  "query returned null",
] as const;

type EtherscanV2Response<T> = {
  status: string;
  message: string;
  result: T;
};

export type BasescanNormalizedError =
  | "invalid_api_key"
  | "rate_limited"
  | "deprecated_endpoint"
  | "network"
  | "api_error"
  | "no_records";

export type BasescanTx = {
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  timeStamp: string;
};

type BasescanInternalTx = {
  hash: string;
  from: string;
  to: string;
  timeStamp: string;
};

type BasescanSourceCodeEntry = {
  ContractName?: string;
  CompilerVersion?: string;
};

type ContractCreationEntry = {
  contractAddress: string;
  contractCreator: string;
  txHash: string;
  blockNumber: string;
  timestamp: string;
};

let lastRequestAt = 0;
let requestQueue: Promise<void> = Promise.resolve();

function logPrefix(): string {
  return "[basescan]";
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

function isNoRecordsResponse(message: string): boolean {
  const normalized = message.trim().toLowerCase();
  return NO_RECORD_MESSAGES.some((entry) => normalized.includes(entry));
}

function classifyApiMessage(message: string): BasescanNormalizedError {
  const normalized = message.trim().toLowerCase();

  if (
    normalized.includes("invalid api key") ||
    normalized.includes("missing/invalid api key") ||
    normalized.includes("notok") && normalized.includes("api key")
  ) {
    return "invalid_api_key";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("max rate limit") ||
    normalized.includes("too many requests")
  ) {
    return "rate_limited";
  }

  if (normalized.includes("deprecated")) {
    return "deprecated_endpoint";
  }

  return "api_error";
}

function toUserFacingError(kind: BasescanNormalizedError, detail?: string): Error {
  switch (kind) {
    case "invalid_api_key":
      return new Error("Invalid or missing Basescan API key");
    case "rate_limited":
      return new Error(
        "Basescan rate limit reached. Please wait a moment and try again.",
      );
    case "deprecated_endpoint":
      return new Error(
        `Basescan API endpoint is deprecated. ${detail ?? "Use Etherscan API V2."}`,
      );
    case "network":
      return new Error(
        detail ??
          "Basescan API request failed (network error). Check your connection and try again.",
      );
    case "no_records":
      return new Error(detail ?? "No records found.");
    default:
      return new Error(detail ? `Basescan API error: ${detail}` : "Basescan API error.");
  }
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
        "Basescan API request timed out after 15 seconds.",
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

/**
 * Low-level Etherscan API V2 GET helper. Always includes `chainid` and `apikey`.
 * Server-only — never import from client components.
 */
export async function etherscanV2Request<T>(
  params: Record<string, string>,
): Promise<T> {
  const searchParams = new URLSearchParams({
    chainid: String(BASE_CHAIN_ID),
    ...params,
    apikey: getBasescanApiKey(),
  });

  const url = `${ETHERSCAN_V2_BASE}?${searchParams.toString()}`;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      await enforceRateLimit();

      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        const isRateLimited = response.status === 429;
        throw toUserFacingError(
          isRateLimited ? "rate_limited" : "api_error",
          `HTTP ${response.status} ${response.statusText}`,
        );
      }

      const json = (await response.json()) as EtherscanV2Response<T>;

      if (json.status === "1") {
        return json.result;
      }

      if (json.status === "0" && isNoRecordsResponse(json.message)) {
        return (Array.isArray(json.result) ? json.result : []) as T;
      }

      const detail = json.message?.trim() || "Unknown Basescan API error";
      const kind = classifyApiMessage(detail);

      if (kind === "rate_limited" && attempt < MAX_RETRIES - 1) {
        const backoffMs = 2 ** attempt * 500;
        console.warn(
          `${logPrefix()} rate limited, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      throw toUserFacingError(kind, detail);
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Basescan API request failed.");

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

  throw lastError ?? new Error("Basescan API request failed.");
}

export type TxListOptions = {
  startblock?: string;
  endblock?: string;
  sort?: "asc" | "desc";
  page?: number;
  offset?: number;
};

/** Fetch a single page of normal transactions for an address. */
export async function getNormalTransactions(
  address: string,
  options: TxListOptions = {},
): Promise<BasescanTx[]> {
  const result = await etherscanV2Request<BasescanTx[]>({
    module: "account",
    action: "txlist",
    address,
    startblock: options.startblock ?? "0",
    endblock: options.endblock ?? "99999999",
    sort: options.sort ?? "asc",
    page: String(options.page ?? 1),
    offset: String(options.offset ?? TX_PAGE_OFFSET),
  });

  return Array.isArray(result) ? result : [];
}

/** Fetch a single page of internal transactions for an address. */
export async function getInternalTransactions(
  address: string,
  options: TxListOptions = {},
): Promise<BasescanInternalTx[]> {
  const result = await etherscanV2Request<BasescanInternalTx[]>({
    module: "account",
    action: "txlistinternal",
    address,
    startblock: options.startblock ?? "0",
    endblock: options.endblock ?? "99999999",
    sort: options.sort ?? "asc",
    page: String(options.page ?? 1),
    offset: String(options.offset ?? TX_PAGE_OFFSET),
  });

  return Array.isArray(result) ? result : [];
}

/** Fetch all normal transactions for an address (paginated). */
export async function fetchAllNormalTransactions(
  address: string,
): Promise<BasescanTx[]> {
  const transactions: BasescanTx[] = [];
  let page = 1;

  while (true) {
    const pageResult = await getNormalTransactions(address, { page });

    if (pageResult.length === 0) {
      break;
    }

    transactions.push(...pageResult);

    if (pageResult.length < TX_PAGE_OFFSET) {
      break;
    }

    page += 1;
  }

  return transactions;
}

function isContractCreation(tx: BasescanTx, walletAddress: string): boolean {
  const fromMatches =
    tx.from?.toLowerCase() === walletAddress.toLowerCase();
  const hasContractAddress = Boolean(tx.contractAddress?.trim());

  return fromMatches && hasContractAddress;
}

export type ContractCreation = {
  address: string;
  deployedAt: Date;
  transactionHash: string;
};

/**
 * Derives contract creations from normal txlist (from=wallet, contractAddress set).
 * Also supports V2 `getcontractcreation` for up to 5 known contract addresses.
 */
export async function getContractCreations(
  walletAddress: string,
): Promise<ContractCreation[]> {
  const normalizedAddress = walletAddress.trim();
  const transactions = await fetchAllNormalTransactions(normalizedAddress);
  const creations: ContractCreation[] = [];

  for (const tx of transactions) {
    if (!isContractCreation(tx, normalizedAddress)) {
      continue;
    }

    const deployedAt = new Date(Number(tx.timeStamp) * 1000);
    if (Number.isNaN(deployedAt.getTime())) {
      continue;
    }

    creations.push({
      address: tx.contractAddress.trim(),
      deployedAt,
      transactionHash: tx.hash?.trim() ?? "",
    });
  }

  creations.sort((a, b) => a.deployedAt.getTime() - b.deployedAt.getTime());
  return creations;
}

/** V2 contract module: lookup creation metadata for up to 5 contract addresses. */
export async function getContractCreationByAddress(
  contractAddresses: string[],
): Promise<ContractCreationEntry[]> {
  const addresses = contractAddresses
    .map((address) => address.trim())
    .filter(Boolean)
    .slice(0, 5);

  if (addresses.length === 0) {
    return [];
  }

  const result = await etherscanV2Request<ContractCreationEntry[]>({
    module: "contract",
    action: "getcontractcreation",
    contractaddresses: addresses.join(","),
  });

  return Array.isArray(result) ? result : [];
}

function truncateAddress(address: string): string {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function fetchContractName(contractAddress: string): Promise<string> {
  try {
    const result = await etherscanV2Request<BasescanSourceCodeEntry[]>({
      module: "contract",
      action: "getsourcecode",
      address: contractAddress,
    });

    const entry = Array.isArray(result) ? result[0] : undefined;
    const name = entry?.ContractName?.trim();

    if (name) {
      return name;
    }
  } catch {
    // Unverified or unavailable — fall back to truncated address
  }

  return truncateAddress(contractAddress);
}

function buildBasescanUrl(contractAddress: string): string {
  return `${BASESCAN_ADDRESS_URL}/${contractAddress}`;
}

/**
 * Fetches contract deployments for a wallet via V2 txlist, then enriches
 * each address with `getsourcecode` for the contract name.
 */
export async function getDeployedContracts(
  walletAddress: string,
): Promise<DeployedContractsResult> {
  const normalizedAddress = walletAddress.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  if (!hasBasescanApiKey()) {
    return {
      error: "Invalid or missing Basescan API key",
    };
  }

  try {
    console.log(`${logPrefix()} fetching deployed contracts for ${normalizedAddress}`);
    const creations = await getContractCreations(normalizedAddress);

    const contracts = await Promise.all(
      creations.map(async ({ address, deployedAt }) => {
        const contractName = await fetchContractName(address);

        return {
          contractName,
          contractAddress: address,
          description: NO_DESCRIPTION,
          deploymentDate: deployedAt,
          basescanUrl: buildBasescanUrl(address),
        } satisfies DeployedContractRecord;
      }),
    );

    return { data: contracts };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch deployed contracts from Basescan.";

    console.warn(`${logPrefix()} getDeployedContracts failed: ${message}`);
    return { error: message };
  }
}

/** Fetch transactions for an address. Stub — no network calls yet. */
export async function getTransactions(address: string): Promise<Transaction[]> {
  void address;
  return Promise.reject(
    new Error("getTransactions is not implemented yet."),
  );
}
