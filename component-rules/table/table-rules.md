# Table Component System Rules

> Use these rules when building or reviewing 2B table components.
> Table is for structured data work: compare, scan, sort, filter, select, and operate.

---

## 1. Table vs Card

Use table when:

- Users compare fields across rows.
- Data is structured and fields are stable.
- Users need sorting, filtering, pagination, selection, or batch operations.
- The page is admin/CRUD-oriented.

Use card list when:

- Users browse, identify, or choose objects.
- Content varies per item.
- Each item needs summary, cover, tags, or rich preview.
- Horizontal comparison is not the main task.

Important:

- `MobileDataCard` is the mobile representation of a table.
- It is not the same as a card-list product pattern.

---

## 2. Base Table

Table base styles must come from the shared table component.

The base component owns:

- header height
- header font size/weight/casing/tracking
- cell font size and padding
- row hover style
- row border style
- selected row style
- skeleton row rhythm
- empty row rhythm

Allowed per-page overrides:

- column width
- alignment
- cursor
- content-specific style
- group hover if needed

Forbidden:

```jsx
// Bad: page overrides base rhythm
<TableHead className="h-12 text-sm font-semibold" />
<TableRow className="hover:bg-muted/80 border-border" />
<TableCell className="p-5 text-base" />
```

---

## 3. Row Identity

Every row must have a stable `rowKey`.

Rules:

- Use business ID as `rowKey`.
- Never use array index.
- selection uses `rowKey`.
- expanded rows use `rowKey`.
- editing rows use `rowKey`.
- row pending/loading uses `rowKey`.

Bad:

```jsx
rows.map((row, index) => <TableRow key={index} />)
```

Good:

```jsx
rows.map((row) => <TableRow key={row.id} data-row-key={row.id} />)
```

---

## 4. Column Config

Columns should be centrally defined.

Column config should include:

- key
- title
- width / minWidth
- alignment
- sortable
- hideable
- mobile priority
- render function

Rules:

- Do not duplicate field logic across header, cell, and mobile card.
- Selection column and action column are structural columns.
- Structural columns should not participate in business sorting.
- If desktop table and mobile `MobileDataCard` both exist, reuse the same field config where possible.

Example:

```js
const columns = [
  { key: 'name', title: 'Name', minWidth: 180, mobilePriority: 1 },
  { key: 'status', title: 'Status', width: 120, mobilePriority: 2 },
  { key: 'createdAt', title: 'Created', width: 160, sortable: true },
];
```

---

## 5. Content Semantics

Use consistent semantics for cell content.

Rules:

- Status: Badge.
- Linkable resource: Link style.
- ID/key/token/trace ID: monospace, copyable when useful.
- Long text: truncate + tooltip/detail.
- Empty value: `-`, not `null` or `undefined`.
- Number: include unit.
- Money: include currency.
- Error/destructive state: use text + destructive semantics, not color only.

Examples:

```text
Good:
Status Badge "Failed"
$128.00
42 requests
-

Bad:
red text only
128 without unit
undefined
```

---

## 6. Alignment, Width, Truncation

Alignment:

- text/name/email: left
- number/money/percent: right
- time: left or consistent fixed format
- status/badge/switch: consistent per product
- action column: right
- selection column: centered

Width:

- Identity column has stable min width.
- Description columns truncate.
- Action column width is fixed by exposed action count.
- Time/status/money columns should not jump width.
- Do not squeeze every column just to avoid horizontal scroll.

Truncation:

- Names should remain recognizable.
- Descriptions/errors can truncate with tooltip.
- IDs/tokens may middle-truncate and provide copy.
- URLs may show domain/path and expose full value by tooltip/copy.

---

## 7. Selection

Use selection only when batch operations exist or are planned.

Rules:

- Selection column is first.
- Use Checkbox.
- Header Checkbox selects current page selectable rows only.
- Disabled rows are not selected and not counted.
- Search/filter/sort/pageSize changes clear selection.
- Normal page change clears selection by default.
- Cross-page selection must be explicit.
- Batch completion clears selection.

