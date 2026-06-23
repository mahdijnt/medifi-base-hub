import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";

type CollectionListProps = {
  collections: string[];
  emptyMessage?: string;
};

export function CollectionList({
  collections,
  emptyMessage = "No collections found.",
}: CollectionListProps) {
  if (collections.length === 0) {
    return (
      <p
        className={cn(
          "rounded-lg border border-[var(--accent-teal)]/15 bg-[var(--accent-teal)]/[0.04] px-4 py-3 text-sm backdrop-blur-sm",
          getContrastTextClass("glow-teal", "muted"),
        )}
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="NFT collections"
    >
      {collections.map((name) => (
        <li key={name}>
          <span
            className={cn(
              "group inline-flex w-full items-center rounded-lg px-3 py-2",
              "border border-[var(--accent-teal)]/18 bg-gradient-to-br from-[var(--accent-teal)]/8 via-[var(--accent-cyan)]/4 to-transparent",
              "backdrop-blur-sm transition-all duration-300",
              "hover:border-[var(--accent-cyan)]/30 hover:shadow-[0_0_14px_-4px_var(--glow-teal-soft)]",
              "sm:hover:shadow-[0_0_16px_-4px_var(--glow-teal-soft)]",
              "hover:from-[var(--accent-teal)]/12",
            )}
          >
            <span
              className="mr-2 size-1.5 shrink-0 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_4px_var(--glow-cyan-soft)]"
              aria-hidden="true"
            />
            <span
              className={cn(
                "truncate text-sm font-medium transition-colors",
                getContrastTextClass("glow-teal", "value"),
                "group-hover:text-slate-900 dark:group-hover:text-white/95",
              )}
            >
              {name}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
