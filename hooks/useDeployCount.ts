"use client";

import { useEffect, useState } from "react";
import { BUILDER_WALLET_ADDRESSES } from "@/lib/runtimeWalletRegistry";
import { fetchContractDeploymentAnalytics } from "@/lib/services/contracts-client";

type UseDeployCountResult = {
  deployCount: number | null;
  loading: boolean;
  error: string | null;
};

export function useDeployCount(
  address: string = BUILDER_WALLET_ADDRESSES.base,
): UseDeployCountResult {
  const [deployCount, setDeployCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchContractDeploymentAnalytics(address);

        if (cancelled) return;

        if ("error" in result) {
          setDeployCount(null);
          setError(result.error);
        } else {
          setDeployCount(result.data.total);
          setError(null);
        }
      } catch {
        if (cancelled) return;
        setDeployCount(null);
        setError("Contract analytics unavailable");
      }

      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [address]);

  return { deployCount, loading, error };
}
