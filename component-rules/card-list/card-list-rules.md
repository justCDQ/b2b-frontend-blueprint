# Card List Rules

> Use these rules for card-based lists in 2B products.
> Card list is for browsing and identifying objects, not dense field comparison.

---

## 1. Card List vs Table vs MobileDataCard

Use card list when:

- visual identity, summary, or status is more important than row comparison
- item content varies
- users browse integrations, templates, resources, dashboards, projects
- infinite scroll or responsive grid is preferred
- item recognition matters more than precise column comparison
- each item benefits from icon, logo, thumbnail, description, tags, or summary metrics

Use table when:

- users compare fields across many rows
- sorting, selection, and batch operations are central
- data has stable columns
- users need dense scanning or precise values
- row-level operations are secondary to data comparison

Use MobileDataCard when:

- desktop experience is a table
- mobile cannot comfortably show all table columns
- card is a responsive representation of table rows
- data fields still follow table column semantics

Do not confuse:

| Pattern | Primary task | Data model | Layout |
|---|---|---|---|
| Table | compare structured fields | stable columns | rows/columns |
| MobileDataCard | mobile representation of table row | same as table columns | stacked fields |
| Card List | browse/identify/select objects | item summary and identity | responsive cards |

Rules:

- If desktop is table and mobile becomes cards, that is `MobileDataCard`, not Card List.
- If card content is just table fields stacked vertically, it is probably MobileDataCard.
- If cards need visual identity, rich summary, or product-like browsing, use Card List.
- If users need total count, page jump, and cross-row comparison, prefer Table.
- If users need infinite browsing of integrations/templates/resources, prefer Card List.
- Card List may still support filters, search, status, and actions.
- Card List should not pretend to be a table by packing many column-like fields into each card.
- Table should not be replaced by Card List only to make the page look lighter.

Examples:

```text
Integrations marketplace -> Card List
Prompt templates -> Card List
Projects with logo/status/summary -> Card List
Users with role/email/last login comparison -> Table
Audit logs -> Table
Mobile users table -> MobileDataCard
```

### Decision Questions

Choose Card List if most answers are yes:

- Does each item have a recognizable identity?
- Does the user browse before deciding?
- Does summary/description matter?
- Are icons/logos/thumbnails/tags useful?
- Is strict row-to-row comparison secondary?

Choose Table if most answers are yes:

- Does the user compare values across rows?
- Are there many stable fields?
- Are sorting and pagination central?
- Are batch operations frequent?
- Does density matter more than preview?

Choose MobileDataCard if:

- The desktop pattern is table.
- The same data must remain available on mobile.
- The mobile card is only a layout adaptation, not a new browsing pattern.

### Filtering And Pagination Boundary

Rules:

- Card List can use FilterBar, but filters should support browsing, not force table-like density.
- Card List commonly works with infinite scroll or load more.
- Traditional pagination is acceptable when business workflow requires pages or total count.
- If users need exact total and page jump, Table may be better.
- Card List page size should fill at least one viewport of cards when possible.

---

## 2. Card Structure

Recommended card:

```text
Header: title + status/action
Body: summary, metadata, tags
Footer: primary/secondary item actions
```

Rules:

- Title must be visible and recognizable.
- Status badge should be near title.
- Metadata should be compact and consistent.
- Do not put too many unrelated fields into one card.
- Card radius should follow product system and remain restrained for 2B.
- B2B cards should be compact and content-first.
- Avoid marketing-style large whitespace, oversized thumbnails, or decorative panels unless the card is truly visual-first.
- Spacing between modules inside a card should be tight but readable.
- Pending/loading indicators inside card should be compact and not dominate content.

### Content priority

Card content must be prioritized. Do not render every available field.

| Priority | Content | Rule |
|---|---|---|
| required | title / identity | always visible |
| strong | status, summary/description | visible when meaningful |
| useful | metadata, owner, time, count, usage | compact and consistent |
| optional | thumbnail/icon/logo | only when it helps recognition |
| optional | tags | limited, truncated, or collapsed |
| optional | actions | item-scoped and restrained |

Rules:

- Title/identity must be in the visual first line or first block.
- Status should appear near title when item state matters.
- Summary should explain the item, not repeat title.
- Metadata should include only fields that help browsing or decision.
- Avoid more than 3-5 metadata items unless card variant is designed for dense info.
- Tags should not dominate the card.
- Empty metadata value uses `-` or is omitted by product decision.
- Card content order should be consistent across items.

### Thumbnail / Icon / Logo

Rules:

- Use thumbnail/icon/logo only when it improves recognition.
- Image/icon area must have stable size.
- Image load failure must have fallback.
- Do not let image aspect ratio change card height unexpectedly.
- B2B thumbnails support recognition; they are not decorative hero images.
- If every item uses the same generic icon, consider removing it.

### Metadata and metrics

Rules:

- Metadata uses consistent label/value or icon/value pattern.
- Time values use consistent format.
- Numbers include unit.
- Money includes currency.
- Long values truncate with tooltip/copy when useful.
- IDs/tokens use monospace and copy affordance when useful.
- Metrics should be few and scannable.

Examples:

```text
Owner: Rebecca
Last sync: 2h ago
Usage: 42 requests
Cost: $128.00
```

### Tags and badges

