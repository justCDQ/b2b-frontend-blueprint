# CLI Template Scaffold Design

This document defines the first design direction for turning the current B2B frontend blueprint into a reusable project template.

## Goal

The CLI should create a practical B2B console starter without forcing one frontend framework too early.

The first scaffold should provide:

- A clear application structure.
- Theme tokens and layout primitives.
- Headless interaction contracts.
- Demo pages that can be kept, removed, or used as references.
- Extension points for RBAC, i18n, auth, testing, and browser compatibility.

## Non-goals For The First CLI

The first CLI should not try to solve everything.

Do not include:

- A full production auth server.
- A full RBAC backend.
- A heavy component implementation tied to one framework.
- A complex plugin registry.
- Full design-system theming UI.

Those can be added after the template shape is stable.

## Proposed Command

Current local MVP:

```bash
node scripts/create-blueprint.mjs my-console --template vanilla --with-demo
```

Future published command:

```bash
create-b2b-blueprint my-console
```

Optional flags:

```bash
node scripts/create-blueprint.mjs --target my-console --template vanilla
node scripts/create-blueprint.mjs my-console --with-demo
node scripts/create-blueprint.mjs my-console --without-demo
node scripts/create-blueprint.mjs ops-console --modules activities,imports
node scripts/create-blueprint.mjs ops-console --app-name "Ops Console" --locale zh --theme system --density compact
node scripts/create-blueprint.mjs ops-console --api-base-url https://api.example.com
node scripts/create-blueprint.mjs my-console --force
node scripts/create-blueprint.mjs my-console --dry-run
```

Current scaffold smoke test:

```bash
pnpm test:scaffold
```

Future CLI flags can add framework templates and deeper module installation after the local scaffold is stable.

Current validation behavior:

- Unsupported templates fail with the supported template list.
- Unsupported modules fail with the supported module list.
- Unsupported locale, theme, and density values fail with explicit choices.
- `--with-demo` and `--without-demo` cannot be used together.
- `--target` and `--template` require explicit values.
- Existing target folders require `--force`.
- `--dry-run` prints the planned output and writes no files.
- `--dry-run` can inspect an existing target without `--force`; real generation still requires `--force`.
- Generated apps read `blueprint.config.js` for project metadata.
- CLI runtime flags write app name, locale, theme, density, modules, and API base URL into `blueprint.config.js`.
- Generated README content changes based on `--with-demo` or `--without-demo`.

## Template Levels

### Level 1: Vanilla Reference

Purpose:

- Prove the interaction rules without framework assumptions.
- Keep the generated project easy to inspect.
- Provide readable examples for AI agents.

Recommended contents:

```text
apps/web/
├── index.html
├── src/
│   ├── main.js
│   ├── styles.css
│   ├── pages/
│   ├── modules/
│   └── shared/
packages/
├── theme/
├── runtime-config/
├── i18n/
├── request/
├── auth/
├── form-schema/
├── import-workflow/
├── resource/
├── headless/
├── data/
└── dom/
```

### Level 2: Framework Adapter

Purpose:

- Add React/Vue/etc. adapters later.
- Reuse the same headless contracts and design rules.

Framework adapters should wrap behavior; they should not rewrite the core interaction rules.

## Generated Project Structure

Recommended initial output:

```text
my-console/
├── apps/
│   └── web/
├── packages/
│   ├── theme/
│   ├── runtime-config/
│   ├── i18n/
│   ├── request/
│   ├── auth/
│   ├── form-schema/
│   ├── import-workflow/
│   ├── resource/
│   ├── headless/
│   ├── data/
│   ├── dom/
│   └── recipes/
├── docs/
│   ├── rules/
│   ├── architecture.md
│   └── getting-started.md
├── scripts/
├── package.json
└── README.md
```

## Page Modules

The first reusable template should include these demo modules:

- User Management.
- Import Records.
- Project Settings Detail.
- Activity Log.

When `--without-demo` is used, the generated project keeps the packages and scripts but replaces the app with a minimal shell. This keeps the project buildable while giving users a clean starting point.

Each module should keep:

- Page entry.
- Local data contract.
- Interaction handlers.
- Permission and disabled reasons.
- Loading, empty, error, and pending states.

## Configuration

The CLI should generate a small config file:

```js
export default {
  appName: "My Console",
  locale: ["zh", "en"],
  themeModes: ["light", "dark"],
  defaultRole: "owner",
  demoModules: ["users", "imports", "projects"]
};
```

## Future Optional Modules

After MVP, the CLI can offer optional modules:

- RBAC permission model.
- Auth flow.
- i18n dictionaries.
- E2E testing.
- Browser compatibility fallbacks.
- Framework adapter.
- Mock API layer.
- CLI update command.

## Engineering Rules

The generated code should follow these rules:

- Keep business permissions out of visual components.
- Keep mutation pending state explicit.
- Use ConfirmDialog for dangerous actions.
- Keep page state local unless shared state is necessary.
- Use tokens instead of hardcoded theme values.
- Keep demo data replaceable by real API contracts.
- Keep docs close to generated code.

## Suggested Implementation Phases

1. Extract the current vanilla demo into a template directory.
2. Add a script that copies the template into a target folder.
3. Replace app name and package metadata.
4. Add optional demo module selection.
5. Add smoke tests for generated output.
6. Publish as an npm package.
