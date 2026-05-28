# List Page AI Rules

> Compact execution rules for AI-generated 2B list pages.
> Use `list-page-rules.md` as the detailed reference.

---

## 1. Page Type

Use Table list when:

- users compare structured records
- many columns matter
- sorting/filtering/batch actions matter
- row-level operations are frequent

Use Card list when:

- users browse/recognize objects
- visual identity or summary matters
- infinite scroll is preferred
- item layout is more important than column comparison

If desktop is table and mobile becomes cards, it is `MobileDataCard`, not Card List.

---

## 2. Standard Structure

List page should include:

```text
Page Header: title + page/list actions
FilterBar: search, filters, refresh, clear, batch/list actions
Content: Table or CardList
Pagination / Load more
State handling: loading, empty, error
```

Rules:

- Page actions affect the whole page/resource domain.
- Row/card actions affect one item.
- Batch actions affect selected items.
- Do not mix action scopes.

---

## 3. Filter And URL State

Rules:

- Page-level search/filter/sort/pagination/view mode should be recoverable from URL.
- Search uses debounce.
- Filter changes reset page.
- Query changes clear selection unless explicitly safe.
- Refresh keeps current query.
- Clear filters resets filter/search and page.
- Invalid query params fall back safely.

---

## 4. Table/List Content

Rules:

- Table uses stable rowKey and structured column config.
- Card list uses stable item identity and safe min card width.
- Status uses StatusBadge/Tag.
- Links use navigation semantics.
- Long text truncates with accessible full value.
- Empty/error/loading state appears in content area, not global shell.
- Mobile table uses `MobileDataCard` with shared field config.

---

## 5. Row/Card Actions

Rules:

- Expose at most 3 common row/card icon actions.
- Extra actions go into More menu.
- Dangerous actions use danger style and ConfirmDialog.
- Action click must not trigger row/card navigation.
- Toggle/switch pending prevents repeated flipping.
- Disabled action needs reason when not obvious.

---

## 6. Detail Entry

Rules:

- Identity field links to route detail when detail route exists.
- Small temporary detail may use dialog.
- Medium contextual detail may use drawer.
- Large/shareable/detail with related data uses route page.
- Returning from route detail should restore list query/page/scroll when possible.

---

## 7. Pagination

Rules:

- Traditional pagination uses `pageNum`, `pageSize`, and `total`.
- Card layout may use infinite scroll.
- Next-token pagination uses `pageSize` plus `nextToken`; do not show total.
- For token pagination in table, show next/previous until no next token.
- Use virtual scroll for 50+ rows/items when row/item height is stable enough.

---

## 8. Data Flow And Race

Rules:

- Query state drives request params.
- Each request uses a params snapshot.
- Only latest matching response may write list data.
- Stale responses cannot overwrite items, total, error, or loading state.
- Refresh has higher priority than stale in-flight results.
- Mutation success updates or refetches list without losing query context.
- Mutation failure rolls back optimistic changes or marks affected row/item failed.

---

## 9. Selection And Batch

Rules:

- Selection uses stable keys.
- Disabled rows/items cannot be selected.
- Batch toolbar appears only when selection exists.
- Show selected count.
- Clarify selected items vs current page vs all matched results.
- Changing filters/sort/page clears selection unless explicitly safe.
- Dangerous batch actions require ConfirmDialog.

---

## 10. State And Feedback

Rules:

- First load uses skeleton/spinner based on known layout.
- Refresh keeps old data when possible.
- Filter/search empty keeps FilterBar and active chips visible.
- Error with old usable data does not replace content.
- Blocking first-load error uses StateView + Retry.
- Toast is for success or non-blocking failures, not blocking content errors.

---

## 11. AI Checklist

- Table vs Card choice is justified.
- Page structure includes header, FilterBar, content, pagination/load strategy.
- Query state is URL-recoverable.
- Filter/search/page changes handle selection and request params.
- Request race protection exists.
- Refresh preserves query and old data when possible.
- Row/card actions are scoped and limited.
- Detail container choice matches complexity.
- Pagination mode matches backend.
- Batch operations show count/scope and confirm dangerous actions.
- Mobile representation preserves data/action semantics.