Rules:

- Status uses StatusBadge rules.
- Tags use Tag rules and should not wrap endlessly.
- Show first few tags and collapse the rest as `+N` when space is limited.
- Error badge may open dialog/popover with reason when useful.
- Color semantics must work in light and dark mode.

---

## 3. Layout

Rules:

- Use responsive grid.
- Grid/flex layout should adapt card count to available width.
- Keep stable card width and aspect rhythm.
- Card width must have a safe minimum and should not shrink infinitely.
- Card height should remain stable across items when possible.
- Prefer fixed/min card height with internal truncation over cards jumping in height.
- Use `minmax(safeMinWidth, 1fr)` or equivalent responsive constraints for grid.
- Use flex wrapping only when card min width and gap are explicitly controlled.
- Do not squeeze cards below readable width just to fit more columns.
- Avoid layout shift from dynamic content.
- Long text truncates with tooltip/detail.
- Empty cards/skeletons should match final card shape.
- Infinite scroll uses bottom loading.

Recommended:

```text
Grid columns: repeat(auto-fit/minmax(safeCardWidth, 1fr))
Safe card width: product-defined, usually not below a readable content width
Card height: stable by variant, content truncates inside
Gap: compact, consistent, not decorative
```

### Compact density

Rules:

- 2B card lists prioritize information density over visual drama.
- Header/body/footer spacing should be compact.
- Metadata rows should use concise labels or icons only when clear.
- Tags should wrap only when the card design explicitly allows it; otherwise truncate or show count.
- Thumbnails/icons should support recognition, not consume most of the card.
- Loading skeleton should match compact card rhythm.
- Pending state should be local and small, such as action loading, status pending, or subtle overlay.
- Do not use large spinners centered in every card unless the whole card content is unavailable.

---

## 4. Actions

Rules:

- Card primary action is item-specific.
- Extra actions go into overflow menu.
- Dangerous actions require confirmation.
- Action placement must not conflict with card click.
- If whole card is clickable, action buttons must stop propagation.
- Avoid too many visible actions per card.

### Card click vs actions

Rules:

- Whole-card click is allowed only when the primary behavior is clear.
- If whole card opens detail, title should also be a link when practical.
- Card actions must not trigger card click.
- Checkbox selection must not trigger card click.
- Overflow menu trigger must not trigger card click.
- On mobile, avoid making the entire card clickable if actions/selection create high mis-tap risk.
- Clickable card needs visible hover/focus feedback.
- Non-clickable card must not look clickable.

### Action placement

Rules:

- Primary item action belongs in card footer or clear action area.
- Overflow belongs in header/right side or footer depending on card density.
- Dangerous actions usually go into overflow.
- Pending action is local to the card.
- Do not expose too many buttons in card footer.

---

## 5. Selection And Batch

Rules:

- Use checkbox selection only when batch actions exist.
- Selection affordance should be visible and not depend on hover.
- Batch toolbar shows selected count.
- Disabled cards cannot be selected and need reason when not obvious.

---

## 6. Card States

Cards must support common item states.

States:

- default
- hover
- focus
- selected
- disabled
- pending
- error
- locked / archived / unavailable
- loading skeleton

Rules:

- Hover/focus state should be visible when card is interactive.
- Selected state must be visually distinct and accessible.
- Disabled/unavailable card should remain readable.
- Disabled reason should be available when not obvious.
- Pending state should be local and compact.
- Error state should show status and recovery/details when useful.
- Archived/locked card should avoid suggesting unavailable actions.
- Loading skeleton matches final card size and density.

### Loading and skeleton

Rules:

- Initial loading uses skeleton cards that match card variant.
- Skeleton count should fill the visible viewport, not total item count.
- Refresh keeps old cards when possible.
- Infinite scroll uses bottom loading.
- Item-level pending does not replace the whole card skeleton.
- Skeleton height should match stable card height.
- Do not use one huge spinner for the entire grid when card skeleton is more informative.

---

## 7. Mobile

Rules:

- Mobile usually uses one-column cards.
- Touch targets must be usable.
- Overflow actions collapse into menu.
- Card click and actions must be clearly separated.
- Selection should not depend on hover.
- Tags/actions may collapse more aggressively on mobile.
- Metadata should keep the most important fields only.

---

## 8. AI Review Checklist

- Card list is the right pattern, not table.
- MobileDataCard is not confused with true Card List.
- Card List is chosen for browsing/identity/summary, not for dense comparison.
- Table is still used when stable fields and cross-row comparison are central.
- Card title/status/metadata hierarchy is clear.
- Grid is responsive and stable.
- Cards have safe minimum width and do not shrink infinitely.
- Card height is stable or intentionally constrained by variant.
- Card spacing/pending/loading is compact and content-first for 2B.
- Card content priority is clear and does not render every field.
- Thumbnail/icon/logo has stable size and useful purpose.
- Metadata/metrics/tags are compact and consistently formatted.
- Tags/badges follow StatusBadge/Tag semantics.
- Actions are item-scoped and do not conflict with card click.
- Whole-card click, title link, actions, selection, and overflow do not conflict.
- Card states are handled: selected, disabled, pending, error, unavailable, skeleton.
- Selection/batch behavior is explicit when present.
- Loading/empty states match card layout.
