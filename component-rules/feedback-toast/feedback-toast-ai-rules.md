# Feedback / Toast AI Rules

> Compact execution rules for AI-generated 2B toast and feedback behavior.
> Use `feedback-toast-rules.md` as the detailed reference.

---

## 1. Toast Boundary

Toast is temporary feedback. It is not content replacement.

Use toast for:

- success feedback
- non-blocking action failure
- refresh failure while old data remains usable
- background task started/failed
- copy/export/import started
- offline/reconnected when content remains usable

Do not use toast as the only feedback for:

- first load failure
- page/list/dialog has no usable content
- form/field validation errors
- missing required setup
- page-level forbidden/not-found
- destructive confirmation

---

## 2. Severity

Use severity by user impact:

- success: completed action
- info: neutral background update
- warning: action completed with caveat or needs attention
- error: non-blocking failure

Rules:

- Blocking errors use StateView/inline error, not toast only.
- Validation errors stay near fields.
- Permission/setup problems use page/section state or disabled reason.
- Repeated identical toasts should be deduplicated.

---

## 3. Placement

Rules:

- Desktop toast usually appears bottom-right or top-right.
- Long-running/background status can use bottom-left/status area when system convention supports it.
- Center toast is only for rare high-attention transient messages; do not use for routine success.
- Mobile toast appears near bottom but must not cover primary actions.
- Avoid stacking many mobile toasts.

---

## 4. Duration

Rules:

- Success/info: short duration.
- Warning/error: longer duration.
- Toast with action: long enough to read and act.
- Critical non-blocking issue may stay until dismissed.
- Do not auto-dismiss before user can understand the message.

---

## 5. Actions

Rules:

- Toast has at most one lightweight action.
- Toast action must be safe and directly related.
- Retry only for safe/idempotent operations.
- Destructive actions never execute directly from toast.
- Use specific action labels.

---

## 6. Copy

Rules:

- Keep message short and specific.
- State what happened or what failed.
- Include object name when useful.
- Do not expose raw technical error unless user can act on it.
- For background tasks, mention that task continues or where to view status.

---

## 7. AI Checklist

- Toast is not replacing required inline/StateView feedback.
- Severity matches impact.
- Placement does not block primary actions.
- Duration matches severity/action.
- Duplicate toasts are deduped.
- Toast action is safe, single, and related.
- Mobile behavior does not cover key controls.
