import Image from "next/image";
import { cn } from "@/lib/utils";
import type { NftItem } from "@/lib/types/analytics";
import {
  dashInteractiveBorder,
  dashInteractiveHoverGlow,
  dashPrimaryGlow,
  dashPrimarySurface,
} from "@/components/dashboard/glass-styles";
import { getContrastTextClass } from "@/utils/color/autoTextColor";

type NFTListProps = {
  items: NftItem[];
  emptyMessage?: string;
  error?: string;
  loading?: boolean;
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

function NftPlaceholder() {
  return (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center rounded-lg",
        "border border-[var(--accent-blue)]/15 bg-[var(--accent-blue)]/[0.06]",
        getContrastTextClass("glow-blue", "muted"),
      )}
      aria-hidden="true"
    >
      <span className="text-xs font-medium uppercase tracking-wider">NFT</span>
    </div>
  );
}

function NftCard({ item }: { item: NftItem }) {
  return (
    <article className={cn("group relative rounded-xl p-px", dashInteractiveBorder)}>
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[11px]",
          dashPrimarySurface,
          dashInteractiveHoverGlow,
        )}
      >
        <div
          className={cn(
            dashPrimaryGlow,
            "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          )}
          aria-hidden="true"
        />

        <div className="relative p-3">
          {item.imageUrl ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-[var(--accent-blue)]/12">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <NftPlaceholder />
          )}

          <div className="mt-3 space-y-1">
            <p
              className={cn(
                "truncate text-sm font-semibold",
                getContrastTextClass("glow-blue", "value"),
              )}
              title={item.name}
            >
              {item.name}
            </p>
            <p
              className={cn(
                "truncate text-xs",
                getContrastTextClass("glow-blue", "muted"),
              )}
              title={item.collectionName}
            >
              {item.collectionName}
            </p>
          </div>

          {item.marketplaceUrl ? (
            <a
              href={item.marketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group/link mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
                getContrastTextClass("glow-teal", "label"),
                "hover:text-[var(--accent-cyan)]",
              )}
            >
              View on marketplace
              <ExternalLinkIcon />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function NFTList({
  items,
  emptyMessage = "No non-spam NFTs found for this wallet.",
  error,
  loading = false,
}: NFTListProps) {
  if (loading) {
    return null;
  }

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400"
      >
        {error}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p
        className={cn(
          "rounded-lg border border-[var(--accent-blue)]/15 bg-[var(--accent-blue)]/[0.04] px-4 py-3 text-sm backdrop-blur-sm",
          getContrastTextClass("glow-blue", "muted"),
        )}
      >
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      aria-label="NFT items"
    >
      {items.map((item) => (
        <li key={`${item.contractAddress}-${item.tokenId}`}>
          <NftCard item={item} />
        </li>
      ))}
    </ul>
  );
}
