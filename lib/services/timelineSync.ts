import type { TimelineMilestone } from "@/data/timeline";

export type TimelineSource = "github" | "basescan" | "farcaster" | "manual";

export type TimelineSyncSources = {
  /** GitHub username or org for release/tag milestones */
  github?: string;
  /** Wallet addresses to scan for deployment milestones */
  basescan?: string[];
  /** Farcaster FID or username for identity milestones */
  farcaster?: string;
};

export type TimelineSyncPayload = {
  version: number;
  generatedAt: string;
  milestones: TimelineMilestone[];
};

const SYNC_VERSION = 1;

/**
 * Normalizes a partial milestone record from an external source into the
 * canonical TimelineMilestone shape.
 */
export function normalizeTimelineMilestone(
  partial: Partial<TimelineMilestone> &
    Pick<TimelineMilestone, "id" | "title" | "type" | "status">,
): TimelineMilestone {
  return {
    ...partial,
    source: partial.source ?? "manual",
  };
}

/**
 * Merges milestones from GitHub releases, Basescan deployments, and
 * Farcaster identity events. Implementation deferred — returns empty array.
 */
export function prepareTimelineFromSources(
  sources: TimelineSyncSources,
): TimelineMilestone[] {
  void sources;
  return [];
}

/**
 * Packages milestones for a GitHub Action sync pipeline (e.g. writing to
 * data/timeline.generated.json on schedule).
 */
export function prepareForGitHubActionSync(
  milestones: TimelineMilestone[],
): TimelineSyncPayload {
  return {
    version: SYNC_VERSION,
    generatedAt: new Date().toISOString(),
    milestones,
  };
}
