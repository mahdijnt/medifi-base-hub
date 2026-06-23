"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import type { DeployedContractRecord } from "@/lib/types/contract";

type ContractCardProps = DeployedContractRecord;

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

export function ContractCard({
  contractName,
  contractAddress,
  description,
  deploymentDate,
  basescanUrl,
}: ContractCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — no visual feedback
    }
  }

  return (
    <article
      className={cn(
        "group relative rounded-xl p-px",
        "bg-gradient-to-br from-[var(--accent-blue)]/14 via-[var(--accent-cyan)]/8 to-[var(--accent-purple)]/6",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-[0_0_22px_-6px_var(--glow-blue-soft)]",
        "hover:from-[var(--accent-blue)]/20 hover:via-[var(--accent-cyan)]/12 hover:to-[var(--accent-purple)]/10",
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5",
          "border border-[var(--accent-blue)]/18 bg-[var(--accent-blue)]/[0.05] backdrop-blur-[12px]",
          "transition-colors duration-300",
          "group-hover:border-[var(--accent-cyan)]/30",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,var(--glow-blue-soft),transparent_65%)] opacity-50"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                "text-base font-semibold tracking-tight",
                getContrastTextClass("glow-blue", "value"),
              )}
            >
              {contractName}
            </h3>

            <button
              type="button"
              onClick={() => void handleCopy()}
              aria-label={`Copy contract address ${contractAddress}`}
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-md",
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

          <p
            className={cn(
              "font-mono text-sm",
              getContrastTextClass("glow-cyan", "muted"),
            )}
            title={contractAddress}
          >
            {truncateAddress(contractAddress)}
          </p>

          {copied ? (
            <p
              className="text-xs font-medium text-emerald-700 dark:text-emerald-400/90"
              role="status"
            >
              Copied!
            </p>
          ) : null}

          <p
            className={cn(
              "text-sm leading-relaxed",
              getContrastTextClass("glass-blue", "muted"),
            )}
          >
            {description}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <time
              dateTime={deploymentDate.toISOString()}
              className={cn("text-xs", getContrastTextClass("glow-teal", "muted"))}
            >
              Deployed {formatDeploymentDate(deploymentDate)}
            </time>

            <a
              href={basescanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                "border border-[var(--accent-blue)]/25 bg-[var(--accent-blue)]/10 text-blue-800",
                "transition-colors duration-200",
                "hover:border-[var(--accent-cyan)]/35 hover:bg-[var(--accent-cyan)]/12 hover:text-blue-900",
                "dark:text-blue-200 dark:hover:text-blue-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)]/40",
              )}
            >
              BaseScan
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
