# MVP Implementation Plan

This document defines the first code MVP for B2B Frontend Blueprint.

The goal is not to complete the full template at once. The goal is to build a runnable, demonstrable, and extensible minimal loop within one day.

## MVP Goal

The first code MVP focuses on:

```text
runnable demo-vanilla
+ framework-agnostic core packages
+ light/dark theme
+ headless behavior
+ DOM controllers
+ component recipes
+ foundation for the next User Management step
```

The MVP should prove:

- Rules can guide real implementation.
- Component boundaries can work in code.
- B2B console UI is not a marketing page.
- Permission, state, request handling, and responsive behavior are not afterthoughts.
- Import Records and Project Settings Detail can be built later on the same architecture.

## MVP Non-Goals

The first version does not include:

- Full CLI.
- Full RBAC admin backend.
- Full auth and registration flow.
- Full i18n system.
- Full Import Records workflow.
- Full Project Settings Detail page.
- Full E2E test matrix.
- Production component library publishing.
- Real backend integration.

These can come after the MVP loop is validated.

## Recommended Stack

Use a lightweight and standard stack.

| Capability | Recommendation |
|---|---|
| Framework | None; first version uses vanilla HTML/CSS/JavaScript |
| Build | No build step; Node static server |
| Package manager | pnpm as script runner only, no dependency install required |
| Styling | CSS variables + vanilla CSS |
| Icons | No icon library in the first version; adapters may add one later |
| Routing | hash or lightweight history controller; complex routing is deferred |
| Forms | Generic form controller approach; adapters can connect react-hook-form later |
| Mock API | local fixtures + async mock functions |
| Tests | Node syntax check; Playwright later |

Notes:

- The first version does not depend on React, Vue, or Svelte.
- The first version does not need a large UI library.
- Styling should use tokens and CSS variables so theming remains possible.

## MVP Repository Structure

Initialize these directories first:

```text
apps/
└── demo-vanilla/
    ├── src/
    │   ├── main.js
    │   └── styles.css
    └── index.html

packages/
├── headless/
│   └── src/
├── theme/
│   └── src/
├── dom/
│   └── src/
├── recipes/
│   └── src/
└── data/
    └── src/
```

Defer:

```text
packages/cli
packages/rbac
packages/i18n
packages/rules
packages/console-shell
packages/ui
```

Reason:

- MVP can implement lightweight permission and shell behavior inside `apps/demo-vanilla`.
- Stable capabilities can be extracted into independent packages after User Management works.

## First Packages

### packages/theme

Implement first:

- CSS variables.
- light theme.
- dark theme.
- base tokens for spacing, radius, border, color, and typography.

Do not implement:

- complex brand theme editor.
- multiple complete enterprise themes.
- advanced motion tokens.

### packages/headless

Implement first:

- `useDisclosure`
- `useTableSelection`
- `usePendingAction`
- `useRequestRace`
- simplified `useUrlQueryState`

Do not implement:

- complete state machine library.
- headless controllers for every component.

### packages/dom

Implement first:

- disclosure DOM binding.
- theme toggle DOM binding.
- later extension points for dialog, dropdown, tabs, and other DOM controllers.

Do not implement:

- framework components.
- business page logic.
- full accessibility component library.

### packages/recipes

Implement first:

- PageShell recipe.
- PageHeader recipe.
- StateView recipe.
- StatusBadge recipe.
- later FilterBar, DataTable, Dialog, and ConfirmDialog recipes.

Do not implement:

- concrete framework implementation.
- full styled component library.
- complex business components.

### packages/data

Implement first:

- mock delay.
- mock error.
- users fixtures.
- list query function.
- mutation functions.
- request identity helper.

Do not implement:

- complete query client.
- real HTTP client.
- OpenAPI generation.

## First Demo: User Management

MVP implements only User Management.

Reference documents:

```text
examples/pages/user-management.zh.md
examples/pages/user-management.md
```

Implementation target:

- PageHeader.
- FilterBar.
- Table.
- BatchActionBar.
- Create/Edit Dialog.
- Delete ConfirmDialog.
- Reset Password ConfirmDialog.
- StatusBadge.
- Permission disabled.
- Loading / Empty / Error / Pending states.
- Simple URL query recovery.
- light/dark theme.

Defer:

- real detail page.
- full member permission system.
- backend APIs.
- complex form dependencies.
- virtual scroll.

## User Management Data Scope

Mock user fields:

