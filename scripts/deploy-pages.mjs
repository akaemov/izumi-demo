import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd();
function git(args, cwd = root) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr || `git ${args[0]} failed`);
  return r.stdout.trim();
}
if (!existsSync(resolve(root, "out/index.html")))
  throw new Error("Run npm run build:pages first");
const remote = git(["remote", "get-url", "origin"]);
if (remote !== "https://github.com/akaemov/izumi-demo.git")
  throw new Error("Unexpected publication repository");
const stage = mkdtempSync(join(tmpdir(), "izumi-pages-"));
try {
  git(["init", "-b", "gh-pages"], stage);
  git(["config", "user.name", git(["config", "user.name"])], stage);
  git(["config", "user.email", git(["config", "user.email"])], stage);
  git(["remote", "add", "origin", remote], stage);
  const existing = git(["ls-remote", "origin", "refs/heads/gh-pages"]);
  if (existing) {
    git(["fetch", "--depth=1", "origin", "gh-pages"], stage);
    git(["checkout", "-B", "gh-pages", "FETCH_HEAD"], stage);
  }
  for (const name of readdirSync(stage))
    if (name !== ".git")
      rmSync(join(stage, name), { recursive: true, force: true });
  cpSync(resolve(root, "out"), stage, { recursive: true });
  writeFileSync(join(stage, ".nojekyll"), "");
  git(["add", "--all"], stage);
  if (git(["status", "--porcelain"], stage))
    git(
      [
        "commit",
        "-m",
        `Publish Izumi Pages from ${git(["rev-parse", "--short", "HEAD"])}`,
      ],
      stage,
    );
  console.log(git(["push", "origin", "HEAD:gh-pages"], stage));
  console.log(
    "Uploaded gh-pages branch. Expected Pages address: https://akaemov.github.io/izumi-demo/",
  );
} finally {
  rmSync(stage, { recursive: true, force: true });
}
