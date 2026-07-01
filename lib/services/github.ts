import "server-only";

import { githubConfig } from "@/data/github";
import { getGithubMetrics } from "@/lib/api/github";
import type { GithubMetricsResult } from "@/lib/types/analytics";

/** GitHub rate limits are tight (30 search req/min) — cache for 10 minutes. */
const CACHE_TTL_MS = 10 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  result: GithubMetricsResult;
};

const metricsCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<GithubMetricsResult>>();

function cacheKey(username: string): string {
  return username.trim().toLowerCase();
}

function getCached(username: string): GithubMetricsResult | null {
  const entry = metricsCache.get(cacheKey(username));
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    metricsCache.delete(cacheKey(username));
    return null;
  }

  console.log(`[github] cache hit for ${username}`);
  return entry.result;
}

function setCache(username: string, result: GithubMetricsResult): void {
  // Only cache successes so transient upstream failures retry promptly.
  if ("error" in result) {
    return;
  }

  metricsCache.set(cacheKey(username), {
    expiresAt: Date.now() + CACHE_TTL_MS,
    result,
  });
}

/**
 * Server-only: fetches GitHub builder metrics (total commits, public repo
 * count, Web3 repo count) with in-memory caching and in-flight deduplication.
 */
export async function getGithubMetricsCached(
  username: string = githubConfig.username,
): Promise<GithubMetricsResult> {
  const normalizedUsername = username.trim();

  if (!normalizedUsername) {
    return { error: "GitHub username is required." };
  }

  const cached = getCached(normalizedUsername);
  if (cached) {
    return cached;
  }

  const key = cacheKey(normalizedUsername);
  const pending = inFlight.get(key);
  if (pending) {
    return pending;
  }

  const request = (async () => {
    try {
      console.log(`[github] fetching metrics for ${normalizedUsername}`);
      const result = await getGithubMetrics(normalizedUsername);
      setCache(normalizedUsername, result);
      return result;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch GitHub metrics.";
      return { error: message };
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, request);
  return request;
}
