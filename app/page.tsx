import { IdentityHub } from "@/components/identity";
import { GoalsWithData } from "@/components/goals";
import { PortfolioSection } from "@/components/portfolio";
import { FeaturedProjects } from "@/components/projects";
import { BuilderSnapshot } from "@/components/home";
import { BuilderStory } from "@/components/story";

export default function Home() {
  return (
    <>
      <IdentityHub />
      <BuilderStory />
      <FeaturedProjects />
      <PortfolioSection />
      <GoalsWithData />
      <BuilderSnapshot />
    </>
  );
}
