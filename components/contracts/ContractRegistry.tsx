"use client";

import { useEffect, useState } from "react";
import { ContractCard } from "./ContractCard";
import { fetchDeployedContracts } from "@/lib/services/contracts-client";
import { ContractRegistrySkeleton } from "@/components/loading/ContractRegistrySkeleton";
import { FadeIn } from "@/components/ui/fade-in";
import type { DeployedContractRecord } from "@/lib/types/contract";
import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";

const STAGGER_MS = 150;

type ContractRegistryProps = {
  walletAddresses: string[];
};

function dedupeContracts(
  contracts: DeployedContractRecord[],
): DeployedContractRecord[] {
  const seen = new Set<string>();
  const deduped: DeployedContractRecord[] = [];

  for (const contract of contracts) {
    const key = contract.contractAddress.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(contract);
  }

  return deduped.sort(
    (a, b) => a.deploymentDate.getTime() - b.deploymentDate.getTime(),
  );
}

function RegistryErrorCard({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3",
        "text-sm text-red-700 dark:text-red-400",
      )}
    >
      {message}
    </div>
  );
}

export function ContractRegistry({ walletAddresses }: ContractRegistryProps) {
  const [contracts, setContracts] = useState<DeployedContractRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadContracts() {
      setLoading(true);
      setError(null);

      const addresses = walletAddresses.map((address) => address.trim()).filter(Boolean);

      if (addresses.length === 0) {
        setContracts([]);
        setLoading(false);
        return;
      }

      const results = await Promise.all(
        addresses.map((address) => fetchDeployedContracts(address)),
      );

      if (cancelled) {
        return;
      }

      const errors = results
        .filter((result): result is { error: string } => "error" in result)
        .map((result) => result.error);

      const merged = dedupeContracts(
        results.flatMap((result) => ("data" in result ? result.data : [])),
      );

      setContracts(merged);

      if (merged.length === 0 && errors.length === addresses.length) {
        setError(errors[0] ?? "Failed to load deployed contracts.");
      } else {
        setError(null);
      }

      setLoading(false);
    }

    void loadContracts();

    return () => {
      cancelled = true;
    };
  }, [walletAddresses]);

  return (
    <section
      aria-labelledby="contract-registry-heading"
      className="pb-16 sm:pb-20"
    >
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <FadeIn duration={150}>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
              aria-hidden="true"
            >
              CR
            </span>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Registry
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={STAGGER_MS} duration={150}>
          <h2
            id="contract-registry-heading"
            className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Contract Registry
          </h2>
        </FadeIn>

        <FadeIn delay={STAGGER_MS * 2} duration={150}>
          {loading ? (
            <ContractRegistrySkeleton />
          ) : error ? (
            <RegistryErrorCard message={error} />
          ) : contracts.length === 0 ? (
            <p
              className={cn(
                "rounded-xl border border-[var(--accent-blue)]/18 bg-[var(--accent-blue)]/[0.05] px-4 py-6 text-center text-sm backdrop-blur-sm",
                getContrastTextClass("glow-blue", "muted"),
              )}
            >
              No deployed contracts found.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contracts.map((contract, index) => (
                <FadeIn
                  key={contract.contractAddress}
                  delay={STAGGER_MS * 2 + index * STAGGER_MS}
                  duration={150}
                >
                  <ContractCard {...contract} />
                </FadeIn>
              ))}
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
