import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const stageDir = path.join(distDir, "aiforge");
const zipPath = path.join(distDir, "aiforge-v1.0.0.zip");

const INCLUDE = [
  "src",
  "public",
  "docs",
  "scripts",
  "LICENSE.txt",
  "CHANGELOG.md",
  "README.md",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "next-env.d.ts",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "vercel.json",
  ".env.example",
  ".gitignore",
];

const SKIP_DIR_NAMES = new Set(["node_modules", ".next", ".data", ".git", "dist", ".vercel"]);

function copyFiltered(src, dest) {
  const stat = statSync(src);
  if (stat.isDirectory()) {
    const base = path.basename(src);
    if (SKIP_DIR_NAMES.has(base)) return;
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) {
      copyFiltered(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(src, dest);
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(stageDir, { recursive: true });

for (const item of INCLUDE) {
  const from = path.join(root, item);
  if (!existsSync(from)) {
    console.warn(`skip missing: ${item}`);
    continue;
  }
  copyFiltered(from, path.join(stageDir, item));
}

writeFileSync(
  path.join(stageDir, "DOCUMENTATION.txt"),
  [
    "AIForge",
    "=======",
    "",
    "Start here:",
    "1. Read README.md",
    "2. Read docs/DOCUMENTATION.md for full setup (local + Vercel)",
    "3. Copy .env.example to .env.local",
    "4. Run: npm install && npm run dev",
    "",
    "License: LICENSE.txt",
    "Listing draft: docs/LISTING.md",
    "",
  ].join("\n"),
  "utf8",
);

if (existsSync(zipPath)) rmSync(zipPath, { force: true });

const compressCmd = `Compress-Archive -Path '${stageDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`;
execSync(`powershell -NoProfile -Command "${compressCmd}"`, { stdio: "inherit" });

console.log(`Created ${zipPath}`);
