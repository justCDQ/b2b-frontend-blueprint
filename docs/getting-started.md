# Getting Started

B2B Frontend Blueprint helps teams and AI coding agents build enterprise console interfaces with clearer interaction rules and a reusable starter template.

Use it for:

- B2B admin consoles.
- SaaS back offices.
- Internal tools.
- Data operation platforms.
- AI-assisted page generation and review.

## What To Do First

1. Read [MVP Scope](./mvp-scope.md).
2. Run the local demo.
3. Generate a starter project.
4. Read the API integration contract.
5. Add or adapt a resource module.
6. Load AI rules when asking an AI agent to generate or review UI.

## Run The Demo

From the repository root:

```bash
pnpm dev
```

Open:

```text
http://127.0.0.1:4173/apps/demo-vanilla/
```

Do not open `apps/demo-vanilla/index.html` through `file://`. The demo uses ES modules and package imports.

The demo includes:

- User Management: hand-written list CRUD reference.
- Import Records: import workflow reference.
- Project Settings: detail page reference.
- Resource CRUD: generic resource page driven by resource metadata.

## Generate A Starter Project

Create a generic console starter:

```bash
node scripts/create-blueprint.mjs my-console --template vanilla --with-demo
```

Create a smaller starter with selected modules:

```bash
node scripts/create-blueprint.mjs ops-console \
  --modules activities,imports \
  --app-name "Ops Console" \
  --locale zh \
  --theme system \
  --density compact \
  --api-base-url https://api.example.com
```

Run the generated project:

```bash
cd ops-console
pnpm build
pnpm dev
```

Generated projects read runtime options from `blueprint.config.js`.

## Configure Runtime Options

The scaffold writes:

```js
export default {
  appName: "Ops Console",
  apiBaseUrl: "https://api.example.com",
  defaultLocale: "zh",
  defaultTheme: "system",
  density: "compact",
  enabledModules: ["activities", "imports"]
};
```

Use this file as the first integration point for app identity, backend URL, theme, locale, density, and enabled modules.

## Connect A Backend API

Read:

- [API Integration Contract](./api-integration.md)
- [API 接入契约](./api-integration.zh.md)

The expected pattern is:

```js
import { createHttpClient } from "../packages/request/src/index.js";
import config from "../blueprint.config.js";

const client = createHttpClient({
  baseUrl: config.apiBaseUrl,
  getToken: () => localStorage.getItem("access_token")
});
```

Resource modules should receive an API object instead of creating global clients internally.

## Add A Resource Module

Read:

- [Add Resource Module](./add-resource-module.md)
- [新增资源模块](./add-resource-module.zh.md)

Use the existing activity resource as the example:

```text
packages/data/src/activities.js
```

The resource pattern covers:

- filters
- table columns
- form schema
- CRUD API
- import contract
- row actions

## Use With AI

For AI page generation, start with:

- [All AI Rules Entry](../component-rules/_ai-bundles/all-ai-rules.md)
- [Core Foundation](../component-rules/_ai-bundles/core-foundation-ai-bundle.md)
- The scenario bundle that matches the task, such as [List CRUD](../component-rules/_ai-bundles/list-crud-ai-bundle.md)

Prompt pattern:

```text
Generate a B2B console resource page.

Follow:
- component-rules/_ai-bundles/core-foundation-ai-bundle.md
- component-rules/_ai-bundles/list-crud-ai-bundle.md
- docs/add-resource-module.md
- docs/api-integration.md

Use the Resource Module Pattern.
Keep actions scoped.
Use ConfirmDialog for dangerous actions.
Handle loading, empty, error, disabled, and permission states.
```

For AI review, ask for:

- interaction boundary issues
- missing states
- unsafe dangerous actions
- unclear permissions
- API contract mismatch
- resource schema mismatch

## Rule Maintenance

Every component rule module should contain four files:

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```

When changing rules:

1. Update the human-readable file.
2. Update the AI rule file.
3. Keep Chinese and English in sync.
4. Update affected AI bundles.
5. Update the inventory for new modules.

See [Rule Authoring Guide](./rule-authoring-guide.md).