```ts
type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "operator" | "viewer";
  status: "active" | "invited" | "disabled" | "locked";
  team?: {
    id: string;
    name: string;
  };
  mfaEnabled: boolean;
  lastActiveAt?: string;
  createdAt: string;
  permissions: {
    canEdit: boolean;
    canEnable: boolean;
    canDisable: boolean;
    canResetPassword: boolean;
    canDelete: boolean;
    canSelect: boolean;
  };
  disabledReasons?: Record<string, string>;
};
```

Mock states must include:

- normal data.
- no data.
- no search results.
- request error.
- current user cannot delete self.
- viewer has no operation permission.
- operator can only export or view.
- locked user shows error status.

## Permission Strategy

MVP does not implement a full RBAC package.

Start with lightweight demo state:

```text
currentRole: owner | admin | operator | viewer
```

The page provides role switching to verify permission states.

Rules:

- Permission checks can live in `users/permissions.ts`.
- UI receives `disabled` and `disabledReason`.
- Button does not read user roles.
- Dangerous actions without permission are disabled with reasons.
- Current user cannot delete or disable self.

## Required State Coverage

MVP page must cover these states.

### Loading

- initial table loading.
- refresh button pending.
- dialog submit pending.
- row action pending.
- batch action pending.

### Empty

- no users yet.
- no results under current filters.

### Error

- list request failed.
- save failed.
- delete failed.

### Disabled

- permission-denied action disabled.
- disabled row checkbox.
- pending action disabled.

### Success

- create succeeded.
- edit succeeded.
- delete succeeded.
- reset password succeeded.

## Responsive Scope

MVP responsive work only needs basic usability.

Desktop:

- full table.
- FilterBar advanced filters collapsed by default.
- operation column visible.

Tablet:

- table can scroll horizontally.
- PageHeader low-priority actions may collapse.

Mobile:

- table may remain horizontally scrollable or switch to simplified list.
- primary action stays reachable.
- Dialog may use near-full width.
- viewport changes do not reset filters or selection.

## One-Day Execution Plan

### 0. Preparation

Confirm:

- current docs are committed.
- Node / pnpm are available.
- repository is clean.

### 1. Initialize Project

Complete:

- create zero-dependency root scripts.
- create `apps/demo-vanilla`.
- create `packages/theme`, `packages/headless`, `packages/dom`, `packages/recipes`, `packages/data`.
- create Node static server.
- create syntax check script.
- configure base scripts:
  - `dev`
  - `build`
  - `typecheck`

### 2. Implement Theme And Layout

Complete:

- theme tokens.
- light/dark toggle.
- PageShell.
- PageHeader.
- base console layout.

### 3. Implement Base Components

Complete:

- Button / IconButton.
- Tooltip.
- DropdownMenu.
- Dialog.
- ConfirmDialog.
- StateView.
- StatusBadge.

### 4. Implement List Components

Complete:

- FilterBar.
- DataTable.
- Pagination.
- BatchActionBar.
- table selection.

### 5. Implement User Management

Complete:

- users fixtures.
- mock API.
- list query.
- create/edit/delete/reset password.
- role switch.
- permissions.
- loading/empty/error/disabled/pending.

### 6. Verify

Complete:

- `pnpm build`.
- `pnpm typecheck`.
- open local demo.
- manually check four roles.
- manually check light/dark.
- manually check loading/empty/error.

## MVP Acceptance Criteria

MVP is complete when:

- Project can install dependencies and start.
- demo-vanilla opens.
- User Management page works.
- Table supports filtering, pagination, and selection.
- Create/edit dialog opens.
- Dangerous actions use ConfirmDialog.
- Different roles show different permission states.
- Disabled actions explain reasons.
- Loading, empty, error, and pending states can be triggered.
- Light/dark theme can switch.
- Page does not break responsively.
- build and typecheck pass.

## Next Steps After MVP

After MVP, prioritize:

1. Add Drawer.
2. Add Project Settings Detail.
3. Add Wizard / Upload.
4. Add Import Records.
5. Extract full `packages/rbac`.
6. Extract full `packages/i18n`.
7. Add Playwright E2E.
8. Start CLI design.

## Risks And Controls

| Risk | Control |
|---|---|
| Implementing too many components at once | MVP implements only components required by User Management. |
| Abstracting too early | Build a runnable page first, then stabilize APIs. |
| Styling becomes one-off page CSS | Use tokens for colors, spacing, and radius. |
| Permissions are hardcoded in buttons | Keep permission decisions in feature/domain layer. |
| States are missed | Verify against the required state coverage list. |
| Responsive behavior becomes too large | MVP guarantees basic usability only. |
