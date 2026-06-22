import { getBasePath } from "@/lib/base-path";

export function normalizePathname(pathname: string): string {
  let path = pathname;
  const basePath = getBasePath();

  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || "/";
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
