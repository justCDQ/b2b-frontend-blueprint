# B2B Frontend Blueprint

AI-ready interaction rules and architecture guidelines for enterprise console UI development.

This repository is an MVP blueprint for building 2B / B2B console frontends with AI-assisted development. It includes interaction rules, AI rule bundles, a runnable vanilla demo, a scaffold script, and reusable starter packages.

## What This Is

This project is a **rules-first blueprint plus runnable starter**, not a full admin framework.

It provides:

- Human-readable component and system rules.
- AI-executable compact rules.
- Scenario-based AI rule bundles.
- Initial system architecture rules for reusable 2B console components.
- A framework-agnostic vanilla demo for validating interaction rules.
- A local scaffold script for generating starter projects.
- Reusable runtime, request, auth, form, import, and resource packages.

It is designed to help teams and coding agents generate more consistent 2B frontend code.

## What This Is Not Yet

This MVP intentionally does not include:

- React component source code.
- Published CLI installer.
- Full RBAC platform.
- Full login/register/account system.
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
│   ├── mvp-scope.md
│   ├── add-resource-module.md
│   ├── api-integration.md
│   └── rule-authoring-guide.md
├── examples/
│   └── prompts/
├── packages/
│   ├── auth/
│   ├── data/
│   ├── dom/
│   ├── form-schema/
│   ├── headless/
│   ├── i18n/
│   ├── import-workflow/
│   ├── recipes/
│   ├── request/
│   ├── resource/
│   ├── runtime-config/
│   └── theme/
├── scripts/
├── templates/
│   └── vanilla/
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
- [MVP Scope](./docs/mvp-scope.md): current product boundary and success criteria.
- [MVP 边界](./docs/mvp-scope.zh.md): 当前产品边界和成功标准。
- [Add Resource Module](./docs/add-resource-module.md): how to add a new business resource.
- [新增资源模块](./docs/add-resource-module.zh.md): 如何新增业务资源模块。
- [Rule Authoring Guide](./docs/rule-authoring-guide.md): how to add or update rules.
- [规则写作指南](./docs/rule-authoring-guide.zh.md): 中文规则维护指南。
- [Template Architecture](./docs/template-architecture.md): future monorepo and package architecture.
- [模板架构蓝图](./docs/template-architecture.zh.md): 未来代码模板的工程结构。
- [CLI Template Scaffold Design](./docs/cli-template-scaffold.md): planned CLI and reusable template design.
- [CLI 模板脚手架设计](./docs/cli-template-scaffold.zh.md): CLI 与可复用模板设计。
- [API Integration Contract](./docs/api-integration.md): request layer, resource API, and error protocol.
- [API 接入契约](./docs/api-integration.zh.md): 请求层、资源 API 与错误协议。
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
- [Activity Management](./examples/pages/activity-management.md)
- [活动管理](./examples/pages/activity-management.zh.md)

For the framework-agnostic demo skeleton:

```bash
pnpm dev
```

The first runnable app is zero-dependency vanilla HTML/CSS/JavaScript:

- `apps/demo-vanilla`
- `packages/theme`
- `packages/runtime-config`
- `packages/i18n`
- `packages/request`
- `packages/auth`
- `packages/form-schema`
- `packages/import-workflow`
- `packages/resource`
- `packages/headless`
- `packages/dom`
- `packages/recipes`
- `packages/data`

## Demo Capabilities

The vanilla demo currently covers core B2B console interactions:

- **User Management**: filter bar, data table, pagination, selection, batch actions, row detail, create/edit dialog, ConfirmDialog, permission disabled states, loading, empty, error, and request race handling.
- **Import Records**: upload workflow, wizard stepper, field mapping, validation errors, failed-row download, result summary, recent import tasks, and partial failure state.
- **Project Settings Detail**: detail page layout, edit mode, settings form, related members table, security switches, section-level forbidden/error states, danger zone, and activity log.
- **Shared Interaction Patterns**: light/dark theme, pending and duplicate prevention, dangerous action confirmation, local state refresh, section-level state handling, and compact B2B layout.

## Scaffold A Project

Create a new framework-agnostic console starter from the vanilla template:

```bash
node scripts/create-blueprint.mjs my-console --template vanilla --with-demo
```

Then run the generated project:

```bash
cd my-console
pnpm build
pnpm dev
```

The generated app opens at:

```text
http://127.0.0.1:4173/apps/web/
```

Supported scaffold options:

```text
--target <path>       Target directory. Overrides positional project name.
--template vanilla    Template name. Currently only vanilla is supported.
--with-demo           Include demo modules. Default.
--without-demo        Generate the app shell without demo modules.
--modules <list>      Comma-separated modules. Supported: users, imports, projects, activities.
--app-name <name>     App display name written to blueprint.config.js.
--locale <zh|en>      Default locale.
--theme <system|light|dark>
--density <comfortable|compact>
--api-base-url <url>  Backend API base URL.
--force               Overwrite target files.
--dry-run             Preview planned output without writing files.
```

The generated project includes `blueprint.config.js`. The app reads this file for project metadata such as `appName`, and the generated README changes based on `--with-demo` or `--without-demo`.

Validate scaffold output:

```bash
pnpm test:scaffold
```

## MVP Status

Current MVP includes:

- Complete component rule modules.
- Human-readable and AI-executable versions.
- English and Chinese versions.
- AI bundle entry points.
- Initial component architecture system rule.
- First page demo blueprint.
- Framework-agnostic runnable demo with list, import, and detail workflows.
- First local scaffold script and vanilla template.

See [ROADMAP.md](./ROADMAP.md) for planned phases.

## License

MIT
