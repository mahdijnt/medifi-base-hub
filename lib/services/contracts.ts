import "server-only";

import {
  etherscanV2Request,
  getContractCreations,
  isBasescanFallbackError,
} from "@/lib/api/basescan";
import {
  getBlockscoutContractCreations,
  getBlockscoutContractMetadata,
} from "@/lib/api/blockscout";
import { hasBasescanApiKey, hasBlockscoutApiKey } from "@/lib/env.server";
import { ETH_ADDRESS_REGEX } from "@/lib/runtimeWalletRegistry";
import type {
  ContractDeploymentAnalytics,
  ContractDeploymentAnalyticsResult,
  DeployedContract,
} from "@/lib/types/analytics";
import type {
  DeployedContractRecord,
  DeployedContractsResult,
} from "@/lib/types/contract";

const CACHE_TTL_MS = 5 * 60 * 1000;
const BASESCAN_ADDRESS_URL = "https://basescan.org/address";
const NO_DESCRIPTION = "No description available";
const UNAVAILABLE_MESSAGE = "Contract analytics unavailable";

type ContractCreation = {
  address: string;
  deployedAt: Date;
  transactionHash: string;
};

type CacheEntry = {
  expiresAt: number;
  result: ContractDeploymentAnalyticsResult;
};

const analyticsCache = new Map<string, CacheEntry>();

function cacheKey(address: string): string {
  return address.trim().toLowerCase();
}

function getCached(address: string): ContractDeploymentAnalyticsResult | null {
  const entry = analyticsCache.get(cacheKey(address));
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    analyticsCache.delete(cacheKey(address));
    return null;
  }

  console.log(`[contracts] cache hit for ${address}`);
  return entry.result;
}

function setCache(
  address: string,
  result: ContractDeploymentAnalyticsResult,
): void {
  analyticsCache.set(cacheKey(address), {
    expiresAt: Date.now() + CACHE_TTL_MS,
    result,
  });
}

function dedupeContracts(contracts: DeployedContract[]): DeployedContract[] {
  const byAddress = new Map<string, DeployedContract>();

  for (const contract of contracts) {
    const key = contract.address.toLowerCase();
    const existing = byAddress.get(key);

    if (!existing || contract.deployedAt < existing.deployedAt) {
      byAddress.set(key, contract);
    }
  }

  return [...byAddress.values()].sort(
    (a, b) => a.deployedAt.getTime() - b.deployedAt.getTime(),
  );
}

function toAnalytics(creations: ContractCreation[]): ContractDeploymentAnalytics {
  const contracts = dedupeContracts(
    creations.map((creation) => ({
      address: creation.address,
      deployedAt: creation.deployedAt,
      transactionHash: creation.transactionHash,
    })),
  );

  return {
    total: contracts.length,
    contracts,
  };
}

function shouldFallbackToBlockscout(error: unknown): boolean {
  if (isBasescanFallbackError(error)) {
    return true;
  }

  const message =
    error instanceof Error ? error.message : String(error ?? "");
  const normalized = message.trim().toLowerCase();

  return (
    normalized.includes("notok") ||
    normalized.includes("deprecated") ||
    normalized.includes("free api access is not supported") ||
    normalized.includes("not supported for this chain")
  );
}

async function tryBasescanCreations(
  address: string,
): Promise<ContractCreation[]> {
  const creations = await getContractCreations(address);
  return creations.map((creation) => ({
    address: creation.address,
    deployedAt: creation.deployedAt,
    transactionHash: creation.transactionHash,
  }));
}

async function tryBlockscoutCreations(
  address: string,
): Promise<ContractCreation[]> {
  const creations = await getBlockscoutContractCreations(address);
  return creations.map((creation) => ({
    address: creation.address,
    deployedAt: creation.deployedAt,
    transactionHash: creation.transactionHash,
  }));
}

