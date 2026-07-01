"use client";

import { useEffect, useState } from "react";
import { githubConfig } from "@/data/github";
import { fetchGithubMetrics } from "@/lib/services/github-client";

type UseGithubCommitsResult = {
  commits: number | null;
  loading: boolean;
  error: string | null;
};

export function useGithubCommits(
  username: string = githubConfig.username,
): UseGithubCommitsResult {
  const [commits, setCommits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchGithubMetrics(username);

        if (cancelled) return;

        if ("error" in result) {
          setCommits(null);
          setError(result.error);
        } else {
          setCommits(result.data.totalCommits);
          setError(null);
        }
      } catch {
        if (cancelled) return;
        setCommits(null);
        setError("GitHub analytics unavailable");
      }

      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [username]);

  return { commits, loading, error };
}
