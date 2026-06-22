export type GoalTag = "Active" | "In Progress" | "Long-term";

export type Goal = {
  id: string;
  title: string;
  progress: number;
  tag: GoalTag;
};

export const currentGoals: Goal[] = [
  {
    id: "github-commits",
    title: "100 GitHub commits",
    progress: 42,
    tag: "In Progress",
  },
  {
    id: "base-deployments",
    title: "10 smart contract deployments on Base",
    progress: 30,
    tag: "In Progress",
  },
  {
    id: "web3-projects",
    title: "Build multiple Web3 projects",
    progress: 55,
    tag: "Active",
  },
  {
    id: "onchain-identity",
    title: "Improve onchain identity presence",
    progress: 68,
    tag: "Active",
  },
  {
    id: "learn-document",
    title: "Learn and document publicly",
    progress: 38,
    tag: "Long-term",
  },
];
