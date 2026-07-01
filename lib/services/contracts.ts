import "server-only";

import { getContractCreations } from "@/lib/api/basescan";
import { hasBasescanApiKey } from "@/lib/env";
import type {
  ContractDeploymentAnalytics,
  ContractDeploymentAnalyticsResult,
  DeployedContract,
} from "@/lib/types/analytics";

const CACHE_TTL_MS = 5 * 60 * 1000;

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

  console.log(`[basescan] cache hit for ${address}`);
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

function toAnalytics(creations: Awaited<ReturnType<typeof getContractCreations>>): ContractDeploymentAnalytics {
  const contracts: DeployedContract[] = creations.map((creation) => ({
    address: creation.address,
    deployedAt: creation.deployedAt,
    transactionHash: creation.transactionHash,
  }));

  return {
    total: contracts.length,
    contracts,
  };
}

/**
 * Server-only: fetches contract deployment analytics via Etherscan API V2.
 * Results are cached in memory for 5 minutes per address.
 */
export async function getContractDeploymentAnalytics(
  address: string,
): Promise<ContractDeploymentAnalyticsResult> {
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  const cached = getCached(normalizedAddress);
  if (cached) {
    return cached;
  }

  if (!hasBasescanApiKey()) {
    return {
      error: "Invalid or missing Basescan API key",
    };
  }

  try {
    console.log(
      `[basescan] computing deployment analytics for ${normalizedAddress}`,
    );
    const creations = await getContractCreations(normalizedAddress);
    const result: ContractDeploymentAnalyticsResult = {
      data: toAnalytics(creations),
    };
    setCache(normalizedAddress, result);
    return result;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch contract deployment analytics.";

    console.warn(`[basescan] getContractDeploymentAnalytics failed: ${message}`);
    return { error: message };
  }
}
