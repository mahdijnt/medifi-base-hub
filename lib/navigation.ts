const PRODUCTION_BASE_PATH = "/medifi-base-hub";

export function normalizePathname(pathname: string): string {
  let path = pathname;

  if (PRODUCTION_BASE_PATH && path.startsWith(PRODUCTION_BASE_PATH)) {
    path = path.slice(PRODUCTION_BASE_PATH.length) || "/";
  }

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path;
}

export function isActiveNavRoute(pathname: string, href: string): boolean {
  const normalized = normalizePathname(pathname);

  if (href === "/") {
    return normalized === "/";
  }

  return normalized === href || normalized.startsWith(`${href}/`);
}
