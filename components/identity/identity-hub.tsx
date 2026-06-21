import { cn } from "@/lib/utils";
import { IdentityHubHeader } from "@/components/identity/identity-hub-header";
import { IdentityProfileSection } from "@/components/identity/identity-profile-section";
import { SocialProfilesSection } from "@/components/identity/social-profiles-section";

export function IdentityHub() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] flex-col justify-center py-12 sm:py-16">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <IdentityHubHeader />

        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-border",
            "bg-surface/30 shadow-sm backdrop-blur-sm",
            "ring-1 ring-foreground/[0.03]",
          )}
        >
          <IdentityProfileSection />
          <SocialProfilesSection />
        </div>
      </div>
    </section>
  );
}
