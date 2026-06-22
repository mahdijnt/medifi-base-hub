export const identity = {
  name: "Mehdi",
  bio: "Onchain builder on Base ecosystem",
  avatar: "/images/profile/mehdi.png",
} as const;

export const socialPlatforms = [
  "x",
  "farcaster",
  "github",
  "base",
  "linkedin",
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export const socialImages: Record<SocialPlatform, string> = {
  x: "/images/social/x.png",
  farcaster: "/images/social/farcaster.png",
  github: "/images/social/github.png",
  base: "/images/social/base.png",
  linkedin: "/images/social/linkedin.png",
};

export const socialLinks = [
  {
    platform: "x" as const,
    label: "X",
    url: "https://x.com/Medifi",
    image: socialImages.x,
  },
  {
    platform: "farcaster" as const,
    label: "Farcaster",
    url: "https://farcaster.xyz/mahdijnt",
    image: socialImages.farcaster,
  },
  {
    platform: "github" as const,
    label: "GitHub",
    url: "https://github.com/mahdijnt",
    image: socialImages.github,
  },
  {
    platform: "base" as const,
    label: "Base",
    url: "https://base.app/profile/medifi",
    image: socialImages.base,
  },
  {
    platform: "linkedin" as const,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/mahdijannati/",
    image: socialImages.linkedin,
  },
] as const;
