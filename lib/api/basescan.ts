import { getBasescanApiKey, hasBasescanApiKey } from "@/lib/env";
import type { Transaction } from "@/lib/types/analytics";
import type {
  DeployedContractRecord,
  DeployedContractsResult,
} from "@/lib/types/contract";

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

const TX_PAGE_OFFSET = 1000;
const BASESCAN_ADDRESS_URL = "https://basescan.org/address";
const NO_DESCRIPTION = "No description available";

type BasescanTx = {
  from: string;
  contractAddress: string;
  timeStamp: string;
};

type BasescanSourceCodeEntry = {
  ContractName?: string;
  CompilerVersion?: string;
};

function truncateAddress(address: string): string {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function isContractCreation(tx: BasescanTx, walletAddress: string): boolean {
  const fromMatches =
    tx.from?.toLowerCase() === walletAddress.toLowerCase();
  const hasContractAddress = Boolean(tx.contractAddress?.trim());

  return fromMatches && hasContractAddress;
}

async function fetchAllTransactions(address: string): Promise<BasescanTx[]> {
  const transactions: BasescanTx[] = [];
  let page = 1;

  while (true) {
    const pageResult = await basescanRequest<BasescanTx[]>({
      module: "account",
      action: "txlist",
      address,
      startblock: "0",
      endblock: "99999999",
      sort: "asc",
      page: String(page),
      offset: String(TX_PAGE_OFFSET),
    });

    if (!Array.isArray(pageResult) || pageResult.length === 0) {
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

async function fetchContractName(contractAddress: string): Promise<string> {
  try {
    const result = await basescanRequest<BasescanSourceCodeEntry[]>({
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
 * Fetches contract deployments for a wallet via Basescan txlist, then enriches
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
      error:
        "Missing NEXT_PUBLIC_BASESCAN_API_KEY. Add it to .env.local to load deployed contracts.",
    };
  }

  try {
    const transactions = await fetchAllTransactions(normalizedAddress);
    const creations: Array<{ address: string; deployedAt: Date }> = [];

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
      });
    }

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

    contracts.sort(
      (a, b) => a.deploymentDate.getTime() - b.deploymentDate.getTime(),
    );

    return { data: contracts };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch deployed contracts from Basescan.";

    return { error: message };
  }
}
