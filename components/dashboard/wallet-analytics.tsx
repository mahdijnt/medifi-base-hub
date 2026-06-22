"use client";

import { useEffect, useState } from "react";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { WalletSelector } from "@/components/dashboard/wallet-selector";
import { getNftAnalytics } from "@/lib/services/nft";
import { getTransactionAnalytics } from "@/lib/services/transactions";
import type { NftAnalytics, TransactionAnalytics } from "@/lib/types/analytics";
import { getAllWallets } from "@/lib/walletRegistry";

export function WalletAnalytics() {
  const wallets = getAllWallets();
  const [selectedId, setSelectedId] = useState(() => wallets[0]?.id ?? "");
  const [transactionAnalytics, setTransactionAnalytics] =
    useState<TransactionAnalytics | null>(null);
  const [nftAnalytics, setNftAnalytics] = useState<NftAnalytics | null>(null);
  const [txLoading, setTxLoading] = useState(true);
  const [nftLoading, setNftLoading] = useState(true);
  const [txError, setTxError] = useState<string | null>(null);
  const [nftError, setNftError] = useState<string | null>(null);

  const selectedWallet = wallets.find((wallet) => wallet.id === selectedId);
  const selectedAddress = selectedWallet?.address;

  useEffect(() => {
    if (!selectedAddress) {
      setTransactionAnalytics(null);
      setNftAnalytics(null);
      setTxLoading(false);
      setNftLoading(false);
      setTxError(null);
      setNftError(null);
      setTxError(
        wallets.length === 0
          ? "No wallets are configured in the registry."
          : null,
      );
      return;
    }

    const address = selectedAddress;
    let cancelled = false;

    async function loadAnalytics() {
      setTxLoading(true);
      setNftLoading(true);
      setTxError(null);
      setNftError(null);

      const [txResult, nftResult] = await Promise.all([
        getTransactionAnalytics(address),
        getNftAnalytics(address),
      ]);

      if (cancelled) {
        return;
      }

      if ("error" in txResult) {
        setTransactionAnalytics(null);
        setTxError(txResult.error);
      } else {
        setTransactionAnalytics(txResult.data);
        setTxError(null);
      }

      if ("error" in nftResult) {
        setNftAnalytics(null);
        setNftError(nftResult.error);
      } else {
        setNftAnalytics(nftResult.data);
        setNftError(null);
      }

      setTxLoading(false);
      setNftLoading(false);
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
      <MetricsGrid
        transactionAnalytics={transactionAnalytics}
        nftAnalytics={nftAnalytics}
        txLoading={txLoading}
        nftLoading={nftLoading}
        txError={txError}
        nftError={nftError}
      />
    </>
  );
}
