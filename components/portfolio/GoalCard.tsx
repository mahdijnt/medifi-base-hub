import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import {
  dashInteractiveBorder,
  dashInteractiveHoverGlow,
  dashPrimaryGlow,
  dashPrimarySurface,
  glassInnerSurface,
} from "@/components/dashboard/glass-styles";

const PROGRESS_DURATION_MS = 160;

type GoalCardProps = {
  label: string;
  current: number;
  target: number;
  loading?: boolean;
  error?: string | null;
};

export function GoalCard({
  label,
  current,
  target,
  loading = false,
  error = null,
}: GoalCardProps) {
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const displayValue = loading ? "—" : error ? "—" : String(current);
  const displayTarget = String(target);

  return (
    <article
      className={cn(
        "group relative rounded-xl p-px",
        dashInteractiveBorder,
        dashInteractiveHoverGlow,
      )}
    >
      <div className={cn("relative flex h-full flex-col p-5", glassInnerSurface)}>
        <div
          className={cn(dashPrimaryGlow, "opacity-60")}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <p
            className={cn(
              "text-sm font-medium",
              getContrastTextClass("glass-blue", "label"),
            )}
          >
            {label}
          </p>

          <p
            className={cn(
              "mt-2 font-mono text-2xl font-semibold tracking-tight",
              loading || error
                ? getContrastTextClass("glass-blue", "muted")
                : getContrastTextClass("glass-blue", "value"),
            )}
            aria-busy={loading}
          >
            {displayValue}
            <span
              className={cn(
                "text-base font-normal",
                getContrastTextClass("glass-blue", "muted"),
              )}
            >
              {" "}
              / {displayTarget}
            </span>
          </p>

          <div className="mt-4 space-y-2">
            <div
              className={cn(
                "h-1.5 w-full overflow-hidden rounded-full",
                dashPrimarySurface,
              )}
              role="presentation"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)]"
                style={{
                  width: loading ? "0%" : `${progress}%`,
                  transition: `width ${PROGRESS_DURATION_MS}ms ease-out`,
                }}
              />
            </div>
            <p
              className={cn(
                "text-right font-mono text-[10px]",
                getContrastTextClass("glass-blue", "muted"),
              )}
            >
              {loading ? "…" : `${Math.round(progress)}%`}
            </p>
          </div>

          {error ? (
            <p
              className={cn(
                "mt-2 text-[11px] leading-snug",
                getContrastTextClass("glass-blue", "muted"),
              )}
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
