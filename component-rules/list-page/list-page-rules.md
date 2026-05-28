# 2B List Page Rules

> Use these rules when creating, modifying, or reviewing 2B list pages.
> The goal is consistency, recoverability, safe operations, and efficient data work.

---

## 1. Page Type

### Use table when

- Users need comparison, scanning, sorting, filtering, pagination, or batch operations.
- Data is structured and rows share stable fields.
- The page is a CRUD/admin list.

Examples:

- User list
- Order list
- Token list
- Log list
- Member list
- Config list

### Use card list when

- Users identify, browse, or choose objects.
- Each item needs summary, cover, description, tags, or uneven content.
- Horizontal comparison is not the main task.

Examples:

- Project cards
- Document cards
- Template cards
- App/resource cards

### Do not confuse these

- Card list is a list type.
- `MobileDataCard` is the mobile representation of a table.

If desktop is a table and mobile becomes cards, it is still a table pattern.

---

## 2. Standard Page Structure

Use this structure for table list pages:

```text
ConsolePage
  PageHeader / title actions
  FilterBar
    FilterBarSearch
    FilterBarChips
    FilterBarAdvanced
    List actions
  TableContainer
    Table
      selection column
      data columns
      action column
    Pagination
  ResponsiveDialog
  ConfirmDialog
  Toast feedback
```

Rules:

- Default page width: Standard.
- CRUD table: use `TableContainer`.
- Auxiliary table inside a detail section: use `ContentCard`.
- Do not mix multiple table container styles in one list page.

---

## 3. Filter Area

The filter area must stay compact. Data should get the space, not filters.

### Expose only core filters

Expose:

- Main search: name, email, ID, keyword, order number.
- Primary status chips: all / active / disabled, all / success / failed.
- A small mutually exclusive type group if it is core.
- Advanced filter entry.
- Refresh button.

Hide in advanced filters:

- Low-frequency fields.
- Long enum lists.
- Multi-select fields.
- Date/time ranges.
- Numeric ranges.
- Combined or advanced conditions.

Rule:

- L1 filter area should have at most 3 filter controls: search, chips, advanced.
- Actions such as refresh, clear, batch actions do not count as filters, but must remain compact.

Example:

```text
Good:
Search + StatusChips + Advanced + Refresh

Bad:
Search + Status + Role + Group + Provider + DateRange + Region + Refresh
```

### Refresh

- Every list page must have refresh.
- Manual refresh keeps current search, filters, sort, page, and pageSize.
- Refresh failure may show error toast and must keep old data.

### Clear filters

Show clear filters only when filters are active.

Rules:

- Clear resets search, filters, and page.
- Clear must update URL state.
- If advanced filters are many, provide reset both inside advanced panel and optionally in outer actions.

---

## 4. URL And State

URL/search params are the source of truth for query state.

Put in URL:

- search
- filters
- sort
- page
- pageSize if shareable view is required
- tab/sub tab if refresh/share must restore it

Keep local:

- dialog open state
- dropdown/tooltip open state
- form draft
- row pending
- current editing object

Rules:

- Default values should not pollute URL.
- Reset must clear both UI and URL.
- Request params must be derived from parsed URL values.
- Do not keep one filter state in URL and another in component state.

Example:

```text
URL params -> parsed values -> FilterBar/Table/Pagination -> request params
```

---

## 5. Table Base

Table styles must come from the base table component.

Base table must define:

- header font size, weight, casing, spacing
- cell font size and padding
- row hover
- row border
- selected row state
- skeleton row structure
- empty row structure

Allowed per-page overrides:

- column width
- alignment
- cursor
- content-specific style

Forbidden:

```jsx
// Bad: overriding base table rhythm
<TableHead className="h-12 text-sm font-semibold" />
<TableRow className="hover:bg-muted/80 border-border" />
```

Required:

- Every row has stable `rowKey`.
- Never use array index as row identity.
- selection, expanded rows, editing rows, and row loading must use `rowKey`.

---

## 6. Column Content

Use consistent content semantics.

Rules:

- Status should use Badge, not only colored text.
- Links must look clickable and have hover feedback.
- IDs, keys, trace IDs should use monospace and support copy when useful.
- Long text should truncate and expose full value by tooltip or detail.
- Empty values should show `-`, not `null` or `undefined`.
- Numbers must show unit; money must show currency.
- Destructive/error states must include text, not only color.

Alignment:

- text/name/email: left
- number/money/percent: right
- status/badge/switch: consistent per product
- actions: right
- selection: narrow and centered

Example:

```text
Good:
Status Badge: "Failed"
Amount: "$128.00"
Empty value: "-"

Bad:
Red text with no label
128 without unit
undefined
```

---

## 7. Row Actions

The action column is the last column.

Rules:

- Expose at most 3 common row actions.
- Use icon buttons with tooltip.
- Use semantic icons.
- Avoid duplicate icons for different actions in the same row.
- More than 3 actions go into `MoreHorizontal`.
- Dangerous actions use destructive color.

Dropdown rules:

