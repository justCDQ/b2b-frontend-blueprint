# Toast / Feedback Component Rules

> Use these rules when building or reviewing feedback messages in 2B products.
> Feedback must inform users without creating noise.

---

## 1. Purpose

Toast is for short feedback after user action or important asynchronous result.

Toast is not for:

- normal successful data loading
- replacing field errors
- showing long content
- explaining complex business state
- noisy polling updates

---

## 2. When To Show Toast

Show toast for user-triggered results:

- create success/failure
- edit success/failure
- delete success/failure
- enable/disable success/failure
- copy success/failure
- import/export task created
- batch action summary
- permission denied after user action
- operation blocked by business rule

Show toast for important async events:

- background task completed
- payment/callback result
- long import/export finished
- user-visible sync failed when user can act

Examples:

```text
Token created.
User disabled.
Copied to clipboard.
Deleted 12 items.
Export task created.
```

---

## 3. When Not To Show Toast

Do not show toast for expected background behavior:

- initial data load success
- normal refresh success
- polling success
- silent refresh failure
- canceled request
- stale/expired request response
- user navigation success
- login success if redirect already happens
- field-level validation error
- every item in a batch operation

Use alternatives:

| Situation | Use |
|---|---|
| field error | inline field error |
| form-level validation | form-level error |
| empty data | EmptyState |
| initial load error | ErrorState with retry |
| long explanation | Dialog / Panel |
| system-wide warning | Banner |

Forbidden:

```text
Data loaded successfully.
Refresh succeeded.
Polling failed every 10 seconds.
One toast per deleted row in batch delete.
```

---

## 4. Toast Types

| Type | Use when |
|---|---|
| success | user action completed |
| error | user action failed |
| warning | action blocked, partial success, risky state |
| info | neutral async update or task created |
| loading | short ongoing action, only if useful |

Rules:

- Success toast should be short.
- Error toast should explain what failed.
- Warning toast should explain what user can do next.
- Info toast should not be used for routine noise.
- Loading toast should resolve to success/error or disappear.

---

## 5. Frequency And Deduplication

Toast should not stack noisily.

Rules:

- Same error message should be deduped for a short window, e.g. 2 seconds.
- Batch operation produces one summary toast.
- Repeated polling errors should not toast.
- Rapid repeated clicks should not create repeated toasts.
- If an action is already pending, disable the trigger instead of allowing repeated toast.

Batch examples:

Good:

```text
Deleted 12 items.
Delete completed: 9 succeeded, 3 failed.
```

Bad:

```text
Deleted item A.
Deleted item B.
Deleted item C.
```

---

## 6. Position

Default desktop position:

- bottom-right

Use bottom-right for:

- CRUD success/failure
- copy result
- batch summary
- import/export task created
- non-blocking operation result

Use page center for:

- initial page loading
- blocking page error
- empty state
- permission empty state
- full-page unavailable state

Use inline/page area instead of toast for:

- form field error
- table initial load error
- filter empty result
- section-level error

Use bottom-left only when:

- product layout has persistent right-side panels that would overlap toast
- right side is reserved for detail drawers or chat panels
- the product standard explicitly chooses bottom-left

Rule:

- Pick one default app-wide toast position.
- Do not change toast position per page without layout reason.

---

## 7. Duration

Recommended duration:

| Type | Duration |
|---|---|
| success | 1500-2500ms |
| info | 3000ms |
| warning | 5000-8000ms |
| error | 5000-8000ms |
| loading | until resolved or max timeout |

Rules:

- Destructive failure should stay longer than success.
- Toast with action should stay long enough to interact.
- Long text should not be forced into toast; use dialog/panel.
- User should be able to close toast manually.

---

## 8. Mobile Behavior

Mobile toast must not block primary actions.

Rules:

- Prefer bottom position if it does not cover critical bottom navigation/actions.
- If bottom actions exist, use top or safe-area-aware bottom offset.
- Toast width should fit mobile viewport.
- Text should wrap at most 2 lines.
- Avoid multiple stacked toasts on mobile.
- Batch/long feedback should use dialog or result page if content is large.
- Mobile hover-dependent explanation is invalid; use tap/detail when needed.

Mobile duration:

- Success can be shorter.
- Error/warning should remain long enough to read.

---

## 9. Toast Content

Rules:

- Keep message short.
- Use action-specific text.
- Avoid vague text like “Operation successful”.
- Include count for batch operations.
- Include object name only when it helps.
- Do not include secrets, tokens, or sensitive data.
- Do not show raw stack trace.

Good:

```text
Token created.
Copied API key.
Disabled user "alice@example.com".
Import completed: 120 succeeded, 3 failed.
```

Bad:

```text
Success.
Error.
Something went wrong.
eyJhbGciOi...
```

---

## 10. Toast With Action

Use action only when it is truly useful.

Examples:

- View task
- Retry
- Download error report
- Undo for safe reversible action

Rules:

- Action text must be short.
- Action must be safe and predictable.
- Do not put complex decisions inside toast.
- Dangerous confirmation should not happen inside toast.

---

## 11. AI Review Checklist

Before accepting feedback/toast code, verify:

- Toast is only used for appropriate user/action feedback.
- Normal load/refresh/polling success does not toast.
- Canceled or stale requests do not toast.
- Field errors use inline errors, not toast.
- Batch action uses one summary toast.
- Duplicate errors are deduped.
- Position follows app default unless layout requires otherwise.
- Page-center feedback is used for blocking loading/error/empty states.
- Duration matches severity.
- Mobile toast does not cover critical actions.
- Toast content is short and action-specific.
- No sensitive data appears in toast.
