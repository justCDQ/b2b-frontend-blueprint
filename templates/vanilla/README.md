# {{projectTitle}}

Framework-agnostic B2B console starter generated from B2B Frontend Blueprint.

## Run

```bash
pnpm dev
```

Open:

```text
http://127.0.0.1:4173/apps/web/
```

Do not open `apps/web/index.html` through `file://`; the app uses ES modules and package imports.

## Included Demo Modules

- User Management
- Import Records
- Project Settings Detail
- Activity Log

## Packages

- `packages/theme`: design tokens and theme CSS.
- `packages/runtime-config`: normalized app runtime configuration.
- `packages/i18n`: lightweight dictionaries, translation, and date formatting.
- `packages/request`: API adapter, mock client, and request error normalization.
- `packages/auth`: minimal current-user and permission skeleton.
- `packages/form-schema`: framework-free field schema and validation.
- `packages/import-workflow`: reusable import workflow contract.
- `packages/resource`: resource modules, module registry, and CRUD controller.
- `packages/headless`: framework-free interaction controllers.
- `packages/data`: mock API contracts and fixtures.
- `packages/dom`: DOM adapters.
- `packages/recipes`: component recipe metadata.

## Scripts

```bash
pnpm build
pnpm test
pnpm check
```
