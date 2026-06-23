"use client";

import { useCallback, useState } from "react";
import { getCombinedBuilderMetrics } from "@/lib/services/combined";
import { getNftAnalytics } from "@/lib/services/nft";
import { getTransactionAnalytics } from "@/lib/services/transactions";
import {
  BUILDER_WALLET_ADDRESSES,
  validateAddressesForAnalyze,
} from "@/lib/runtimeWalletRegistry";
import type { CombinedBuilderMetrics } from "@/lib/types/analytics";
import type { Wallet } from "@/types/wallet";
import { validateWalletForm } from "@/utils/validateWallet";
import { FadeIn } from "@/components/ui/fade-in";
import { AnalyzeButton } from "./analyze-button";
import { CombinedMetrics } from "./combined-metrics";
import { DashboardHero } from "./dashboard-hero";
import { DashboardIntroCard } from "./dashboard-intro-card";
import { LoadBuilderWalletsButton } from "./load-builder-wallets-button";
import { SupportedWalletTypes } from "./supported-wallet-types";
import { WalletAnalytics } from "./wallet-analytics";
import { WalletAddressPanel } from "./wallet-address-panel";
import {
  NftMetricsSection,
  type NFTMetrics,
  type NftsState,
} from "./nft-metrics-section";
import {
  TransactionMetricsSection,
  type TransactionMetrics,
  type TransactionsState,
} from "./transaction-metrics-section";
import type { WalletAddresses } from "@/types/wallet";

const STAGGER_MS = 120;

const EMPTY_ADDRESSES: WalletAddresses = {
  base: "",
  farcaster: "",
  baseapp: "",
};

type TransactionWalletKey = keyof TransactionsState;

const TRANSACTION_WALLET_FIELDS: Array<{
  addressKey: keyof WalletAddresses;
  stateKey: TransactionWalletKey;
}> = [
  { addressKey: "base", stateKey: "main" },
  { addressKey: "farcaster", stateKey: "farcaster" },
  { addressKey: "baseapp", stateKey: "baseapp" },
];

function buildTransactionLoadingState(
  addresses: WalletAddresses,
): TransactionsState {
  const state: TransactionsState = {};

  for (const { addressKey, stateKey } of TRANSACTION_WALLET_FIELDS) {
    const address = addresses[addressKey].trim();
    if (address) {
      state[stateKey] = {
        total: 0,
        firstTx: null,
        lastTx: null,
        loading: true,
      };
    }
  }

  return state;
}

function buildNftLoadingState(addresses: WalletAddresses): NftsState {
  const state: NftsState = {};

  for (const { addressKey, stateKey } of TRANSACTION_WALLET_FIELDS) {
    const address = addresses[addressKey].trim();
    if (address) {
      state[stateKey] = {
        total: 0,
        collections: [],
        loading: true,
      };
    }
  }

  return state;
}

type AnalyzePhase = "idle" | "loading" | "results" | "error";

