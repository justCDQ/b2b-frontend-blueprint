# Status Badge / Tag AI Rules

> Compact execution rules for AI-generated 2B status badge and tag behavior.
> Use `status-badge-rules.md` as the detailed reference.

---

## 1. Purpose

Use StatusBadge/Tag to show compact categorical state or labels.

Use for:

- success/warning/error/info/neutral states
- lifecycle state
- permission/sync/import/deployment state
- compact tags/labels

Do not use for:

- long explanations
- primary actions
- complex filters when Select/Checkbox is needed
- replacing full error details

---

## 2. Color Semantics

Rules:

- Red/danger = error/destructive/failed.
- Yellow/orange = warning/attention/partial.
- Green = success/active/healthy.
- Blue = info/in progress.
- Gray/neutral = inactive/default/unknown.
- Colors must work in light and dark mode.
- Status must not rely on color only.
- Color choice should not conflict with theme primary color.

---

## 3. Text

Rules:

- Text should be short.
- Default is no wrap.
- Long text truncates and provides tooltip/popover.
- Avoid using full sentences inside badge.
- Use consistent vocabulary for same status.
- Do not show raw backend enum when user-facing wording is needed.

---

## 4. Icon

Rules:

- 2B status badges usually do not need icons.
- Use icon only when it improves recognition or severity.
- Icon must not replace text.
- Icon and text color should match semantic state.

---

## 5. Clickable Tags

Rules:

- Tag may be clickable only when it has a clear action.
- Clickable error/status can open dialog/drawer/popover with reason/details.
- Clickable tag must have hover/focus state.
- Non-clickable status must not look interactive.
- Error reason dialog should explain what happened and what to do next when available.

---

## 6. Placement And Responsive

Rules:

- Badges near title indicate resource status.
- Badges in table/card cells must stay compact.
- Multiple tags can wrap only when explicitly allowed.
- Mobile cannot rely only on hover tooltip; provide tap-accessible details.

---

## 7. AI Checklist

- StatusBadge/Tag is used for compact categorical state.
- Color semantics match status.
- Light/dark mode contrast is safe.
- Text is short, consistent, and not raw enum.
- Long text has tooltip/popover.
- Clickable tag has clear action and state.
- Error clickable tag opens reason/details when useful.
- Mobile has non-hover access to details.
