import { cn } from "@/lib/utils";

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
      <p className="rounded-lg border border-blue-500/15 bg-blue-500/[0.04] px-4 py-3 text-sm text-muted backdrop-blur-sm">
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
              "border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent",
              "backdrop-blur-sm transition-all duration-300",
              "hover:border-blue-400/40 hover:shadow-[0_0_16px_-2px_rgba(59,130,246,0.35)]",
              "hover:from-blue-500/20",
            )}
          >
            <span
              className="mr-2 size-1.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]"
              aria-hidden="true"
            />
            <span className="truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground">
              {name}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
