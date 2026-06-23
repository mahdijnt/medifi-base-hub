// Static milestones for now — replace via timelineSync.prepareTimelineFromSources()
// when GitHub releases, Basescan deployments, and Farcaster identity sync are enabled.

export type TimelineMilestone = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  type: "hub" | "dashboard" | "contract" | "future" | "custom";
  status: "completed" | "upcoming";
  source?: "github" | "basescan" | "farcaster" | "manual";
};

export const timelineMilestones: TimelineMilestone[] = [
  {
    id: "hub-created",
    title: "Builder Hub Created",
    description:
      "Medifi Base Hub launched as the onchain builder identity and portfolio home on Base.",
    type: "hub",
    status: "completed",
    source: "manual",
  },
  {
    id: "dashboard-released",
    title: "Dashboard Released",
    description:
      "Base Analytics Dashboard shipped with wallet metrics, contract tracking, and combined onchain summaries.",
    type: "dashboard",
    status: "completed",
    source: "manual",
  },
  {
    id: "first-contract",
    title: "First Contract Deployment",
    description:
      "First smart contract deployed to Base mainnet from this builder wallet.",
    type: "contract",
    status: "completed",
    source: "manual",
  },
  {
    id: "future-deploys",
    title: "Future Deploy Milestones",
    description:
      "Upcoming contract releases, protocol integrations, and onchain experiments on Base.",
    type: "future",
    status: "upcoming",
    source: "manual",
  },
];
