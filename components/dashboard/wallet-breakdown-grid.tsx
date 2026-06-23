import { FadeIn } from "@/components/ui/fade-in";
import { WalletBreakdownSkeleton } from "@/components/loading";
import type { WalletMetricsBreakdown } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

const STAGGER_MS = 80;

type WalletBreakdownGridProps = {
  wallets: WalletMetricsBreakdown[] | null;
  loading: boolean;
  placeholderCount?: number;
};

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

type WalletBreakdownCardProps = {
  wallet: WalletMetricsBreakdown;
};

function WalletBreakdownCard({ wallet }: WalletBreakdownCardProps) {
  const stats = [
    { label: "Transactions", value: wallet.transactions },
    { label: "NFTs", value: wallet.nfts },
    { label: "Contracts", value: wallet.contracts },
  ];

  return (
    <article
      className={cn(
        "group relative rounded-xl p-px",
        "bg-gradient-to-br from-black/10 via-black/5 to-black/[0.03]",
        "dark:from-white/20 dark:via-white/10 dark:to-white/5",
        "transition-transform duration-300 ease-out hover:scale-[1.03]",
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5",
          "border border-black/[0.08] bg-black/[0.04] backdrop-blur-[12px]",
          "dark:border-white/15 dark:bg-white/[0.08]",
          "shadow-sm transition-shadow duration-300",
          "group-hover:shadow-[0_0_24px_-4px_var(--glow)]",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_right,var(--glow),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col gap-4">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {wallet.name}
          </h3>

          <dl className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-medium text-muted">{stat.label}</dt>
                <dd className="mt-1 font-mono text-lg font-semibold tracking-tight text-foreground">
                  {formatCount(stat.value)}
                </dd>
              </div>
            ))}
          </dl>

          {wallet.errors && wallet.errors.length > 0 ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Partial data — some metrics unavailable.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function WalletBreakdownGrid({
  wallets,
  loading,
  placeholderCount = 3,
}: WalletBreakdownGridProps) {
  const items = wallets ?? [];

  return (
    <div className="space-y-4">
      <FadeIn delay={STAGGER_MS * 2}>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
          Per-Wallet Breakdown
        </h2>
      </FadeIn>

      {loading ? (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Loading per-wallet breakdown"
        >
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <WalletBreakdownSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((wallet, index) => (
            <FadeIn
              key={wallet.id}
              delay={STAGGER_MS * 2 + index * STAGGER_MS}
            >
              <WalletBreakdownCard wallet={wallet} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
