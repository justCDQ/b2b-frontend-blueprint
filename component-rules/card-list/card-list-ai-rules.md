# Card List AI Rules

> Compact execution rules for AI-generated 2B card list behavior.
> Use `card-list-rules.md` as the detailed reference.

---

## 1. When To Use Card List

Use Card List when users browse, recognize, compare summaries, or select objects visually.

Use Card List for:

- object summary
- visual identity/logo/thumbnail
- compact metadata
- status and key metrics
- responsive grid
- infinite scroll

Do not use Card List when:

- precise column comparison matters
- many fields must align across rows
- bulk operations dominate
- table is the primary desktop pattern and mobile only reflows rows

If desktop table becomes mobile cards, it is `MobileDataCard`, not Card List.

---

## 2. Card Content Priority

Card should define:

- identity/title
- status
- short summary
- key metadata
- key metrics if useful
- tags/badges
- optional image/logo/icon
- actions

Rules:

- Title/identity is required.
- Status should be easy to scan.
- Keep B2B cards compact.
- Do not use excessive marketing-style whitespace.
- Long text truncates with accessible full value.

---

## 3. Layout

Rules:

- Use responsive grid/flex.
- Define safe minimum card width.
- Width adapts to screen/container.
- Height should remain stable when possible.
- Do not shrink cards indefinitely.
- Use compact spacing between modules.
- Loading/pending state should be local and not oversized.

Recommended:

```css
grid-template-columns: repeat(auto-fit, minmax(var(--card-min-width), 1fr));
```

---

## 4. Actions And Click

Rules:

- Card click may open detail only when it does not conflict with selection/actions.
- Identity/title can link to detail.
- Expose only common actions.
- Extra actions go into More menu.
- Dangerous actions use danger style and ConfirmDialog.
- Action click must not trigger card click.
- Disabled actions need reason when not obvious.

---

## 5. Selection And Batch

Rules:

- Selection uses stable item keys.
- Checkbox/selection affordance must be visible enough.
- Selected state must be clear.
- Disabled items cannot be selected.
- Batch toolbar appears only when selection exists.
- Show selected count and scope.

---

## 6. States

Support:

- default
- hover/focus
- selected
- disabled
- pending
- error
- empty/list loading

Rules:

- Pending should be scoped to affected card/action.
- Error card can show local retry/detail when useful.
- Skeleton matches card layout.
- Empty state belongs to list area.

---

## 7. Responsive

Rules:

- Web uses responsive grid.
- Narrow layout reduces columns then becomes single column.
- Tags/actions may collapse more aggressively.
- Touch layout cannot rely on hover.
- Card remains compact on mobile.

---

## 8. AI Checklist

- Card List is justified over Table.
- Card has identity, status, key metadata, and actions.
- Responsive grid has safe min width.
- Layout stays compact and stable.
- Click/action/selection do not conflict.
- Disabled/pending/error states are handled.
- Batch actions show count and scope.
- Mobile layout remains usable and not oversized.
