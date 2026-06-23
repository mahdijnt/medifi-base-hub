import { IdentityHubHeader } from "@/components/identity/identity-hub-header";
import { IdentityProfileSection } from "@/components/identity/identity-profile-section";
import { SocialProfilesSection } from "@/components/identity/social-profiles-section";
import {
  identityCardGradient,
  identityCardInner,
  identityCardMetallic,
  identityCardNoise,
  identityCardOuter,
  identityCardShimmer,
} from "@/components/identity/identity-theme";
import { cn } from "@/lib/utils";

export function IdentityHub() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] flex-col justify-center py-12 sm:py-16">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <IdentityHubHeader />

        <div className={cn(identityCardOuter)}>
          <div
            className={cn(
              identityCardInner,
              "min-h-[26rem] p-8 sm:min-h-[28rem] sm:p-10",
            )}
          >
            <div className={identityCardGradient} aria-hidden="true" />
            <div className={identityCardMetallic} aria-hidden="true" />
            <div className={identityCardShimmer} aria-hidden="true" />
            <div className={identityCardNoise} aria-hidden="true" />

            <div className="relative">
              <IdentityProfileSection />
              <SocialProfilesSection />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
