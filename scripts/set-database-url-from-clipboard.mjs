import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");

const clip = execSync(
  `powershell -NoProfile -Command "Get-Clipboard -Raw"`,
  { encoding: "utf8" },
).trim();

const match = clip.match(/postgresql:\/\/[^\s"'`]+/i);
if (!match) {
  console.error("Clipboard does not contain a postgresql:// connection string.");
  process.exit(1);
}

const url = match[0].replace(/[;,]+$/, "");
const line = `DATABASE_URL=${url}`;

let content = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
if (/^DATABASE_URL=/m.test(content)) {
  content = content.replace(/^DATABASE_URL=.*$/m, line);
} else {
  content = `${content.trimEnd()}\n\n${line}\n`;
}
writeFileSync(envPath, content, "utf8");
console.log("DATABASE_URL saved to .env.local (value not printed).");
