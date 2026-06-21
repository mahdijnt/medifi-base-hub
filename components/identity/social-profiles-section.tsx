import { SocialLink } from "@/components/social";
import { socialLinks } from "@/data/identity";
import { cn } from "@/lib/utils";

export function SocialProfilesSection() {
  return (
    <div className="px-5 py-6 sm:px-8 sm:py-7">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Profiles
        </p>
        <span className="font-mono text-[10px] text-muted/80">
          {socialLinks.length} links
        </span>
      </div>

      <div
        className={cn(
          "mt-4 rounded-xl border border-border bg-background/50 p-4 sm:p-5",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]",
        )}
      >
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((link, index) => (
            <SocialLink
              key={link.url}
              label={link.label}
              url={link.url}
              image={link.image}
              tooltipId={`social-tooltip-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
