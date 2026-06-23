import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const options = parseArgs(args);
const templateRoot = join(repositoryRoot, `templates/${options.template}`);

if (!options.target) {
  printHelp();
  process.exit(1);
}

const targetRoot = resolve(process.cwd(), options.target);
const projectName = toPackageName(basename(targetRoot));
const projectTitle = toTitle(projectName);

if (!existsSync(templateRoot)) {
  console.error(`Template not found: ${options.template}`);
  process.exit(1);
}

if (existsSync(targetRoot) && !options.force) {
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

if (!options.withDemo) {
  stripDemoModules(targetRoot);
}

replacePlaceholders(targetRoot, {
  projectName,
  projectTitle
});
writeBlueprintConfig(targetRoot, {
  projectTitle,
  template: options.template,
  withDemo: options.withDemo
});

console.log(`Created ${projectTitle} at ${targetRoot}`);
console.log("");
console.log(`Template: ${options.template}`);
console.log(`Demo modules: ${options.withDemo ? "included" : "removed"}`);
console.log("");
console.log("Next steps:");
console.log(`  cd ${options.target}`);
console.log("  pnpm build");
console.log("  pnpm dev");
console.log("");
console.log("Open:");
console.log("  http://127.0.0.1:4173/apps/web/");

function printHelp() {
  console.log("Usage:");
  console.log("  node scripts/create-blueprint.mjs <project-name> [options]");
  console.log("");
  console.log("Options:");
  console.log("  --target <path>       Target directory. Overrides positional project name.");
  console.log("  --template vanilla    Template name. Currently only vanilla is supported.");
  console.log("  --with-demo           Include demo modules. Default.");
  console.log("  --without-demo        Generate the app shell without demo modules.");
  console.log("  --force               Overwrite target files.");
}

function parseArgs(values) {
  const parsed = {
    force: false,
    target: "",
    template: "vanilla",
    withDemo: true
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (value === "--force") {
      parsed.force = true;
      continue;
    }

    if (value === "--with-demo") {
      parsed.withDemo = true;
      continue;
    }

    if (value === "--without-demo") {
      parsed.withDemo = false;
      continue;
    }

    if (value === "--target") {
      parsed.target = values[index + 1] || "";
      index += 1;
      continue;
    }

    if (value === "--template") {
      parsed.template = values[index + 1] || "vanilla";
      index += 1;
      continue;
    }

    if (!value.startsWith("--") && !parsed.target) {
      parsed.target = value;
      continue;
    }

    console.error(`Unknown option: ${value}`);
    process.exit(1);
  }

  return parsed;
}

function writeBlueprintConfig(targetRoot, options) {
  const config = `export default {
  appName: ${JSON.stringify(options.projectTitle)},
  template: ${JSON.stringify(options.template)},
  demoModules: ${JSON.stringify(options.withDemo ? ["users", "imports", "projects"] : [])},
  themeModes: ["light", "dark"],
  locales: ["zh", "en"]
};
`;

  writeFileSync(join(targetRoot, "blueprint.config.js"), config);
}

function stripDemoModules(targetRoot) {
  const indexPath = join(targetRoot, "apps/web/index.html");
  const mainPath = join(targetRoot, "apps/web/src/main.js");
  const stylesPath = join(targetRoot, "apps/web/src/styles.css");

  writeFileSync(
    indexPath,
    `<!doctype html>
<html lang="en" data-theme="light" data-density="comfortable">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectTitle}}</title>
    <link rel="stylesheet" href="../../packages/theme/src/styles.css" />
    <link rel="stylesheet" href="./src/styles.css" />
  </head>
  <body>
    <main class="empty-shell">
      <p class="eyebrow">B2B Blueprint</p>
      <h1>{{projectTitle}}</h1>
      <p>Start building your console by adding modules under <code>apps/web/src</code>.</p>
      <button class="button button--primary" id="theme-toggle" type="button">Switch to dark</button>
    </main>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
`
  );

  writeFileSync(
    mainPath,
    `import { attachThemeToggle } from "../../../packages/dom/src/index.js";

attachThemeToggle({
  root: document.documentElement,
  trigger: document.querySelector("#theme-toggle")
});
`
  );

  writeFileSync(
    stylesPath,
    `* {
  box-sizing: border-box;
}

body {
  background: var(--b2b-color-bg);
  color: var(--b2b-color-text);
  font-family: var(--b2b-font-sans);
  margin: 0;
}

.empty-shell {
  display: grid;
  gap: var(--b2b-space-3);
  margin: 0 auto;
  max-width: 720px;
  min-height: 100vh;
  padding: var(--b2b-space-6);
  place-content: center;
}

.eyebrow {
  color: var(--b2b-color-accent);
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
}

h1,
p {
  margin: 0;
}

p {
  color: var(--b2b-color-text-muted);
  line-height: 1.6;
}

.button {
  border: 1px solid transparent;
  border-radius: var(--b2b-radius-sm);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  min-height: 36px;
  padding: 0 14px;
  width: max-content;
}

.button--primary {
  background: var(--b2b-color-accent);
  color: #ffffff;
}
`
  );

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
