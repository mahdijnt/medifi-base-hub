import { FadeIn } from "@/components/ui/fade-in";
import type { Wallet } from "@/types/wallet";
import { cn } from "@/lib/utils";

const STAGGER_MS = 120;

type WalletSelectorProps = {
  wallets: Wallet[];
  selectedId: string;
  onChange: (walletId: string) => void;
  disabled?: boolean;
};

export function WalletSelector({
  wallets,
  selectedId,
  onChange,
  disabled = false,
}: WalletSelectorProps) {
  const selectedWallet = wallets.find((wallet) => wallet.id === selectedId);

  return (
    <FadeIn delay={STAGGER_MS * 3} duration={500}>
      <div
        className={cn(
          "group relative rounded-xl p-px",
          "bg-gradient-to-br from-black/10 via-black/5 to-black/[0.03]",
          "dark:from-white/20 dark:via-white/10 dark:to-white/5",
        )}
      >
        <div
          className={cn(
            "relative rounded-[11px] p-5 sm:p-6",
            "border border-black/[0.08] bg-black/[0.04] backdrop-blur-[12px]",
            "dark:border-white/15 dark:bg-white/[0.08]",
            "shadow-sm",
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[11px] bg-[radial-gradient(ellipse_at_top_left,var(--glow),transparent_55%)] opacity-40"
            aria-hidden="true"
          />

          <div className="relative space-y-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
                Wallet
              </p>
              <p className="mt-1 text-sm text-foreground/75">
                Select a wallet to view onchain analytics
              </p>
            </div>

            <div className="relative">
              <label htmlFor="wallet-selector" className="sr-only">
                Select wallet
              </label>
              <select
                id="wallet-selector"
                value={selectedId}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled || wallets.length === 0}
                className={cn(
                  "w-full appearance-none rounded-lg border px-4 py-3 pr-10",
                  "border-border bg-background/50 text-sm text-foreground",
                  "backdrop-blur-sm",
                  "focus:outline-none focus:ring-2 focus:ring-foreground/20",
                  (disabled || wallets.length === 0) &&
                    "cursor-not-allowed opacity-70",
                )}
              >
                {wallets.length === 0 ? (
                  <option value="">No wallets configured</option>
                ) : (
                  wallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </option>
                  ))
                )}
              </select>
              <span
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              >
                ▾
              </span>
            </div>

            {selectedWallet ? (
              <p className="font-mono text-[11px] text-muted">
                {selectedWallet.address}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
