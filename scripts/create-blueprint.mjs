import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const supportedTemplates = ["vanilla"];
const supportedModules = ["users", "imports", "projects", "activities"];
const defaultDemoModules = ["users", "imports", "projects"];

const args = process.argv.slice(2);
const options = parseArgs(args);
const templateRoot = join(repositoryRoot, `templates/${options.template}`);

if (!options.target) {
  printHelp();
  process.exit(1);
}

if (!supportedTemplates.includes(options.template)) {
  console.error(`Unsupported template: ${options.template}`);
  console.error(`Supported templates: ${supportedTemplates.join(", ")}`);
  process.exit(1);
}

const targetRoot = resolve(process.cwd(), options.target);
const projectName = toPackageName(basename(targetRoot));
const projectTitle = options.appName || toTitle(projectName);

if (!existsSync(templateRoot)) {
  console.error(`Template not found: ${options.template}`);
  process.exit(1);
}

if (options.dryRun) {
  printDryRun({
    targetRoot,
    projectTitle,
    templateRoot,
    options
  });
  process.exit(0);
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
  apiBaseUrl: options.apiBaseUrl,
  density: options.density,
  locale: options.locale,
  projectTitle,
  theme: options.theme,
  template: options.template,
  modules: options.modules,
  withDemo: options.withDemo
});
writeProjectReadme(targetRoot, {
  apiBaseUrl: options.apiBaseUrl,
  density: options.density,
  locale: options.locale,
  projectTitle,
  theme: options.theme,
  modules: options.modules,
  withDemo: options.withDemo
});

console.log(`Created ${projectTitle} at ${targetRoot}`);
console.log("");
console.log(`Template: ${options.template}`);
console.log(`Modules: ${options.modules.length > 0 ? options.modules.join(", ") : "none"}`);
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
  console.log("  --modules <list>      Comma-separated modules. Supported: users, imports, projects, activities.");
  console.log("  --app-name <name>     App display name written to blueprint.config.js.");
  console.log("  --locale <zh|en>      Default locale.");
  console.log("  --theme <system|light|dark>");
  console.log("  --density <comfortable|compact>");
  console.log("  --api-base-url <url>  Backend API base URL.");
  console.log("  --force               Overwrite target files.");
  console.log("  --dry-run             Preview planned output without writing files.");
}

function parseArgs(values) {
  const parsed = {
    dryRun: false,
    apiBaseUrl: "",
    appName: "",
    density: "comfortable",
    force: false,
    locale: "zh",
    target: "",
    template: "vanilla",
    theme: "system",
    modules: [...defaultDemoModules],
    modulesFlag: false,
    withDemo: true,
    withDemoFlag: false,
    withoutDemoFlag: false
  };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];

    if (value === "--force") {
      parsed.force = true;
      continue;
    }

    if (value === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }

    if (value === "--with-demo") {
      parsed.withDemo = true;
      if (!parsed.modulesFlag) parsed.modules = [...defaultDemoModules];
      parsed.withDemoFlag = true;
      continue;
    }

    if (value === "--without-demo") {
      parsed.withDemo = false;
      if (!parsed.modulesFlag) parsed.modules = [];
      parsed.withoutDemoFlag = true;
      continue;
    }

    if (value === "--modules") {
      parsed.modules = parseModules(readOptionValue(values, index, "--modules"));
      parsed.modulesFlag = true;
      parsed.withDemo = parsed.modules.length > 0;
      index += 1;
      continue;
    }

    if (value === "--app-name") {
      parsed.appName = readOptionValue(values, index, "--app-name");
      index += 1;
      continue;
    }

    if (value === "--locale") {
      parsed.locale = readChoice(readOptionValue(values, index, "--locale"), ["zh", "en"], "--locale");
      index += 1;
      continue;
    }

    if (value === "--theme") {
      parsed.theme = readChoice(readOptionValue(values, index, "--theme"), ["system", "light", "dark"], "--theme");
      index += 1;
      continue;
    }

    if (value === "--density") {
      parsed.density = readChoice(readOptionValue(values, index, "--density"), ["comfortable", "compact"], "--density");
      index += 1;
      continue;
    }

    if (value === "--api-base-url") {
      parsed.apiBaseUrl = readOptionValue(values, index, "--api-base-url");
      index += 1;
      continue;
    }

    if (value === "--target") {
      parsed.target = readOptionValue(values, index, "--target");
      index += 1;
      continue;
    }

    if (value === "--template") {
      parsed.template = readOptionValue(values, index, "--template");
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

  if (parsed.withDemoFlag && parsed.withoutDemoFlag) {
    console.error("Use either --with-demo or --without-demo, not both.");
    process.exit(1);
  }

  return parsed;
}

