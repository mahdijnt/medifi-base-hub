import { hasAlchemyApiKey } from "@/lib/env";
import { fetchContractDeploymentAnalytics } from "@/lib/services/contracts-client";
import { fetchNftAnalytics } from "@/lib/services/nft-client";
import { getTransactionAnalytics } from "@/lib/services/transactions";
import type {
  CombinedBuilderMetrics,
  CombinedBuilderMetricsResult,
  WalletMetricsBreakdown,
} from "@/lib/types/analytics";
import type { Wallet } from "@/types/wallet";

const EMPTY_TOTALS = { transactions: 0, nfts: 0, contracts: 0 };

function getMissingApiKeyMessage(): string | null {
  const missing: string[] = [];

  if (!hasAlchemyApiKey()) {
    missing.push("NEXT_PUBLIC_ALCHEMY_API_KEY");
  }

  if (missing.length === 0) {
    return null;
  }

  return `Missing required API keys: ${missing.join(", ")}. Add them to .env.local to load combined builder metrics.`;
}

async function fetchWalletMetrics(
  wallet: { id: string; name: string; address: string },
): Promise<WalletMetricsBreakdown> {
  const errors: string[] = [];
  let transactions = 0;
  let nfts = 0;
  let contracts = 0;

  try {
    const [txResult, nftResult, contractResult] = await Promise.all([
      getTransactionAnalytics(wallet.address),
      fetchNftAnalytics(wallet.address),
      fetchContractDeploymentAnalytics(wallet.address),
    ]);

    if ("error" in txResult) {
      errors.push(txResult.error);
      console.warn(
        `[combined] ${wallet.id} transaction analytics: ${txResult.error}`,
      );
    } else {
      transactions = txResult.data.total;
    }

    if ("error" in nftResult) {
      errors.push(nftResult.error);
      console.warn(
        `[combined] ${wallet.id} NFT analytics: ${nftResult.error}`,
      );
    } else {
      nfts = nftResult.data.total;
    }

    if ("error" in contractResult) {
      errors.push(contractResult.error);
      console.warn(
        `[combined] ${wallet.id} contract analytics: ${contractResult.error}`,
      );
    } else {
      contracts = contractResult.data.total;
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch wallet metrics.";

    errors.push(message);
    console.warn(`[combined] ${wallet.id}: ${message}`);
  }

  return {
    id: wallet.id,
    name: wallet.name,
    transactions,
    nfts,
    contracts,
    ...(errors.length > 0 ? { errors } : {}),
  };
}

function aggregateTotals(
  perWallet: WalletMetricsBreakdown[],
): CombinedBuilderMetrics["totals"] {
  return perWallet.reduce(
    (acc, wallet) => ({
      transactions: acc.transactions + wallet.transactions,
      nfts: acc.nfts + wallet.nfts,
      contracts: acc.contracts + wallet.contracts,
    }),
    { ...EMPTY_TOTALS },
  );
}

/**
 * Aggregates transaction, NFT, and contract deployment analytics across the
 * provided wallets. Per-wallet fetch failures are logged and counted as zero
 * so the rest of the aggregation can continue.
 */
export async function getCombinedBuilderMetrics(
  wallets: Wallet[],
): Promise<CombinedBuilderMetricsResult> {
  if (wallets.length === 0) {
    return {
      data: {
        totals: { ...EMPTY_TOTALS },
        perWallet: [],
      },
    };
  }

  const missingKeysMessage = getMissingApiKeyMessage();
  if (missingKeysMessage) {
    return { error: missingKeysMessage };
  }

  const perWallet = await Promise.all(wallets.map(fetchWalletMetrics));

  return {
    data: {
      totals: aggregateTotals(perWallet),
      perWallet,
    },
  };
}
