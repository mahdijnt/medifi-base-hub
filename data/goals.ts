export type GoalTag = "Active" | "In Progress" | "Long-term";

export type Goal = {
  id: string;
  title: string;
  progress: number;
  tag: GoalTag;
};

export type GoalDynamicSource =
  | "github-commits"
  | "base-deployments"
  | "web3-repos"
  | "farcaster-txs"
  | "static";

export type GoalProgress = {
  id: string;
  title: string;
  tag: GoalTag;
  targetValue: number;
  dynamic: GoalDynamicSource;
  /** Used when dynamic source is unavailable or for fully static goals */
  staticProgress?: number;
};

export const goalDefinitions: GoalProgress[] = [
  {
    id: "github-commits",
    title: "100 GitHub commits",
    targetValue: 100,
    tag: "In Progress",
    dynamic: "github-commits",
  },
  {
    id: "base-deployments",
    title: "10 smart contract deployments on Base",
    targetValue: 10,
    tag: "In Progress",
    dynamic: "base-deployments",
  },
  {
    id: "web3-projects",
    title: "Build multiple Web3 projects",
    targetValue: 5,
    tag: "Active",
    dynamic: "web3-repos",
  },
  {
    id: "onchain-identity",
    title: "Improve onchain identity presence",
    targetValue: 50,
    tag: "Active",
    dynamic: "farcaster-txs",
  },
  {
    id: "learn-document",
    title: "Learn and document publicly",
    targetValue: 100,
    tag: "Long-term",
    dynamic: "static",
    staticProgress: 38,
  },
];

/** Static fallback goals for SSR / loading states */
export const currentGoals: Goal[] = goalDefinitions.map((def) => ({
  id: def.id,
  title: def.title,
  tag: def.tag,
  progress: def.staticProgress ?? 0,
}));

export function computeGoalProgress(
  currentValue: number,
  targetValue: number,
): number {
  if (targetValue <= 0) return 0;
  return Math.min(100, Math.round((currentValue / targetValue) * 100));
}
