# Tooltip / HelpText AI Rules

> Compact execution rules for AI-generated 2B tooltip and helper text behavior.
> Use `tooltip-helptext-rules.md` as the detailed reference.

---

## 1. Component Boundary

Use Tooltip for:

- icon-only action label
- hover/focus explanation
- disabled reason
- truncated read-only full value
- short-to-medium read-only technical explanation

Use HelpText for persistent field/section guidance.

Use Popover/Drawer/Dialog/docs for long, structured, interactive, or workflow-like explanations.

Rules:

- Tooltip cannot contain interactive controls.
- Critical mobile information cannot be tooltip-only.
- Do not enforce hard character count; constrain readability with width/height/placement.

---

## 2. Tooltip Rules

Rules:

- Icon-only actions require tooltip or accessible label.
- Tooltip appears on hover and keyboard focus.
- Text is specific and readable.
- Placement avoids covering target/primary action.
- Long tooltip content is bounded.
- Tooltip is not the only feedback for blocking errors.
- Tooltip closes predictably.

---

## 3. HelpText And Disabled Reasons

Rules:

- HelpText stays near related field/section.
- HelpText does not replace label.
- Error text overrides or appears near HelpText without conflict.
- Disabled reason explains permission, status, dependency, quota, pending, or missing setup when safe.
- Avoid internal policy codes.
- Mobile disabled reason must be tap-accessible or inline.

---

## 4. Accessibility

Rules:

- Tooltip trigger is keyboard focusable when needed.
- Tooltip content is connected as accessible description when possible.
- HelpText is semantically connected to field when possible.
- Tooltip does not trap focus.
- Focusable content requires Popover/Dialog, not Tooltip.

---

## 5. AI Checklist

- Icon-only actions have tooltip/label.
- Critical info is not tooltip-only.
- Tooltip has no interactive controls.
- HelpText is near related field/section.
- Disabled reason is accessible and specific.
- Long content is bounded/readable.
- Mobile has non-hover access.
