import { cn } from "@/lib/utils";

type TooltipProps = {
  content: string;
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ content, id, children, className }: TooltipProps) {
  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 -translate-x-1/2",
          "max-w-[min(20rem,calc(100vw-2rem))] rounded-md border border-border bg-surface px-2.5 py-1.5",
          "font-mono text-[10px] leading-snug text-foreground shadow-lg backdrop-blur-sm",
          "opacity-0 transition-all duration-150",
          "group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0",
          "group-focus-within/tooltip:opacity-100 group-focus-within/tooltip:translate-y-0",
          "translate-y-0.5",
        )}
      >
        <span className="block truncate">{content}</span>
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-surface"
        />
      </span>
    </span>
  );
}
