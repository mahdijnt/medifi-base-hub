import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";
import { dashPrimaryBorder, dashPrimaryGlow, dashPrimarySurface } from "./glass-styles";

type MetricCardProps = {
  label: string;
  value: string;
  loading?: boolean;
  compactValue?: boolean;
};

export function MetricCard({
  label,
  value,
  loading = false,
  compactValue = false,
}: MetricCardProps) {
  return (
    <article
      className={cn(
        "group relative rounded-xl p-px",
        dashPrimaryBorder,
        "transition-transform duration-300 ease-out hover:scale-[1.03]",
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[11px] p-5",
          dashPrimarySurface,
          "transition-shadow duration-300",
          "group-hover:shadow-[0_0_20px_-8px_var(--glow-blue-soft)]",
          "sm:group-hover:shadow-[0_0_24px_-8px_var(--glow-blue-soft)]",
        )}
      >
        <div
          className={cn(
            dashPrimaryGlow,
            "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          )}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col">
          <p className={cn("text-sm font-medium", getContrastTextClass("glow-blue", "label"))}>
            {label}
          </p>

          <p
            className={cn(
              "mt-2 font-mono font-semibold tracking-tight",
              compactValue ? "text-base leading-snug" : "text-3xl",
              loading
                ? getContrastTextClass("glow-blue", "muted")
                : getContrastTextClass("glow-blue", "value"),
            )}
            aria-busy={loading}
          >
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}
