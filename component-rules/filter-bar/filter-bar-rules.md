# FilterBar Component System Rules

> Use these rules when building or reviewing filter bars in 2B list pages.
> FilterBar is not a decoration area. It is the compact control surface for query, refresh, reset, and batch actions.

---

## 1. Purpose

FilterBar must help users narrow data quickly without taking over the page.

Goals:

- Keep the first row compact.
- Expose only high-frequency filters.
- Move advanced/low-frequency filters into a popover.
- Keep query state recoverable from URL.
- Provide refresh.
- Provide clear filters when active.
- Reserve space for batch/list actions.

Rule:

- Data area is the main content. FilterBar must not grow into a large form panel.

---

## 2. Component Structure

Recommended structure:

```text
FilterBar
  FilterBarMain
    FilterBarSearch
    FilterBarChips
    FilterBarAdvanced
  FilterBarActions
    FilterBarClear
    FilterBarRefresh
    FilterBarBatchActions
    FilterBarMoreActions
```

If the implementation does not use these exact names, it must preserve the same responsibilities.

---

## 3. What Goes Outside

Expose only L1 controls.

L1 filter controls:

- Main search.
- Primary status chips.
- One core type/category group if it is high-frequency and small.
- Advanced filter trigger.

List actions:

- Refresh.
- Clear filters when active.
- Batch actions when selected.
- More actions when needed.

Rule:

- L1 filter controls should be at most 3: search, chips, advanced.
- Refresh and actions do not count as filters, but must remain compact.

Good:

```text
Search + StatusChips + Advanced + Refresh
```

Bad:

```text
Search + Status + Role + Group + Provider + Region + DateRange + Refresh
```

---

## 4. What Goes Into Advanced

Put these into `FilterBarAdvanced`:

- Low-frequency fields.
- Long enum lists.
- Multi-select filters.
- Date/time ranges.
- Numeric ranges.
- Tags/groups/providers.
- Region/channel/source.
- Advanced match modes.
- Combined conditions.

Decision rules:

- If most users do not use it every time, put it in advanced.
- If it needs explanation, put it in advanced.
- If it would force the first row to wrap, put it in advanced.
- If it has more than 6 options, put it in advanced unless it is the primary status.

---

## 5. FilterBarSearch

Search is for the main keyword.

Examples:

- name
- email
- ID
- order number
- token name
- trace ID

Rules:

- Search input has left search icon.
- Search input has clear button when value exists.
- Placeholder must describe searchable fields.
- Search updates URL state through the list query hook.
- Search change resets page.
- Search change clears selection.

Search modes:

| Mode | Use when | Rule |
|---|---|---|
| Debounced search | request is cheap | debounce 300-500ms |
| Explicit submit | request is expensive or query is complex | update URL only on Enter/search button |

Forbidden:

```jsx
// Bad: page-local handmade search with no clear state contract
const [keyword, setKeyword] = useState('');
<Input value={keyword} onChange={e => setKeyword(e.target.value)} />
```

Required:

```text
Search value -> query values -> URL -> request params
```

---

## 6. FilterBarChips

Use chips for small mutually exclusive filters.

Good:

- all / active / disabled
- all / success / failed
- all / pending / completed
- all / api / webhook / manual

Rules:

- Use chips/segmented control, not multiple Selects.
- Option count should normally be 6 or fewer.
- Chips change resets page.
- Chips change clears selection.
- Chips state must be recoverable from URL.

Forbidden:

```jsx
// Bad: status filter as many independent buttons
<button className={status === 'all' ? 'active' : ''}>All</button>
<button className={status === 'active' ? 'active' : ''}>Active</button>
```

---

## 7. FilterBarAdvanced

Advanced filter is a compact popover/sheet entry for secondary filters.

Required behavior:

- Shows active count when advanced filters are active.
- Provides reset for advanced fields.
- Does not duplicate L1 filters.
- Uses field labels.
- Supports Select, multi-select, checkbox, date/time, numeric input.
- Resets page when changed.
- Clears selection when changed.

Active count:

- Count only advanced fields by default.
- Do not count page, pageSize, or sort.
- Decide whether search/status count is shown separately; do not double-count.

Reset:

- Advanced reset clears advanced filters only.
- Global clear filters clears search + chips + advanced filters.

Mobile:

- Popover content must fit viewport.
- Use full-width controls on mobile.
- If popover becomes too dense, use bottom sheet behavior.

---

## 8. FilterBarActions

Actions live beside filters but are not filters.

Required actions:

- Refresh.

Conditional actions:

- Clear filters when active.
- Batch actions when rows are selected.
- Export/import/upload when list supports them.
- More menu for low-frequency actions.

Rules:

- Refresh must always be available.
- Clear filters should not show when no filter is active.
- Batch actions should not steal search width.
- Low-frequency actions go into More.
- Dangerous batch action uses destructive style and confirmation.

Desktop layout:

```text
left:  Search + Chips + Advanced
right: Clear + Refresh + BatchActions + More
```

Mobile layout:

```text
row 1: Search full width
row 2: Chips horizontal scroll
row 3: Advanced + Refresh + More
```

