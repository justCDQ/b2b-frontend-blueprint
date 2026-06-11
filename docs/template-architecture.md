# Template Architecture Blueprint

This document defines the future engineering structure for turning the B2B frontend blueprint from a rules repository into a runnable template and CLI-installable system.

It does not implement code yet. It defines code boundaries, package responsibilities, where shared capabilities should live, and how page demo blueprints map to future demo modules.

## Architecture Goals

The template should support three usage modes:

1. **Rules usage**: AI or developers read rules and generate B2B-appropriate frontend code.
2. **Template usage**: developers clone or install a runnable console project.
3. **Module installation**: CLI installs shell, RBAC, table, form, import workflow, demo modules, and rules on demand.

Core goals:

- Components are reusable.
- Styling is themeable.
- Behavior is composable.
- Permission, i18n, theme, routing, and data fetching have clear boundaries.
- Demo pages prove how rules work in real screens.
- CLI can install modules instead of copying one indivisible project.

## Recommended Repository Structure

Use a lightweight monorepo when code implementation starts, but keep the core independent from React, Vue, and Svelte.

```text
.
├── apps/
│   └── demo-vanilla/
├── packages/
│   ├── headless/
│   ├── theme/
│   ├── dom/
│   ├── recipes/
│   ├── adapters/
│   │   ├── react/
│   │   ├── vue/
│   │   └── svelte/
│   ├── ui/
│   ├── icons/
│   ├── rbac/
│   ├── i18n/
│   ├── data/
│   ├── console-shell/
│   ├── rules/
│   └── cli/
├── examples/
│   ├── pages/
│   └── prompts/
├── component-rules/
├── system-rules/
├── docs/
└── ROADMAP.md
```

Notes:

- `apps/demo-vanilla` is the first zero-dependency reference console.
- `packages/headless` contains style-agnostic interaction logic.
- `packages/theme` manages tokens, themes, and density.
- `packages/dom` provides native DOM controllers.
- `packages/recipes` describes component anatomy, slots, states, and class contracts.
- `packages/adapters` later contains React, Vue, and Svelte adapters.
- `packages/ui` can later provide shared framework-agnostic UI assets or adapter support.
- `packages/rbac` provides permission models and helpers.
- `packages/data` provides request, mock, and contract examples.
- `packages/console-shell` provides shell layout and navigation.
- `packages/rules` packages AI rules and documentation entry points.
- `packages/cli` installs modules and rules into target projects.

## Layering Principles

Recommended mental model:

```text
theme tokens
→ headless behavior
→ DOM controller / adapter
→ component recipe
→ semantic component
→ domain component
→ feature module
→ demo app
```

Layer responsibilities:

| Layer | Responsibility | Examples |
|---|---|---|
| theme tokens | Framework-independent style variables | color, spacing, radius, density |
| headless behavior | State, keyboard behavior, selection, validation, request coordination | `createDisclosure`, `createSelectionController` |
| DOM controller / adapter | Connects headless behavior to DOM or frameworks | `attachDisclosure`, React adapter |
| component recipe | Anatomy, slots, states, and class contracts | `pageShell`, `stateView` |
| semantic component | B2B semantic UI | `DataTable`, `FilterBar`, `ConfirmDialog`, `StateView` |
| domain component | Domain data mapping | `UserStatusBadge`, `ProjectMembersTable` |
| feature module | Page-level business module | `users`, `imports`, `projects` |
| demo app | Complete reference console | `apps/demo` |

Rules:

- Core packages do not depend on React, Vue, or Svelte.
- Low-level components do not contain domain logic.
- Business permissions are not hardcoded in primitives.
- API requests do not live in UI primitives.
- Theme does not live in headless hooks.
- Pages own data flow and business orchestration.
- Reusable components expose extension through slots, recipes, data attributes, and adapter props.

## Framework-Agnostic First

Core packages are framework-agnostic by default.

Rules:

- `theme` exports CSS variables and token metadata.
- `headless` exports pure JavaScript/TypeScript behavior logic.
- `dom` binds behavior to native DOM without business page logic.
- `recipes` describes anatomy and state contracts.
- `react`, `vue`, and `svelte` are adapters, not the core.
- The first demo uses `apps/demo-vanilla` to validate core behavior.
- Framework adapters should start only after the core contracts are stable.

## apps/demo-vanilla

`apps/demo-vanilla` is the first runnable product surface.

Responsibilities:

- Demonstrate real template usage.
- Compose framework-agnostic capabilities from `packages/*`.
- Implement page demo blueprints.
- Provide mock APIs and permission switching.
- Provide light/dark theme switching.
- Provide i18n examples.
- Avoid React/Vue/Svelte dependencies.

Recommended structure:

```text
apps/demo-vanilla/
├── src/
│   ├── main.js
│   └── styles.css
└── index.html
```

Rules:

