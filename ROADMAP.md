# Roadmap

## Phase 1: Rules Library MVP

Status: done.

- Component rules.
- Human-readable English and Chinese rules.
- AI-executable English and Chinese rules.
- AI rule bundles.
- Component architecture system rule.
- Getting started documentation.
- Rule authoring guide.
- Prompt examples for AI coding tools.
- Top-level AI rules entry.
- Page demo blueprints: User Management, Import Records, Project Settings Detail.

## Phase 2: System Rules

Goal: define the architecture needed for a reusable enterprise console template.

Planned:

- Theme Token Rules
- RBAC Permission Rules
- i18n Rules
- Data Fetching / API Rules
- Browser Compatibility Rules
- Testing Rules
- Auth / User System Rules
- CLI Registry Rules

## Phase 3: Template Architecture

Goal: turn rules into a concrete frontend project blueprint.

Status: draft started.

- Source directory conventions.
- Component layering.
- Token structure.
- Route structure.
- Permission contracts.
- API contract examples.
- Demo module conventions.
- Monorepo package boundaries.
- MVP implementation plan.

## Phase 4: Demo App

Goal: provide a runnable reference console.

Candidate demo:

- Users module
- Projects module
- List page
- FilterBar
- Table
- Detail page
- Dialog form
- Drawer preview
- Permission disabled state
- Loading / Empty / Error states

## Phase 5: CLI / Registry

Goal: install reusable modules into real projects.

Planned commands:

```text
add console-shell
add theme-tokens
add rbac
add auth
add data-table
add filter-bar
add form-system
add import-workflow
add demo-users
```

## Phase 6: Tests And Compatibility

Goal: make the template reliable for real enterprise projects.

Planned:

- E2E test setup.
- Component behavior tests.
- Permission matrix tests.
- Theme visual checks.
- Browser compatibility matrix.
- Accessibility checks.
