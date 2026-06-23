import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import {
  dashSecondaryBorder,
  glassInnerSurface,
  glassRadialGlow,
} from "@/components/dashboard/glass-styles";

type CommitCardProps = {
  commits: number | null;
  loading?: boolean;
  error?: string | null;
};

export function CommitCard({
  commits,
  loading = false,
  error = null,
}: CommitCardProps) {
  const displayValue = loading ? "…" : error ? "—" : String(commits ?? 0);

  return (
    <article
      className={cn(
        "group relative rounded-xl p-px",
        dashSecondaryBorder,
        "transition-transform duration-300 ease-out hover:scale-[1.02]",
      )}
    >
      <div className={cn("relative flex h-full flex-col p-5", glassInnerSurface)}>
        <div
          className={cn(glassRadialGlow, "opacity-50")}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <p
            className={cn(
              "text-sm font-medium",
              getContrastTextClass("glow-cyan", "label"),
            )}
          >
            GitHub Commits
          </p>

          <p
            className={cn(
              "mt-2 font-mono text-3xl font-semibold tracking-tight",
              loading || error
                ? getContrastTextClass("glow-cyan", "muted")
                : getContrastTextClass("glow-cyan", "value"),
            )}
            aria-busy={loading}
          >
            {displayValue}
          </p>

          <p
            className={cn(
              "mt-2 text-xs leading-relaxed",
              getContrastTextClass("glow-cyan", "muted"),
            )}
          >
            {error
              ? error
              : "Total commits across public repos"}
          </p>
        </div>
      </div>
    </article>
  );
}
