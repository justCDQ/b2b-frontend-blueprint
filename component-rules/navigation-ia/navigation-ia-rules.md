# Navigation / IA Rules

> Use these rules for information architecture and page-level navigation in 2B console products.
> Navigation is not only a menu. It defines how users understand the system, move between workspaces, and recover context.

---

## 1. Core Principle

Navigation should match the user's mental model and business structure.

Rules:

- Organize routes by user task and resource domain, not by backend table names.
- Keep global navigation stable across authenticated pages.
- Make the current location obvious at all times.
- Preserve user context when moving between list, detail, edit, and related pages.
- Do not create routes that cannot be reached from navigation, links, or valid actions.
- Do not use local state for page-level navigation.
- Navigation should use link/router semantics, not mutation button semantics.

Good IA:

```text
Workspace -> Module -> Resource list -> Resource detail -> Resource sections/actions
```

Avoid:

```text
Random feature pages connected only by buttons, with no stable hierarchy or return path.
```

---

## 2. Navigation Levels

Use clear levels. Do not make every section a top-level module.

| Level | Purpose | Examples |
|---|---|---|
| Global / Product | Cross-product or account-level entry. | workspace switcher, user menu, billing account |
| L1 Module | Main console domain. | Projects, Users, Integrations, Billing, Settings |
| L2 Section | Submodule inside an L1 domain. | Settings/Security, Billing/Invoices |
| L3 Resource | Specific object or working surface. | `/projects/:projectId`, `/users/:userId` |
| L4 Subsection | Detail page section/tab. | Overview, Activity, Audit Log, Permissions |

Rules:

- L1 modules belong in primary navigation.
- L2 sections can appear in sidebar group, route nav, or module landing page.
- L3 resource pages should be reached from list/search/link.
- L4 subsections should usually be tabs, side nav, anchors, or route segments/query under the detail page.
- Avoid L5 navigation. Use page sections, accordions, drawers, or separate workflows instead.
- A route level should exist only if it changes user context meaningfully.

---

## 3. Route Design

Routes should be stable, readable, and canonical.

Rules:

- Use nouns/resources for route paths.
- Use stable ids for resource routes.
- Keep one canonical route for each major page.
- Use redirects for legacy/alternate paths.
- Avoid duplicating the same page under multiple unrelated paths.
- Page-level selected state belongs in path or query, not component-only local state.
- Query params are for filters, search, sort, pagination, view mode, selected tab, and temporary page state.
- Path segments are for route identity and hierarchy.
- Do not use URL hash for core navigation state.

Examples:

```text
/projects
/projects/:projectId
/projects/:projectId/activity
/users?status=active&page=2
/settings/security
```

Avoid:

```text
/projectDetail?id=123
/settings?page=security
/users/detail/123/edit/logs/deep/more
```

---

## 4. Primary Navigation

Primary navigation shows the main product modules.

Rules:

- Keep primary navigation stable and predictable.
- Show active module based on current route.
- Group related modules when there are many.
- Do not put rare one-off actions in primary navigation.
- Do not put row-level or resource-specific actions in the global shell.
- Keep labels short and domain-specific.
- Use icons only when they improve recognition; text remains required for complex consoles.
- Top-level nav should not change dramatically between modules unless the product context changes.

When module count grows:

- Group modules by domain.
- Provide search/command palette only as an enhancement, not as the only navigation.
- Collapse visually, not semantically: hidden modules must remain reachable.

---

## 5. Secondary Navigation

Secondary navigation helps users move inside a module or detail page.

Use secondary navigation for:

- Settings sections.
- Detail page sections.
- Billing sections.
- Admin submodules.
- Long operational workspaces.

Patterns:

| Pattern | Use when |
|---|---|
| Horizontal route pills | 2-5 peer sections. |
| Sidebar section nav | Many sections or icons/labels need scanning. |
| Tabs | Same-page panels, not independent pages. |
| Anchors | Long single page with sections. |
| Breadcrumb | Hierarchy and return orientation, not peer switching. |

Rules:

- L1 and L2 navigation should look visually distinct.
- Route navigation uses links and derives active state from route.
- Tabs should not be used for unrelated route pages.
- SegmentedControl should not be used for route navigation.
- Sticky secondary nav is allowed when it improves orientation.

---

## 6. Breadcrumb And Back

Breadcrumb and Back solve different problems.

| Pattern | Use when |
|---|---|
| Breadcrumb | The page is deep in a stable hierarchy. |
| Back | The user came from a clear parent workflow such as list -> detail. |
| Both | Deep detail page needs orientation and a fast return. |

Breadcrumb rules:

- Breadcrumb must reflect route/resource hierarchy.
- Breadcrumb items are links except the current page.
- Do not show fake breadcrumbs that do not match IA.
- Resource names in breadcrumb should be stable enough; fallback to id or loading state.
- Breadcrumb should not replace page title.

Back rules:

- Prefer canonical back destination over browser-history-only back when known.
- List -> detail back should restore list filters, search, sort, page, and scroll when possible.
- If there is no safe previous context, back goes to the canonical parent route.
- Back should not discard dirty changes without confirmation.
- Do not create multiple competing back actions on one page.