- Trigger icon: `MoreHorizontal`.
- Width: consistent, e.g. `min-w-[160px]`.
- Item = icon + text.
- Icon/text gap: 8px.
- Dangerous item is last, separated, and both icon/text are destructive.

Example:

```text
Good exposed actions:
Edit, Copy, More

Good menu:
View
Download
---
Delete
```

Forbidden:

```jsx
// Bad: text button inside action column
<Button size="sm">Edit</Button>

// Bad: icon button without tooltip
<Button size="icon"><Pencil /></Button>
```

---

## 8. Row Details

Row click is allowed only when there is real detail value.

Decision:

- Table already contains enough info: no row click, no detail entry.
- Medium extra detail: row click or Eye action opens `ResponsiveDialog`.
- Large detail, operations, tabs, child tables, audit, shareable state: route detail page.

Rules:

- Row click must not be the only accessible detail entry.
- If detail page exists, main identity field should be a link.
- Checkbox, action button, link, switch, dropdown must not trigger row click.
- Clickable rows need cursor and hover feedback.
- Non-clickable rows must not look clickable.

---

## 9. Dialogs And Confirmations

Normal actions open `ResponsiveDialog`.

Dialog size by complexity:

- 1-2 fields: `sm`
- 3-6 fields: `md`
- multi-section/tabs: `lg`
- wizard: `xl`
- large fixed-height content: `full`

Dangerous actions use `ConfirmDialog variant="destructive"`.

Danger confirmation must include:

- exact item or scope
- exact action
- consequence

Good:

```text
Delete Token
Confirm deleting Token "prod-api-key"? Requests using this token will fail immediately. This cannot be undone.
```

Bad:

```text
Confirm operation?
Are you sure?
```

---

## 10. Switch Columns

Use Switch for binary states.

Examples:

- enabled / disabled
- on / off
- allowed / blocked

Rules:

- Switch column may appear anywhere semantically appropriate.
- It is not forced into the action column.
- Clicking Switch must not trigger row click.
- Risky switches require confirmation.
- Switch pending state must prevent repeated clicks.
- Failure must roll back and show error.

Confirm required when:

- disabling user/token/channel
- affecting production service
- affecting billing/background task

No confirm needed for:

- low-risk preferences
- display-only settings

---

## 11. Disabled State

Disabled means “not reachable now”, not just gray UI.

### Disabled selection

Rules:

- Non-selectable rows have disabled Checkbox.
- Disabled Checkbox is not counted.
- Header select-all selects only selectable rows.
- If all rows are non-selectable, header Checkbox is disabled.
- Reason must be explainable by tooltip or inline status.

Examples:

```text
System default item cannot be deleted
Archived records cannot be batch modified
No permission to operate this user
```

### Disabled actions

Use disabled + reason when users may understand or later gain access.

Hide when users should never know the ability exists.

Rules:

- Disabled action must not open dialog or send request.
- Tooltip explains why, not just repeats action name.
- Disabled menu item also needs reason.
- Frontend disabled is UX only; backend must still validate permission and state.

---

## 12. Pagination

### Traditional pagination

Default for table.

Request:

- `pageNum`
- `pageSize`
- filters/sort/search

Response:

- `items`
- `total`
- `pageNum`
- `pageSize`

Rules:

- Show total.
- Support page change and pageSize change.
- Default pageSize: 20.
- Options: `[10, 20, 50, 100]`.
- Convert API 1-indexed page and Pagination 0-indexed page at boundary.

### Infinite scroll

Default for card layout.

Rules:

- pageSize should fill at least one full screen.
- Use scroll sentinel.
- Show lightweight “all loaded” state.
- Do not use Pagination for card grid.

### next-token pagination

Use when backend returns cursor instead of total.

Request:

- `pageSize`
- `nextToken` / `cursor`

Response:

- `items`
- `nextToken` or `hasMore`

Rules:

- Do not show total or total pages.
- Natural fit for cards/infinite scroll.
- For table, use next/previous or continue-loading semantics.
- To support previous page, keep token stack.
- Do not use when users need jump-to-page, total count, or full-result batch operations.

### Virtual scroll

Virtual scroll is rendering optimization, not data pagination.

Consider when one page renders 50+ rows/cards.

Use only when:

- row/card height is stable
- interaction is simple
- no complex expanded rows or heavy inline editing

---

## 13. Data Flow

### State changes

Rules:

- search change -> page 1, clear selection
- filter change -> page 1, clear selection
- sort change -> page 1, clear selection
- pageSize change -> page 1, clear selection
- page change -> clear selection by default
- refresh -> keep query state
- batch action done -> clear selection and refresh

### Loading states

Use separate loading states:

- `isInitialLoading`
- `isFetching`
- `isRefreshing`
- `isSilentRefreshing`
- `rowPending[rowKey]`
- `bulkPending`

Rules:

- Row pending does not skeleton the whole table.
- Silent refresh does not show strong loading.
- Manual refresh can show loading only on refresh button.

### Empty/error

Differentiate:

- no data at all
- no result after filter
- no permission
- page out of range
- initial load error
- refresh error
- row action error

Rules:

- Filter empty should offer clear filters.
- Page out of range should go to valid page.
- Refresh failure keeps old data.
- Canceled/expired request should not toast.

