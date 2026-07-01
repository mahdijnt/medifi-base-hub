import { NextResponse } from "next/server";
import { githubConfig } from "@/data/github";
import { getGithubMetricsCached } from "@/lib/services/github";

const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

const EMPTY_GITHUB_DATA = {
  totalCommits: 0,
  publicRepoCount: 0,
  web3RepoCount: 0,
};

const UNAVAILABLE_MESSAGE = "GitHub analytics unavailable";

/**
 * GitHub builder metrics proxy (server-side only).
 *
 * Reads NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN server-side so the PAT is
 * never shipped to the browser. Returns all GitHub metrics in one response
 * (commits + repo counts) so client hooks share a single upstream fetch.
 * Static export (GitHub Pages) cannot host API routes — the api folder is
 * temporarily disabled in CI before `output: 'export'` builds.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const username =
      searchParams.get("username")?.trim() || githubConfig.username;

    if (!GITHUB_USERNAME_REGEX.test(username)) {
      return NextResponse.json({
        success: false,
        error: "Invalid GitHub username format.",
        data: EMPTY_GITHUB_DATA,
      });
    }

    const result = await getGithubMetricsCached(username);

    if ("error" in result) {
      console.error("[github] error:", result.error);
      return NextResponse.json({
        success: false,
        error: UNAVAILABLE_MESSAGE,
        data: EMPTY_GITHUB_DATA,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCommits: result.data.totalCommits,
        publicRepoCount: result.data.publicRepoCount,
        web3RepoCount: result.data.web3RepoCount,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown GitHub analytics error";
    console.error("[github] error:", message);
    return NextResponse.json({
      success: false,
      error: UNAVAILABLE_MESSAGE,
      data: EMPTY_GITHUB_DATA,
    });
  }
}
