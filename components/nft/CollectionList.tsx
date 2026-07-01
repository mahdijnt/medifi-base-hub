import { cn } from "@/lib/utils";
import type { NftCollection } from "@/lib/types/analytics";
import { getContrastTextClass } from "@/utils/color/autoTextColor";

type CollectionListProps = {
  collections: NftCollection[];
  emptyMessage?: string;
};

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CollectionTag({ collection }: { collection: NftCollection }) {
  const label =
    collection.count > 1
      ? `${collection.name} (${collection.count.toLocaleString("en-US")})`
      : collection.name;

  const className = cn(
    "group inline-flex w-full items-center gap-2 rounded-lg px-3 py-2",
    "border border-[var(--accent-teal)]/18 bg-gradient-to-br from-[var(--accent-teal)]/8 via-[var(--accent-cyan)]/4 to-transparent",
    "backdrop-blur-sm transition-all duration-300",
    "hover:border-[var(--accent-cyan)]/30 hover:shadow-[0_0_14px_-4px_var(--glow-teal-soft)]",
    "sm:hover:shadow-[0_0_16px_-4px_var(--glow-teal-soft)]",
    "hover:from-[var(--accent-teal)]/12",
  );

  const content = (
    <>
      <span
        className="size-1.5 shrink-0 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_4px_var(--glow-cyan-soft)]"
        aria-hidden="true"
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm font-medium transition-colors",
          getContrastTextClass("glow-teal", "value"),
          "group-hover:text-slate-900 dark:group-hover:text-white/95",
        )}
      >
        {label}
      </span>
      {collection.marketplaceUrl ? <ExternalLinkIcon /> : null}
    </>
  );

  if (collection.marketplaceUrl) {
    return (
      <a
        href={collection.marketplaceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={`View ${collection.name} on OpenSea`}
      >
        {content}
      </a>
    );
  }

  return <span className={className}>{content}</span>;
}

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
      {collections.map((collection) => (
        <li key={collection.contractAddress ?? collection.name}>
          <CollectionTag collection={collection} />
        </li>
      ))}
    </ul>
  );
}