- Demo app may contain business examples, but reusable components should not stay trapped inside demo modules.
- Demo modules may depend on `packages/theme`, `packages/headless`, `packages/dom`, `packages/recipes`, and `packages/data`.
- Mock data should cover permission, state, error, empty, and pending cases.
- Demo app should not become the only source of reusable implementation.

## packages/headless

`packages/headless` contains style-agnostic interaction logic.

Candidate capabilities:

```text
useDisclosure
useControllableState
useTableSelection
usePagination
useFilterState
useUrlQueryState
usePendingAction
useRequestRace
useWizard
useDirtyState
```

Rules:

- Does not depend on CSS.
- Does not depend on a visual component library.
- Does not hardcode business copy.
- Does not call business APIs directly.
- May handle state machines, keyboard behavior, selection, pagination, and request race control.
- Should be easy to unit test.

## packages/ui

`packages/ui` provides reusable B2B UI components.

Recommended structure:

```text
packages/ui/
├── src/
│   ├── primitives/
│   ├── components/
│   ├── patterns/
│   └── index.ts
└── package.json
```

### primitives

Base components:

```text
Button
IconButton
Input
Textarea
Select
Checkbox
Radio
Switch
Dialog
Drawer
Tooltip
DropdownMenu
Tabs
SegmentedControl
```

Rules:

- Primitives do not know business domains.
- Primitives use tokens and variants.
- Primitives own basic accessibility behavior.
- Primitives do not call business APIs.

### components

B2B semantic components:

```text
PageHeader
PageShell
FilterBar
DataTable
CardList
StateView
StatusBadge
ConfirmDialog
Pagination
FormSection
ActionBar
BatchActionBar
```

Rules:

- Components may express B2B interaction semantics.
- Components do not bind to specific business data structures.
- Components support disabled reason, pending, and permission-derived state.
- Components support light/dark theme and responsive behavior.

### patterns

Composition patterns:

```text
ListPageLayout
DetailPageLayout
ImportWizard
SettingsSection
ActivityLog
```

Rules:

- Patterns may package common page fragments.
- Patterns still should not hardcode business domains.
- Complex data mapping belongs in feature modules.

## packages/theme

`packages/theme` manages design tokens, themes, and density.

Candidate content:

```text
tokens/
themes/
css-vars/
density/
motion/
```

Token groups:

- color
- typography
- spacing
- radius
- border
- shadow
- z-index
- motion
- density

Rules:

- Use semantic tokens instead of raw color values.
- Support light and dark modes.
- Support brand theming.
- Support density changes.
- Separate layout tokens from color tokens.
- Component variants map to tokens.

## packages/rbac

`packages/rbac` provides permission models, permission checks, and permission UI helpers.

Candidate content:

```text
createAbility
can
PermissionProvider
usePermission
PermissionGate
getDisabledReason
```

Rules:

- Permission decisions happen in domain or feature layers.
- UI components receive `disabled`, `disabledReason`, and `hidden` results.
- Base components do not read user roles.
- Permissions should support:
  - role-based checks
  - permission strings
  - resource-level permissions
  - state-based permissions
- Demo app should provide role switching to validate disabled and hidden strategies.

## packages/i18n

`packages/i18n` provides internationalization entry points.

Candidate content:

```text
I18nProvider
useTranslation
messages/
formatDate
formatNumber
```

Rules:

- Components do not hardcode product copy.
- Empty text, errors, tooltips, aria labels, and validation messages are injectable.
- UI must tolerate longer translated text.
- Demo app should provide at least Chinese and English copy examples.

## packages/data

`packages/data` provides request, mock, and data contract examples.

Candidate content:

```text
httpClient
requestRace
queryClient
mockServer
fixtures
contracts
```

Rules:

- Data fetching does not live in low-level UI components.
- Pages or feature modules call APIs.
- Request race handling should be reusable.
- Mock data covers:
  - loading
  - empty
  - error
  - success
  - partial success
  - permission denied
  - disabled state
- Data contracts should match page demo types.

## packages/console-shell

`packages/console-shell` provides console-level layout and navigation.

Candidate components:

```text
ConsoleShell
SidebarNav
Topbar
Breadcrumb
RouteTabs
PageContainer
ContentLayout
```

Rules:

- Shell owns navigation, page container, and responsive sidebar.
- Shell does not contain business modules.
- Route config is injected by app.
- Nav items support permission filtering and disabled reasons.
- Mobile navigation needs a clear fallback strategy.

## packages/rules

`packages/rules` packages rule files for CLI and AI tools.

Candidate content:

```text
rules/
bundles/
prompts/
manifest.json
```

Rules:

- Do not duplicate scattered rules manually; generate or sync from `component-rules`, `system-rules`, and `examples/prompts`.
- Provide a manifest that describes rule package version, entry points, and use cases.
- Support bundle outputs:
  - core foundation
  - list CRUD
  - form overlay
  - navigation layout
  - data feedback
  - import workflow

