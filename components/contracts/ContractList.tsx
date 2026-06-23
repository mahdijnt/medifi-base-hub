"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ContractEntry = {
  address: string;
  deployedAt: Date;
};

type ContractListProps = {
  contracts: ContractEntry[];
  defaultExpanded?: boolean;
};

function truncateAddress(address: string): string {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatDeploymentDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type ContractRowProps = {
  contract: ContractEntry;
};

function ContractRow({ contract }: ContractRowProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(contract.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — no visual feedback
    }
  }

  return (
    <li>
      <div
        className={cn(
          "group flex flex-col gap-2 rounded-lg px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between",
          "border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent",
          "backdrop-blur-sm transition-all duration-300",
          "hover:border-blue-400/40 hover:shadow-[0_0_16px_-2px_rgba(59,130,246,0.35)]",
          "hover:from-blue-500/20",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="size-1.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]"
            aria-hidden="true"
          />
          <span
            className="truncate font-mono text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground"
            title={contract.address}
          >
            {truncateAddress(contract.address)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 pl-3.5 sm:pl-0">
          <time
            dateTime={contract.deployedAt.toISOString()}
            className="text-xs text-blue-200/60 dark:text-blue-300/60"
          >
            {formatDeploymentDate(contract.deployedAt)}
          </time>

          <button
            type="button"
            onClick={() => void handleCopy()}
            aria-label={`Copy contract address ${contract.address}`}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md",
              "border border-blue-500/25 bg-blue-500/10 text-blue-300/80",
              "transition-all duration-200",
              "hover:border-blue-400/50 hover:bg-blue-500/20 hover:text-blue-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
              copied &&
                "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-[0_0_12px_-2px_rgba(52,211,153,0.5)]",
            )}
          >
            {copied ? (
              <span className="text-xs font-semibold tracking-wide">✓</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M15.75 11.25V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v6A2.25 2.25 0 0 0 7.5 13.5h6a2.25 2.25 0 0 0 2.25-2.25Zm-9-1.5h6v-6h-6v6Z"
                  clipRule="evenodd"
                />
                <path d="M6 6.75A2.25 2.25 0 0 0 3.75 9v6.75A2.25 2.25 0 0 0 6 17.25h6.75A2.25 2.25 0 0 0 15 15V9a.75.75 0 0 0-1.5 0v6a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 .75-.75H6Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {copied ? (
        <p
          className="mt-1 text-right text-xs font-medium text-emerald-400/90 transition-opacity duration-200"
          role="status"
        >
          Copied!
        </p>
      ) : null}
    </li>
  );
}

export function ContractList({
  contracts,
  defaultExpanded = true,
}: ContractListProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (contracts.length === 0) {
    return (
      <p className="rounded-lg border border-blue-500/15 bg-blue-500/[0.04] px-4 py-3 text-sm text-muted backdrop-blur-sm">
        No contracts deployed for this wallet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2",
          "border border-blue-500/20 bg-blue-500/[0.06] text-sm font-medium text-blue-200/80",
          "backdrop-blur-sm transition-all duration-300",
          "hover:border-blue-400/35 hover:bg-blue-500/10 hover:text-blue-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
        )}
      >
        <span>
          {contracts.length.toLocaleString("en-US")} contract
          {contracts.length === 1 ? "" : "s"}
        </span>
        <span
          className={cn(
            "text-blue-300/70 transition-transform duration-300",
            expanded ? "rotate-180" : "rotate-0",
          )}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2 pt-1" aria-label="Deployed contracts">
            {contracts.map((contract) => (
              <ContractRow key={contract.address} contract={contract} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
