import { cpSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd();
const stage = resolve(root, ".pages-build");
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage);
for (const file of [
  "src",
  "public",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "next-env.d.ts",
  "eslint.config.mjs",
]) {
  cpSync(resolve(root, file), resolve(stage, file), { recursive: true });
}
// GitHub Pages has no server runtime. Keep the unavailable server endpoint out of this static build.
rmSync(resolve(stage, "src/app/api"), { recursive: true, force: true });
symlinkSync(
  resolve(root, "node_modules"),
  resolve(stage, "node_modules"),
  "dir",
);
const result = spawnSync(
  process.execPath,
  [resolve(root, "node_modules/next/dist/bin/next"), "build"],
  {
    cwd: stage,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_DIST_DIR: ".next",
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_BASE_PATH: "/izumi-demo",
      NEXT_PUBLIC_CONTENT_MODE: "preview",
    },
  },
);
if (result.status !== 0) process.exit(result.status || 1);
rmSync(resolve(root, "out"), { recursive: true, force: true });
cpSync(resolve(stage, "out"), resolve(root, "out"), { recursive: true });
console.log("GitHub Pages export ready in out/ (base path /izumi-demo/).");
