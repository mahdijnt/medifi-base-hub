"use client";

import { useEffect, useState } from "react";
import {
  computeGoalProgress,
  currentGoals,
  goalDefinitions,
  type Goal,
} from "@/data/goals";
import { githubConfig } from "@/data/github";
import { getTotalCommitCount, getWeb3RepoCount } from "@/lib/api/github";
import { BUILDER_WALLET_ADDRESSES } from "@/lib/runtimeWalletRegistry";
import { getContractDeploymentAnalytics } from "@/lib/services/contracts";
import { getTransactionAnalytics } from "@/lib/services/transactions";

type GoalMetrics = {
  githubCommits: number | null;
  baseDeployments: number | null;
  web3Repos: number | null;
  farcasterTxs: number | null;
};

type UseGoalProgressResult = {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  metrics: GoalMetrics;
};

function buildGoalsFromMetrics(metrics: GoalMetrics): Goal[] {
  return goalDefinitions.map((def) => {
    let currentValue: number | null = null;

    switch (def.dynamic) {
      case "github-commits":
        currentValue = metrics.githubCommits;
        break;
      case "base-deployments":
        currentValue = metrics.baseDeployments;
        break;
      case "web3-repos":
        currentValue = metrics.web3Repos;
        break;
      case "farcaster-txs":
        currentValue = metrics.farcasterTxs;
        break;
      case "static":
        return {
          id: def.id,
          title: def.title,
          tag: def.tag,
          progress: def.staticProgress ?? 0,
        };
    }

    const progress =
      currentValue !== null
        ? computeGoalProgress(currentValue, def.targetValue)
        : (def.staticProgress ?? 0);

    return {
      id: def.id,
      title: def.title,
      tag: def.tag,
      progress,
    };
  });
}

const EMPTY_METRICS: GoalMetrics = {
  githubCommits: null,
  baseDeployments: null,
  web3Repos: null,
  farcasterTxs: null,
};

export function useGoalProgress(): UseGoalProgressResult {
  const [metrics, setMetrics] = useState<GoalMetrics>(EMPTY_METRICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const [
        commitsResult,
        deployResult,
        web3Result,
        txResult,
      ] = await Promise.all([
        getTotalCommitCount(githubConfig.username),
        getContractDeploymentAnalytics(BUILDER_WALLET_ADDRESSES.base),
        getWeb3RepoCount(githubConfig.username),
        getTransactionAnalytics(BUILDER_WALLET_ADDRESSES.farcaster),
      ]);

      if (cancelled) return;

      const errors: string[] = [];

      const nextMetrics: GoalMetrics = {
        githubCommits:
          "data" in commitsResult ? commitsResult.data : null,
        baseDeployments:
          "data" in deployResult ? deployResult.data.total : null,
        web3Repos: "data" in web3Result ? web3Result.data : null,
        farcasterTxs: "data" in txResult ? txResult.data.total : null,
      };

      if ("error" in commitsResult) errors.push(commitsResult.error);
      if ("error" in deployResult) errors.push(deployResult.error);
      if ("error" in web3Result) errors.push(web3Result.error);
      if ("error" in txResult) errors.push(txResult.error);

      setMetrics(nextMetrics);
      setError(errors.length > 0 ? errors[0] : null);
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const goals = loading
    ? currentGoals
    : buildGoalsFromMetrics(metrics);

  return { goals, loading, error, metrics };
}
