"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";

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
          "border border-[var(--accent-blue)]/18 bg-gradient-to-br from-[var(--accent-blue)]/8 via-[var(--accent-cyan)]/4 to-transparent",
          "backdrop-blur-sm transition-all duration-300",
          "hover:border-[var(--accent-cyan)]/28 hover:shadow-[0_0_14px_-4px_var(--glow-blue-soft)]",
          "sm:hover:shadow-[0_0_16px_-4px_var(--glow-blue-soft)]",
          "hover:from-[var(--accent-blue)]/12",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="size-1.5 shrink-0 rounded-full bg-[var(--accent-blue)] shadow-[0_0_4px_var(--glow-blue-soft)]"
            aria-hidden="true"
          />
          <span
            className={cn(
              "truncate font-mono text-sm font-medium transition-colors",
              getContrastTextClass("glow-blue", "value"),
              "group-hover:text-slate-900 dark:group-hover:text-white/95",
            )}
            title={contract.address}
          >
            {truncateAddress(contract.address)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 pl-3.5 sm:pl-0">
          <time
            dateTime={contract.deployedAt.toISOString()}
            className={cn("text-xs", getContrastTextClass("glow-teal", "muted"))}
          >
            {formatDeploymentDate(contract.deployedAt)}
          </time>

          <button
            type="button"
            onClick={() => void handleCopy()}
            aria-label={`Copy contract address ${contract.address}`}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md",
              "border border-[var(--accent-purple)]/22 bg-[var(--accent-purple)]/8 text-violet-800",
              "transition-all duration-200",
              "hover:border-[var(--accent-purple)]/35 hover:bg-[var(--accent-purple)]/14 hover:text-violet-900",
              "dark:text-violet-200 dark:hover:text-violet-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)]/40",
              copied &&
                "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 shadow-[0_0_10px_-2px_rgba(52,211,153,0.4)] dark:text-emerald-400",
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
          className="mt-1 text-right text-xs font-medium text-emerald-700 transition-opacity duration-200 dark:text-emerald-400/90"
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
      <p
        className={cn(
          "rounded-lg border border-[var(--accent-blue)]/15 bg-[var(--accent-blue)]/[0.04] px-4 py-3 text-sm backdrop-blur-sm",
          getContrastTextClass("glow-blue", "muted"),
        )}
      >
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
          "border border-[var(--accent-purple)]/18 bg-[var(--accent-purple)]/[0.06] text-sm font-medium backdrop-blur-sm",
          getContrastTextClass("glow-purple", "label"),
          "transition-all duration-300",
          "hover:border-[var(--accent-purple)]/30 hover:bg-[var(--accent-purple)]/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-purple)]/40",
        )}
      >
        <span>
          {contracts.length.toLocaleString("en-US")} contract
          {contracts.length === 1 ? "" : "s"}
        </span>
        <span
          className={cn(
            "text-violet-700/80 transition-transform duration-300 dark:text-violet-300/70",
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
