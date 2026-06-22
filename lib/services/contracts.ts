import { basescanRequest } from "@/lib/api/basescan";
import { hasBasescanApiKey } from "@/lib/env";
import type {
  ContractDeploymentAnalytics,
  ContractDeploymentAnalyticsResult,
  DeployedContract,
} from "@/lib/types/analytics";

const PAGE_OFFSET = 1000;

type BasescanTx = {
  from: string;
  to: string;
  contractAddress: string;
  timeStamp: string;
};

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
      offset: String(PAGE_OFFSET),
    });

    if (!Array.isArray(pageResult) || pageResult.length === 0) {
      break;
    }

    transactions.push(...pageResult);

    if (pageResult.length < PAGE_OFFSET) {
      break;
    }

    page += 1;
  }

  return transactions;
}

function computeContractAnalytics(
  transactions: BasescanTx[],
  walletAddress: string,
): ContractDeploymentAnalytics {
  const contracts: DeployedContract[] = [];

  for (const tx of transactions) {
    if (!isContractCreation(tx, walletAddress)) {
      continue;
    }

    const deployedAt = new Date(Number(tx.timeStamp) * 1000);
    if (Number.isNaN(deployedAt.getTime())) {
      continue;
    }

    contracts.push({
      address: tx.contractAddress.trim(),
      deployedAt,
    });
  }

  contracts.sort((a, b) => a.deployedAt.getTime() - b.deployedAt.getTime());

  return {
    total: contracts.length,
    contracts,
  };
}

/**
 * Fetches onchain transaction history from Basescan and derives contract
 * deployment analytics for a wallet.
 *
 * Uses NEXT_PUBLIC_BASESCAN_API_KEY in the browser (static export). The key is
 * visible client-side — same exposure model as NEXT_PUBLIC_ALCHEMY_API_KEY.
 */
export async function getContractDeploymentAnalytics(
  address: string,
): Promise<ContractDeploymentAnalyticsResult> {
  const normalizedAddress = address.trim();

  if (!normalizedAddress) {
    return { error: "Wallet address is required." };
  }

  if (!hasBasescanApiKey()) {
    return {
      error:
        "Missing NEXT_PUBLIC_BASESCAN_API_KEY. Add it to .env.local to load contract deployment analytics.",
    };
  }

  try {
    const transactions = await fetchAllTransactions(normalizedAddress);
    return { data: computeContractAnalytics(transactions, normalizedAddress) };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch contract deployment analytics.";

    return { error: message };
  }
}