export function DashboardShell() {
  const [addresses, setAddresses] = useState<WalletAddresses>(EMPTY_ADDRESSES);
  const [analyzePhase, setAnalyzePhase] = useState<AnalyzePhase>("idle");
  const [metrics, setMetrics] = useState<CombinedBuilderMetrics | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | undefined>();
  const [mainWalletError, setMainWalletError] = useState<string | undefined>();
  const [farcasterWalletError, setFarcasterWalletError] = useState<
    string | undefined
  >();
  const [baseAppWalletError, setBaseAppWalletError] = useState<
    string | undefined
  >();
  const [activeWallets, setActiveWallets] = useState<Wallet[]>([]);
  const [walletCount, setWalletCount] = useState(0);
  const [transactions, setTransactions] = useState<TransactionsState>({});
  const [nfts, setNfts] = useState<NftsState>({});

  const fetchTransactionMetrics = useCallback(
    async (addressesToAnalyze: WalletAddresses) => {
      const walletsToFetch = TRANSACTION_WALLET_FIELDS.flatMap(
        ({ addressKey, stateKey }) => {
          const address = addressesToAnalyze[addressKey].trim();
          return address ? [{ stateKey, address }] : [];
        },
      );

      await Promise.all(
        walletsToFetch.map(async ({ stateKey, address }) => {
          const result = await getTransactionAnalytics(address);

          const metrics: TransactionMetrics =
            "error" in result
              ? {
                  total: 0,
                  firstTx: null,
                  lastTx: null,
                  loading: false,
                  error: result.error,
                }
              : {
                  total: result.data.total,
                  firstTx: result.data.firstTx,
                  lastTx: result.data.lastTx,
                  loading: false,
                };

          setTransactions((previous) => ({
            ...previous,
            [stateKey]: metrics,
          }));
        }),
      );
    },
    [],
  );

  const fetchNftMetrics = useCallback(
    async (addressesToAnalyze: WalletAddresses) => {
      const walletsToFetch = TRANSACTION_WALLET_FIELDS.flatMap(
        ({ addressKey, stateKey }) => {
          const address = addressesToAnalyze[addressKey].trim();
          return address ? [{ stateKey, address }] : [];
        },
      );

      await Promise.all(
        walletsToFetch.map(async ({ stateKey, address }) => {
          const result = await getNftAnalytics(address);

          const metrics: NFTMetrics =
            "error" in result
              ? {
                  total: 0,
                  collections: [],
                  loading: false,
                  error: result.error,
                }
              : {
                  total: result.data.total,
                  collections: result.data.collections,
                  loading: false,
                };

          setNfts((previous) => ({
            ...previous,
            [stateKey]: metrics,
          }));
        }),
      );
    },
    [],
  );

  const runAnalyze = useCallback(async (addressesToAnalyze: WalletAddresses) => {
    const validation = validateAddressesForAnalyze(addressesToAnalyze);

    if (!validation.ok) {
      setValidationError(validation.error);
      return;
    }

    setValidationError(null);
    setAnalyzeError(null);
    setAnalyzePhase("loading");
    setActiveWallets(validation.wallets);
    setWalletCount(validation.wallets.length);
    setMetrics(null);
    setTransactions(buildTransactionLoadingState(addressesToAnalyze));
    setNfts(buildNftLoadingState(addressesToAnalyze));

    const [result] = await Promise.all([
      getCombinedBuilderMetrics(validation.wallets),
      fetchTransactionMetrics(addressesToAnalyze),
      fetchNftMetrics(addressesToAnalyze),
    ]);

    if ("error" in result) {
      setMetrics(null);
      setAnalyzeError(result.error);
      setAnalyzePhase("error");
      return;
    }

    setMetrics(result.data);
    setAnalyzePhase("results");
  }, [fetchTransactionMetrics, fetchNftMetrics]);

  function clearWalletErrors() {
    setFormError(undefined);
    setMainWalletError(undefined);
    setFarcasterWalletError(undefined);
    setBaseAppWalletError(undefined);
  }

  function handleAnalyze() {
    const validation = validateWalletForm({
      main: addresses.base,
      farcaster: addresses.farcaster,
      baseApp: addresses.baseapp,
    });

    if (!validation.valid) {
      setFormError(validation.formError);
      setMainWalletError(validation.fieldErrors?.main);
      setFarcasterWalletError(validation.fieldErrors?.farcaster);
      setBaseAppWalletError(validation.fieldErrors?.baseApp);
      return;
    }

    clearWalletErrors();
    void runAnalyze(addresses);
  }

  function handleLoadBuilderWallets() {
    clearWalletErrors();
    setValidationError(null);
    setAddresses(BUILDER_WALLET_ADDRESSES);
    void runAnalyze(BUILDER_WALLET_ADDRESSES);
  }

  function handleAddressesChange(next: WalletAddresses) {
    setAddresses(next);
    if (formError || mainWalletError || farcasterWalletError || baseAppWalletError) {
      clearWalletErrors();
    }
  }

  const isAnalyzing = analyzePhase === "loading";
  const showMetrics = analyzePhase !== "idle";

  return (
    <section
      aria-labelledby="dashboard-heading"
      className="pb-16 pt-8 sm:pb-20 sm:pt-12"
    >
      <div className="mx-auto w-full max-w-5xl space-y-8 sm:space-y-10">
        <DashboardHero />
        <DashboardIntroCard />
        <SupportedWalletTypes />

        <div className="space-y-6">
          <WalletAddressPanel
            addresses={addresses}
            onChange={handleAddressesChange}
            errors={{
              base: mainWalletError,
              farcaster: farcasterWalletError,
              baseapp: baseAppWalletError,
            }}
          />

          {formError ? (
            <FadeIn duration={400}>
              <p
                role="alert"
                className="text-sm text-red-400/90"
              >
                {formError}
              </p>
            </FadeIn>
          ) : null}

          {validationError ? (
            <FadeIn duration={400}>
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
              >
                {validationError}
              </p>
            </FadeIn>
          ) : null}

          <FadeIn delay={STAGGER_MS * 6} duration={500}>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <AnalyzeButton
                onClick={handleAnalyze}
                loading={isAnalyzing}
                disabled={isAnalyzing}
              />
              <LoadBuilderWalletsButton
                onClick={handleLoadBuilderWallets}
                disabled={isAnalyzing}
              />
            </div>
          </FadeIn>
        </div>

        {showMetrics ? (
          <FadeIn delay={STAGGER_MS} duration={500}>
            <div className="space-y-10">
              <CombinedMetrics
                metrics={metrics}
                loading={isAnalyzing}
                error={analyzeError}
                walletCount={walletCount}
              />

              <TransactionMetricsSection transactions={transactions} />

              <NftMetricsSection nfts={nfts} />

              {analyzePhase === "results" && activeWallets.length > 0 ? (
                <WalletAnalytics wallets={activeWallets} />
              ) : null}
            </div>
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
