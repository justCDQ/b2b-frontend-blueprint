# Tooltip / HelpText Rules

> Use these rules for explanations, hints, disabled reasons, helper content, and compact contextual guidance in 2B products.

---

## 1. Component Boundary

Choose by importance, persistence, and interactivity.

| Component | Use for |
|---|---|
| Tooltip | hover/focus explanation, icon label, disabled reason, short-to-medium read-only explanation |
| HelpText | persistent field/section guidance |
| Inline hint | small always-visible contextual note |
| Popover | longer, structured, or interactive explanation |
| Alert/Banner | important persistent notice |
| Docs link | long conceptual or procedural documentation |

Rules:

- Tooltip is not for critical mobile-only information.
- Tooltip cannot contain interactive controls.
- HelpText is preferred for form guidance that users must see.
- Disabled reason can use tooltip when accessible and bounded.
- Long 2B explanations do not need a hard character limit, but need readable width/height.
- If content becomes multi-section, scroll-heavy, or interactive, use Popover/Drawer/Dialog/docs.

---

## 2. Tooltip Rules

Use Tooltip for:

- icon-only action label
- short clarification
- disabled reason
- truncated text full value
- read-only technical explanation

Rules:

- Required for icon-only actions.
- Available on hover and keyboard focus.
- Text is specific and readable.
- Placement should avoid covering the target or primary action.
- Long tooltip content has bounded width and readable line length.
- Tooltip should not be the only way to understand blocking errors.
- Tooltip should not include buttons, links, checkboxes, or forms.
- Tooltip closes predictably on blur, escape, or pointer leave.

Examples:

```text
Edit
Delete
Only owners can delete this project.
Last synced from Salesforce at 14:30.
```

---

## 3. HelpText Rules

Use HelpText for:

- field format
- default behavior
- consequences
- limits
- permission/scope explanation
- complex settings guidance

Rules:

- Place HelpText near related field/section.
- Do not replace label with HelpText.
- Keep HelpText visible when it affects correct completion.
- Error text should override or appear near HelpText without conflict.
- Avoid vague product marketing copy.
- Use examples when format matters.

Good:

```text
Use comma-separated domains, for example: acme.com, example.org.
```

Avoid:

```text
Configure this for a better experience.
```

---

## 4. Disabled Reasons

Rules:

- Explain whether disabled state is caused by permission, status, dependency, quota, pending, or missing setup.
- Mention recovery action when possible.
- Avoid internal policy codes.
- Keep sensitive permission details hidden when needed.
- On mobile, provide tap-accessible reason or inline text.
- Disabled primary action should not be the only recovery path.

Examples:

```text
Only workspace owners can delete this project.
Enable billing before creating another environment.
Wait until import validation finishes.
```

---

## 5. Truncation And Long Content

Rules:

- Truncated table/card text can expose full value through tooltip when read-only.
- If full value is long structured data, use popover/drawer/detail view.
- Do not set arbitrary maximum character count for all tooltip content.
- Constrain readability through max width, line length, and placement.
- Long tooltip should not cover the information it explains.

---

## 6. Mobile And Touch

Rules:

- Hover-only tooltip is not enough on touch devices.
- Critical explanations need inline text, tap-to-open popover, sheet, or details view.
- Icon-only actions still need accessible labels.
- Disabled reasons should be reachable by tap or adjacent helper text.
- Avoid tiny tooltip triggers.

---

## 7. Accessibility

Rules:

- Tooltip trigger is keyboard focusable when needed.
- Tooltip content is announced or connected with accessible description.
- HelpText uses semantic relationship to field when possible.
- Tooltip should not trap focus.
- Popover/dialog is used when focusable content is required.
- Do not rely on color alone for help/error/disabled meaning.

---

## 8. AI Review Checklist

- Icon-only actions have tooltip/accessible label.
- Critical information is not tooltip-only.
- Tooltip has no interactive controls.
- HelpText is near related field/section.
- Disabled reason explains permission/state/dependency when safe.
- Long explanatory content is bounded and readable.
- Mobile has non-hover access to important explanations.
- Error text and HelpText do not conflict.
