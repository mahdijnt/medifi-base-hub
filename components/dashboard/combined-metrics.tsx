"use client";

import { useEffect, useState } from "react";
import { CombinedSummary } from "@/components/dashboard/combined-summary";
import { WalletBreakdownGrid } from "@/components/dashboard/wallet-breakdown-grid";
import { FadeIn } from "@/components/ui/fade-in";
import { getCombinedBuilderMetrics } from "@/lib/services/combined";
import type { CombinedBuilderMetrics } from "@/lib/types/analytics";

const STAGGER_MS = 120;

export function CombinedMetrics() {
  const [metrics, setMetrics] = useState<CombinedBuilderMetrics | null>(null);
  const [combinedLoading, setCombinedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCombinedMetrics() {
      setCombinedLoading(true);
      setError(null);

      const result = await getCombinedBuilderMetrics();

      if (cancelled) {
        return;
      }

      if ("error" in result) {
        setMetrics(null);
        setError(result.error);
      } else {
        setMetrics(result.data);
        setError(null);
      }

      setCombinedLoading(false);
    }

    void loadCombinedMetrics();

    return () => {
      cancelled = true;
    };
  }, []);

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

      <CombinedSummary
        totals={metrics?.totals ?? null}
        loading={combinedLoading}
      />

      <WalletBreakdownGrid
        wallets={metrics?.perWallet ?? null}
        loading={combinedLoading}
      />
    </section>
  );
}
