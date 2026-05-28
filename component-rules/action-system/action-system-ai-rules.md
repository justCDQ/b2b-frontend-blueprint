# Action System AI Rules

> Compact execution rules for AI-generated 2B action/button behavior.
> Use `action-system-rules.md` as the detailed reference.

---

## 1. Core Rule

Every action must have exactly one clear intent:

- create
- update
- delete
- submit
- navigate
- refresh
- filter
- export/import
- enable/disable
- batch operation
- open detail/dialog/drawer/menu

If an action both mutates and navigates, treat it as mutation first. Navigate only after success.

---

## 2. Priority

Rules:

- Use at most one primary action per visible scope.
- Primary action must represent the main user goal in that scope.
- Secondary actions support the main task.
- Low-frequency actions go into overflow/menu.
- Dangerous actions must not be primary unless the entire surface is dedicated to that dangerous task.
- Navigation actions use link/navigation semantics, not mutation button semantics.

Priority order:

```text
primary goal -> frequent safe action -> secondary action -> overflow -> dangerous action
```

---

## 3. Scope

Place actions by what they affect:

| Scope | Placement |
|---|---|
| page/resource | page header |
| list/query | FilterBar or list toolbar |
| selected rows/items | batch toolbar |
| row/item | row action column or card action area |
| dialog | dialog footer |
| form | form footer/action area |
| field | field suffix/inline control |
| StateView | StateView action area |

Rules:

- Do not mix page actions with row actions.
- Do not put resource-specific actions in global shell.
- Row actions affect only that row.
- Batch actions require selected items.
- Dialog actions belong in the footer unless they are local inline actions.

---

## 4. Pending And Duplicate Prevention

Rules:

- Show pending immediately for submit/create/update/delete/import/export actions.
- Disable repeated trigger while pending.
- Pending scope must be the smallest safe scope: button, row, batch toolbar, form, dialog, field, navigation, or refresh.
- Form submit pending disables submit and prevents duplicate submit.
- Row mutation pending should block only the row action when safe.
- Batch pending blocks the batch action and affected selection.
- Refresh pending should keep old data visible when possible.
- Navigation pending should prevent repeated route push.
- Optimistic update must rollback or mark failure when request fails.

Do not:

- Disable unrelated safe navigation unless state would become inconsistent.
- Clear old usable data during refresh pending.
- Allow double-click duplicate mutation.

---

## 5. Disabled And Permission

Rules:

- Hide an action only when the user should not know it exists.
- Disable an action when the user can see it but cannot use it.
- Disabled actions need a reason when the reason is not obvious.
- Permission-disabled actions should explain required permission or role when safe.
- State-disabled actions should explain required state.
- Disabled icon actions still need tooltip/reason.
- Disabled menu items remain visible when they explain unavailable options.

Do not:

- Show a disabled primary action as the only recovery path.
- Use permission hidden state and disabled state inconsistently.
- Depend on tooltip-only explanations on mobile.

---

## 6. Dangerous Actions

Dangerous actions include destructive, irreversible, high-impact, or broad-scope operations.

Rules:

- Use ConfirmDialog for destructive/high-risk confirmation.
- Confirmation must name the target object/scope, action, and consequence.
- Do not use generic text like `Are you sure?` or `Confirm delete?`.
- Dangerous actions usually live in overflow, danger zone, or separated menu group.
- Danger styling applies to icon and label in menus.
- During dangerous pending, prevent repeated trigger.
- On failure, preserve context and explain whether anything changed.

Good confirmation:

```text
Delete project "Acme Sync"?
This will remove its configuration and cannot be undone.
```

---

## 7. Icon, Menu, And Batch Actions

Icon actions:

- Use semantic icons.
- Do not reuse the same icon for different meanings in the same scope.
- Provide tooltip/accessible label.
- Expose at most 3 row icon actions; move the rest to More menu.

Menu actions:

- Group related items.
- Put dangerous items last or in a separated group.
- Menu items include icon + label when consistent with the system.
- External navigation shows external-link affordance when possible.

Batch actions:

- Appear only after selection exists.
- Show selected count.
- Clarify whether action affects current page, selected items, or all matched results.
- Dangerous batch actions require ConfirmDialog.

---

## 8. Feedback

Rules:

- Success mutation usually gets toast or local success state.
- Blocking errors use inline/StateView where appropriate, not toast only.
- Single action failure can use toast when page content remains usable.
- Form submit errors map to fields when possible.
- Refresh failure preserves old data and shows subtle error/toast.

---

## 9. AI Checklist

- Action intent is clear.
- Only one primary action exists per scope.
- Action placement matches affected scope.
- Navigation uses link/router semantics.
- Pending prevents duplicate trigger.
- Disabled action has reason when needed.
- Permission behavior is consistent.
- Dangerous action uses ConfirmDialog with specific target/action/consequence.
- Row actions are limited and overflow is used.
- Batch action shows count and scope.
- Feedback matches severity and scope.