async function fetchContractCreationsDual(
  address: string,
): Promise<ContractCreation[] | { error: string }> {
  if (hasBasescanApiKey()) {
    try {
      console.log(`[contracts] trying basescan for ${address}`);
      return await tryBasescanCreations(address);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Basescan request failed.";

      if (shouldFallbackToBlockscout(error)) {
        console.warn(`[contracts] basescan failed, trying blockscout: ${message}`);
      } else {
        console.warn(`[contracts] basescan failed: ${message}`);

        if (!hasBlockscoutApiKey()) {
          return { error: message };
        }

        console.warn("[contracts] basescan failed, trying blockscout");
      }
    }
  } else {
    console.warn("[contracts] basescan key missing, trying blockscout");
  }

  if (!hasBlockscoutApiKey()) {
    if (!hasBasescanApiKey()) {
      return {
        error:
          "Missing NEXT_PUBLIC_BASESCAN_API_KEY and BLOCKSCOUT_PRO_API_KEY. Add at least one to .env.local.",
      };
    }
    return { error: UNAVAILABLE_MESSAGE };
  }

  try {
    console.log(`[contracts] trying blockscout for ${address}`);
    return await tryBlockscoutCreations(address);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Blockscout request failed.";
    console.warn(`[contracts] blockscout failed: ${message}`);
    return { error: UNAVAILABLE_MESSAGE };
  }
}

function unavailableResult(): ContractDeploymentAnalyticsResult {
  return { error: UNAVAILABLE_MESSAGE };
}

/**
 * Server-only: fetches contract deployment analytics via BaseScan with
 * Blockscout Pro fallback. Results are cached in memory for 5 minutes.
 */
export async function getContractDeploymentAnalytics(
  address: string,
): Promise<ContractDeploymentAnalyticsResult> {
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  if (!ETH_ADDRESS_REGEX.test(normalizedAddress)) {
    return { error: "Invalid wallet address format." };
  }

  const cached = getCached(normalizedAddress);
  if (cached) {
    return cached;
  }

  const creationsResult = await fetchContractCreationsDual(normalizedAddress);

  if ("error" in creationsResult) {
    const result = unavailableResult();
    setCache(normalizedAddress, result);
    return result;
  }

  const result: ContractDeploymentAnalyticsResult = {
    data: toAnalytics(creationsResult),
  };
  setCache(normalizedAddress, result);
  return result;
}

function truncateAddress(address: string): string {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function buildBasescanUrl(contractAddress: string): string {
  return `${BASESCAN_ADDRESS_URL}/${contractAddress}`;
}

async function resolveContractName(
  contractAddress: string,
): Promise<string> {
  if (hasBasescanApiKey()) {
    try {
      const result = await etherscanV2Request<
        { ContractName?: string }[]
      >({
        module: "contract",
        action: "getsourcecode",
        address: contractAddress,
      });

      const name = Array.isArray(result)
        ? result[0]?.ContractName?.trim()
        : undefined;
      if (name) {
        return name;
      }
    } catch {
      // try Blockscout metadata next
    }
  }

  if (hasBlockscoutApiKey()) {
    try {
      const metadata = await getBlockscoutContractMetadata(contractAddress);
      const name = metadata?.name?.trim();
      if (name) {
        return name;
      }
    } catch {
      // fall through to truncated address
    }
  }

  return truncateAddress(contractAddress);
}

/**
 * Enriched deployed-contract registry with dual-provider creation lookup
 * and Blockscout metadata when available.
 */
export async function getDeployedContractsRegistry(
  walletAddress: string,
): Promise<DeployedContractsResult> {
  const normalizedAddress = walletAddress.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  if (!ETH_ADDRESS_REGEX.test(normalizedAddress)) {
    return { error: "Invalid wallet address format." };
  }

  const creationsResult = await fetchContractCreationsDual(normalizedAddress);

  if ("error" in creationsResult) {
    return { error: UNAVAILABLE_MESSAGE };
  }

  try {
    const contracts = await Promise.all(
      creationsResult.map(async ({ address, deployedAt }) => {
        const contractName = await resolveContractName(address);

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
        : "Failed to fetch deployed contracts.";

    console.warn(`[contracts] getDeployedContractsRegistry failed: ${message}`);
    return { error: UNAVAILABLE_MESSAGE };
  }
}
