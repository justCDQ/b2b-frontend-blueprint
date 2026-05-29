# Getting Started

This repository is a rules-first blueprint for building B2B console interfaces with AI-assisted development.

It is useful when you want AI to generate enterprise UI code that behaves like a real console product instead of a generic marketing page or a loose component demo.

## Who This Is For

Use this repository if you are:

- Designing a reusable B2B frontend template.
- Building admin consoles, SaaS back offices, internal tools, CRM/ERP-style systems, or data operation platforms.
- Writing prompts for AI coding tools.
- Reviewing whether generated UI follows enterprise interaction conventions.
- Turning component-level design experience into reusable engineering rules.

## What To Read First

For a quick overview:

1. Read [README.md](../README.md).
2. Read [component-rules/README.md](../component-rules/README.md).
3. Read [component-rules/_inventory/rules-inventory.md](../component-rules/_inventory/rules-inventory.md).
4. Read the module that matches your current task.

For Chinese product/design discussion:

1. Prefer `*-rules.zh.md`.
2. Use `*-ai-rules.zh.md` when writing Chinese prompts for AI.
3. Keep English AI rules in sync when the rule affects code generation.

For AI code generation:

1. Start with [all-ai-rules.md](../component-rules/_ai-bundles/all-ai-rules.md).
2. Pick one scenario bundle from [AI Rule Bundles](../component-rules/_ai-bundles/README.md).
3. Add specific module AI rules only when the task needs them.
4. Use human-readable rules for review, edge cases, and product decisions.

## Reading Paths

### Build A List CRUD Page

Load these first:

- [List CRUD AI Bundle](../component-rules/_ai-bundles/list-crud-ai-bundle.md)
- [List Page AI Rules](../component-rules/list-page/list-page-ai-rules.md)
- [FilterBar AI Rules](../component-rules/filter-bar/filter-bar-ai-rules.md)
- [Table AI Rules](../component-rules/table/table-ai-rules.md)
- [Action System AI Rules](../component-rules/action-system/action-system-ai-rules.md)

Use these human-readable references when refining:

- [List Page Rules](../component-rules/list-page/list-page-rules.md)
- [FilterBar Rules](../component-rules/filter-bar/filter-bar-rules.md)
- [Table Rules](../component-rules/table/table-rules.md)

### Build A Form In Dialog Or Detail Page

Load these first:

- [Form Overlay AI Bundle](../component-rules/_ai-bundles/form-overlay-ai-bundle.md)
- [Form AI Rules](../component-rules/form/form-ai-rules.md)
- [Dialog AI Rules](../component-rules/dialog/dialog-ai-rules.md)
- [Drawer / Side Panel AI Rules](../component-rules/drawer-side-panel/drawer-side-panel-ai-rules.md)
- [Detail Page AI Rules](../component-rules/detail-page/detail-page-ai-rules.md)

Use these human-readable references when refining:

- [Form Rules](../component-rules/form/form-rules.md)
- [Dialog Rules](../component-rules/dialog/dialog-rules.md)
- [Detail Page Rules](../component-rules/detail-page/detail-page-rules.md)

### Build Feedback And State Handling

Load these first:

- [Data Feedback AI Bundle](../component-rules/_ai-bundles/data-feedback-ai-bundle.md)
- [StateView AI Rules](../component-rules/state-view/state-view-ai-rules.md)
- [Feedback / Toast AI Rules](../component-rules/feedback-toast/feedback-toast-ai-rules.md)
- [StatusBadge / Tag AI Rules](../component-rules/status-badge/status-badge-ai-rules.md)
- [Timeline / Activity Log AI Rules](../component-rules/timeline-activity-log/timeline-activity-log-ai-rules.md)

### Build Upload Or Import Workflow

Load these first:

- [Import Workflow AI Bundle](../component-rules/_ai-bundles/import-workflow-ai-bundle.md)
- [Upload / Import Workflow AI Rules](../component-rules/upload-import-workflow/upload-import-workflow-ai-rules.md)
- [Wizard / Stepper AI Rules](../component-rules/wizard-stepper/wizard-stepper-ai-rules.md)
- [StateView AI Rules](../component-rules/state-view/state-view-ai-rules.md)
- [Timeline / Activity Log AI Rules](../component-rules/timeline-activity-log/timeline-activity-log-ai-rules.md)

## How To Use With AI

Use this pattern when asking AI to generate code:

```text
You are generating a B2B console page.

Follow:
- component-rules/_ai-bundles/core-foundation-ai-bundle.md
- component-rules/_ai-bundles/list-crud-ai-bundle.md
- component-rules/table/table-ai-rules.md
- component-rules/filter-bar/filter-bar-ai-rules.md

Task:
Generate a user management list page with search, filters, table selection, row actions, batch actions, loading, empty, error, disabled, and permission states.

Constraints:
- Do not create a marketing landing page.
- Use dense but readable console layout.
- Keep action scope explicit.
- Use ConfirmDialog for dangerous actions.
- Protect mutation actions from duplicate clicks.
```

Use this pattern when asking AI to review code:

```text
Review this B2B console implementation against the loaded rules.

Focus on:
- interaction boundary mistakes
- inconsistent action placement
- missing loading/empty/error/disabled states
- unsafe dangerous actions
- unclear permission behavior
- responsive behavior that resets business state

Return findings with file references and concrete fixes.
```

## How To Extend The Rules

Every component module should contain four files:

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```

When you add or change a rule:

1. Update the human-readable version first.
2. Update the matching AI version.
3. Update the Chinese and English files.
4. Update any affected bundle.
5. Update the inventory if a new module is added.

See [Rule Authoring Guide](./rule-authoring-guide.md) for details.

## Current MVP Boundary

This repository currently contains rules and documentation only.

It does not yet include:

- Runnable React components.
- CLI installer.
- Auth or RBAC implementation.
- Test setup.
- Browser compatibility configuration.
- Demo application source code.

Those belong to later phases in [ROADMAP.md](../ROADMAP.md).

