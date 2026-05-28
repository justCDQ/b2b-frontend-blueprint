# Drawer / Side Panel Rules

> Use these rules for side panels in 2B products.
> Drawers are for contextual work without fully leaving the current page.

---

## 1. Component Boundary

Use Drawer / Side Panel when:

- user needs current page/list context
- detail/edit is medium complexity
- workflow is temporary but larger than popover
- user may scan multiple items from a list
- closing should return user to the same page context
- content benefits from vertical reading or form layout

Use Dialog when:

- task is short and focused
- content does not need wide horizontal space
- content would feel sparse in 70vw
- task is confirmation-only
- task fits `xs/s/m/l/full` dialog size rules

Use Route Page when:

- workflow is large, shareable, or multi-section
- user needs deep review
- related tables/logs/activity are required
- user may bookmark/refresh/share
- drawer would become the main working surface

Rules:

- Drawer is not a hidden route page.
- Drawer is not for tiny confirmation-only flows.
- Confirm/delete from anywhere uses ConfirmDialog.

---

## 2. Placement And Width

Desktop:

- Opens from right by default.
- Default first-level width is `70vw`.
- Main page context remains visible but inactive when modal drawer is open.

Nested drawer:

| Scenario | Width |
|---|---|
| first-level drawer | 70vw |
| nested parent drawer | 100vw / full current workspace |
| nested child drawer | 70vw |

Rules:

- If opening a next-level drawer, current drawer becomes full workspace and child drawer uses `70vw`.
- Avoid more than 2 drawer levels.
- If nested content is small, use Dialog instead.
- Drawer width must respect viewport constraints and safe margins.
- If content cannot reasonably fill 70vw, use Dialog.

Mobile:

- Drawer becomes bottom sheet or full-screen sheet.
- Complex drawer content usually becomes full-screen sheet.
- Avoid narrow side drawer on mobile.

---

## 3. Structure

Recommended structure:

```text
Header: title + optional subtitle/status + close
Body: detail/form/list/workflow content
Footer: optional actions
```

Rules:

- Header is required.
- Close button is in header right.
- Footer appears when submit/confirm actions exist.
- Body is the only scrolling region.
- Header/footer stay sticky when body scrolls.
- Footer actions follow Dialog action ordering.
- Drawer title names the object or task.

---

## 4. Content Types

Good drawer content:

- row detail preview
- medium edit form
- related object picker
- log preview
- configuration side task
- contextual compare/review

Avoid drawer content:

- huge multi-step workflow
- full dashboard
- page-level navigation tree
- dense audit investigation
- tiny rename form
- delete confirmation only

Rules:

- If content has tabs, related tables, and many resource actions, prefer Detail Page.
- If content has one short form, prefer Dialog.
- If user needs to compare list while reading detail, Drawer is appropriate.

---

## 5. Actions

Rules:

- Drawer-level actions belong in footer.
- Local section actions stay inside section.
- Row actions inside a drawer affect only those rows.
- Dangerous drawer action usually goes to overflow or ConfirmDialog.
- Submit pending disables submit and prevents duplicate submit.
- Close during pending should be disabled or confirmed when leaving could corrupt state.
- Dirty close requires confirmation.

---

## 6. Navigation And Route State

Rules:

- Drawer is usually local state.
- Use route-backed drawer only when refresh/share should restore it.
- Route-backed drawer must close to canonical parent route.
- Opening drawer from list should preserve list query/page/scroll.
- Closing drawer returns to same list/detail context.
- Browser Back behavior must be intentional when drawer is route-backed.

---

## 7. Loading, Error, Empty, Permission

Rules:

- Initial drawer load uses drawer body skeleton/spinner.
- Header remains visible during body loading when possible.
- Section empty states are compact.
- Drawer content load failure uses drawer-body StateView with Retry.
- Refresh failure preserves old drawer content when possible.
- Forbidden content shows permission state, not empty.
- Deleted/not-found resource shows clear unavailable state and close/back action.

---

## 8. Responsive Behavior

Rules:

- Desktop drawer uses right-side panel.
- Narrow desktop can reduce width only if content remains usable.
- Mobile uses bottom sheet or full-screen sheet.
- Footer actions remain reachable.
- Long forms should not become cramped; move to full-screen sheet or route page.
- Touch layout cannot rely on hover-only actions/tooltips.

---

## 9. Accessibility

Rules:

- Modal drawer traps focus when open.
- Focus moves to drawer title or first actionable element on open.
- Focus returns to trigger on close when possible.
- Escape closes only when safe with dirty/pending state.
- Drawer has accessible name from title.
- Background content is inert for modal drawer.

---

## 10. Examples

Good:

```text
User table -> user detail drawer: 70vw
User detail drawer -> edit permissions drawer: parent 100vw, child 70vw
Job row -> view logs drawer
Project list -> configure integration drawer
```

Use Dialog instead:

```text
Rename project
Confirm delete
Edit one short label
```

Use Route Page instead:

```text
Project detail with Overview / Members / Audit Logs / Billing
Multi-section permission editor
Large import wizard
```

---

## 11. AI Review Checklist

- Drawer is justified over Dialog and Route Page.
- Content can reasonably fill drawer width.
- Default desktop width uses 70vw.
- Nested drawer uses parent 100vw and child 70vw.
- Header/body/footer structure is clear.
- Body is the only scroll region.
- Drawer actions are scoped correctly.
- Dirty/pending close behavior exists.
- Route-backed behavior is intentional.
- Mobile behavior uses sheet/full-screen sheet.
- Accessibility focus and inert background are handled.
