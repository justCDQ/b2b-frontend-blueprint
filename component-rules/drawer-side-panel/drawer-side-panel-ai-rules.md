# Drawer / Side Panel AI Rules

> Compact execution rules for AI-generated 2B drawer/side panel behavior.
> Use `drawer-side-panel-rules.md` as the detailed reference.

---

## 1. When To Use

Use Drawer when:

- user needs current page/list context
- detail/edit is medium complexity
- workflow is temporary but larger than popover
- user may scan multiple list items
- closing returns to same context

Use Dialog for short focused tasks or small content.

Use Route Page for large, shareable, multi-section, or deep-review workflows.

Do not use Drawer for tiny confirmations or as hidden route page.

---

## 2. Width And Placement

Rules:

- Desktop drawer opens from right.
- First-level desktop drawer defaults to `70vw`.
- If nested drawer opens, parent becomes `100vw`, child uses `70vw`.
- Avoid more than 2 drawer levels.
- If content cannot fill 70vw reasonably, use Dialog.
- Mobile drawer becomes bottom sheet or full-screen sheet.

---

## 3. Structure

Drawer structure:

```text
Header: title + optional status/subtitle + close
Body: content
Footer: optional actions
```

Rules:

- Header is required.
- Body is the only scroll region.
- Header/footer stay sticky when body scrolls.
- Footer appears for submit/confirm actions.
- Drawer title names object or task.

---

## 4. Actions And State

Rules:

- Drawer-level actions belong in footer.
- Local section actions stay in section.
- Related row actions affect only related rows.
- Submit pending disables submit and prevents duplicate submit.
- Dirty close requires confirmation.
- Close during risky pending is disabled or confirmed.
- Dangerous confirmation uses ConfirmDialog.

---

## 5. Route, Loading, Permission

Rules:

- Drawer is local state by default.
- Use route-backed drawer only when refresh/share should restore it.
- Route-backed drawer closes to canonical parent route.
- Opening from list preserves query/page/scroll.
- Initial drawer load uses body skeleton/spinner.
- Content failure uses drawer-body StateView + Retry.
- Forbidden uses permission state, not empty.

---

## 6. Accessibility

Rules:

- Modal drawer traps focus.
- Focus moves to title/first actionable element on open.
- Focus returns to trigger on close when possible.
- Background content is inert.
- Escape closes only when dirty/pending state allows.

---

## 7. AI Checklist

- Drawer is justified over Dialog/Route Page.
- Desktop width uses 70vw.
- Nested width follows 100vw parent + 70vw child.
- Header/body/footer structure exists.
- Body is only scroll region.
- Dirty/pending close behavior exists.
- Route-backed behavior is intentional.
- Mobile uses sheet/full-screen sheet.
- Focus/inert behavior is handled.
