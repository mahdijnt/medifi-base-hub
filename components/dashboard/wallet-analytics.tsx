"use client";

import { useEffect, useState } from "react";
import { ContractsList } from "@/components/dashboard/contracts-list";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { WalletSelector } from "@/components/dashboard/wallet-selector";
import { fetchContractDeploymentAnalytics } from "@/lib/services/contracts-client";
import { getNftAnalytics } from "@/lib/services/nft";
import { getTransactionAnalytics } from "@/lib/services/transactions";
import type {
  ContractDeploymentAnalytics,
  NftAnalytics,
  TransactionAnalytics,
} from "@/lib/types/analytics";
import type { Wallet } from "@/types/wallet";

type WalletAnalyticsProps = {
  wallets: Wallet[];
};

export function WalletAnalytics({ wallets }: WalletAnalyticsProps) {
  const [selectedId, setSelectedId] = useState(() => wallets[0]?.id ?? "");
  const [transactionAnalytics, setTransactionAnalytics] =
    useState<TransactionAnalytics | null>(null);
  const [nftAnalytics, setNftAnalytics] = useState<NftAnalytics | null>(null);
  const [contractAnalytics, setContractAnalytics] =
    useState<ContractDeploymentAnalytics | null>(null);
  const [txLoading, setTxLoading] = useState(true);
  const [nftLoading, setNftLoading] = useState(true);
  const [contractLoading, setContractLoading] = useState(true);
  const [txError, setTxError] = useState<string | null>(null);
  const [nftError, setNftError] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);

  useEffect(() => {
    if (wallets.length === 0) {
      setSelectedId("");
      return;
    }

    if (!wallets.some((wallet) => wallet.id === selectedId)) {
      setSelectedId(wallets[0].id);
    }
  }, [wallets, selectedId]);

  const selectedWallet = wallets.find((wallet) => wallet.id === selectedId);
  const selectedAddress = selectedWallet?.address;

  useEffect(() => {
    if (!selectedAddress) {
      setTransactionAnalytics(null);
      setNftAnalytics(null);
      setContractAnalytics(null);
      setTxLoading(false);
      setNftLoading(false);
      setContractLoading(false);
      setTxError(null);
      setNftError(null);
      setContractError(null);
      return;
    }

    const address = selectedAddress;
    let cancelled = false;

    async function loadAnalytics() {
      setTxLoading(true);
      setNftLoading(true);
      setContractLoading(true);
      setTxError(null);
      setNftError(null);
      setContractError(null);

      const [txResult, nftResult, contractResult] = await Promise.all([
        getTransactionAnalytics(address),
        getNftAnalytics(address),
        fetchContractDeploymentAnalytics(address),
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

      if ("error" in contractResult) {
        setContractAnalytics(null);
        setContractError(contractResult.error);
      } else {
        setContractAnalytics(contractResult.data);
        setContractError(null);
      }

      setTxLoading(false);
      setNftLoading(false);
      setContractLoading(false);
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [selectedAddress]);

  if (wallets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <WalletSelector
        wallets={wallets}
        selectedId={selectedId}
        onChange={setSelectedId}
      />
      <MetricsGrid
        transactionAnalytics={transactionAnalytics}
        nftAnalytics={nftAnalytics}
        contractAnalytics={contractAnalytics}
        txLoading={txLoading}
        nftLoading={nftLoading}
        contractLoading={contractLoading}
        txError={txError}
        nftError={nftError}
        contractError={contractError}
      />
      <ContractsList
        contracts={contractAnalytics?.contracts ?? null}
        loading={contractLoading}
        error={contractError}
      />
    </div>
  );
}
