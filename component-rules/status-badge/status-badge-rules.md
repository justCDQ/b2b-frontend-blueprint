# StatusBadge / Tag Component Rules

> Use these rules when building or reviewing status badges and tags in 2B products.
> StatusBadge communicates state. It must be readable, consistent, and theme-safe.

---

## 1. Purpose

StatusBadge / Tag appears in:

- table cells
- detail metadata
- cards
- filter summaries
- dialog content
- timeline/audit records

Use it for:

- status
- type
- category
- risk level
- processing state
- result state

Do not use it as decoration.

---

## 2. Color Semantics

Status colors must carry stable meaning.

Recommended semantic mapping:

| Semantic | Meaning | Typical color |
|---|---|---|
| success | completed, active, healthy | green |
| error | failed, blocked, destructive | red |
| warning | risky, needs attention | yellow/orange |
| info | neutral information, in progress | blue |
| muted | disabled, archived, unknown | gray |
| draft | draft, not published | gray/neutral |
| processing | running, pending, syncing | blue or accent |

Rules:

- Red means error/destructive.
- Yellow/orange means warning/attention.
- Green means success/healthy.
- Gray means disabled/archived/neutral.
- Do not use random colors per page.
- Do not let product primary color override semantic meaning.

Theme rules:

- Colors must work in light and dark mode.
- Background and text contrast must be readable in both themes.
- Use semantic tokens when possible.
- Avoid overly saturated backgrounds.
- Badge border/background/text should be designed as a set.

---

## 3. Icon Usage

In B2B systems, StatusBadge usually does not need icons.

Rules:

- Default: no icon.
- Use icon only when it adds real clarity.
- Do not add decorative icons.
- Error/warning does not automatically require icon.
- If icon is used, keep it small and aligned.

Good:

```text
Failed
Processing
Active
```

Usually unnecessary:

```text
✓ Active
⚠ Warning
```

---

## 4. Text Length

Badge text must be short.

Rules:

- Recommended length: 1-12 characters in Chinese, 1-16 characters in English.
- Long text should be truncated.
- Default badge does not wrap.
- Use tooltip for truncated text.
- Only allow wrapping when the layout explicitly needs multi-line tags.

Default behavior:

```text
white-space: nowrap
overflow: hidden
text-overflow: ellipsis
```

Examples:

Good:

```text
Active
Failed
处理中
已禁用
```

Bad:

```text
Failed because remote provider returned a timeout
```

Use tooltip or error detail dialog for long reason.

---

## 5. Tooltip

Use tooltip when:

- badge text is truncated
- status needs a short explanation
- disabled/archived reason is short
- timestamp or source context is useful

Rules:

- Tooltip is for short explanation only.
- Do not put long error stack or large JSON into tooltip.
- Tooltip should not be the only way to access critical error detail.
- On mobile, do not rely only on hover tooltip.

---

## 6. Clickable Badge

Most badges are read-only.

Badge can be clickable when:

- it opens error reason
- it opens warning details
- it filters by this tag/status
- it opens related detail

Rules:

- Clickable badge must look interactive.
- Use pointer cursor.
- Provide accessible label.
- Click behavior must be predictable.
- Do not make badge clickable just because it is colorful.

Error badge:

- Error status is often clickable.
- Click should open a dialog with the error reason/details.
- Dialog title should name the error context.
- Dialog body can show message, reason, code, source, timestamp, and raw detail if needed.

Example:

```text
Badge: Failed
Click -> Error Details dialog
```

Dialog content:

```text
Title: Error Details
Message: Provider request timed out.
Code: PROVIDER_TIMEOUT
Time: 2026-05-11 10:31
```

---

## 7. Tag Variants

Use variants by semantic role.

| Variant | Use when |
|---|---|
| status | lifecycle/result state |
| type | object type/category |
| filter | selected filter summary |
| removable | user can remove tag |
| clickable | opens details or applies filter |

Rules:

- StatusBadge should not be removable by default.
- Removable tags need clear close/remove control.
- Filter tags may be removable.
- Type tags should use neutral colors unless type carries semantic risk.

---

## 8. Layout

Rules:

- Default no wrap.
- Multiple tags should use small gap.
- In table cells, tags must not expand row height unexpectedly.
- In cards/detail pages, wrapping can be allowed only when designed.
- Avoid using too many colored tags together.

Table rule:

- If multiple tags appear in table cell, show important ones first.
- Consider `+N` overflow when too many tags.

---

## 9. AI Review Checklist

Before accepting StatusBadge/Tag code, verify:

- Color uses semantic meaning.
- Color works in light and dark mode.
- Primary brand color does not override error/success/warning semantics.
- Icon is omitted unless useful.
- Text is short and does not wrap by default.
- Long text has tooltip or detail entry.
- Clickable badge has clear interactive affordance.
- Error badge opens detail dialog when error reason is needed.
- Tooltip is not used for large error content.
- Table badges do not unexpectedly increase row height.
