"use client";

import { useEffect, useState } from "react";
import { githubConfig } from "@/data/github";
import { getTotalCommitCount } from "@/lib/api/github";

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

      const result = await getTotalCommitCount(username);

      if (cancelled) return;

      if ("error" in result) {
        setCommits(null);
        setError(result.error);
      } else {
        setCommits(result.data);
        setError(null);
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
