# StateView AI Rules

> Compact execution rules for AI-generated 2B frontend code.
> Use the full `state-view-rules.md` as the detailed reference.

---

## 1. When To Use StateView

Use StateView only when the current area cannot render normal content.

Scope must match the failed/empty area:

- Page StateView: whole page has no usable content.
- List StateView: table/card list cannot show rows/items.
- Section StateView: one module/section failed or is empty.
- Dialog StateView: dialog body cannot show content.
- Field state: keep loading/error near the field; do not use page StateView.

Do not use StateView for:

- single button pending
- field validation error
- form submit validation error
- refresh failure when old data is still usable
- short success/failure feedback

---

## 2. Loading

Rules:

- First load with known layout: use skeleton.
- First load with unknown/tiny layout: use centered spinner.
- Refresh with old data: keep old data; show subtle refreshing state.
- Button action pending: show button loading immediately and prevent duplicate click.
- Field options loading: show field/dropdown loading only.
- Infinite scroll: use bottom loading, not full list replacement.
- Avoid loading flicker for very fast requests.
- Do not show empty/error before the first request finishes.

Examples:

```text
Initial table load -> table skeleton
Refresh existing table -> keep rows + refresh button loading
Delete row -> row action/button pending
Remote select loading -> dropdown spinner
```

---

## 3. Empty Decision Order

Before showing empty, resolve in this order:

1. Request failed -> show error.
2. User has no access -> show forbidden.
3. Required setup/integration is missing -> show config/integration empty.
4. Search keyword has no result -> show search-empty.
5. Filters have no result -> show filter-empty.
6. Parent exists but section has no related data -> show local empty.
7. Module has no records yet -> show initial empty.

Never classify as initial empty before ruling out error, permission, setup, search, and filters.

---

## 4. Empty Actions

Use specific empty states.

| Empty state | Primary action |
|---|---|
| initial empty | Create / Import, only with permission |
| filter-empty | Clear filters |
| search-empty | Clear search |
| config-empty | Configure |
| integration-empty | Connect integration |
| permission-empty | Contact admin only if workflow exists |
| local empty | optional Add/Create |
| async-pending empty | View task / Refresh |

Rules:

- Keep FilterBar and active chips visible for filter/search empty.
- Do not show create/configure/connect actions without permission.
- Do not imply permission-hidden data does not exist.
- Do not show downstream create action before required setup exists.
- Local empty should stay compact and keep parent context visible.

---

## 5. Error Boundary

Choose error UI by content availability.

| Scenario | UI |
|---|---|
| first load failed | StateView + Retry |
| list load failed and no rows | list StateView + Retry |
| refresh failed with old data | keep old data + toast/local error |
| section failed | section StateView |
| dialog content failed | dialog body StateView |
| form validation failed | inline field/form error |
| field options failed | field/dropdown error |
| row/action failed | toast + rollback/row error |
| not-found page | StateView + Go back |
| forbidden page | StateView + Go back/Contact admin |

Rules:

- Do not clear useful old data just to show error.
- Error UI must be scoped to the failed area.
- Retry must rerun the failed request with the same route/query/filter/page context.
- Form submit failure must preserve dirty input.
- Server field errors should map back to fields.
- Optimistic mutation failure must rollback or mark failed.

---

## 6. Toast Boundary

Toast is temporary feedback. It is not a content replacement.

Use toast for:

- success feedback
- refresh failure while old content remains usable
- single action failure while content remains usable
- background task started/failed
- copied/export/import started
- offline/reconnected when page content remains usable

Do not use toast as the only feedback for:

- first load failed
- page/list/dialog has no usable content
- field/form validation errors
- missing required setup
- page-level forbidden/not-found

Rules:

- Deduplicate repeated identical error toasts.
- Toast may have at most one lightweight action.
- Toast Retry only for safe/idempotent actions.
- Mobile toast must not cover primary actions.

---

## 7. StateView Actions

Rules:

- Use 0-2 visible actions.
- Usually use 1 primary action.
- Never use two primary buttons.
- Primary action must directly resolve or advance the current state.
- Hide actions the user cannot perform.
- Disabled action needs reason; do not use disabled primary as main recovery.
- Actions should preserve context when possible.
- Labels must be specific verbs, not `OK` or `Submit`.

Default priority:

```text
Failed request -> Retry
Filter empty -> Clear filters
Search empty -> Clear search
Initial empty -> Create/Import if allowed
Missing setup -> Configure/Connect
Async pending -> View task or Refresh
Not found/forbidden -> Go back
Permission empty -> Contact admin only if workflow exists
```

---

## 8. Placement

Rules:

- Page StateView: content area center or slightly above center; keep global nav.
- Table empty/error: table body; keep header/filter when useful.
- Filter/search empty: keep FilterBar and active chips.
- Dialog StateView: body center; header always visible.
- Field loading/error: dropdown or field area.
- Small section empty: compact inline state.
- Mobile: shorter copy, stacked actions.

---

## 9. AI Checklist

Before accepting generated code, verify:

- StateView scope matches the affected area.
- Loading distinguishes first load and refresh.
- Refresh keeps old data when possible.
- Empty cause follows the decision order.
- Filter/search empty preserves query context and recovery action.
- Error does not replace usable old data.
- Toast is not the only feedback for blocking errors.
- Field/form errors are inline.
- Actions are permission-aware and limited to 0-2.
- Retry/Clear/Create/Configure/Go back actions match the state.
- Mobile layout does not hide or cover primary actions.
