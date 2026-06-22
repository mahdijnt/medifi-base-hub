import { cn } from "@/lib/utils";

type SectionBadgeProps = {
  badge: string;
  label: string;
  className?: string;
};

export function SectionBadge({ badge, label, className }: SectionBadgeProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-surface/60 font-mono text-[10px] font-medium text-muted"
        aria-hidden="true"
      >
        {badge}
      </span>
      <p className="text-xs font-medium uppercase tracking-widest text-muted">
        {label}
      </p>
    </div>
  );
}
