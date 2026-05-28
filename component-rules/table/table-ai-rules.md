# Table AI Rules

> Compact execution rules for AI-generated 2B table behavior.
> Use `table-rules.md` as the detailed reference.

---

## 1. When To Use Table

Use Table when users need to compare structured records across columns.

Use Table for:

- dense operational data
- sortable/filterable rows
- row-level actions
- bulk selection
- exact values and comparisons

Do not use Table when:

- users browse visual/summary objects
- each item has rich media/description
- mobile-first layout cannot preserve columns
- card list better supports recognition and scanning

---

## 2. Base Requirements

Table must define:

- stable `rowKey`
- column config
- header labels
- cell renderers
- alignment
- width/minWidth when needed
- loading/empty/error state
- pagination or loading strategy

Rules:

- Header, font size, spacing, line style must be consistent.
- Do not duplicate field logic between desktop table and mobile card.
- Use structured column config to drive desktop and mobile representation.

---

## 3. Column And Cell Rules

Rules:

- Text columns align left.
- Numeric columns align right when comparison matters.
- Status uses StatusBadge/Tag.
- Links use link semantics.
- IDs/request ids may provide copy action.
- Long text truncates with accessible full value.
- Rich cells must remain scannable.
- Do not put large forms or complex layouts inside cells.

Column config should include:

- key
- title
- width/minWidth
- render
- sortable/filterable when relevant
- mobile priority

---

## 4. Row Detail

Rules:

- If detail route exists, identity field should be a link.
- Row click can open detail only when it does not conflict with selection/actions.
- Small detail may use dialog.
- Medium contextual detail may use drawer.
- Large/shareable/related-data detail uses route page.
- Clicking row actions must not trigger row detail navigation.

---

## 5. Action Column

Rules:

- Row actions belong in the last action column.
- Expose at most 3 common icon actions.
- More than 3 actions go into `MoreHorizontal` menu.
- Icon actions need tooltip/accessible label.
- Icons must be semantic and not conflict with existing meanings.
- Dangerous menu item icon and label use danger style.
- Action menu width should be consistent.

---

## 6. Selection And Batch

Rules:

- Selection requires stable row keys.
- Disabled row checkbox is greyed out and not selectable.
- Selection state must survive safe refresh when row keys remain.
- Batch toolbar appears only when selection exists.
- Batch toolbar shows selected count.
- Clarify current page vs all matched results when needed.
- Dangerous batch action requires ConfirmDialog.

---

## 7. Disabled And Pending

Rules:

- Disabled actions remain visible when reason matters.
- Permission-disabled actions need reason/tooltip.
- State-disabled actions explain required state.
- Row action pending blocks only affected row/action when safe.
- Toggle/switch pending must prevent repeated flipping.
- Loading button/state prevents rapid duplicate clicks.

---

## 8. Pagination And Data Flow

Rules:

- Traditional table pagination uses `pageNum`, `pageSize`, and `total`.
- Next-token pagination hides total and uses next/previous availability.
- Page/filter/sort changes reset selection unless explicitly safe.
- Query state should be URL-recoverable on page-level lists.
- Request responses must not overwrite newer query results.
- Refresh keeps current query and old rows when possible.
- Virtual scroll is allowed for 50+ rows or high-density data when row height is stable.

---

## 9. Complex Features

Use only when needed:

- Sorting for comparable columns.
- Header filters for column-specific filtering.
- Fixed header/columns for wide/long tables.
- Expanded rows for secondary detail, not primary detail page replacement.
- Editable cells only for low-risk small edits.
- Column visibility for dense configurable tables.

Do not add complex table features by default.

---

## 10. Mobile

Rules:

- Mobile should prefer `MobileDataCard` for complex tables.
- Reuse column config and mobile priority.
- Do not create separate mobile field logic.
- Mobile actions cannot depend on hover.
- Selection, disabled reasons, and batch actions remain accessible.

---

## 11. AI Checklist

- Table is justified over card list.
- Stable rowKey exists.
- Columns define render, width/minWidth, semantics, mobile priority.
- Action column has max 3 visible icon actions plus More menu.
- Selection and disabled selection are handled.
- Batch toolbar shows count and scope.
- Pagination mode matches backend contract.
- Request race protection exists.
- Row detail behavior does not conflict with actions/selection.
- Mobile representation reuses column config.
