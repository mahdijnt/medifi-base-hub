import Image from "next/image";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SocialLinkProps = {
  label: string;
  url: string;
  image: string;
  tooltipId: string;
};

export function SocialLink({
  label,
  url,
  image,
  tooltipId,
}: SocialLinkProps) {
  return (
    <Tooltip content={url} id={tooltipId}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={tooltipId}
        aria-label={`${label} profile`}
        className={cn(
          "group/icon relative flex size-12 items-center justify-center rounded-xl",
          "border border-border bg-background/80",
          "transition-all duration-200 ease-out",
          "hover:scale-105 hover:border-foreground/25",
          "hover:shadow-[0_0_24px_-4px_var(--glow)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <Image
          src={image}
          alt=""
          width={24}
          height={24}
          className="size-6 object-contain transition-transform duration-200 group-hover/icon:scale-110"
          aria-hidden="true"
        />
      </a>
    </Tooltip>
  );
}
