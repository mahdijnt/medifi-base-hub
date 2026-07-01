import fs from "node:fs";
import path from "node:path";

const apiDir = path.join(process.cwd(), "app", "api");
const backupDir = path.join(process.cwd(), "app", "_api_backup");

const mode = process.argv[2];

if (mode === "disable") {
  if (fs.existsSync(apiDir) && !fs.existsSync(backupDir)) {
    fs.renameSync(apiDir, backupDir);
    console.log("[toggle-api-routes] disabled app/api for static export build");
  }
} else if (mode === "enable") {
  if (fs.existsSync(backupDir) && !fs.existsSync(apiDir)) {
    fs.renameSync(backupDir, apiDir);
    console.log("[toggle-api-routes] restored app/api after static export build");
  }
} else {
  console.error("Usage: node scripts/toggle-api-routes.mjs <disable|enable>");
  process.exit(1);
}
