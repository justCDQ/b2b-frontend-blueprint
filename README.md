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
- A framework-agnostic vanilla demo for validating interaction rules.

It is designed to help teams and coding agents generate more consistent 2B frontend code.

## What This Is Not Yet

This MVP does not include:

- React component source code.
- CLI installer.
- RBAC implementation.
- Auth implementation.
- E2E test project.

Those belong to later phases.

## Run The Demo

Use the local dev server:

```bash
pnpm dev
```

Then open:

```text
http://127.0.0.1:4173/apps/demo-vanilla/
```

Do not open `apps/demo-vanilla/index.html` directly with `file://`. The demo uses ES modules and cross-package imports, so browser module loading works through the local server URL.

## Directory Structure

```text
.
├── apps/
│   └── demo-vanilla/
├── component-rules/
│   ├── README.md
│   ├── _ai-bundles/
│   ├── _inventory/
│   ├── action-system/
│   ├── list-page/
│   ├── table/
│   ├── form/
│   └── ...
├── docs/
│   ├── getting-started.md
│   └── rule-authoring-guide.md
├── examples/
│   └── prompts/
├── packages/
│   ├── data/
│   ├── dom/
│   ├── headless/
│   ├── recipes/
│   └── theme/
├── scripts/
├── system-rules/
│   └── component-architecture/
├── ROADMAP.md
├── LICENSE
└── README.md
```

## Getting Started

Recommended entry points:

- [Getting Started](./docs/getting-started.md): how to read and use the repository.
- [快速开始](./docs/getting-started.zh.md): 中文使用入口。
- [Rule Authoring Guide](./docs/rule-authoring-guide.md): how to add or update rules.
- [规则写作指南](./docs/rule-authoring-guide.zh.md): 中文规则维护指南。
- [Template Architecture](./docs/template-architecture.md): future monorepo and package architecture.
- [模板架构蓝图](./docs/template-architecture.zh.md): 未来代码模板的工程结构。
- [MVP Implementation Plan](./docs/mvp-implementation-plan.md): first runnable code MVP plan.
- [MVP 实施计划](./docs/mvp-implementation-plan.zh.md): 第一版可运行代码 MVP 执行计划。
- [Prompt Examples](./examples/prompts/README.md): prompt templates for AI coding tools.
- [Page Demo Blueprints](./examples/pages/README.md): page-level demo specifications.
- [All AI Rules Entry](./component-rules/_ai-bundles/all-ai-rules.md): top-level AI rules loading guide.
- [AI 规则总入口](./component-rules/_ai-bundles/all-ai-rules.zh.md): 中文 AI 规则加载入口。

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

- [All AI Rules Entry](./component-rules/_ai-bundles/all-ai-rules.md)
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
1. Load all-ai-rules as the top-level guide.
2. Load core-foundation-ai-bundle.
3. Load the scenario bundle, such as list-crud-ai-bundle.
4. Load specific module AI rules when needed.
5. Use human-readable rules for review and refinement.
```

For team discussion:

```text
1. Read the Chinese human-readable rule file.
2. Adjust boundary decisions.
3. Update the matching AI rule file.
4. Update bundles if the change affects generation behavior.
```

For prompt examples:

- [Generate User Management List](./examples/prompts/generate-user-management-list.md)
- [Generate Dialog Form](./examples/prompts/generate-dialog-form.md)
- [Generate Import Workflow](./examples/prompts/generate-import-workflow.md)
- [Review B2B Console Page](./examples/prompts/review-b2b-console-page.md)

For page demo blueprints:

- [User Management](./examples/pages/user-management.md)
- [用户管理](./examples/pages/user-management.zh.md)
- [Import Records](./examples/pages/import-records.md)
- [导入任务](./examples/pages/import-records.zh.md)
- [Project Settings Detail](./examples/pages/settings-detail.md)
- [项目设置详情](./examples/pages/settings-detail.zh.md)

For the framework-agnostic demo skeleton:

```bash
pnpm dev
```

The first runnable app is zero-dependency vanilla HTML/CSS/JavaScript:

- `apps/demo-vanilla`
- `packages/theme`
- `packages/headless`
- `packages/dom`
- `packages/recipes`
- `packages/data`

## MVP Status

Current MVP includes:

- Complete component rule modules.
- Human-readable and AI-executable versions.
- English and Chinese versions.
- AI bundle entry points.
- Initial component architecture system rule.
- First page demo blueprint.
- Framework-agnostic runnable skeleton.

See [ROADMAP.md](./ROADMAP.md) for planned phases.

## License

MIT