## packages/cli

`packages/cli` installs template modules.

Future command examples:

```text
b2b-blueprint init
b2b-blueprint add console-shell
b2b-blueprint add theme-tokens
b2b-blueprint add rbac
b2b-blueprint add data-table
b2b-blueprint add filter-bar
b2b-blueprint add form-system
b2b-blueprint add import-workflow
b2b-blueprint add demo-users
```

Rules:

- CLI supports module-based installation.
- CLI should not only copy the whole demo app.
- CLI detects target project stack and directories.
- CLI avoids overwriting user files.
- CLI reports installed files and required follow-up configuration.
- CLI supports dry run.

## Page Demo To Code Module Mapping

### User Management

Documents:

```text
examples/pages/user-management.zh.md
examples/pages/user-management.md
```

Recommended code:

```text
apps/demo/src/modules/users/
├── pages/UserManagementPage.tsx
├── components/UserFilterBar.tsx
├── components/UserTable.tsx
├── components/UserFormDialog.tsx
├── components/UserRowActions.tsx
├── api.ts
├── contracts.ts
└── fixtures.ts
```

Covers:

- CRUD list.
- FilterBar.
- DataTable.
- Dialog form.
- ConfirmDialog.
- Batch actions.
- Permission disabled.

### Import Records

Documents:

```text
examples/pages/import-records.zh.md
examples/pages/import-records.md
```

Recommended code:

```text
apps/demo/src/modules/imports/
├── pages/ImportRecordsPage.tsx
├── components/ImportTaskTable.tsx
├── components/ImportWizard.tsx
├── components/FieldMappingStep.tsx
├── components/ValidationStep.tsx
├── components/ImportTaskDetail.tsx
├── api.ts
├── contracts.ts
└── fixtures.ts
```

Covers:

- Upload workflow.
- Wizard / Stepper.
- Async task polling.
- StateView.
- Activity Log.
- Failure recovery.

### Project Settings Detail

Documents:

```text
examples/pages/settings-detail.zh.md
examples/pages/settings-detail.md
```

Recommended code:

```text
apps/demo/src/modules/projects/
├── pages/ProjectDetailPage.tsx
├── sections/OverviewSection.tsx
├── sections/SettingsSection.tsx
├── sections/MembersSection.tsx
├── sections/SecuritySection.tsx
├── sections/ActivitySection.tsx
├── components/ProjectHeader.tsx
├── components/ProjectDangerActions.tsx
├── api.ts
├── contracts.ts
└── fixtures.ts
```

Covers:

- Detail Page.
- Route Navigation / Tabs.
- Page edit mode.
- Related table.
- Drawer.
- Audit Log.
- Forbidden / Not Found / Section Error.

## MVP Implementation Order

Do not implement every module at once. Move in verifiable loops.

### Step 1: Project Skeleton

Implement:

- monorepo config.
- `apps/demo`.
- `packages/ui`.
- `packages/theme`.
- `packages/headless`.
- basic lint, typecheck, and test scripts.

### Step 2: Base Visuals And Layout

Implement:

- theme tokens.
- light/dark theme.
- Button / IconButton.
- PageShell.
- PageHeader.
- Tooltip.
- DropdownMenu.
- StateView.
- Toast.

### Step 3: Overlay And Action

Implement:

- Dialog.
- ConfirmDialog.
- Drawer.
- Action system helpers.
- Pending / duplicate prevention.
- Disabled reason.

### Step 4: Forms And Lists

Implement:

- Form primitives.
- FilterBar.
- DataTable.
- Pagination.
- BatchActionBar.
- StatusBadge.

### Step 5: First Demo

Implement:

- User Management page.
- mock API.
- permission fixture.
- loading / empty / error / disabled / pending states.

### Step 6: Complex Workflow Demo

Implement:

- Import Records page.
- ImportWizard.
- task polling.
- failed rows recovery.

### Step 7: Detail Configuration Demo

Implement:

- Project Settings Detail.
- route tabs.
- page edit mode.
- related table.
- Activity / Audit Log.

## Non-Goals

MVP does not include:

- Full real backend.
- Full production RBAC admin backend.
- Full CLI registry.
- Infinite variants for every component.
- Large all-in-one business system.
- Visual builder or configuration platform.

MVP should prove:

- Rules can guide code generation.
- Component boundaries are practical.
- Three typical B2B page types can run.
- Permission, state, responsive behavior, and theme can be verified.

## Architecture Acceptance Criteria

The template architecture is ready for code initialization when:

- Repository boundaries are clear.
- `apps/demo` and `packages/*` responsibilities are explicit.
- UI, headless, theme, RBAC, data, and shell do not leak responsibilities into each other.
- Page demos map to concrete feature modules.
- MVP implementation order is executable.
- Rules and code templates have a clear relationship.
- Future CLI can install modules instead of copying the whole project.
