# B2B Frontend Blueprint

AI-ready interaction rules and architecture guidelines for enterprise console UI development.

This repository is an MVP rules library for building 2B / B2B console frontends with AI-assisted development. It focuses on interaction quality, component boundaries, responsive behavior, permissions, state handling, and reusable architecture.

## What This Is

This project is currently a **rules blueprint**, not a component implementation.

It provides:

- Human-readable component and system rules.
- AI-executable compact rules.
- Scenario-based AI rule bundles.
- Initial system architecture rules for reusable 2B console components.

It is designed to help teams and coding agents generate more consistent 2B frontend code.

## What This Is Not Yet

This MVP does not include:

- React component source code.
- CLI installer.
- RBAC implementation.
- Auth implementation.
- E2E test project.
- A runnable demo app.

Those belong to later phases.

## Directory Structure

```text
.
├── component-rules/
│   ├── README.md
│   ├── _ai-bundles/
│   ├── _inventory/
│   ├── action-system/
│   ├── list-page/
│   ├── table/
│   ├── form/
│   └── ...
├── system-rules/
│   └── component-architecture/
├── ROADMAP.md
├── LICENSE
└── README.md
```

## Rule File Convention

Each module contains four files:

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```

File meanings:

- `*-rules.md`: English human-readable detailed rules.
- `*-rules.zh.md`: Chinese human-readable detailed rules.
- `*-ai-rules.md`: English AI-executable compact rules.
- `*-ai-rules.zh.md`: Chinese AI-executable compact rules.

## Component Rules

Start here:

- [Component Rules README](./component-rules/README.md)
- [AI Rule Bundles](./component-rules/_ai-bundles/README.md)
- [Rules Inventory](./component-rules/_inventory/rules-inventory.md)

Core areas include:

- Action System
- Dialog
- Drawer / Side Panel
- Form
- FilterBar
- Table
- List Page
- Detail Page
- StateView
- Responsive Layout
- Navigation / IA
- Upload / Import Workflow
- Wizard / Stepper
- Timeline / Activity / Audit Log

## AI Bundles

Use bundles when asking AI to generate or review a full interaction pattern.

Available bundles:

- [Core Foundation](./component-rules/_ai-bundles/core-foundation-ai-bundle.md)
- [List CRUD](./component-rules/_ai-bundles/list-crud-ai-bundle.md)
- [Form Overlay](./component-rules/_ai-bundles/form-overlay-ai-bundle.md)
- [Navigation Layout](./component-rules/_ai-bundles/navigation-layout-ai-bundle.md)
- [Data Feedback](./component-rules/_ai-bundles/data-feedback-ai-bundle.md)
- [Import Workflow](./component-rules/_ai-bundles/import-workflow-ai-bundle.md)

## System Rules

System rules define architecture-level constraints beyond individual UI components.

Current system rule:

- [Component Architecture](./system-rules/component-architecture/component-architecture-rules.md)

Planned system rules:

- Theme Token Rules
- RBAC Permission Rules
- i18n Rules
- Data Fetching / API Rules
- Browser Compatibility Rules
- Testing Rules
- Auth / User System Rules
- CLI Registry Rules

## Recommended Use

For AI-assisted page generation:

```text
1. Load core-foundation-ai-bundle.
2. Load the scenario bundle, such as list-crud-ai-bundle.
3. Load specific module AI rules when needed.
4. Use human-readable rules for review and refinement.
```

For team discussion:

```text
1. Read the Chinese human-readable rule file.
2. Adjust boundary decisions.
3. Update the matching AI rule file.
4. Update bundles if the change affects generation behavior.
```

## MVP Status

Current MVP includes:

- Complete component rule modules.
- Human-readable and AI-executable versions.
- English and Chinese versions.
- AI bundle entry points.
- Initial component architecture system rule.

See [ROADMAP.md](./ROADMAP.md) for planned phases.

## License

MIT