---

## 7. List To Detail Navigation

List/detail navigation is a core 2B flow.

Rules:

- Identity field in table/list/card should link to detail when a detail route exists.
- Row click may open drawer only when the detail is temporary/contextual.
- Detail page route is required when users need share, refresh, related data, audit, permissions, or deep operations.
- Preserve list query state when entering detail.
- Returning to list should restore the user's previous working context.
- If the detail resource is deleted, show not-found/deleted state with canonical back.

Recommended state:

```text
/users?status=active&role=admin&page=3
-> /users/user_123
Back -> /users?status=active&role=admin&page=3
```

If scroll restoration matters, store it in router/browser state rather than query.

---

## 8. Workspace, Account, And Tenant Context

2B products often have organization/workspace context.

Rules:

- Current workspace/account/tenant should be visible in the shell when it changes data scope.
- Switching workspace must make scope change clear.
- Cross-workspace navigation should not silently reuse stale filters or selected resources.
- Routes should include workspace/account id when pages are not globally scoped.
- If a resource belongs to a different workspace, show a clear access/scope state.
- Breadcrumb and page titles should help users understand current scope.

Route examples:

```text
/workspaces/:workspaceId/projects
/orgs/:orgId/billing/invoices
```

Use global routes only when data is truly global.

---

## 9. Query State And History

Query state should make important page state recoverable without polluting history.

Put in query params:

- search keyword
- filters
- sort
- pagination
- view mode
- selected tab when same-page and shareable
- date range

Do not put in query params:

- transient hover/open state
- raw form drafts
- sensitive tokens/secrets
- large payloads
- scroll position unless there is a strong reason

History rules:

- Filter/search/sort changes usually use replace navigation after debounce.
- Explicit page navigation can push history.
- Opening a route detail page pushes history.
- Closing local drawer/dialog should usually not push history unless route-backed.
- Invalid query params should fall back safely and cleanly.

---

## 10. Navigation With Permission

Permission affects navigation, but should not make IA confusing.

Rules:

- Hide navigation items only when the user should not know the feature exists.
- Disable or show locked state when the feature exists but access can be requested or explained.
- Forbidden routes must show a permission state, not empty data.
- Do not expose sensitive resource names in navigation if the user lacks access.
- If a module is hidden due to permission, direct route access still needs forbidden handling.
- Navigation availability and route guards must use the same permission source.

---

## 11. Responsive Navigation

Use the responsive layout rules as the base.

Rules:

- Desktop consoles often use sidebar navigation.
- Narrow desktop can collapse sidebar to rail or grouped menu.
- Mobile can use sheet navigation, horizontal route pills, or bottom-safe entry depending on app structure.
- Active route must remain visible after collapse.
- Header actions and navigation must not compete for the same small space.
- Secondary route nav can become horizontal scrollable pills.
- Breadcrumb can collapse to parent/back + current title on narrow screens.

Do not:

- Hide primary navigation with no obvious way to open it.
- Depend on hover to reveal navigation.
- Put too many route levels into a mobile header.

---

## 12. Loading, Error, And Missing Routes

Navigation must remain stable across data states.

Rules:

- Page-level loading should keep shell navigation visible.
- Active route should stay visible during loading.
- Not-found state should provide canonical parent navigation.
- Forbidden state should not imply resource does not exist.
- Redirects should be explicit and centralized.
- Route param loading should not flash forbidden/not-found before permissions/resource checks finish.
- Retry should keep current route and query context.

---

## 13. Accessibility

Rules:

- Primary navigation uses semantic navigation landmarks.
- Current route exposes `aria-current` or equivalent active semantics.
- Keyboard users can reach and operate navigation groups.
- Collapsed navigation has accessible labels.
- Breadcrumb uses breadcrumb navigation semantics.
- Focus after route change moves to the page title/main content, not to a random control.
- Skip-to-content should be available in complex shells.

---

## 14. Examples

Project module:

```text
Primary nav: Projects
/projects
/projects/:projectId
/projects/:projectId/activity
/projects/:projectId/settings
```

Settings module:

```text
Primary nav: Settings
Secondary nav: Profile / Security / Billing / API Keys
/settings/profile
/settings/security
/settings/billing
/settings/api-keys
```

Workspace scoped module:

```text
Workspace switcher: Acme
/workspaces/acme/projects
/workspaces/acme/users
/workspaces/acme/audit-logs
```

---

## 15. AI Review Checklist

- IA follows user tasks and resource domains, not backend tables.
- Global navigation is stable and route-aware.
- L1/L2/L3/L4 levels are clear and not over-nested.
- Every route has a reachable entry or intentional redirect.
- Route paths are canonical, readable, and not duplicated.
- Current location is obvious through active nav, title, and/or breadcrumb.
- Breadcrumb reflects real hierarchy.
- Back behavior has a canonical destination and preserves list context.
- List/detail navigation restores filters, sort, page, and scroll when possible.
- Query params are used for recoverable page state, not transient UI state.
- Permission states do not appear as empty data.
- Responsive navigation keeps active route and primary actions reachable.
- Loading/not-found/forbidden states keep navigation stable.
