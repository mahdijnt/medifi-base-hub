import { SocialLink } from "@/components/social";
import { identityProfilesPanel } from "@/components/identity/identity-theme";
import { socialLinks } from "@/data/identity";
import { cn } from "@/lib/utils";
import { getContrastTextClass } from "@/utils/color/autoTextColor";

export function SocialProfilesSection() {
  return (
    <div className="pt-10">
      <div className="flex items-center justify-between gap-3">
        <p
          className={cn(
            "text-[11px] font-medium uppercase tracking-wider",
            getContrastTextClass("identity-card", "label"),
          )}
        >
          Profiles
        </p>
        <span
          className={cn(
            "font-mono text-[10px]",
            getContrastTextClass("identity-card", "muted"),
          )}
        >
          {socialLinks.length} links
        </span>
      </div>

      <div className={cn(identityProfilesPanel)}>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map((link, index) => (
            <SocialLink
              key={link.url}
              label={link.label}
              url={link.url}
              image={link.image}
              tooltipId={`social-tooltip-${index}`}
              variant="identity"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
