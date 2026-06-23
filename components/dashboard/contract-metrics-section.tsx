"use client";

import { ContractList } from "@/components/contracts/ContractList";
import {
  ContractListSkeleton,
  ContractMetricSkeleton,
  StatusMessage,
} from "@/components/loading";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

const STAGGER_MS = 120;

export type ContractMetrics = {
  total: number;
  contracts: { address: string; deployedAt: Date }[];
  loading?: boolean;
  error?: string;
};

export type ContractsState = {
  main?: ContractMetrics;
  farcaster?: ContractMetrics;
  baseapp?: ContractMetrics;
};

type ContractWalletKey = keyof ContractsState;

const WALLET_ORDER: ContractWalletKey[] = ["main", "farcaster", "baseapp"];

const WALLET_LABELS: Record<ContractWalletKey, string> = {
  main: "Main Base Wallet",
  farcaster: "Farcaster Wallet",
  baseapp: "Base App Wallet",
};

type ContractMetricsSectionProps = {
  contracts: ContractsState;
};

function isEmptyMetrics(metrics: ContractMetrics): boolean {
  return metrics.total === 0 && metrics.contracts.length === 0;
}

type ContractMetricCardProps = {
  label: string;
  value: string;
};

function ContractMetricCard({ label, value }: ContractMetricCardProps) {
  return (
    <article
      className={cn(
        "group relative rounded-xl p-px",
        "bg-gradient-to-br from-blue-500/25 via-blue-400/10 to-blue-600/5",
        "transition-transform duration-300 ease-out hover:scale-[1.02]",
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5",
          "border border-blue-500/20 bg-blue-500/[0.06] backdrop-blur-[12px]",
          "shadow-sm shadow-blue-500/10 transition-shadow duration-300",
          "group-hover:shadow-[0_0_24px_-4px_rgba(59,130,246,0.35)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.2),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <p className="text-sm font-medium text-blue-200/70 dark:text-blue-300/70">
            {label}
          </p>
          <p className="mt-2 font-mono text-4xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

type WalletContractCardProps = {
  walletKey: ContractWalletKey;
  metrics: ContractMetrics;
};

function WalletContractCard({ walletKey, metrics }: WalletContractCardProps) {
  const label = WALLET_LABELS[walletKey];

  if (metrics.loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {label}
        </h3>
        <ContractMetricSkeleton />
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-300/60">Deployments</p>
          <ContractListSkeleton />
        </div>
      </div>
    );
  }

  if (metrics.error) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {label}
        </h3>
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          {metrics.error}
        </p>
      </div>
    );
  }

  if (isEmptyMetrics(metrics)) {
    return (
      <div className="space-y-3">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {label}
        </h3>
        <p className="rounded-lg border border-blue-500/15 bg-blue-500/[0.04] px-4 py-3 text-sm text-muted backdrop-blur-sm">
          No contracts deployed for this wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {label}
      </h3>

      <div className="max-w-sm">
        <ContractMetricCard
          label="Total Contracts Deployed"
          value={metrics.total.toLocaleString("en-US")}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-blue-300/70">Deployments</p>
        <ContractList contracts={metrics.contracts} />
      </div>
    </div>
  );
}

export function ContractMetricsSection({
  contracts,
}: ContractMetricsSectionProps) {
  const activeWallets = WALLET_ORDER.filter((key) => contracts[key] !== undefined);
  const anyLoading = activeWallets.some((key) => contracts[key]?.loading === true);

  if (activeWallets.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="contract-metrics-heading" className="space-y-6">
      <FadeIn duration={450}>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-8 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 font-mono text-[10px] font-medium text-blue-300 shadow-sm shadow-blue-500/20"
            aria-hidden="true"
          >
            SC
          </span>
          <p className="text-xs font-medium uppercase tracking-widest text-blue-300/70">
            Contract Analytics
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={STAGGER_MS} duration={500}>
        <h2
          id="contract-metrics-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          Per-Wallet Contracts
        </h2>
      </FadeIn>

      {anyLoading ? (
        <div role="status" aria-live="polite" aria-busy="true">
          <StatusMessage message="Analyzing contract deployments..." active />
        </div>
      ) : null}

      <div className="space-y-8">
        {activeWallets.map((walletKey, index) => {
          const metrics = contracts[walletKey];
          if (!metrics) {
            return null;
          }

          return (
            <FadeIn
              key={walletKey}
              delay={STAGGER_MS * 2 + index * STAGGER_MS}
              duration={500}
            >
              <WalletContractCard walletKey={walletKey} metrics={metrics} />
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
