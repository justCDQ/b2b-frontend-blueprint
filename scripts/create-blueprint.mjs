import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const templateRoot = join(repositoryRoot, "templates/vanilla");

const args = process.argv.slice(2);
const targetName = args.find((arg) => !arg.startsWith("--"));
const force = args.includes("--force");

if (!targetName) {
  printHelp();
  process.exit(1);
}

const targetRoot = resolve(process.cwd(), targetName);
const projectName = toPackageName(basename(targetRoot));
const projectTitle = toTitle(projectName);

if (!existsSync(templateRoot)) {
  console.error(`Template not found: ${templateRoot}`);
  process.exit(1);
}

if (existsSync(targetRoot) && !force) {
  console.error(`Target already exists: ${targetRoot}`);
  console.error("Use --force to overwrite files.");
  process.exit(1);
}

mkdirSync(targetRoot, { recursive: true });
cpSync(templateRoot, targetRoot, {
  recursive: true,
  force: true,
  errorOnExist: false
});
replacePlaceholders(targetRoot, {
  projectName,
  projectTitle
});

console.log(`Created ${projectTitle} at ${targetRoot}`);
console.log("");
console.log("Next steps:");
console.log(`  cd ${targetName}`);
console.log("  pnpm build");
console.log("  pnpm dev");
console.log("");
console.log("Open:");
console.log("  http://127.0.0.1:4173/apps/web/");

function printHelp() {
  console.log("Usage:");
  console.log("  node scripts/create-blueprint.mjs <project-name> [--force]");
}

function replacePlaceholders(directory, replacements) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      replacePlaceholders(path, replacements);
      continue;
    }

    if (!isTextFile(path)) continue;

    const source = readFileSync(path, "utf8");
    const next = source
      .replaceAll("{{projectName}}", replacements.projectName)
      .replaceAll("{{projectTitle}}", replacements.projectTitle);

    if (next !== source) {
      writeFileSync(path, next);
    }
  }
}

function isTextFile(path) {
  return [".html", ".js", ".mjs", ".json", ".md", ".css"].some((extension) => path.endsWith(extension));
}

function toPackageName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "") || "b2b-console";
}

function toTitle(value) {
  return value
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ") || "B2B Console";
}
