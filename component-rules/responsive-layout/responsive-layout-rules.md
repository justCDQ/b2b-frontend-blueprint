# Responsive Layout Rules

> Use these rules for responsive behavior between desktop web and mobile in 2B products.
> Responsive layout is not only visual scaling. It is an interaction strategy that preserves task efficiency as available space changes.

---

## 1. Core Principle

Responsive behavior should be driven by content, container size, and task priority, not only by device labels.

Rules:

- Prefer container-aware layout over page-wide hardcoded breakpoints.
- Avoid hardcoding fixed widths unless the component has a real minimum usable size.
- Use design tokens, spacing scale, grid constraints, and component density rules.
- Preserve the same task and data semantics across layouts.
- Change layout before removing important information.
- Hide or collapse secondary information only when the primary workflow remains complete.
- Do not create separate desktop/mobile logic branches unless the interaction truly changes.

Good strategy:

```text
Same data model -> same component contract -> different layout presentation
```

Avoid:

```text
Desktop component and mobile component each define their own fields, actions, and validation.
```

---

## 2. Responsive Tiers

Use responsive tiers as design guidance, not rigid pixel-only rules.

| Tier | Typical behavior |
|---|---|
| Wide desktop | Full layout, table/list density, side panels, persistent navigation. |
| Standard desktop | Default 2B console layout, full toolbar, table, dialogs/drawers. |
| Narrow desktop / tablet | Reduce columns, wrap toolbar, collapse secondary actions. |
| Mobile web | Single-column, touch-first controls, sheets/full-screen detail. |

Rules:

- A component should respond to its parent container when embedded in narrow regions.
- A drawer, modal, split page, or dashboard panel can trigger compact layout even on desktop.
- Use breakpoints as defaults only; allow components to define container-based thresholds.
- Test both viewport width and container width.

Recommended decision order:

```text
1. Can content reflow while preserving hierarchy?
2. Can secondary controls collapse into menu/sheet?
3. Can dense data switch to prioritized stacked representation?
4. Does the workflow need a different carrier: dialog -> drawer -> page -> sheet?
```

---

## 3. Layout Adaptation

Use flexible layout primitives:

- CSS grid with `minmax()` for cards and panels.
- Flex wrap for action groups and lightweight filters.
- Container queries when component width matters more than viewport width.
- `max-width`, `min-width`, `clamp()`, and design tokens instead of fixed pixel values.
- Stable aspect ratio for fixed-format content.

Rules:

- Define safe minimum width for cards, panels, table columns, and controls.
- When content cannot fit safely, reflow or collapse; do not shrink until text/action becomes unusable.
- Avoid viewport-scaled typography for component text.
- Keep line height, spacing, and touch target sizes stable.
- Do not use negative letter spacing to squeeze text.
- Do not let hover states, labels, badges, or loading text resize the layout.

Example:

```css
.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--card-min-width), 1fr));
  gap: var(--space-3);
}
```

---

## 4. Information Priority

Every responsive component should define information priority.

Priority levels:

| Priority | Behavior |
|---|---|
| P0 | Always visible. Required to identify the object or continue the task. |
| P1 | Visible when space allows. Important for common decisions. |
| P2 | Collapsible, moved to detail, or hidden behind expansion. |
| P3 | Only in detail view, drawer, tooltip/popover, or metadata section. |

Rules:

- P0 content must not disappear on narrow layouts.
- P1 content can move below the title or into a second row.
- P2 content can collapse into `More`, expandable area, or detail drawer.
- P3 content should not compete with primary workflow.
- Collapsed information must still be reachable when it affects decisions.

For tables:

- Reuse column config to define mobile priority.
- Desktop table can become `MobileDataCard` on mobile.
- Do not maintain separate field definitions for desktop table and mobile cards.

For forms:

- Multi-column form becomes one column.
- Field order follows task flow, not desktop visual position.
- Inline helper/error text remains close to the field.

---

## 5. Action Adaptation

Actions must stay reachable and predictable.

Rules:

- Primary action remains visible whenever the user can complete the task.
- Refresh, Save, Submit, Cancel, Apply, and Clear filters should not disappear without an equivalent path.
- Secondary actions can collapse into overflow menu.
- Destructive actions should stay separated from common actions even when collapsed.
- Icon-only actions need tooltip on desktop and accessible label/tap reason on mobile.
- Hover-only actions must become visible, tappable, or available through a menu on touch devices.

Common patterns:

| Desktop | Narrow / mobile |
|---|---|
| Full toolbar actions | Primary visible + secondary overflow |
| Row icon actions | One or two visible + More menu |
| Filter action row | Apply/Clear/Refresh sticky or reachable |
| Page header actions | Primary visible + menu |
| Batch toolbar | Sticky bottom/action bar when selection exists |