Disabled selection:

- Checkbox disabled.
- Reason available by tooltip or inline status.
- Header select-all ignores disabled rows.

Examples:

```text
Good:
Selected 20 rows on current page
Select all 248 rows matching current filters

Bad:
All selected
```

The bad example is ambiguous.

---

## 8. Action Column

The action column is always the last column.

Rules:

- Expose at most 3 common actions.
- Use icon buttons.
- Every icon button has tooltip.
- Use semantic icons.
- Avoid duplicate icons for different actions in the same row.
- More than 3 actions go into `MoreHorizontal`.
- Dangerous actions use destructive color.

Dropdown rules:

- Trigger: `MoreHorizontal`.
- Width: consistent, e.g. `min-w-[160px]`.
- Item = icon + text.
- Icon/text gap: 8px.
- Dangerous item last, separated, and destructive for both icon/text.

Good:

```text
Edit | Copy | More
More: View, Download, Delete
```

Bad:

```jsx
<Button size="sm">Edit</Button>
<Button size="icon"><Pencil /></Button> // no tooltip
```

---

## 9. Row Detail

Do not add row detail by default.

Decision:

- Table already has enough info: no row click.
- Medium extra info: open `ResponsiveDialog`.
- Large detail/workspace/shareable state: route detail page.

Rules:

- Row click must not be the only accessible detail entry.
- If a route detail page exists, identity field should be a Link.
- Checkbox/action/link/switch/dropdown clicks must not trigger row click.
- Clickable rows need cursor and hover feedback.
- Non-clickable rows must not look clickable.

---

## 10. Switch Column

Use Switch for binary state.

Examples:

- enabled / disabled
- on / off
- allowed / blocked

Rules:

- Switch column can appear wherever semantically correct.
- It is not forced into the action column.
- Click must not trigger row detail.
- Risky switches require confirmation.
- Pending state prevents repeated clicks.
- Failure rolls back and shows error.

Require confirmation when:

- disabling user/token/channel
- affecting production service
- affecting billing/background tasks

---

## 11. Disabled State

Disabled state must explain why an action is unreachable.

### Disabled selection

Use when:

- row is locked
- row is processing
- row is archived
- row is system protected
- user lacks permission
- row cannot join current batch action

Rules:

- Checkbox disabled.
- Not counted in selection.
- Reason available.

### Disabled actions

Show disabled + reason when:

- user may gain permission later
- row state temporarily blocks action
- selected rows do not meet requirements

Hide when:

- user should never know the ability exists
- ability is permanently irrelevant for role

Rules:

- Disabled action does not open dialog.
- Disabled action does not send request.
- Tooltip explains why.
- Backend must still validate permission and state.

---

## 12. Loading And Pending

Use specific loading states.

Table-level:

- `isInitialLoading`
- `isFetching`
- `isRefreshing`
- `isSilentRefreshing`

Row/batch:

- `rowPending[rowKey]`
- `bulkPending`

Rules:

- Row pending does not skeleton the whole table.
- Refresh loading belongs to refresh button.
- Silent refresh has no strong loading.
- Row action pending disables conflicting row actions.
- Repeated clicks must be prevented.

---

## 13. Pagination

Default table pagination is traditional pagination.

Traditional request:

- `pageNum`
- `pageSize`
- filters/search/sort

Traditional response:

- `items`
- `total`
- `pageNum`
- `pageSize`

Rules:

- Show total.
- Support page and pageSize change.
- Default pageSize: 20.
- Options: `[10, 20, 50, 100]`.
- Convert API page index and UI page index at the boundary.

next-token table:

- Do not show total or total pages.
- Use next/previous or continue-loading semantics.
- Keep token stack if previous page is required.
- Avoid if users need jump-to-page, total count, or full-result batch operations.

Virtual scroll:

- Rendering optimization only.
- Consider when 50+ rows render at once.
- Requires stable row height and simple interaction.
- Do not use to replace server pagination.

