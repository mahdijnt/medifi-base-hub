import { IdentityHub } from "@/components/identity";
import { GoalsWithData } from "@/components/goals";
import { PortfolioSection } from "@/components/portfolio";
import { FeaturedProjects } from "@/components/projects";
import { BuilderSnapshot } from "@/components/home";
import { BuilderStory } from "@/components/story";
import { BuilderTimeline } from "@/components/timeline";
import { ContractRegistry } from "@/components/contracts";
import { CONTRACT_REGISTRY_WALLET_ADDRESSES } from "@/data/contracts";

export default function Home() {
  return (
    <>
      <IdentityHub />
      <BuilderStory />
      <BuilderTimeline />
      <FeaturedProjects />
      <PortfolioSection />
      <GoalsWithData />
      <BuilderSnapshot />
      <ContractRegistry walletAddresses={CONTRACT_REGISTRY_WALLET_ADDRESSES} />
    </>
  );
}
