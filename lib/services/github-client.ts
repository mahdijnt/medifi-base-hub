import { withBasePath } from "@/lib/base-path";
import type { GithubMetrics, GithubMetricsResult } from "@/lib/types/analytics";

type GithubMetricsApiResponse = {
  success?: boolean;
  error?: string;
  data?: Partial<GithubMetrics>;
};

const STATIC_EXPORT_HINT =
  "GitHub analytics unavailable. Requires a server deployment (e.g. Vercel) — static export / GitHub Pages cannot run API routes.";

/** Deduplicate concurrent client fetches (three hooks mount at once). */
const inFlight = new Map<string, Promise<GithubMetricsResult>>();

async function requestGithubMetrics(
  username?: string,
): Promise<GithubMetricsResult> {
  try {
    const query = username
      ? `?username=${encodeURIComponent(username)}`
      : "";
    const response = await fetch(
      withBasePath(`/api/github/commits${query}`),
      { cache: "no-store" },
    );

    if (response.status === 404) {
      return { error: STATIC_EXPORT_HINT };
    }

    if (!response.ok) {
      let detail = `Request failed (${response.status})`;
      try {
        const body = (await response.json()) as { error?: string };
        if (body.error) {
          detail = body.error;
        }
      } catch {
        // ignore parse errors
      }
      return { error: detail };
    }

    const body = (await response.json()) as GithubMetricsApiResponse;

    if (body.success === false || body.error) {
      return { error: body.error ?? "GitHub analytics unavailable" };
    }

    if (!body.data) {
      return { error: "GitHub analytics unavailable" };
    }

    return {
      data: {
        totalCommits: body.data.totalCommits ?? 0,
        publicRepoCount: body.data.publicRepoCount ?? 0,
        web3RepoCount: body.data.web3RepoCount ?? 0,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch GitHub analytics.";

    return { error: message };
  }
}

/**
 * Client-side fetch for GitHub builder metrics via `/api/github/commits`.
 * Never calls api.github.com directly — the PAT stays server-side.
 * Concurrent calls for the same username share one request.
 */
export async function fetchGithubMetrics(
  username?: string,
): Promise<GithubMetricsResult> {
  const key = (username ?? "").trim().toLowerCase();

  const pending = inFlight.get(key);
  if (pending) {
    return pending;
  }

  const request = requestGithubMetrics(username).finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, request);
  return request;
}
