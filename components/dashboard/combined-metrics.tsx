"use client";

import { useEffect, useState } from "react";
import { CombinedSummary } from "@/components/dashboard/combined-summary";
import { WalletBreakdownGrid } from "@/components/dashboard/wallet-breakdown-grid";
import { StatusMessage } from "@/components/loading";
import { FadeIn } from "@/components/ui/fade-in";
import type { CombinedBuilderMetrics } from "@/lib/types/analytics";

const STAGGER_MS = 120;

const ANALYTICS_STATUS_MESSAGES = [
  "Analyzing transactions...",
  "Analyzing NFTs...",
  "Analyzing contracts...",
] as const;

const STATUS_REVEAL_MS = 450;

type CombinedMetricsProps = {
  metrics: CombinedBuilderMetrics | null;
  loading: boolean;
  error: string | null;
  walletCount: number;
};

export function CombinedMetrics({
  metrics,
  loading,
  error,
  walletCount,
}: CombinedMetricsProps) {
  const [revealedStatusCount, setRevealedStatusCount] = useState(0);

  useEffect(() => {
    if (!loading) {
      setRevealedStatusCount(0);
      return;
    }

    setRevealedStatusCount(1);

    const timers = ANALYTICS_STATUS_MESSAGES.slice(1).map((_, index) =>
      window.setTimeout(
        () => setRevealedStatusCount(index + 2),
        (index + 1) * STATUS_REVEAL_MS,
      ),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [loading]);

  return (
    <section aria-labelledby="combined-metrics-heading" className="space-y-6">
      <FadeIn duration={450}>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
            aria-hidden="true"
          >
            CM
          </span>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Combined Metrics
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={STAGGER_MS} duration={500}>
        <h2
          id="combined-metrics-heading"
          className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          Builder Command Center
        </h2>
      </FadeIn>

      {error ? (
        <FadeIn delay={STAGGER_MS * 2} duration={500}>
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        </FadeIn>
      ) : null}

      {loading ? (
        <div
          className="space-y-1.5 py-1"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          {ANALYTICS_STATUS_MESSAGES.map((message, index) => (
            <StatusMessage
              key={message}
              message={message}
              active={index < revealedStatusCount}
            />
          ))}
        </div>
      ) : null}

      <CombinedSummary
        totals={metrics?.totals ?? null}
        loading={loading}
      />

      <WalletBreakdownGrid
        wallets={metrics?.perWallet ?? null}
        loading={loading}
        placeholderCount={walletCount}
      />
    </section>
  );
}