---

## 9. Refresh

Every list page must have refresh.

Rules:

- Refresh keeps current search, filters, sort, page, and pageSize.
- Refresh should not clear selection unless returned data invalidates rowKeys.
- Refresh button shows loading during manual refresh.
- Manual refresh failure may show error toast.
- Manual refresh keeps old data on failure.
- Silent refresh must not use the refresh button loading state.

Example:

```text
User clicks Refresh
-> keep current URL state
-> fetch current params
-> show refresh button loading
-> update table if params still match
```

---

## 10. Clear Filters

Clear filters appears only when filters are active.

Global clear:

- Clears search.
- Clears chips/status.
- Clears advanced filters.
- Resets page to 1.
- Clears selection.
- Updates URL.

Advanced reset:

- Clears only advanced filters.
- Keeps search and primary status.
- Resets page to 1.
- Clears selection.

Forbidden:

```text
Clear only UI but keep URL params.
Clear URL but leave input values stale.
```

---

## 11. Batch Actions In FilterBar

FilterBar must reserve a place for batch actions.

Rules:

- Batch actions appear only when selected rows exist, or stay disabled with reason.
- Batch count must be visible.
- Multiple batch actions go into DropdownMenu.
- Dangerous batch actions require confirmation.
- Batch operation result uses one aggregated toast.
- After batch action: clear selection, refresh list, recalculate valid page.

Example:

```text
3 selected
[Export] [More]
More -> Move group / Disable / Delete
```

Disabled batch action reasons:

- No rows selected.
- Some selected rows are locked.
- No permission.
- Current selection scope is unsupported.

---

## 12. URL State

FilterBar must integrate with URL-driven query state.

Rules:

- Defaults are not written into URL.
- Every filter field has parse/serialize logic.
- Query changes use replace navigation to avoid polluting history.
- Reset removes related params.
- Back/forward restores filter state.
- Shared link restores filter state.

Recommended schema:

```js
useTableFilters({
  schema: {
    search: { default: '' },
    status: { default: 'all' },
    group: { default: 'all' },
    page: { default: 1, parse: Number, serialize: String },
    pageSize: { default: 20, parse: Number, serialize: String },
  }
});
```

Forbidden:

```js
window.location.hash = 'status=active';
```

---

## 13. State Change Rules

Filter change effects:

| Change | page | selection |
|---|---|---|
| search | reset to 1 | clear |
| chips/status | reset to 1 | clear |
| advanced filter | reset to 1 | clear |
| clear filters | reset to 1 | clear |
| refresh | keep | keep if rowKeys valid |

Rules:

- Any result-set change resets page.
- Any result-set change clears selection.
- Refresh is not a result-set definition change.

---

## 14. Disabled And Permission

FilterBar actions can be disabled.

Rules:

- Disabled action must explain why.
- Use Tooltip or inline reason.
- Disabled action must not fire request.
- Permission logic should be centralized, not scattered in JSX.

Examples:

```text
Cannot export: no export permission
Cannot delete: 2 selected items are locked
Cannot refresh: request in progress
```

Hide instead of disable when:

- The user should never know the ability exists.
- The operation is irrelevant for the current role permanently.

Disable with reason when:

- User may gain access.
- Current state temporarily blocks the action.
- Selected rows do not meet requirements.

---

## 15. Loading

Use specific loading states.

Rules:

- Search/filter fetch uses table fetching state.
- Manual refresh uses refresh button loading.
- Batch operation uses bulk pending state.
- Silent refresh uses no strong visual loading.
- Advanced reset should not show full-page loading unless request is slow.

Do not:

- Skeleton the whole table for a row-level action.
- Show refresh button loading for silent polling.
- Allow repeated refresh clicks during refresh.

---

## 16. Mobile Behavior

Rules:

- Search is full width.
- Chips scroll horizontally.
- Advanced trigger remains visible.
- Refresh remains accessible.
- More actions collect overflow actions.
- Batch actions become compact bar or More menu.
- Touch targets should be at least 36px, key actions near 44px.
- No horizontal overflow at 375px.

Forbidden:

```text
All filter fields stacked as a long mobile form above table.
```

---

## 17. Accessibility

Rules:

- Search input has accessible label or clear placeholder.
- Icon-only buttons have accessible names.
- Tooltip is not the only way to understand critical disabled state on mobile.
- Advanced filter trigger announces active count.
- Keyboard users can reach search, chips, advanced, refresh, clear, and batch actions.

---

## 18. AI Review Checklist

Before accepting a FilterBar implementation, verify:

- L1 filters are compact: search + chips + advanced.
- Low-frequency filters are inside advanced.
- Refresh is always present.
- Clear filters appears only when active.
- Batch actions have a reserved place.
- Filter state is URL-driven.
- Defaults do not pollute URL.
- Query changes reset page and clear selection.
- Refresh keeps query state.
- Search has clear button and search icon.
- Chips are used for primary small status filters.
- Advanced shows active count and reset.
- Disabled actions explain why.
- Mobile layout does not overflow.
- No handmade duplicated search/chips/date picker if shared components exist.
- No hash-based persistence.
