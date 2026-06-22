import { IdentityHub } from "@/components/identity";
import { CurrentGoals } from "@/components/goals";
import { FeaturedProjects } from "@/components/projects";
import { BuilderStory } from "@/components/story";

export default function Home() {
  return (
    <>
      <IdentityHub />
      <BuilderStory />
      <FeaturedProjects />
      <CurrentGoals />
    </>
  );
}
