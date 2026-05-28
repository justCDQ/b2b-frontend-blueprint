# FilterBar AI Rules

> Compact execution rules for AI-generated 2B FilterBar behavior.
> Use `filter-bar-rules.md` as the detailed reference.

---

## 1. Purpose

FilterBar controls list query state without occupying too much page space.

It may include:

- search
- core filters
- advanced filters
- active filter chips
- refresh
- clear filters
- batch/list actions

---

## 2. Visible vs Advanced Filters

Visible filters should be:

- high-frequency
- decision-critical
- compact
- easy to understand
- safe to change often

Advanced filters should contain:

- low-frequency filters
- wide or complex controls
- long option lists
- date ranges when not primary
- technical/internal filters
- filters requiring explanation

Rules:

- Do not show every filter by default.
- Keep the first row compact.
- Advanced filters open in popover/drawer/sheet depending on space and complexity.
- Active advanced filters must be visible as chips or count.

---

## 3. Search And Change Behavior

Rules:

- Text search uses debounce.
- Single select/radio/segmented value may trigger request immediately.
- Multi-select usually applies after confirm.
- Date range applies after valid range is selected.
- Query-changing filters reset page number.
- Query changes clear selection unless explicitly safe.
- Invalid/empty values should be removed from query params.

---

## 4. URL State

Rules:

- Page-level list filters should be recoverable from URL.
- Search, filters, sort, pagination, view mode, and tab/mode can use query params.
- Use replace navigation for debounce-driven query changes.
- Use push only for explicit page navigation or meaningful history entries.
- Do not store raw complex objects, secrets, or transient open state in URL.

---

## 5. Actions

Required:

- Refresh action is required for list pages.

Conditional:

- Clear filters appears when active filters/search exist.
- Batch actions appear only when selection exists.
- Import/export/create actions may appear near list toolbar when list-scoped.

Rules:

- Refresh keeps current query.
- Refresh should not clear selection unless row keys become invalid.
- Clear filters clears filter/search query and resets page.
- Clear filters does not clear view mode unless view mode is part of filter intent.
- Batch actions show selected count and scope.

---

## 6. Loading, Disabled, Permission

Rules:

- Filter changes can show list loading/refreshing.
- Refresh button shows pending while request runs.
- Filter controls may remain usable during refresh unless changing them would create race confusion.
- Disabled filter/action needs reason when not obvious.
- Permission-hidden actions should not leave broken layout gaps.
- Permission-disabled actions explain role/permission when safe.

---

## 7. Responsive

Rules:

- Keep search and most important filters visible when possible.
- Move advanced filters into drawer/sheet on narrow screens.
- Controls may become full-width on mobile.
- Do not stack all filters as a long form above table by default.
- Refresh/Clear filters remain reachable.
- Hover-only explanations need tap/inline alternative.

---

## 8. AI Checklist

- Only core filters are visible by default.
- Advanced filters are accessible and active state is visible.
- Search uses debounce.
- Single/multi/date filter behavior matches expected apply timing.
- Query state is URL-recoverable.
- Filter changes reset page and handle selection.
- Refresh exists and preserves current query.
- Clear filters appears only when useful.
- Batch actions depend on selection.
- Mobile/narrow layout does not become a giant filter form.
