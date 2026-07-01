"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { NftCollectionSkeleton, NftMetricSkeleton, StatusMessage } from "@/components/loading";
import { CollectionList } from "@/components/nft/CollectionList";
import type { NftCollection } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";
import { getAccentLabelClass, getContrastTextClass } from "@/utils/color/autoTextColor";
import {
  dashInteractiveBorder,
  dashInteractiveHoverGlow,
  dashPrimaryGlow,
  dashPrimarySurface,
} from "./glass-styles";

const STAGGER_MS = 80;

export type NFTMetrics = {
  total: number;
  collections: NftCollection[];
  loading?: boolean;
  error?: string;
};

export type NftsState = {
  main?: NFTMetrics;
  farcaster?: NFTMetrics;
  baseapp?: NFTMetrics;
};

type NftWalletKey = keyof NftsState;

const WALLET_ORDER: NftWalletKey[] = ["main", "farcaster", "baseapp"];

const WALLET_LABELS: Record<NftWalletKey, string> = {
  main: "Main Base Wallet",
  farcaster: "Farcaster Wallet",
  baseapp: "Base App Wallet",
};

type NftMetricsSectionProps = {
  nfts: NftsState;
};

function isEmptyMetrics(metrics: NFTMetrics): boolean {
  return metrics.total === 0 && metrics.collections.length === 0;
}

type NftMetricCardProps = {
  label: string;
  value: string;
};

function NftMetricCard({ label, value }: NftMetricCardProps) {
  return (
    <article className={cn("group relative rounded-xl p-px", dashInteractiveBorder)}>
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5",
          dashPrimarySurface,
          dashInteractiveHoverGlow,
        )}
      >
        <div
          className={cn(
            dashPrimaryGlow,
            "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          )}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <p
            className={cn(
              "text-sm font-medium",
              getContrastTextClass("glow-blue", "label"),
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-mono text-4xl font-bold tracking-tight",
              getContrastTextClass("glow-blue", "value"),
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

type WalletNftCardProps = {
  walletKey: NftWalletKey;
  metrics: NFTMetrics;
};

function WalletNftCard({ walletKey, metrics }: WalletNftCardProps) {
  const label = WALLET_LABELS[walletKey];

  if (metrics.loading) {
    return (
      <div className="space-y-4">
        <h3
          className={cn(
            "text-base font-semibold tracking-tight",
            getContrastTextClass("glass", "heading"),
          )}
        >
          {label}
        </h3>
        <NftMetricSkeleton />
        <div className="space-y-2">
          <p className={cn("text-sm font-medium", getAccentLabelClass("secondary"))}>
            Collections
          </p>
          <NftCollectionSkeleton />
        </div>
      </div>
    );
  }

  if (metrics.error) {
    return (
      <div className="space-y-3">
        <h3
          className={cn(
            "text-base font-semibold tracking-tight",
            getContrastTextClass("glass", "heading"),
          )}
        >
          {label}
        </h3>
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {metrics.error}
        </p>
      </div>
    );
  }

  if (isEmptyMetrics(metrics)) {
    return (
      <div className="space-y-3">
        <h3
          className={cn(
            "text-base font-semibold tracking-tight",
            getContrastTextClass("glass", "heading"),
          )}
        >
          {label}
        </h3>
        <p
          className={cn(
            "rounded-lg border border-[var(--accent-blue)]/15 bg-[var(--accent-blue)]/[0.04] px-4 py-3 text-sm backdrop-blur-sm",
            getContrastTextClass("glow-blue", "muted"),
          )}
        >
          No NFTs found for this wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3
        className={cn(
          "text-base font-semibold tracking-tight",
          getContrastTextClass("glass", "heading"),
        )}
      >
        {label}
      </h3>

      <div className="max-w-sm">
        <NftMetricCard
          label="Total NFT Count"
          value={metrics.total.toLocaleString("en-US")}
        />
      </div>

      <div className="space-y-3">
        <p className={cn("text-sm font-medium", getAccentLabelClass("secondary"))}>
          Collections ({metrics.collections.length.toLocaleString("en-US")})
        </p>
        <CollectionList collections={metrics.collections} />
      </div>
    </div>
  );
}

export function NftMetricsSection({ nfts }: NftMetricsSectionProps) {
  const activeWallets = WALLET_ORDER.filter((key) => nfts[key] !== undefined);
  const anyLoading = activeWallets.some((key) => nfts[key]?.loading === true);

  if (activeWallets.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="nft-metrics-heading" className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[var(--accent-blue)]/22 bg-[var(--accent-blue)]/8 font-mono text-[10px] font-medium text-blue-800 shadow-sm shadow-[var(--glow-blue-soft)] dark:text-blue-200"
            aria-hidden="true"
          >
            NFT
          </span>
          <p className={`text-xs font-medium uppercase tracking-widest ${getAccentLabelClass("primary")}`}>
            NFT Analytics
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={STAGGER_MS}>
        <h2
          id="nft-metrics-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          Per-Wallet NFTs
        </h2>
      </FadeIn>

      {anyLoading ? (
        <div role="status" aria-live="polite" aria-busy="true">
          <StatusMessage message="Analyzing NFTs..." active />
        </div>
      ) : null}

      <div className="space-y-8">
        {activeWallets.map((walletKey, index) => {
          const metrics = nfts[walletKey];
          if (!metrics) {
            return null;
          }

          return (
            <FadeIn key={walletKey} delay={STAGGER_MS * 2 + index * STAGGER_MS}>
              <WalletNftCard walletKey={walletKey} metrics={metrics} />
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