---

## 14. Data Flow

Rules:

- Query state comes from URL/search params.
- Request params derive from parsed query values.
- Search/filter/sort/pageSize changes reset page to 1.
- Search/filter/sort/pageSize changes clear selection.
- Refresh keeps query state.
- Deleting last item on page may require page fallback.
- Batch operation completion clears selection and refreshes list.

Race handling:

- New request beats old request.
- User query beats silent refresh.
- Response may update table only if params snapshot still matches.
- Stale/canceled responses do not write items, total, loading, or error.
- Stale/canceled responses do not toast.

Recommended:

- `requestId + params snapshot`
- Add `AbortController` when supported.

---

## 15. Batch Operations

Batch operations require explicit scope.

Scopes:

- current page selected rows
- manually selected rows across pages
- all rows matching current filters

Rules:

- Default scope is current page selected rows.
- Cross-page/all-filter scope must be explicit.
- Confirmation must include action, scope, count, and consequence.
- Payload must send `ids` or `filter scope`.
- Backend must validate each item.
- Use `bulkPending`.
- Result uses one aggregated toast.
- Partial failure shows success/failure count and details entry.
- Completion clears selection, refreshes list, recalculates valid page.

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

---

## 16. Complex Features

### Sorting

- Sort state should be URL-recoverable.
- Sort change resets page.
- Single-column sort is default.
- Multi-column sort requires clear priority.

### Header filter

- Use only for lightweight column-bound filters.
- Do not duplicate a FilterBar condition.
- Complex filters belong in Advanced Filter.

### Fixed header/columns

- Use fixed header for many rows.
- Use fixed first/last column for many columns.
- Do not fix more than 2 columns without strong reason.
- Mobile should prefer `MobileDataCard`.

### Expanded rows

- Use for lightweight extra info only.
- Do not put full workflows inside expanded rows.
- Medium detail -> dialog.
- Complex detail -> route page.

### Editable cells/rows

- Use for low-risk quick edits.
- Explicit save/cancel required.
- Validation error keeps edit mode.
- Complex/dangerous edits use dialog.

### Column visibility

- Provide default column set.
- Identity/status/action columns usually cannot be hidden.
- Persist preference when useful.
- Mobile field priority should reuse column config.

---

## 17. Mobile Table

Use tiered strategy.

| Condition | Strategy |
|---|---|
| 7+ columns or complex interaction | desktop table, mobile `MobileDataCard` |
| 4-6 columns | hide secondary columns, provide detail entry |
| 3 or fewer columns | keep table with horizontal scroll |

Rules:

- Mobile actions cannot depend on hover.
- Touch targets must be usable.
- Operation menus should collapse into More when crowded.
- Dialog becomes bottom sheet.
- MobileDataCard must preserve the same data meaning as desktop columns.

---

## 18. Accessibility

Rules:

- Icon buttons have accessible names.
- Tooltip is not the only critical explanation on mobile.
- Checkbox, Switch, Dropdown, Link are keyboard reachable.
- Sort header exposes current sort state.
- Disabled action explains why.
- Row click is not the only path to detail.
- Status is not color-only.

---

## 19. AI Review Checklist

Before accepting AI-generated table code, verify:

- Table is the right pattern, not card list.
- Base table styles are not overridden.
- Stable rowKey is used.
- Column config is centralized.
- Cell content uses Badge/Link/Code/Number/Empty semantics.
- Alignment and truncation are deliberate.
- Selection is rowKey-based.
- Disabled rows are excluded from selection.
- Action column is last.
- At most 3 row actions are exposed.
- More actions use `MoreHorizontal`.
- Dangerous actions are destructive and confirmed.
- Row detail strategy is justified.
- Switch column does not trigger row click.
- Disabled actions explain why.
- Loading states are separated.
- Pagination protocol is clear.
- Race handling prevents stale response overwrite.
- Batch operation scope and payload are explicit.
- Mobile strategy is defined.
- Accessibility basics are present.
