"use client";

import { useEffect, useState } from "react";
import { githubConfig } from "@/data/github";
import { getPublicRepoCount, getTotalCommitCount } from "@/lib/api/github";
import { BUILDER_WALLET_ADDRESSES } from "@/lib/runtimeWalletRegistry";
import { getContractDeploymentAnalytics } from "@/lib/services/contracts";
import { getTransactionAnalytics } from "@/lib/services/transactions";

/** Farcaster wallet activity weighted higher for social onchain identity */
const FARCASTER_TX_WEIGHT = 1.2;
/** Main Base wallet activity baseline weight */
const BASE_TX_WEIGHT = 1.0;

export function computeOnchainIdentityScore(
  farcasterTxCount: number,
  baseTxCount: number,
): number {
  return Math.round(
    farcasterTxCount * FARCASTER_TX_WEIGHT + baseTxCount * BASE_TX_WEIGHT,
  );
}

type MetricState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type BuilderSnapshotMetrics = {
  deployments: MetricState<number>;
  commits: MetricState<number>;
  projects: MetricState<number>;
  identityScore: MetricState<number>;
};

const INITIAL_METRIC = <T,>(): MetricState<T> => ({
  data: null,
  loading: true,
  error: null,
});

const INITIAL_METRICS: BuilderSnapshotMetrics = {
  deployments: INITIAL_METRIC(),
  commits: INITIAL_METRIC(),
  projects: INITIAL_METRIC(),
  identityScore: INITIAL_METRIC(),
};

type UseBuilderSnapshotResult = {
  metrics: BuilderSnapshotMetrics;
  loading: boolean;
};

export function useBuilderSnapshot(): UseBuilderSnapshotResult {
  const [metrics, setMetrics] = useState<BuilderSnapshotMetrics>(INITIAL_METRICS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setMetrics({
        deployments: { data: null, loading: true, error: null },
        commits: { data: null, loading: true, error: null },
        projects: { data: null, loading: true, error: null },
        identityScore: { data: null, loading: true, error: null },
      });

      const [
        deployResult,
        commitsResult,
        projectsResult,
        farcasterTxResult,
        baseTxResult,
      ] = await Promise.all([
        getContractDeploymentAnalytics(BUILDER_WALLET_ADDRESSES.base),
        getTotalCommitCount(githubConfig.username),
        getPublicRepoCount(githubConfig.username),
        getTransactionAnalytics(BUILDER_WALLET_ADDRESSES.farcaster),
        getTransactionAnalytics(BUILDER_WALLET_ADDRESSES.base),
      ]);

      if (cancelled) return;

      const deployments: MetricState<number> = {
        loading: false,
        data: "data" in deployResult ? deployResult.data.total : null,
        error: "error" in deployResult ? deployResult.error : null,
      };

      const commits: MetricState<number> = {
        loading: false,
        data: "data" in commitsResult ? commitsResult.data : null,
        error: "error" in commitsResult ? commitsResult.error : null,
      };

      const projects: MetricState<number> = {
        loading: false,
        data: "data" in projectsResult ? projectsResult.data : null,
        error: "error" in projectsResult ? projectsResult.error : null,
      };

      const farcasterTx =
        "data" in farcasterTxResult ? farcasterTxResult.data.total : null;
      const baseTx = "data" in baseTxResult ? baseTxResult.data.total : null;

      const txErrors: string[] = [];
      if ("error" in farcasterTxResult) txErrors.push(farcasterTxResult.error);
      if ("error" in baseTxResult) txErrors.push(baseTxResult.error);

      const identityScore: MetricState<number> = {
        loading: false,
        data:
          farcasterTx !== null && baseTx !== null
            ? computeOnchainIdentityScore(farcasterTx, baseTx)
            : null,
        error: txErrors.length > 0 ? txErrors[0] : null,
      };

      setMetrics({ deployments, commits, projects, identityScore });
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const loading = Object.values(metrics).some((metric) => metric.loading);

  return { metrics, loading };
}
