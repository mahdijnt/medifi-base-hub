/** Deployment base path (empty on Vercel/root; `/medifi-base-hub` on GitHub Pages). */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Prefix an absolute path with the deployment base path. */
export function withBasePath(path: string): string {
  const base = getBasePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
