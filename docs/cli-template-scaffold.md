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

```bash
create-b2b-blueprint my-console
```

Optional flags:

```bash
create-b2b-blueprint my-console --template vanilla
create-b2b-blueprint my-console --template react
create-b2b-blueprint my-console --with-demo
create-b2b-blueprint my-console --without-demo
create-b2b-blueprint my-console --i18n zh,en
create-b2b-blueprint my-console --theme light,dark
```

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