---

## 6. Component Transform Rules

Use consistent transformations across components.

| Desktop pattern | Narrow / mobile transformation |
|---|---|
| Table with many columns | MobileDataCard or prioritized stacked row |
| Card grid | Fewer columns, safe min width, then single column |
| FilterBar | Important filters visible, advanced filters in drawer/sheet |
| Dialog | Small dialog stays dialog; complex dialog becomes bottom sheet or full-screen sheet |
| Drawer | Right drawer becomes bottom sheet or full-screen sheet |
| Sidebar navigation | Collapsed rail, top tabs, or mobile sheet navigation |
| Dropdown/Menu | Bottom sheet or full-width menu when dense |
| Popover | Inline, drawer/sheet, or dialog when content is long/interactive |
| Tabs | Scrollable tabs/pills, or route navigation when page-level |

Rules:

- Transform the carrier when the content no longer fits the original carrier.
- Do not force desktop table, drawer, or dialog behavior into mobile if it becomes cramped.
- Transformation must preserve data, state, pending, disabled, and permission rules.
- The same event handlers and validation rules should be reused when possible.

---

## 7. Density And Spacing

2B responsive design should preserve usable density.

Rules:

- Narrow layout does not mean oversized marketing-style spacing.
- Reduce columns before drastically increasing vertical whitespace.
- Keep repeated list/card/table items compact.
- Use spacing tokens rather than one-off margins.
- Increase tap targets without making every item visually bloated.
- Sticky headers/footers are allowed when they protect primary actions or context.

Density changes:

| Context | Desktop | Narrow / mobile |
|---|---|---|
| Table/list | Dense rows | Stacked but compact fields |
| Form | 1-2 columns | Single column, moderate spacing |
| Toolbar | Inline groups | Wrap/collapse groups |
| Card list | Grid | Fewer columns, compact single column |

---

## 8. Overflow And Scrolling

Rules:

- Avoid horizontal page scroll.
- Horizontal scroll is acceptable only inside specific data regions when preserving columns is more important than reflow.
- Sticky footer/header should not create double-scroll confusion.
- Long overlays need bounded height and internal scroll.
- Hide decorative scrollbars only when scroll affordance remains understandable.
- Do not let body scroll and overlay scroll fight each other.

Preferred order:

```text
Reflow -> collapse secondary content -> internal scroll in bounded region -> dedicated full page
```

---

## 9. State And Data Consistency

Responsive transformation must not change business behavior.

Rules:

- Selection state remains consistent between table and card representation.
- Batch actions remain available after layout changes.
- Filter state, pagination, sorting, and search stay intact.
- Pending/loading/error/empty states use layout-appropriate skeletons.
- Disabled reasons and permission explanations remain accessible.
- Route/query state should not reset when layout changes.
- Do not refetch data just because the layout changes unless page size strategy changes intentionally.

When page size changes:

- Infinite card layouts may use different page size than table layouts.
- Changing page size should reset or reconcile pagination intentionally.
- Do not let responsive changes create duplicate or missing records.

---

## 10. Implementation Rules

Prefer:

- Container queries for reusable components.
- CSS grid/flex with tokens.
- Shared field/action config across desktop and mobile representations.
- Semantic component states instead of viewport-specific duplicated state.
- Token-based max/min sizes.

Avoid:

- Many one-off pixel breakpoints inside component logic.
- Separate mobile-only field lists that drift from desktop.
- Hidden controls with no mobile alternative.
- Hardcoded viewport math that breaks inside drawers/dialogs.
- Layout decisions based only on user agent.

Example component contract:

```ts
type ResponsiveField = {
  key: string
  label: string
  priority: 0 | 1 | 2 | 3
  minWidth?: number
  render: (item: unknown) => React.ReactNode
}

type ResponsiveAction = {
  key: string
  label: string
  priority: 'primary' | 'secondary' | 'overflow'
  danger?: boolean
  disabledReason?: string
}
```

---

## 11. AI Review Checklist

- Layout changes are driven by content/container/task priority, not only viewport width.
- Important information and actions remain reachable.
- The responsive strategy avoids duplicated business logic.
- Components use flexible constraints instead of hardcoded fixed widths.
- Tables define mobile field priority.
- Toolbars and actions have clear collapse behavior.
- Dialog/drawer/popover transformations follow existing component rules.
- Loading/empty/error/disabled states still work after layout change.
- No horizontal page scroll unless intentionally scoped to a data region.
- Mobile/touch behavior does not rely on hover.
- Responsive changes do not reset filters, selection, pagination, or dirty form data.
