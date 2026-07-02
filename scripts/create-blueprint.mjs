#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(join(repositoryRoot, "package.json"), "utf8"));
const supportedTemplates = ["vanilla"];
const supportedModules = ["users", "imports", "projects", "activities"];
const defaultDemoModules = ["users", "imports", "projects"];

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.version) {
  console.log(packageJson.version);
  process.exit(0);
}

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
writeEnvExample(targetRoot, {
  apiBaseUrl: options.apiBaseUrl,
  density: options.density,
  locale: options.locale,
  projectTitle,
  theme: options.theme
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

printSuccess({
  targetRoot,
  projectTitle,
  options
});

function printHelp() {
  console.log("B2B Frontend Blueprint scaffold");
  console.log("");
  console.log("Usage:");
  console.log("  create-b2b-blueprint <project-name> [options]");
  console.log("  node scripts/create-blueprint.mjs <project-name> [options]");
  console.log("");
  console.log("Examples:");
  console.log("  node scripts/create-blueprint.mjs ops-console --template vanilla --with-demo");
  console.log("  node scripts/create-blueprint.mjs ops-console --without-demo --locale zh --theme system");
  console.log("  node scripts/create-blueprint.mjs ops-console --modules users,activities --api-base-url https://api.example.com");
  console.log("");
  console.log("Options:");
  console.log("  -h, --help           Show help.");
  console.log("  -v, --version        Show package version.");
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

    if (value === "--help" || value === "-h") {
      parsed.help = true;
      continue;
    }

    if (value === "--version" || value === "-v") {
      parsed.version = true;
      continue;
    }

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
  console.log("- Generate .env.example.");
  console.log("- Generate README.md for selected demo mode.");

  if (!options.withDemo) {
    console.log("- Replace demo app with a clean production-start shell.");
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

function printSuccess({ targetRoot, projectTitle, options }) {
  console.log("");
  console.log(`Created ${projectTitle}`);
  console.log("");
  console.log(`Location: ${targetRoot}`);
  console.log(`Template: ${options.template}`);
  console.log(`Mode: ${options.withDemo ? "demo starter" : "clean app shell"}`);
  console.log(`Modules: ${options.modules.length > 0 ? options.modules.join(", ") : "none"}`);
  console.log(`Locale: ${options.locale}`);
  console.log(`Theme: ${options.theme}`);
  console.log(`Density: ${options.density}`);
  console.log(`API base URL: ${options.apiBaseUrl || "(empty)"}`);
  console.log("");
  console.log("Next steps:");
  console.log(`  cd ${options.target}`);
  console.log("  pnpm build");
  console.log("  pnpm dev");
  console.log("");
  console.log("Open:");
  console.log("  http://127.0.0.1:4173/apps/web/");
  console.log("");
  console.log("Useful files:");
  console.log("  blueprint.config.js");
  console.log("  apps/web/src/main.js");
  console.log("  README.md");
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

function writeEnvExample(targetRoot, options) {
  const env = `# Runtime defaults for generated projects.
# The vanilla starter reads blueprint.config.js directly.
# Keep this file as the deployment/env reference when wiring your own build tool.

BLUEPRINT_APP_NAME=${JSON.stringify(options.projectTitle)}
BLUEPRINT_API_BASE_URL=${options.apiBaseUrl || ""}
BLUEPRINT_DEFAULT_LOCALE=${options.locale}
BLUEPRINT_DEFAULT_THEME=${options.theme}
BLUEPRINT_DENSITY=${options.density}
`;

  writeFileSync(join(targetRoot, ".env.example"), env);
}

function writeProjectReadme(targetRoot, options) {
  const moduleLines = options.modules.map((module) => `- ${toModuleLabel(module)}`).join("\n");
  const demoSection = options.withDemo
    ? `## Included Demo Modules

${moduleLines}

These modules are examples. Replace mock data and resource definitions as your product model becomes clear.
`
    : `## App Shell

This project was generated without demo modules.

Start from:

- \`apps/web/index.html\`
- \`apps/web/src/main.js\`
- \`apps/web/src/styles.css\`

Add feature modules under \`apps/web/src\` and keep reusable behavior in \`packages/headless\`.

The shell still includes runtime config, theme, i18n, and the package structure, so you can add real modules without deleting demo code first.
`;

  const readme = `# ${options.projectTitle}

Framework-agnostic B2B console starter generated from B2B Frontend Blueprint.

This project is a starter, not a locked framework. Read the code, replace the mock APIs, and keep the resource contracts explicit.

## Install

\`\`\`bash
pnpm install
\`\`\`

This starter has no framework runtime dependency. It uses native ES modules and small local packages.

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

## Project Structure

\`\`\`text
.
├── apps/web/                 Browser app entry.
├── packages/auth/            Current-user and permission skeleton.
├── packages/data/            Mock data and example resource APIs.
├── packages/dom/             DOM binding helpers.
├── packages/form-schema/     Field schema and validation helpers.
├── packages/headless/        Framework-free interaction controllers.
├── packages/i18n/            Language dictionaries and formatters.
├── packages/import-workflow/ Import workflow contract.
├── packages/request/         HTTP client and error normalization.
├── packages/resource/        Resource modules and CRUD controller.
├── packages/runtime-config/  Runtime config normalization.
├── packages/theme/           Tokens, CSS variables, light/dark styles.
├── blueprint.config.js       App runtime configuration.
└── .env.example              Deployment/env reference.
\`\`\`

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

The generated \`.env.example\` mirrors the same defaults for teams that later introduce Vite, Next.js, Remix, Docker, CI, or another deployment layer. In the vanilla starter, \`blueprint.config.js\` is the source of truth.

## Change Common Defaults

Change the app title:

\`\`\`js
// blueprint.config.js
export default {
  appName: "Operations Console"
};
\`\`\`

Switch the default language:

\`\`\`js
export default {
  defaultLocale: "zh"
};
\`\`\`

Switch the default theme:

\`\`\`js
export default {
  defaultTheme: "system"
};
\`\`\`

Use compact density for data-heavy pages:

\`\`\`js
export default {
  density: "compact"
};
\`\`\`

## Connect Real APIs

Use \`packages/request\` as the only browser-side HTTP entry:

\`\`\`js
import { createHttpClient } from "./packages/request/src/index.js";
import config from "./blueprint.config.js";

export const client = createHttpClient({
  baseUrl: config.apiBaseUrl,
  getToken: () => localStorage.getItem("access_token"),
  onUnauthorized: () => {
    localStorage.removeItem("access_token");
    window.location.hash = "#login";
  }
});
\`\`\`

Standard resource APIs can be generated with \`createResourceApi\`:

\`\`\`js
import { adaptPageResponse, createResourceApi } from "./packages/request/src/index.js";

export const activityApi = createResourceApi({
  client,
  endpoint: "/activities",
  adaptList: (response) => adaptPageResponse(response, {
    listKey: "data.items",
    totalKey: "data.total",
    pageNumKey: "data.pageNum",
    pageSizeKey: "data.pageSize"
  })
});
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

Error responses should use:

\`\`\`json
{
  "code": "VALIDATION_ERROR",
  "message": "Please check the submitted fields.",
  "details": {}
}
\`\`\`

Handle \`401\` by clearing the current session and redirecting to login. Handle \`403\` by rendering forbidden states or disabled actions with a visible reason.

## Auth And Permission

The starter includes a minimal permission skeleton in:

\`\`\`text
packages/auth/src/index.js
\`\`\`

It covers:

- current user profile
- sign in / sign out session state
- role switching for demo verification
- backend user payload normalization
- route permission guard
- forbidden state helpers
- permission checks through \`auth.can(action, resource)\`
- disabled reasons through \`auth.reason(action, resource)\`
- menu filtering through \`filterModulesByPermission\`

Replace the demo profiles with your backend user payload when real login is ready.

Recommended backend login response:

\`\`\`json
{
  "accessToken": "token",
  "user": {
    "id": "user-001",
    "name": "小明",
    "email": "xiaoming@example.com",
    "roles": ["admin"]
  },
  "permissions": ["orders:read", "orders:update"]
}
\`\`\`

Normalize it before creating the auth context:

\`\`\`js
import { normalizeBackendUser } from "./packages/auth/src/index.js";

const profile = normalizeBackendUser(loginResponse);
\`\`\`

## Add A Resource Module

For a maintainable module, split resource concerns by responsibility:

\`\`\`text
orders/
├── orders.schema.js       Filters, columns, and form schema.
├── orders.api.js          createResourceApi adapter.
├── orders.permissions.js  Resource permission map.
└── orders.module.js       createResourceModuleFromParts composition.
\`\`\`

The module composition should look like:

\`\`\`js
import {
  createResourceModuleFromParts,
  createResourceModuleParts
} from "./packages/resource/src/index.js";

export const orderResourceParts = createResourceModuleParts({
  key: "orders",
  label: "Orders",
  resource: "orders",
  schema: {
    filters,
    columns,
    form
  },
  api: orderApi
});

export const orderResource = createResourceModuleFromParts(orderResourceParts);
\`\`\`

Then add the module key to \`enabledModules\` in \`blueprint.config.js\`.

## Remove Demo Modules Later

When you no longer need the examples:

1. Remove unused module keys from \`enabledModules\`.
2. Delete unused demo data from \`packages/data\`.
3. Keep reusable packages such as \`request\`, \`resource\`, \`form-schema\`, \`theme\`, \`i18n\`, and \`auth\`.

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

Run \`pnpm build\` before publishing or handing the project to another developer.

## Troubleshooting

- If the page is blank, make sure you opened the dev server URL, not \`file://\`.
- If styles look wrong, check that \`packages/theme/src/styles.css\` is linked from \`apps/web/index.html\`.
- If API calls fail, confirm \`apiBaseUrl\` in \`blueprint.config.js\` and the backend response shape.
- If a module is missing from navigation, confirm its key exists in \`enabledModules\`.

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
    <div class="shell">
      <aside class="sidebar">
        <div class="brand" data-app-title>{{projectTitle}}</div>
        <nav class="nav" aria-label="App navigation">
          <a class="nav__item nav__item--active" href="#overview">Overview</a>
          <a class="nav__item" href="#resources">Resources</a>
          <a class="nav__item" href="#settings">Settings</a>
        </nav>
      </aside>

      <main class="main">
        <header class="page-header">
          <div>
            <p class="eyebrow">Clean app shell</p>
            <h1 data-app-title>{{projectTitle}}</h1>
            <p>Start from a framework-agnostic B2B console shell with runtime config, theme, i18n, request, auth, and resource packages ready.</p>
          </div>
          <div class="actions">
            <button class="button button--secondary" id="api-check" type="button">Check API</button>
            <button class="button button--primary" id="theme-toggle" type="button">Switch to dark</button>
          </div>
        </header>

        <section class="dashboard-grid">
          <article class="metric-card">
            <span>Runtime</span>
            <strong data-runtime-locale>zh</strong>
            <small>Default locale</small>
          </article>
          <article class="metric-card">
            <span>Theme</span>
            <strong data-runtime-theme>system</strong>
            <small>Light and dark modes are available</small>
          </article>
          <article class="metric-card">
            <span>Density</span>
            <strong data-runtime-density>comfortable</strong>
            <small>Use compact for data-heavy pages</small>
          </article>
          <article class="metric-card">
            <span>API</span>
            <strong data-api-status>Not configured</strong>
            <small data-api-base>Set apiBaseUrl in blueprint.config.js</small>
          </article>
        </section>

        <section class="readiness-grid">
          <article class="readiness-panel">
            <div class="section-header">
              <div>
                <p class="eyebrow">System readiness</p>
                <h2>Backend console foundations</h2>
                <p>The app shell already includes the common infrastructure most B2B projects need before feature work starts.</p>
              </div>
            </div>
            <ul class="check-list">
              <li><strong>Auth session</strong><span>Current user, token slot, sign in/out, route guard, and forbidden state helpers.</span></li>
              <li><strong>Permission model</strong><span>Menu filtering and action checks through <code>auth.can(action, resource)</code>.</span></li>
              <li><strong>API adapter</strong><span>HTTP client, request timeout, token injection, 401/403 hooks, and resource CRUD API factory.</span></li>
              <li><strong>Resource registry</strong><span>Resource modules can be composed from schema, API, permissions, and page metadata.</span></li>
            </ul>
          </article>

          <article class="code-panel">
            <p class="eyebrow">First module shape</p>
            <pre><code>createResourceModuleParts({
  key: "orders",
  resource: "orders",
  schema: { filters, columns, form },
  api: orderApi
});</code></pre>
          </article>
        </section>

        <section class="workbench">
          <div class="section-header">
            <div>
              <p class="eyebrow">Next build step</p>
              <h2>Add your first resource module</h2>
              <p>Define filters, table columns, form schema, permissions, and an API adapter. Then add the module key to <code>enabledModules</code>.</p>
            </div>
          </div>
          <div class="step-list">
            <div class="step-item">
              <strong>1. Create resource schema</strong>
              <span>Start in <code>packages/data/src</code> or create a new business package.</span>
            </div>
            <div class="step-item">
              <strong>2. Connect real API</strong>
              <span>Use <code>createResourceApi</code> from <code>packages/request</code>.</span>
            </div>
            <div class="step-item">
              <strong>3. Register navigation</strong>
              <span>Add your module key to <code>blueprint.config.js</code>.</span>
            </div>
          </div>
        </section>
      </main>
    </div>
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
const apiBaseUrl = config.apiBaseUrl || "";

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
for (const element of document.querySelectorAll("[data-app-title]")) {
  element.textContent = title;
}
document.querySelector("[data-runtime-locale]").textContent = config.defaultLocale;
document.querySelector("[data-runtime-theme]").textContent = config.defaultTheme;
document.querySelector("[data-runtime-density]").textContent = config.density;
document.querySelector("[data-api-status]").textContent = apiBaseUrl ? "Configured" : "Not configured";
document.querySelector("[data-api-base]").textContent = apiBaseUrl || "Set apiBaseUrl in blueprint.config.js";
document.querySelector("#api-check").addEventListener("click", () => {
  const status = document.querySelector("[data-api-status]");
  status.textContent = apiBaseUrl ? "Ready to connect" : "Missing apiBaseUrl";
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

.shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
}

.sidebar {
  background: var(--b2b-color-surface);
  border-right: 1px solid var(--b2b-color-border);
  padding: var(--b2b-space-5) var(--b2b-space-4);
}

.brand {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: var(--b2b-space-5);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: var(--b2b-space-1);
}

.nav__item {
  border-radius: var(--b2b-radius-sm);
  color: var(--b2b-color-text-muted);
  font-size: 14px;
  padding: 8px 10px;
  text-decoration: none;
}

.nav__item:hover,
.nav__item--active {
  background: var(--b2b-color-surface-hover);
  color: var(--b2b-color-text);
}

.main {
  display: grid;
  gap: var(--b2b-space-5);
  min-width: 0;
  padding: var(--b2b-space-5);
}

.page-header {
  align-items: flex-start;
  border-bottom: 1px solid var(--b2b-color-border);
  display: flex;
  gap: var(--b2b-space-4);
  justify-content: space-between;
  padding-bottom: var(--b2b-space-5);
}

.page-header h1 {
  font-size: 24px;
  line-height: 1.2;
  margin: 0 0 8px;
}

.page-header p,
.section-header p {
  color: var(--b2b-color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--b2b-space-2);
  justify-content: flex-end;
}

.eyebrow {
  color: var(--b2b-color-accent);
  font-size: 12px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

.dashboard-grid {
  display: grid;
  gap: var(--b2b-space-4);
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-card,
.workbench {
  background: var(--b2b-color-surface);
  border: 1px solid var(--b2b-color-border);
  border-radius: var(--b2b-radius-md);
}

.metric-card {
  display: grid;
  gap: 6px;
  padding: var(--b2b-space-4);
}

.metric-card span,
.metric-card small {
  color: var(--b2b-color-text-muted);
}

.metric-card strong {
  font-size: 20px;
}

.workbench {
  display: grid;
  gap: var(--b2b-space-4);
  padding: var(--b2b-space-5);
}

.section-header {
  display: flex;
  justify-content: space-between;
}

.readiness-grid {
  display: grid;
  gap: var(--b2b-space-4);
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
}

.readiness-panel,
.code-panel {
  background: var(--b2b-color-surface);
  border: 1px solid var(--b2b-color-border);
  border-radius: var(--b2b-radius-md);
  padding: var(--b2b-space-5);
}

.check-list {
  display: grid;
  gap: var(--b2b-space-3);
  list-style: none;
  margin: var(--b2b-space-4) 0 0;
  padding: 0;
}

.check-list li {
  border-top: 1px solid var(--b2b-color-border);
  display: grid;
  gap: 4px;
  padding-top: var(--b2b-space-3);
}

.check-list span {
  color: var(--b2b-color-text-muted);
  line-height: 1.6;
}

.code-panel {
  align-content: start;
  display: grid;
  gap: var(--b2b-space-3);
}

pre {
  background: var(--b2b-color-bg);
  border: 1px solid var(--b2b-color-border);
  border-radius: var(--b2b-radius-sm);
  margin: 0;
  overflow: auto;
  padding: var(--b2b-space-4);
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}

.step-list {
  display: grid;
  gap: var(--b2b-space-3);
}

.step-item {
  border: 1px solid var(--b2b-color-border);
  border-radius: var(--b2b-radius-sm);
  display: grid;
  gap: 4px;
  padding: var(--b2b-space-4);
}

.step-item span {
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

.button--secondary {
  background: var(--b2b-color-surface);
  border-color: var(--b2b-color-border);
  color: var(--b2b-color-text);
}

@media (max-width: 900px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    border-bottom: 1px solid var(--b2b-color-border);
    border-right: 0;
  }

  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .readiness-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page-header {
    display: grid;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
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
