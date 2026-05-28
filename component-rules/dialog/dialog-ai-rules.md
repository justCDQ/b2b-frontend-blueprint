# Dialog AI Rules

> Compact execution rules for AI-generated 2B dialog behavior.
> Use `dialog-rules.md` as the detailed reference.

---

## 1. When To Use

Use Dialog for focused temporary tasks that do not need a shareable route.

Use Dialog for:

- short create/edit form
- quick detail
- confirmation
- small focused workflow

Do not use Dialog for:

- deep navigation
- large multi-section workspace
- shareable/reloadable detail
- related tables/logs/activity
- long complex work that should be a route page

---

## 2. Platform Behavior

Desktop:

- Use centered dialog for small/medium focused work.
- Sizes: `xs`, `s`, `m`, `l`, `full`.
- Max width/height must not exceed 80% of viewport for standard/full dialogs.

Mobile:

- Use tiny dialog only for very small alerts/confirmations.
- Use bottom sheet or full-screen sheet for forms/complex content.
- Do not force desktop centered large dialog onto mobile.

---

## 3. Required Structure

Every dialog must have:

```text
Header: title + close button
Body: content
Footer: actions, optional
```

Rules:

- Header is always required.
- Close button is in header right.
- Footer is optional.
- Footer actions are right-aligned on desktop.
- More important action is farther right.
- Dialog title must describe the task or object.

---

## 4. Scrolling

Rules:

- Header remains visible.
- Footer remains visible when present.
- Body scrolls when content is long.
- Avoid visible scrollbars when possible without hiding scroll affordance.
- Do not let page body and dialog body scroll fight.
- Long content should not push actions offscreen.

---

## 5. Size Choice

Use sizes by content:

| Size | Use for |
|---|---|
| xs | ConfirmDialog, tiny alert, short prompt |
| s | 1-2 fields or short focused content |
| m | 3-6 fields or standard edit |
| l | complex form/detail with sections |
| full | temporary large workspace, not shareable route |

Rules:

- If content exceeds `l`, choose `full` or route page.
- If content needs sharing/bookmarking/deep operations, use route page.
- If content cannot reasonably fill a large dialog, use smaller size.

---

## 6. ConfirmDialog

Use ConfirmDialog for destructive or high-risk confirmation from any trigger source.

Rules:

- ConfirmDialog is usually `xs` or `s`.
- Content is title, description, optional short details, actions.
- Do not put forms, tables, tabs, or long workflows inside ConfirmDialog.
- Confirmation copy must name target, action, and consequence.
- Dangerous primary action uses danger style.
- Cancel remains available.

Do not write:

```text
Are you sure?
Confirm delete?
```

Write:

```text
Delete workspace "Acme"?
This removes all workspace settings and cannot be undone.
```

---

## 7. Form Dialog

Rules:

- Use dialog form for short create/edit.
- Required validation runs before save.
- Save pending disables submit and prevents duplicate submit.
- Save failure preserves input.
- Dirty close requires confirmation.
- Server field errors map to fields when possible.
- Large/multi-section forms should become drawer or route page.

---

## 8. Dialog Actions

Rules:

- Footer usually has Cancel + primary action.
- Use specific primary label: `Save`, `Create`, `Import`, `Delete`.
- Do not use vague `OK` for data mutation.
- Destructive action uses danger style and ConfirmDialog when high-risk.
- Secondary actions stay left of primary.

---

## 9. AI Checklist

- Dialog is justified over drawer/route page.
- Header exists with title and close button.
- Size matches content complexity.
- Body scrolls while header/footer stay stable.
- Mobile uses tiny dialog or sheet behavior.
- Footer action order is correct.
- ConfirmDialog is used for destructive/high-risk confirmation.
- Confirm copy names target/action/consequence.
- Form save handles validation, pending, dirty close, and failure.
