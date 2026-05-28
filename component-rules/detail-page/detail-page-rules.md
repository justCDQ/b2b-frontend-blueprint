# Detail Page Rules

> Use these rules for 2B resource detail pages.
> Detail pages support deep review, related data, operations, and shareable route state.

---

## 1. Detail Page vs Dialog vs Drawer

Use Detail Page when:

- users need shareable/reloadable URL
- data is too large for table/dialog/drawer
- related tables/logs/activity exist
- users perform multiple operations around one resource
- detail includes edit mode or complex sections
- users may refresh, bookmark, or share the detail
- permission, audit, billing, or operational context matters
- the page becomes the main working surface

Use Dialog when:

- content is short and focused
- task is temporary
- no shareable state is needed
- user should immediately return to current context
- content fits dialog size rules

Use Drawer when:

- user needs list/current page context while viewing/editing
- detail is medium complexity
- user may scan multiple list items quickly
- workflow is temporary but larger than dialog
- closing returns user to the same task flow

Rules:

- Do not use Dialog for large read-only detail just to avoid routing.
- Do not use Drawer as a hidden route page.
- Do not create Detail Page for tiny temporary content.
- If share/refresh/bookmark matters, use Detail Page.
- If users compare list context while reading detail, Drawer may be better.

---

## 2. Entry From List/Card

Rules:

- Table/list/card identity field should link to Detail Page when detail route exists.
- Row click can open Drawer/Dialog only when detail is contextual and temporary.
- Card click can open Detail Page or Drawer based on complexity.
- `View details` action must match chosen detail container.
- Opening Detail Page should preserve list query/filter/sort/page state.
- Returning to list should restore previous query/page/scroll when possible.
- Opening Drawer/Dialog should keep list visually stable behind it.

Examples:

```text
User row -> identity link -> /users/:id
Project card -> /projects/:id
Job row -> View logs -> drawer
Token row -> quick detail -> dialog/drawer
```

---

## 3. URL And State

Rules:

- Detail Page identity belongs in route path.
- Detail tabs/sections may use route segments or query params.
- Temporary UI state stays local unless recovery/share matters.
- Returning to parent list should preserve query state.
- Refresh keeps current route, section, and selected tab.
- Invalid tab/section query falls back safely.
- Deleted resource shows deleted/not-found state with canonical back.

Examples:

```text
/projects/:projectId
/projects/:projectId/activity
/users/:userId?tab=permissions
```

---

## 4. Page Structure

Recommended structure:

```text
Breadcrumb / Back
Page Header: title, status, metadata, primary actions
Summary / Key facts
Tabs / Sections
Related tables / logs / activity
```

Rules:

- Identity/title is visible in first viewport.
- Status badge appears near title when relevant.
- Primary resource actions are in page header.
- Summary shows key facts needed before deep sections.
- Related data belongs in sections/tabs.
- Avoid turning detail page into a pile of unrelated cards.
- Use sections/bands instead of nested cards when possible.

---

## 5. Information Architecture

Common detail sections:

- Overview
- Settings / Configuration
- Members / Permissions
- Usage / Metrics
- Related records
- Activity Log
- Audit Log
- Billing / Plan
- Integrations

Rules:

- Use tabs/route nav for peer sections.
- Use anchors for long single-page detail.
- Use related tables for child resources.
- Use Activity/Audit Log rules for logs.
- Do not create many tiny tabs.
- L1/L2 navigation should remain visually distinct.

---

## 6. Actions

Rules:

- Page-level actions affect the resource.
- Section actions affect only the section.
- Related table row actions affect related rows.
- Dangerous resource actions go to overflow, danger zone, or ConfirmDialog.
- Edit can open edit mode, dialog, drawer, or route depending on complexity.
- Actions respect permission and disabled reasons.
- Do not mix action scopes.

Common actions:

```text
Edit
Configure
Archive
Disable/Enable
Duplicate
Delete
Export
View audit log
```

---

## 7. Edit Mode

Choose edit mode by complexity:

| Complexity | Edit pattern |
|---|---|
| 1-2 fields | Dialog |
| medium contextual edit | Drawer |
| many fields / sections | Page edit mode |
| shareable edit workflow | Route edit page |

Rules:

- Edit mode must have Save and Cancel.
- Dirty state needs leave confirmation.
- Save pending prevents duplicate submit.
- Save failure preserves input.
- Server field errors map to fields when possible.
- Readonly and permission-disabled fields remain understandable.

---

## 8. Related Data

Rules:

- Related tables/lists keep their own loading/empty/error states.
- Related row actions stay inside related table/list.
- Related filters/search stay local to the section.
- Section empty is compact and should not take over the whole page.
- Related data refresh should not reset the entire detail page.
- Audit/Activity logs follow log rules.

---

## 9. State Handling

Rules:

- Initial loading uses detail skeleton when layout is known.
- Refresh keeps old detail visible when possible.
- Not found shows StateView with canonical back.
- Forbidden shows permission StateView without implying resource does not exist.
- Deleted resource state explains deletion when known.
- Partial section failure stays in section.
- Page-level error appears only when the whole detail cannot render.

---

## 10. Responsive Behavior

Rules:

- Header title/status/actions remain visible and usable.
- Header actions collapse into overflow before title becomes unreadable.
- Detail sections can become stacked.
- Wide summary metadata can become stacked key-value rows.
- Related tables may become MobileDataCard.
- Heavy detail workflows on mobile may use dedicated route page rather than cramped drawer/dialog.

---

## 11. Accessibility

Rules:

- Page title is the main heading.
- Breadcrumb/back are keyboard accessible.
- Tabs/route nav expose active state.
- Status badge is not color-only.
- Save/cancel/dirty confirmation is keyboard accessible.
- Related tables preserve table/list semantics.
- Focus after route/detail load moves to main heading or relevant section.

---

## 12. Examples

User detail:

```text
Header: Rebecca Chen + Active + Edit + More
Summary: role, team, last login
Sections: Overview / Permissions / Activity / Audit Log
Related: sessions, API keys
```

Project detail:

```text
Header: Acme Sync + Running + Configure + More
Summary: owner, environment, sync status
Sections: Overview / Jobs / Members / Settings / Audit Log
```

Avoid:

```text
Tiny token preview as full detail page
Large multi-section account detail inside dialog
Drawer with tabs, related tables, audit log, and many resource actions
```

---

## 13. AI Review Checklist

- Detail Page is justified over Dialog/Drawer.
- Entry from list/card preserves back context.
- Route path/query represent identity and recoverable state.
- Header contains title, status, metadata, and page actions.
- Page structure separates summary, sections, and related data.
- Related data has local states and local actions.
- Action scopes are not mixed.
- Edit pattern matches complexity.
- Dirty/save/failure behavior exists.
- Not-found/forbidden/deleted states are explicit.
- Responsive behavior preserves title, status, and primary actions.
