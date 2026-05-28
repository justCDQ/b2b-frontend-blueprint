# Page Header / Layout Shell Rules

> Use these rules for 2B console page framing: shell, sidebar, topbar, breadcrumb, page title, page actions, and content width.

---

## 1. Purpose

Layout Shell gives the product stable navigation and persistent context.

Page Header gives the current page a clear identity, orientation, and action area.

Rules:

- Shell owns global navigation and account/workspace context.
- Page Header owns current page title, page status, and page-level actions.
- Main content owns page-specific sections, lists, forms, and local actions.
- Do not put row/list/field-specific actions in the global shell.
- Do not hide page identity behind cards or section headings.

---

## 2. Layout Shell

Common shell parts:

- sidebar or primary navigation
- topbar
- workspace/account/tenant switcher
- user menu
- notification/help entry
- content area

Rules:

- Shell navigation stays stable across authenticated pages.
- Current route must have visible active state.
- Workspace/account scope is visible when it changes data scope.
- Shell should not reflow unpredictably when page content changes.
- Page-level loading, empty, forbidden, and not-found states should keep shell visible when possible.
- Global shell actions must not compete with page actions.
- Mobile shell collapses predictably and keeps active route reachable.

Avoid:

- changing primary navigation between modules without scope change
- placing create/delete/edit row actions in topbar
- hiding workspace context on scoped data pages

---

## 3. Page Header Structure

Recommended structure:

```text
Breadcrumb / Back
Title row: title + status badge + key metadata
Description, optional
Actions
```

Rules:

- Routed pages require a page title.
- Title names the current resource, module, or workflow.
- Status badge appears near title when status affects decisions.
- Short metadata can appear near title when it improves orientation.
- Description is optional and should not repeat the title.
- Page actions sit in the header action area.
- Low-frequency actions go into overflow.
- Header should not become a dense form or toolbar.

Title examples:

```text
Users
Project "Acme Sync"
Import customers
Security settings
```

---

## 4. Header Actions

Page header actions affect the whole page/resource.

Rules:

- Use at most one primary header action.
- Primary action should be the main page/resource operation.
- Secondary actions sit near primary or in overflow.
- Dangerous resource actions usually go to overflow or danger zone.
- Refresh/filter/list actions usually belong near FilterBar/list toolbar, not page header.
- Row actions never belong in page header.
- Navigation actions use link/router semantics.

Common header actions:

| Page type | Common actions |
|---|---|
| list page | Create, Import, Export; sometimes global settings |
| detail page | Edit, Archive, Configure, More |
| settings page | Save only when page is edit form |
| workflow page | Cancel, Save draft, Continue/Submit |

---

## 5. Breadcrumb And Back

Breadcrumb and Back are different.

Use Breadcrumb when:

- page is inside stable hierarchy
- user needs orientation across resource/module levels
- parent routes are meaningful destinations

Use Back when:

- user came from a clear parent workflow such as list to detail
- canonical return destination is known
- returning should preserve list query/page/scroll

Rules:

- Breadcrumb reflects real route/resource hierarchy.
- Breadcrumb items are links except current page.
- Do not show fake breadcrumbs.
- Back should prefer canonical destination over browser-history-only when known.
- Do not show multiple competing Back actions.
- Back must respect dirty state protection.

---

## 6. Content Width And Page Types

Use width by page purpose.

| Page type | Width strategy |
|---|---|
| dense list/table | full available content width |
| card grid | responsive content width with safe grid constraints |
| detail page | medium-to-wide constrained width |
| form/edit page | constrained readable width |
| dashboard | responsive grid bands |
| workflow/wizard | constrained or full depending on complexity |

Rules:

- Lists with many columns may use full width.
- Forms should not stretch fields across excessive width.
- Detail pages should keep first viewport identity clear.
- Avoid nested cards for page sections.
- Use content bands or sections instead of cards-inside-cards.
- Keep page header and content alignment consistent.

---

## 7. Layout States

Rules:

- Initial page load keeps shell stable.
- Page skeleton should match page type.
- Page-level StateView appears in content area, not over global shell.
- Forbidden state should not imply resource does not exist.
- Not-found state provides canonical parent/back action.
- Refresh keeps current route and page header stable.
- Permission-hidden actions should not create awkward header gaps.

---

## 8. Responsive Behavior

Rules:

- Sidebar may collapse to rail, menu button, or sheet.
- Active route remains discoverable after collapse.
- Header actions collapse into overflow before title becomes unreadable.
- Breadcrumb may collapse to parent/back + current title on narrow screens.
- Page title must remain visible.
- Primary page action remains reachable.
- Avoid stacking too many header rows on mobile.

---

## 9. Accessibility

Rules:

- Shell navigation uses semantic navigation landmarks.
- Active route exposes `aria-current` or equivalent.
- Page title is the main heading.
- Breadcrumb uses breadcrumb semantics.
- Header actions have accessible labels.
- Focus after route change moves to main title/content.
- Provide skip-to-content for complex shells.

---

## 10. Examples

List page:

```text
Shell: sidebar + workspace switcher
Header: Users + Create user
FilterBar: search/filter/refresh/import/export
Content: table
```

Detail page:

```text
Breadcrumb: Projects / Acme Sync
Header: Acme Sync + Active badge + Edit + More
Content: summary, tabs, related tables, activity
```

Settings page:

```text
Shell: Settings active
Header: Security settings
Secondary nav: Profile / Security / Billing / API Keys
Content: sectioned form
```

---

## 11. AI Review Checklist

- Shell navigation is stable and route-aware.
- Workspace/account scope is visible when it changes data.
- Page title exists and names current page/resource.
- Header actions are page/resource scoped.
- Row/list/local actions are not placed in shell/header incorrectly.
- Breadcrumb/back behavior is canonical.
- Content width matches page type.
- Loading/empty/error/forbidden states keep shell stable.
- Responsive header preserves title, active route, and primary action.
- Accessibility landmarks and focus behavior exist.
