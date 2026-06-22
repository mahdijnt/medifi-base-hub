"use client";

import { useEffect, useState } from "react";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { WalletSelector } from "@/components/dashboard/wallet-selector";
import { getTransactionAnalytics } from "@/lib/services/transactions";
import type { TransactionAnalytics } from "@/lib/types/analytics";
import { getAllWallets } from "@/lib/walletRegistry";

export function TransactionAnalytics() {
  const wallets = getAllWallets();
  const [selectedId, setSelectedId] = useState(() => wallets[0]?.id ?? "");
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedWallet = wallets.find((wallet) => wallet.id === selectedId);
  const selectedAddress = selectedWallet?.address;

  useEffect(() => {
    if (!selectedAddress) {
      setAnalytics(null);
      setLoading(false);
      setError(
        wallets.length === 0
          ? "No wallets are configured in the registry."
          : null,
      );
      return;
    }

    const address = selectedAddress;
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      setError(null);

      const result = await getTransactionAnalytics(address);

      if (cancelled) {
        return;
      }

      if ("error" in result) {
        setAnalytics(null);
        setError(result.error);
      } else {
        setAnalytics(result.data);
        setError(null);
      }

      setLoading(false);
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [selectedAddress, wallets.length]);

  return (
    <>
      <WalletSelector
        wallets={wallets}
        selectedId={selectedId}
        onChange={setSelectedId}
      />
      <MetricsGrid analytics={analytics} loading={loading} error={error} />
    </>
  );
}