---

## 14. Request Race And Refresh Priority

Every list request must prevent stale response overwrite.

Priority:

1. User query change: search/filter/sort/page/pageSize
2. Manual refresh
3. Row operation refresh
4. Dialog submit refresh
5. Silent refresh / polling
6. Preload/background request

Rules:

- New request beats old request.
- User-triggered request beats silent refresh.
- Response may update table only if params snapshot still matches current query.
- Stale response must not write `items`, `total`, `error`, or loading state.
- Stale or canceled response must not show toast.

Recommended:

- `requestId + params snapshot`
- Add `AbortController` when request library supports it.
- Search uses debounce 300-500ms or explicit submit.

Example:

```js
let latestRequestId = 0;

async function fetchList(params, { silent = false } = {}) {
  const requestId = ++latestRequestId;
  const snapshot = serializeParams(params);

  try {
    const result = await api.list(params, { suppressError: silent });
    if (requestId !== latestRequestId) return;
    if (snapshot !== serializeParams(getCurrentParams())) return;

    setItems(result.items);
    setTotal(result.total);
  } catch (error) {
    if (requestId !== latestRequestId) return;
    if (isCanceled(error)) return;
    if (!silent) showError(error);
  }
}
```

---

## 15. Batch Operations

Batch operations must define scope.

Scopes:

- current selected page rows
- manually selected rows across pages
- all rows matching current filters

Default:

- operate only selected rows on current page.
- cross-page and all-filter operations must be explicit.

Rules:

- Selection uses rowKey.
- Header Checkbox selects selectable rows on current page only.
- Disabled rows are not counted.
- Scope label must be visible.
- Dangerous batch operation requires confirmation.
- Confirmation must include action, scope, count, and consequence.
- Payload must specify `ids` or `filter scope`.
- Backend must re-check permission/state per item.
- Use `bulkPending` to prevent duplicate submit.
- Batch result is one aggregated toast.
- Partial failure must show success/failure count and details entry.
- After completion: clear selection, refresh list, recalculate valid page.

Payload examples:

```json
{
  "scope": "ids",
  "ids": ["id1", "id2"]
}
```

```json
{
  "scope": "filter",
  "filters": { "status": "expired" },
  "excludeIds": []
}
```

Good confirmation:

```text
Delete selected Tokens
Confirm deleting 12 selected Tokens? These tokens will stop working immediately. This cannot be undone.
```

Bad confirmation:

```text
Confirm batch operation?
```

---

## 16. Complex Table Features

Use these only when needed.

### Sorting and column filter

- Sorting state must be recoverable from URL.
- Sort change resets page.
- Header filter is only for lightweight column-bound filters.
- Do not duplicate the same filter in FilterBar and column header.

### Fixed header/columns

- Use fixed header for many rows.
- Use fixed first/last column for many columns.
- Do not fix more than 2 columns unless strongly justified.
- Mobile should prefer responsive card representation over fixed columns.

### Expanded rows

- Use only for lightweight extra info.
- Do not put full workflows inside expanded row.
- Medium detail -> dialog.
- Complex detail -> route page.

### Editable cells/rows

- Use for low-risk, high-frequency quick edits.
- Explicit save/cancel required.
- Validation error keeps edit mode.
- Complex or dangerous edit -> dialog.

### Column visibility

- Must have default column set.
- Identity, status, and action columns usually cannot be hidden.
- User preference may persist in localStorage or user profile.
- Mobile field priority should reuse column config.

---

## 17. Mobile Table

Use tiered mobile strategy.

| Condition | Strategy |
|---|---|
| 7+ columns or complex interaction | Desktop table, mobile `MobileDataCard` |
| 4-6 columns | Hide secondary columns, provide detail entry |
| 3 or fewer columns | Keep table with horizontal scroll |

Rules:

- Mobile actions must not depend on hover.
- Header + actions should stack.
- Search full width.
- Chips horizontally scroll.
- Advanced filter remains accessible.
- Dialog becomes bottom sheet.

---

## 18. Toast

Show toast for:

- user-triggered CRUD success/failure
- copy result
- permission denial
- validation blocking submit
- batch result summary

Do not toast:

- normal data load success
- login/navigation success
- polling success
- silent refresh failure
- canceled/expired requests

Rules:

- Batch operation uses one toast.
- Repeated same error should be deduped.
- Error toast should be actionable or understandable.

---

## 19. AI Review Checklist

Before accepting AI-generated list page code, verify:

- Query state is URL-driven.
- Request params derive from parsed URL values.
- Table/card choice matches user task.
- Base table styles are not overridden.
- Stable rowKey is used.
- Action column exposes at most 3 icon actions.
- Tooltip exists for icon actions and disabled actions.
- Dangerous actions use specific confirmation.
- Disabled states explain why.
- Selection scope is explicit.
- Batch payload uses ids or filter scope.
- Pagination protocol is clear.
- Race handling prevents stale response overwrite.
- Loading states are separated.
- Empty/error states are distinct.
- Mobile table strategy is defined.
- Toast usage is not noisy.