function parseModules(value) {
  const modules = value.split(",").map((item) => item.trim()).filter(Boolean);
  const unsupported = modules.filter((module) => !supportedModules.includes(module));

  if (unsupported.length > 0) {
    console.error(`Unsupported modules: ${unsupported.join(", ")}`);
    console.error(`Supported modules: ${supportedModules.join(", ")}`);
    process.exit(1);
  }

  return Array.from(new Set(modules));
}

function readOptionValue(values, index, optionName) {
  const value = values[index + 1];

  if (!value || value.startsWith("--")) {
    console.error(`${optionName} requires a value.`);
    process.exit(1);
  }

  return value;
}

function readChoice(value, choices, optionName) {
  if (!choices.includes(value)) {
    console.error(`${optionName} must be one of: ${choices.join(", ")}.`);
    process.exit(1);
  }

  return value;
}

function printDryRun({ targetRoot, projectTitle, templateRoot, options }) {
  const exists = existsSync(targetRoot);
  const fileCount = countFiles(templateRoot);

  console.log("Blueprint scaffold dry run");
  console.log("");
  console.log(`Target: ${targetRoot}`);
  console.log(`Project title: ${projectTitle}`);
  console.log(`Template: ${options.template}`);
  console.log(`Modules: ${options.modules.length > 0 ? options.modules.join(", ") : "none"}`);
  console.log(`Locale: ${options.locale}`);
  console.log(`Theme: ${options.theme}`);
  console.log(`Density: ${options.density}`);
  console.log(`API base URL: ${options.apiBaseUrl || "(empty)"}`);
  console.log(`Template files: ${fileCount}`);
  console.log("");
  console.log("Planned output:");
  console.log(`- Copy templates/${options.template}/ into target directory.`);
  console.log("- Generate blueprint.config.js.");
  console.log("- Generate README.md for selected demo mode.");

  if (!options.withDemo) {
    console.log("- Replace demo app with the minimal app shell.");
  }

  console.log("- Replace project placeholders.");
  console.log("");

  if (exists && !options.force) {
    console.log("Target already exists. Real generation would require --force.");
  } else if (exists && options.force) {
    console.log("Target already exists. Real generation would overwrite files because --force is set.");
  } else {
    console.log("Target does not exist. Real generation would create it.");
  }

  console.log("");
  console.log("No files were written.");
}

function countFiles(directory) {
  let count = 0;

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      count += countFiles(path);
      continue;
    }

    count += 1;
  }

  return count;
}

function writeBlueprintConfig(targetRoot, options) {
  const modules = options.withDemo ? options.modules : [];
  const config = `export default {
  appName: ${JSON.stringify(options.projectTitle)},
  apiBaseUrl: ${JSON.stringify(options.apiBaseUrl)},
  defaultLocale: ${JSON.stringify(options.locale)},
  defaultTheme: ${JSON.stringify(options.theme)},
  density: ${JSON.stringify(options.density)},
  enabledModules: ${JSON.stringify(modules)},
  template: ${JSON.stringify(options.template)},
  demoModules: ${JSON.stringify(modules)},
  themeModes: ["light", "dark"],
  locales: ["zh", "en"]
};
`;

  writeFileSync(join(targetRoot, "blueprint.config.js"), config);
}

