# Responsive Layout AI Rules

> Compact execution rules for AI-generated 2B responsive layouts.
> Use `responsive-layout-rules.md` as the detailed reference.

---

## 1. Core Rule

Responsive behavior is driven by content, container size, and task priority, not device labels only.

Rules:

- Prefer container-aware layout over hardcoded viewport-only breakpoints.
- Use tokens, grid/flex constraints, min/max sizes, and safe minimum widths.
- Preserve the same data/action semantics across layouts.
- Reflow before hiding important content.
- Collapse secondary content only when primary workflow remains complete.
- Do not duplicate business logic for desktop and mobile layouts.

---

## 2. Information Priority

Every responsive component should define:

| Priority | Behavior |
|---|---|
| P0 | Always visible; identifies object or enables task. |
| P1 | Visible when space allows; important for decisions. |
| P2 | Collapsible into More/expansion/detail. |
| P3 | Detail-only or metadata-only. |

Rules:

- P0 must never disappear on narrow layouts.
- P1 can move to a second row.
- P2 can collapse.
- P3 should not compete with primary workflow.

---

## 3. Layout Rules

Prefer:

- CSS grid with `minmax()`.
- Flex wrap for toolbars/action groups.
- Container queries for reusable components.
- `max-width`, `min-width`, `clamp()`, and tokens.
- Stable aspect ratio for fixed-format elements.

Do not:

- Shrink controls until text/action becomes unusable.
- Scale component text with viewport width.
- Use negative letter spacing to fit text.
- Let badges/loading/hover labels resize layout.
- Create horizontal page scroll.

---

## 4. Component Transform Rules

Use consistent transformations:

| Desktop | Narrow/mobile |
|---|---|
| Table with many columns | MobileDataCard / prioritized stacked row |
| Card grid | fewer columns -> single column |
| FilterBar | core filters visible + advanced in sheet/drawer |
| Dialog | small dialog or bottom/full-screen sheet |
| Drawer | bottom/full-screen sheet |
| Sidebar navigation | rail/menu/sheet/horizontal pills |
| Dropdown/Menu | bottom sheet or full-width menu when dense |
| Popover | inline/drawer/sheet/dialog for long interactive content |
| Tabs | scrollable pills or route nav |

Rules:

- Change carrier when content no longer fits.
- Preserve data, state, pending, disabled, permission, and validation rules.
- Reuse field/action config between desktop and mobile.

---

## 5. Actions And State

Rules:

- Primary action remains reachable.
- Refresh/Save/Submit/Cancel/Apply/Clear filters must not disappear without equivalent access.
- Secondary actions can collapse into overflow.
- Dangerous actions remain visually separated.
- Hover-only actions must become visible/tappable/menu-based on touch devices.
- Filter, selection, pagination, sorting, dirty data, and route/query state must not reset due to layout change.

---

## 6. AI Checklist

- Layout responds to content/container/task priority.
- Important data and actions remain reachable.
- No duplicated desktop/mobile business logic.
- Flexible constraints replace hardcoded fixed widths.
- Table/card mobile representation shares config.
- Actions have collapse behavior.
- Overlay transformations follow dialog/drawer/popover rules.
- No unintended horizontal page scroll.
- Touch behavior does not rely on hover.
- Layout change does not reset business state.
