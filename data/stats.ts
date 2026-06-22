export type BuilderStat = {
  id: string;
  title: string;
  value: number;
  /** Decorative progress bar width (0–100), visual only */
  progress: number;
};

export const builderStats: BuilderStat[] = [
  {
    id: "contracts-deployed",
    title: "Contracts Deployed",
    value: 0,
    progress: 0,
  },
  {
    id: "github-commits",
    title: "GitHub Commits",
    value: 5,
    progress: 35,
  },
  {
    id: "projects-built",
    title: "Projects Built",
    value: 1,
    progress: 25,
  },
  {
    id: "onchain-activity",
    title: "Onchain Activity",
    value: 0,
    progress: 0,
  },
];
