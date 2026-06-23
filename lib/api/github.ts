import { githubConfig } from "@/data/github";
import { getGithubToken, hasGithubToken } from "@/lib/env";

const GITHUB_API_URL = "https://api.github.com";

type GithubRepo = {
  name: string;
  full_name: string;
  fork: boolean;
  private: boolean;
  description: string | null;
  topics?: string[];
};

type GithubSearchCommitsResponse = {
  total_count: number;
};

type GithubRequestOptions = {
  /** Skip auth header when checking public endpoints without a token */
  requireAuth?: boolean;
};

async function githubRequest<T>(
  path: string,
  options: GithubRequestOptions = {},
): Promise<T> {
  const { requireAuth = true } = options;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (requireAuth) {
    if (!hasGithubToken()) {
      throw new Error(
        "Missing NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN. Add it to .env.local to load GitHub analytics.",
      );
    }
    headers.Authorization = `Bearer ${getGithubToken()}`;
  }

  let response: Response;

  try {
    response = await fetch(`${GITHUB_API_URL}${path}`, { headers });
  } catch {
    throw new Error(
      "GitHub API request failed (network or CORS). Ensure NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN is set.",
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `GitHub API request failed (${response.status} ${response.statusText})${detail ? `: ${detail.slice(0, 120)}` : ""}`,
    );
  }

  return (await response.json()) as T;
}

/** Fetch public repositories for a GitHub user */
export async function getUserRepos(username: string): Promise<GithubRepo[]> {
  const repos: GithubRepo[] = [];
  let page = 1;

  while (true) {
    const pageResult = await githubRequest<GithubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`,
    );

    if (!Array.isArray(pageResult) || pageResult.length === 0) {
      break;
    }

    repos.push(...pageResult);

    if (pageResult.length < 100) {
      break;
    }

    page += 1;
  }

  return repos.filter((repo) => !repo.private);
}

/**
 * Count commits for a repo using the GitHub search API.
 * total_count is capped at 1000 per search query.
 */
export async function getCommitCountForRepo(
  owner: string,
  repo: string,
  author?: string,
): Promise<number> {
  const authorClause = author
    ? `+author:${encodeURIComponent(author)}`
    : "";
  const query = `repo:${owner}/${repo}${authorClause}`;

  const result = await githubRequest<GithubSearchCommitsResponse>(
    `/search/commits?q=${query}&per_page=1`,
  );

  return result.total_count ?? 0;
}

function resolveTrackedRepos(
  username: string,
  repos: GithubRepo[],
  selected?: string[],
): GithubRepo[] {
  const publicRepos = repos.filter((repo) => !repo.fork);
  const tracked = selected?.length ? selected : githubConfig.trackedRepos;

  if (tracked.length === 0) {
    return publicRepos;
  }

  const trackedSet = new Set(tracked.map((name) => name.toLowerCase()));
  return publicRepos.filter((repo) => trackedSet.has(repo.name.toLowerCase()));
}

const WEB3_KEYWORDS = ["web3", "base", "solidity", "ethereum", "onchain", "defi", "nft"];

export function isWeb3Repo(repo: GithubRepo): boolean {
  const topics = (repo.topics ?? []).map((topic) => topic.toLowerCase());
  if (topics.some((topic) => WEB3_KEYWORDS.includes(topic))) {
    return true;
  }

  const haystack = `${repo.name} ${repo.description ?? ""}`.toLowerCase();
  return WEB3_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

/** Count public non-fork repositories for a GitHub user */
export async function getPublicRepoCount(
  username: string,
): Promise<{ data: number } | { error: string }> {
  if (!hasGithubToken()) {
    return {
      error:
        "Missing NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN. Add it to .env.local to count public repos.",
    };
  }

  try {
    const repos = await getUserRepos(username);
    const count = repos.filter((repo) => !repo.fork).length;
    return { data: count };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to count public repos.";
    return { error: message };
  }
}

export async function getWeb3RepoCount(
  username: string,
): Promise<{ data: number } | { error: string }> {
  if (!hasGithubToken()) {
    return {
      error:
        "Missing NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN. Add it to .env.local to count Web3 repos.",
    };
  }

  try {
    const repos = await getUserRepos(username);
    const count = repos.filter((repo) => !repo.fork && isWeb3Repo(repo)).length;
    return { data: count };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to count Web3 repos.";
    return { error: message };
  }
}

/** Aggregate total commits across selected public repos for a user */
export async function getTotalCommitCount(
  username: string,
  repos?: string[],
): Promise<{ data: number } | { error: string }> {
  if (!hasGithubToken()) {
    return {
      error:
        "Missing NEXT_PUBLIC_GITHUB_PERSONAL_ACCESS_TOKEN. Add it to .env.local to load commit counts.",
    };
  }

  try {
    const allRepos = await getUserRepos(username);
    const selectedRepos = resolveTrackedRepos(username, allRepos, repos);

    if (selectedRepos.length === 0) {
      return { data: 0 };
    }

    const counts = await Promise.all(
      selectedRepos.map((repo) => {
        const [owner, name] = repo.full_name.split("/");
        return getCommitCountForRepo(owner, name, username);
      }),
    );

    const total = counts.reduce((sum, count) => sum + count, 0);
    return { data: total };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch GitHub commit count.";

    return { error: message };
  }
}
