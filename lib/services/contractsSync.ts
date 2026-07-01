import "server-only";

import { getDeployedContracts } from "@/lib/api/basescan";
import type {
  DeployedContractRecord,
  NormalizedContract,
  ContractSyncPayload,
} from "@/lib/types/contract";

const SYNC_VERSION = 1;

export function normalizeContractMetadata(
  raw: DeployedContractRecord,
  deployerWallet: string,
): NormalizedContract {
  return {
    contractName: raw.contractName,
    contractAddress: raw.contractAddress,
    description: raw.description,
    deploymentDate: raw.deploymentDate.toISOString(),
    basescanUrl: raw.basescanUrl,
    deployerWallet,
  };
}

function dedupeContracts(contracts: NormalizedContract[]): NormalizedContract[] {
  const seen = new Set<string>();
  const deduped: NormalizedContract[] = [];

  for (const contract of contracts) {
    const key = contract.contractAddress.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(contract);
  }

  return deduped.sort(
    (a, b) =>
      new Date(a.deploymentDate).getTime() - new Date(b.deploymentDate).getTime(),
  );
}

/**
 * Fetches deployed contracts for each wallet from Basescan and returns a
 * normalized, deduplicated list. Intended for GitHub Action sync pipelines.
 */
export async function fetchContractsFromBasescan(
  walletAddresses: string[],
): Promise<NormalizedContract[]> {
  const normalizedAddresses = walletAddresses
    .map((address) => address.trim())
    .filter(Boolean);

  if (normalizedAddresses.length === 0) {
    return [];
  }

  const results = await Promise.all(
    normalizedAddresses.map(async (walletAddress) => {
      const result = await getDeployedContracts(walletAddress);
      return { walletAddress, result };
    }),
  );

  const merged: NormalizedContract[] = [];

  for (const { walletAddress, result } of results) {
    if ("error" in result) {
      continue;
    }

    for (const contract of result.data) {
      merged.push(normalizeContractMetadata(contract, walletAddress));
    }
  }

  return dedupeContracts(merged);
}

export function prepareForGitHubActionSync(
  contracts: NormalizedContract[],
): ContractSyncPayload {
  return {
    contracts,
    generatedAt: new Date().toISOString(),
    version: SYNC_VERSION,
  };
}