function writeProjectReadme(targetRoot, options) {
  const moduleLines = options.modules.map((module) => `- ${toModuleLabel(module)}`).join("\n");
  const demoSection = options.withDemo
    ? `## Included Demo Modules

${moduleLines}
`
    : `## App Shell

This project was generated without demo modules.

Start from:

- \`apps/web/index.html\`
- \`apps/web/src/main.js\`
- \`apps/web/src/styles.css\`

Add feature modules under \`apps/web/src\` and keep reusable behavior in \`packages/headless\`.
`;

  const readme = `# ${options.projectTitle}

Framework-agnostic B2B console starter generated from B2B Frontend Blueprint.

This project is a starter, not a locked framework. Read the code, replace the mock APIs, and keep the resource contracts explicit.

## Run

\`\`\`bash
pnpm dev
\`\`\`

Open:

\`\`\`text
http://127.0.0.1:4173/apps/web/
\`\`\`

Do not open \`apps/web/index.html\` through \`file://\`; the app uses ES modules and package imports.

${demoSection}

## Runtime Configuration

Project metadata and runtime options live in:

\`\`\`text
blueprint.config.js
\`\`\`

Important fields:

\`\`\`js
export default {
  appName: ${JSON.stringify(options.projectTitle)},
  apiBaseUrl: ${JSON.stringify(options.apiBaseUrl || "")},
  defaultLocale: ${JSON.stringify(options.locale)},
  defaultTheme: ${JSON.stringify(options.theme)},
  density: ${JSON.stringify(options.density)},
  enabledModules: ${JSON.stringify(options.withDemo ? options.modules : [])}
};
\`\`\`

Use this file to change app name, backend URL, locale, theme, density, and enabled modules.

## Connect Real APIs

Use \`packages/request\` as the only browser-side HTTP entry:

\`\`\`js
import { createHttpClient } from "./packages/request/src/index.js";
import config from "./blueprint.config.js";

export const client = createHttpClient({
  baseUrl: config.apiBaseUrl,
  getToken: () => localStorage.getItem("access_token")
});
\`\`\`

Resource APIs should expose:

\`\`\`js
{
  query(query),
  create(input),
  update(id, patch),
  delete(id)
}
\`\`\`

List responses should use:

\`\`\`json
{
  "list": [],
  "pageNum": 1,
  "pageSize": 20,
  "total": 0
}
\`\`\`

## Add A Resource Module

Start from:

\`\`\`text
packages/data/src/activities.js
\`\`\`

A resource module should define:

- filters
- table columns
- form schema
- CRUD API
- optional import contract
- row actions

Then add the module key to \`enabledModules\` in \`blueprint.config.js\`.

## Packages

- \`packages/theme\`: design tokens and theme CSS.
- \`packages/runtime-config\`: normalized app runtime configuration.
- \`packages/i18n\`: lightweight dictionaries, translation, and date formatting.
- \`packages/request\`: API adapter, mock client, and request error normalization.
- \`packages/auth\`: minimal current-user and permission skeleton.
- \`packages/form-schema\`: framework-free field schema and validation.
- \`packages/import-workflow\`: reusable import workflow contract.
- \`packages/resource\`: resource modules, module registry, and CRUD controller.
- \`packages/headless\`: framework-free interaction controllers.
- \`packages/data\`: mock API contracts and fixtures.
- \`packages/dom\`: DOM adapters.
- \`packages/recipes\`: component recipe metadata.

## Scripts

\`\`\`bash
pnpm build
pnpm test
pnpm check
\`\`\`

## AI Usage

When asking an AI coding agent to extend this project, tell it to follow:

- B2B interaction rules from the source blueprint.
- Resource Module Pattern.
- API Integration Contract.
- ConfirmDialog for dangerous actions.
- loading, empty, error, disabled, and permission states.
`;

  writeFileSync(join(targetRoot, "README.md"), readme);
}

function toModuleLabel(module) {
  return {
    activities: "Resource CRUD Example",
    imports: "Import Records",
    projects: "Project Settings Detail",
    users: "User Management"
  }[module] || toTitle(module);
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
      <h1 data-app-title>{{projectTitle}}</h1>
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
    `import { attachThemeController } from "../../../packages/dom/src/index.js";
import { createI18n } from "../../../packages/i18n/src/index.js";
import { createRuntimeConfig } from "../../../packages/runtime-config/src/index.js";
import blueprintConfig from "../../../blueprint.config.js";

const config = createRuntimeConfig(blueprintConfig);
const i18n = createI18n({
  locale: config.defaultLocale
});
const title = config.appName || "B2B Console";

attachThemeController({
  root: document.documentElement,
  trigger: document.querySelector("#theme-toggle"),
  defaultTheme: config.defaultTheme,
  density: config.density,
  labels: {
    light: i18n.t("app.theme.switchToLight"),
    dark: i18n.t("app.theme.switchToDark")
  }
});

document.title = title;
document.documentElement.lang = i18n.locale;
document.querySelector("[data-app-title]").textContent = title;
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
