import type { WalletMetricsBreakdown } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import {
  dashInteractiveBorder,
  dashInteractiveHoverGlow,
  dashPrimaryGlow,
  dashPrimarySurface,
} from "./glass-styles";

type WalletBreakdownCardProps = {
  wallet: WalletMetricsBreakdown;
};

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export function WalletBreakdownCard({ wallet }: WalletBreakdownCardProps) {
  const stats = [
    { label: "Transactions", value: wallet.transactions },
    { label: "NFTs", value: wallet.nfts },
    { label: "Contracts", value: wallet.contracts },
  ];

  return (
    <article className={cn("group relative rounded-xl p-px", dashInteractiveBorder)}>
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5",
          dashPrimarySurface,
          dashInteractiveHoverGlow,
        )}
      >
        <div
          className={cn(
            dashPrimaryGlow,
            "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          )}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col gap-4">
          <h3
            className={cn(
              "text-base font-semibold tracking-tight",
              getContrastTextClass("glow-blue", "heading"),
            )}
          >
            {wallet.name}
          </h3>

          <dl className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt
                  className={cn(
                    "text-xs font-medium",
                    getContrastTextClass("glow-teal", "label"),
                  )}
                >
                  {stat.label}
                </dt>
                <dd
                  className={cn(
                    "mt-1 font-mono text-lg font-semibold tracking-tight",
                    getContrastTextClass("glow-blue", "value"),
                  )}
                >
                  {formatCount(stat.value)}
                </dd>
              </div>
            ))}
          </dl>

          {wallet.errors && wallet.errors.length > 0 ? (
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Partial data — some metrics unavailable.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
