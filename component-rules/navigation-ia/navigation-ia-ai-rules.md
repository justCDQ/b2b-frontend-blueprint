# Navigation / IA AI Rules

> Compact execution rules for AI-generated 2B information architecture and navigation.
> Use `navigation-ia-rules.md` as the detailed reference.

---

## 1. Core Rule

Organize navigation by user tasks and resource domains, not backend table names.

Rules:

- Keep global navigation stable across authenticated pages.
- Current location must be obvious.
- Every route needs a reachable entry or intentional redirect.
- Page-level navigation uses route/link semantics, not local state.
- Preserve context between list, detail, edit, and related pages.

---

## 2. Navigation Levels

Use clear levels:

| Level | Use for |
|---|---|
| Global/Product | workspace switcher, account, user menu |
| L1 Module | main domains: Projects, Users, Billing, Settings |
| L2 Section | module sections: Security, Invoices |
| L3 Resource | detail pages: `/projects/:id` |
| L4 Subsection | detail tabs/sections: Overview, Audit Log |

Rules:

- L1 belongs in primary navigation.
- L2 belongs in sidebar/route nav/module landing page.
- L3 is reached from list/search/link.
- L4 uses tabs, side nav, anchors, route segment, or query.
- Avoid L5 navigation.

---

## 3. Route Rules

Rules:

- Use noun/resource paths.
- Use stable ids for resource routes.
- Keep one canonical route per major page.
- Use redirects for alternate/legacy paths.
- Path segments define hierarchy and page identity.
- Query params define recoverable page state.
- Do not use hash for core navigation state.

Use query params for:

- search
- filters
- sort
- pagination
- view mode
- selected tab when same-page/shareable
- date range

Do not put secrets, large payloads, raw drafts, or transient hover/open state in URL.

---

## 4. Primary And Secondary Navigation

Rules:

- Primary navigation shows main product modules.
- Do not put rare actions or row/resource actions in global nav.
- Active module derives from current route.
- Secondary navigation moves within module/detail page.
- Route navigation uses links.
- Tabs are for same-page panels, not unrelated route pages.
- SegmentedControl is not route navigation.
- Breadcrumb is for hierarchy, not peer switching.

---

## 5. Breadcrumb And Back

Rules:

- Breadcrumb reflects real route/resource hierarchy.
- Breadcrumb items are links except current page.
- Back prefers canonical destination over browser-history-only when known.
- List -> detail back restores filters, search, sort, page, and scroll when possible.
- Back cannot discard dirty changes without confirmation.
- Do not show multiple competing back actions.

---

## 6. Workspace/Tenant Scope

Rules:

- Show current workspace/account/tenant when it changes data scope.
- Include workspace/account id in route when data is scoped.
- Switching workspace must clear or reconcile stale filters/selection/resources.
- Direct access to out-of-scope resource shows access/scope state.

---

## 7. Permission And States

Rules:

- Hide nav item only when user should not know feature exists.
- Disable/lock nav item when access can be explained or requested.
- Forbidden route shows permission state, not empty data.
- Direct route access still needs route guard.
- Loading keeps shell navigation visible.
- Not-found offers canonical parent navigation.
- Retry preserves route/query context.

---

## 8. Responsive And Accessibility

Rules:

- Desktop console usually uses sidebar.
- Narrow desktop may collapse to rail/menu.
- Mobile uses sheet navigation or horizontal route pills.
- Active route remains visible after collapse.
- Navigation does not depend on hover.
- Use semantic nav landmarks.
- Active route exposes `aria-current` or equivalent.
- Focus after route change moves to page title/main content.

---

## 9. AI Checklist

- IA follows tasks/resource domains.
- Global navigation is stable and route-aware.
- Navigation levels are clear and not over-nested.
- Each route is reachable or redirected.
- Routes are canonical and readable.
- Query state is used for recoverable page state only.
- Breadcrumb and Back have distinct roles.
- List/detail return restores context.
- Permission state does not look like empty data.
- Responsive nav keeps active route and primary actions reachable.
