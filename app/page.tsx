import { IdentityHub } from "@/components/identity";
import { FeaturedProjects } from "@/components/projects";
import { BuilderStory } from "@/components/story";

export default function Home() {
  return (
    <>
      <IdentityHub />
      <BuilderStory />
      <FeaturedProjects />
    </>
  );
}
