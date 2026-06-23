"use client";

import { portfolioConfig } from "@/data/portfolio";
import { useDeployCount } from "@/hooks/useDeployCount";
import { useGithubCommits } from "@/hooks/useGithubCommits";
import { FadeIn } from "@/components/ui/fade-in";
import { BuilderPortfolio } from "./BuilderPortfolio";
import { CommitCard } from "./CommitCard";
import { GoalCard } from "./GoalCard";

const STAGGER_MS = 150;

export function PortfolioSection() {
  const { commits, loading: commitsLoading, error: commitsError } =
    useGithubCommits();
  const {
    deployCount,
    loading: deployLoading,
    error: deployError,
  } = useDeployCount();

  return (
    <>
      <BuilderPortfolio
        deployGoal={portfolioConfig.deployGoal}
        currentDeployCount={deployCount}
        overview={portfolioConfig.overview}
        deployLoading={deployLoading}
        deployError={deployError}
      />

      <section aria-labelledby="portfolio-metrics-heading" className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <FadeIn duration={150}>
            <h3
              id="portfolio-metrics-heading"
              className="sr-only"
            >
              Portfolio metrics
            </h3>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FadeIn delay={STAGGER_MS} duration={150}>
              <CommitCard
                commits={commits}
                loading={commitsLoading}
                error={commitsError}
              />
            </FadeIn>

            <FadeIn delay={STAGGER_MS * 2} duration={150}>
              <GoalCard
                label="Deploy Goal Progress"
                current={deployCount ?? 0}
                target={portfolioConfig.deployGoal}
                loading={deployLoading}
                error={deployError}
              />
            </FadeIn>

            <FadeIn delay={STAGGER_MS * 3} duration={150}>
              <GoalCard
                label="Commit Milestone"
                current={commits ?? 0}
                target={100}
                loading={commitsLoading}
                error={commitsError}
              />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
