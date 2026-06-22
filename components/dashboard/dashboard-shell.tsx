"use client";

import { useCallback, useState } from "react";
import { getCombinedBuilderMetrics } from "@/lib/services/combined";
import {
  BUILDER_WALLET_ADDRESSES,
  validateAddressesForAnalyze,
} from "@/lib/runtimeWalletRegistry";
import type { CombinedBuilderMetrics } from "@/lib/types/analytics";
import type { Wallet } from "@/types/wallet";
import { FadeIn } from "@/components/ui/fade-in";
import { AnalyzeButton } from "./analyze-button";
import { CombinedMetrics } from "./combined-metrics";
import { DashboardHero } from "./dashboard-hero";
import { DashboardIntroCard } from "./dashboard-intro-card";
import { LoadBuilderWalletsButton } from "./load-builder-wallets-button";
import { SupportedWalletTypes } from "./supported-wallet-types";
import { WalletAnalytics } from "./wallet-analytics";
import { WalletAddressPanel } from "./wallet-address-panel";
import type { WalletAddresses } from "@/types/wallet";

const STAGGER_MS = 120;

const EMPTY_ADDRESSES: WalletAddresses = {
  base: "",
  farcaster: "",
  baseapp: "",
};

type AnalyzePhase = "idle" | "loading" | "results" | "error";

export function DashboardShell() {
  const [addresses, setAddresses] = useState<WalletAddresses>(EMPTY_ADDRESSES);
  const [analyzePhase, setAnalyzePhase] = useState<AnalyzePhase>("idle");
  const [metrics, setMetrics] = useState<CombinedBuilderMetrics | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeWallets, setActiveWallets] = useState<Wallet[]>([]);
  const [walletCount, setWalletCount] = useState(0);

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

    const result = await getCombinedBuilderMetrics(validation.wallets);

    if ("error" in result) {
      setMetrics(null);
      setAnalyzeError(result.error);
      setAnalyzePhase("error");
      return;
    }

    setMetrics(result.data);
    setAnalyzePhase("results");
  }, []);

  function handleAnalyze() {
    void runAnalyze(addresses);
  }

  function handleLoadBuilderWallets() {
    setAddresses(BUILDER_WALLET_ADDRESSES);
    void runAnalyze(BUILDER_WALLET_ADDRESSES);
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
            onChange={setAddresses}
          />

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
