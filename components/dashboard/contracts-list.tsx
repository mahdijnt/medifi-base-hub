import { FadeIn } from "@/components/ui/fade-in";
import type { DeployedContract } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

const STAGGER_MS = 120;
const MAX_VISIBLE_CONTRACTS = 5;

type ContractsListProps = {
  contracts: DeployedContract[] | null;
  loading: boolean;
  error: string | null;
};

function formatDeploymentDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shortenAddress(address: string): string {
  if (address.length < 10) {
    return address;
  }

  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function ContractsList({
  contracts,
  loading,
  error,
}: ContractsListProps) {
  const visibleContracts = contracts?.slice(0, MAX_VISIBLE_CONTRACTS) ?? [];
  const remainingCount =
    contracts && contracts.length > MAX_VISIBLE_CONTRACTS
      ? contracts.length - MAX_VISIBLE_CONTRACTS
      : 0;

  return (
    <div className="space-y-4">
      <FadeIn delay={STAGGER_MS * 10} duration={500}>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
          Deployed Contracts
        </h2>
      </FadeIn>

      <FadeIn delay={STAGGER_MS * 11} duration={500}>
        <article
          className={cn(
            "relative rounded-xl p-px",
            "bg-gradient-to-br from-black/10 via-black/5 to-black/[0.03]",
            "dark:from-white/20 dark:via-white/10 dark:to-white/5",
          )}
        >
          <div
            className={cn(
              "relative rounded-[11px] border border-black/[0.08] bg-black/[0.04] p-5 backdrop-blur-[12px]",
              "dark:border-white/15 dark:bg-white/[0.08]",
            )}
          >
            {loading ? (
              <p className="text-sm text-foreground/40">Loading...</p>
            ) : error ? (
              <p className="text-sm text-muted">—</p>
            ) : !contracts || contracts.length === 0 ? (
              <p className="text-sm text-muted">No contracts deployed.</p>
            ) : (
              <ul className="space-y-3">
                {visibleContracts.map((contract) => (
                  <li
                    key={contract.address}
                    className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span
                      className="font-mono text-sm font-medium text-foreground"
                      title={contract.address}
                    >
                      {shortenAddress(contract.address)}
                    </span>
                    <span className="text-sm text-muted">
                      {formatDeploymentDate(contract.deployedAt)}
                    </span>
                  </li>
                ))}
                {remainingCount > 0 ? (
                  <li className="pt-1 text-sm text-muted">
                    +{remainingCount} more
                  </li>
                ) : null}
              </ul>
            )}
          </div>
        </article>
      </FadeIn>
    </div>
  );
}
