import { execSync } from "node:child_process";

const isVercel = Boolean(process.env.VERCEL);

if (!isVercel) {
  execSync("node scripts/toggle-api-routes.mjs disable", { stdio: "inherit" });
}

try {
  execSync("next build", { stdio: "inherit" });
} finally {
  if (!isVercel) {
    execSync("node scripts/toggle-api-routes.mjs enable", { stdio: "inherit" });
  }
}
