# Button / Action System Rules

> Use these rules when building or reviewing actions in 2B products.
> An action is any user-triggered operation: button, icon button, menu item, row action, batch action, dialog footer action, or StateView action.

---

## 1. Core Idea

Actions must express intent, priority, permission, risk, and pending state.

Every action should define:

- label
- intent
- priority
- scope
- permission rule
- disabled rule
- loading/pending behavior
- confirmation need
- success/failure feedback

Action is not only a visual button style.

Rules:

- Choose action semantics before choosing visual variant.
- Visual weight must match action priority.
- Placement must match action scope.
- Disabled/hidden state must match permission and data state.
- Pending behavior must match mutation risk and scope.
- Feedback must match action result and affected area.

### Action intent

Every action should have one primary intent.

| Intent | Meaning | Examples |
|---|---|---|
| create | create new data | Create project, Add user |
| edit | modify existing data | Edit, Rename, Update settings |
| submit | commit form/workflow | Save, Publish, Confirm |
| navigate | move to another view | View details, Go back |
| refresh | fetch latest state | Refresh, Retry |
| clear/reset | remove current local/query state | Clear filters, Reset form |
| import/export | move data in/out | Import users, Export CSV |
| connect/configure | complete prerequisite setup | Connect GitHub, Configure billing |
| toggle | switch binary state | Enable, Disable |
| destructive | remove/revoke/reset risky state | Delete, Revoke, Disconnect |
| support | expose help/detail | View docs, View task, Contact admin |

Rules:

- A label should reveal the intent.
- Do not use vague labels such as `OK`, `Submit`, `Handle`, or `Process` unless the surrounding context makes the action unambiguous.
- One action should not mix unrelated intents.
- If an action both submits and navigates, treat it as submit first and handle navigation after success.
- If an action both deletes and navigates, treat it as destructive first.

---

## 2. Action Types

| Type | Use when |
|---|---|
| primary action | main page/dialog/form/state recovery action |
| secondary action | useful but less important action |
| ghost/link action | low-emphasis or navigation-like action |
| icon action | compact repeated action, often table row/toolbars |
| danger action | destructive or risky operation |
| menu action | overflow action or lower-frequency command |
| batch action | operation applied to selected items |
| inline action | local edit/confirm inside row/field |
| split action | primary command with adjacent secondary command menu |
| toggle action | binary state switch |

Rules:

- Use one primary action per area.
- Do not show multiple equally strong primary buttons in the same action group.
- Danger actions must be visually distinct.
- Icon actions require tooltip.
- Menu actions should include icon + label when possible.
- Action type and visual style are related but not identical.
- A danger action can appear as menu item, icon action, or dialog primary action depending on context.
- A navigation action can be link-style even if it appears in an action group.
- A toggle action should use Switch when it represents an immediate on/off state.
- Do not use a button when a link is semantically navigation to another route.

### Primary action

Use for the single most important next step in an area.

Rules:

- There should be at most one primary action in one visual decision area.
- Page-level primary action usually appears in page header or main toolbar.
- Dialog primary action appears in footer.
- StateView primary action recovers or advances the state.
- Form primary action submits or saves the form.
- Do not make a destructive action primary unless the whole screen/dialog is a destructive confirmation.

Examples:

```text
User list page -> Create user
Edit dialog -> Save
Load failed StateView -> Retry
Delete confirmation dialog -> Delete can be primary danger
```

### Secondary action

Use for useful alternatives that are not the main next step.

Rules:

- Secondary action must not compete visually with primary.
- Common secondary actions: Cancel, Refresh, Export, View docs, Go back.
- If there are many secondary actions, move lower-frequency ones to menu.
- Do not turn every useful command into a visible secondary button.

### Ghost/link action

Use for low-emphasis actions or navigation-like actions.

Rules:

- Use link style for route navigation or help/docs when it is not the primary recovery.
- Use ghost style when the action stays in context but should be visually light.
- Do not use link style for destructive actions.
- Do not use ghost style for the main irreversible confirmation.

### Icon action

Use when space is limited and the action is repeated.

Rules:

- Common in table row actions, compact toolbars, and input adornments.
- Requires tooltip.
- Icon must be semantic and not duplicated for different meanings in the same context.
- Do not use icon-only action for rare or ambiguous commands.
- Expose at most 3 row icon actions before overflow.

### Menu action

Use for overflow, low-frequency commands, or grouped alternatives.

Rules:

- Menu action still needs clear intent and permission handling.
- Do not hide the only primary path inside a menu.
- Dangerous menu actions appear last and use danger color.
- Menu item label must be explicit.

### Batch action

Use for actions applied to selected items.

Rules:

- Batch actions depend on selection.
- Selection count must be visible.
- Batch primary action should reflect the selected context.
- Dangerous batch action requires confirmation with selected count.
- Do not include disabled/unselectable rows in batch operation.

### Inline action

Use for small local edits.

Rules:

- Inline action belongs near the edited field/row.
- It should not trigger parent row click.
- Pending and error are local.
- Inline edit should use explicit confirm/cancel when the change is not safely auto-saved.

### Toggle action

Use for immediate binary state.

Rules:

- Use Switch when the action directly changes enabled/disabled or on/off.
- Toggle pending must prevent repeated flipping.
- Failure rolls back or clearly marks failed state.
- Risky toggle requires confirmation.

### Split action

Use rarely, when one primary command has closely related variants.

Rules:

- The main side performs the default action.
- The menu side exposes variants.
- Do not use split action for unrelated commands.
- Do not use split action when it hides a required decision.

---

## 3. Priority

Action priority must match user workflow.

Rules:

- Primary action is the next best step.
- Secondary action supports recovery or alternative path.
- Low-frequency actions move to menu/overflow.
- Destructive actions should not be the default primary action unless the whole task is destructive confirmation.
- In dialog footer, the most important action is rightmost on desktop.
- In mobile stacked layout, primary action appears first or visually strongest.
- Priority is decided by task importance, frequency, and risk, not by personal preference.
- More visible does not mean more important if the action is risky, rare, or secondary.
- Do not promote an action only because there is empty space.
- Do not show actions that are not useful in the current state.

### Priority levels

| Priority | Meaning | Visual treatment |
|---|---|---|
| primary | the best next step | primary button |
| secondary | useful alternative or companion | secondary/outline button |
| tertiary | low-emphasis support action | ghost/link |
| overflow | available but low-frequency | menu item |
| hidden | not relevant or not permitted | not rendered |
| disabled | visible but temporarily unavailable | disabled with reason |

Rules:

- A page/dialog/StateView action group usually has one primary or no primary.
- Tertiary actions should not distract from the primary workflow.
- Overflow actions should remain discoverable but not dominate layout.
- Hidden is preferred over disabled when the user can never perform the action.
- Disabled is preferred when user can fix state to make the action available.

### Priority decision order

Choose action priority in this order:

1. Is the action relevant in the current state?
2. Is the user allowed to perform it?
3. Is it the main next step?
4. Is it frequent enough to expose?
5. Is it risky or destructive?
6. Does it need confirmation?
7. Is it local, page-level, row-level, or batch-level?

Rule:

- Risk can lower visual priority, even if the action is important.

### Common priority defaults

| Context | Primary | Secondary | Overflow |
|---|---|---|---|
| list page | Create/Add | Refresh/Export | Import, Settings |
| table row | up to 3 icon actions | none | extra row actions |
| dialog form | Save/Create | Cancel | rarely used |
| destructive confirm | Delete/Confirm danger | Cancel | none |
| StateView error | Retry | Go back/View details | none |
| filter-empty | Clear filters | Refresh | none |
| detail page | Edit | Refresh/Back | Delete, Audit logs |
| batch toolbar | main batch action | secondary batch action | extra batch actions |

### One primary rule

Rules:

- One visual area should not contain two primary buttons.
- If two actions seem primary, choose by user goal and move the other to secondary.
- If both are equally important because they represent a required decision, use neutral choices rather than primary/secondary.
- In confirmation dialog, the confirming action may be primary danger and cancel stays secondary.
- Wizard/footer can have `Back` secondary and `Next/Submit` primary.

Bad:

```text
[Create user] [Import users] both primary
```

Better:

```text
[Create user] primary
[Import users] secondary or overflow
```

### Priority and risk

Rules:

- Destructive actions are usually lower visual priority until confirmation.
- In a destructive confirmation dialog, the destructive confirm action can become the primary action, but must use danger styling.
- Risky non-destructive actions may require confirmation and should not be hidden in a surprising place.
- Reversible actions can be more exposed than irreversible actions.

### Priority and frequency

Rules:

- High-frequency safe actions can be visible.
- Low-frequency actions move to overflow.
- Repeated row actions should use icon buttons only when the meaning is obvious and tooltip exists.
- Rare actions need text labels, not only icons.

---

## 4. Scope

Action scope controls placement and feedback.

| Scope | Examples | Placement |
|---|---|---|
| page | Create, Export | page header/tool area |
| list | Refresh, Batch delete | FilterBar/list toolbar |
| row | View, Edit, Delete | table action column |
| dialog | Cancel, Save | dialog footer |
| form | Submit, Reset | form footer/action area |
| field | Confirm edit, Clear | near field |
| StateView | Retry, Clear filters | StateView action area |
| batch | Delete selected, Export selected | selection toolbar |
| navigation | Back, View details | link/nav area |

Rules:

- Do not place row actions in page header.
- Do not place page-level destructive actions inside row menus.
- Batch actions appear only when selection exists or selection mode is active.
- Dialog submit actions belong in footer.
- The action should live where the user understands its affected scope.
- The action feedback should be scoped to the same area as the action.
- Moving an action to a higher scope increases perceived impact and risk.
- Moving an action to a lower scope can hide it from users who need it.
- Do not duplicate the same action in multiple scopes unless the product intentionally supports both paths.

### Scope decision order

Choose action scope in this order:

1. What object or area does the action affect?
2. Is the action global, page-level, list-level, row-level, field-level, or dialog-level?
3. Does the action require selection?
4. Does the action submit a form or mutate a specific object?
5. Does the action navigate to another route?
6. Does the action belong to a temporary state like empty/error?

Rule:

- Scope is decided by affected target, not by where there is visual space.

### Page actions

Use page actions for operations that affect the current page/module as a whole.

Common examples:

- Create resource.
- Open import flow.
- Export page-level data.
- Page-level settings.
- Navigate to related module.

Placement:

- Page header.
- Page-level toolbar.
- Right side of the page title area when the layout supports it.

Rules:

- Page primary action should be stable and easy to find.
- Page actions should not depend on a single row selection.
- Page-level create/import actions must respect permission.
- Do not place row-specific actions in the page header.
- Do not place many page actions directly in the header; use overflow for lower-frequency actions.

Examples:

```text
Projects page -> Create project in page header
Users page -> Import users as secondary/overflow
Settings page -> Save is not page action if it submits a form section
```

### List and toolbar actions

Use list actions for operations that affect list data, query state, or selected rows.

Common examples:

- Refresh.
- Clear filters.
- Export current result.
- Toggle view mode.
- Batch actions.

Placement:

- FilterBar action area.
- List toolbar above table/card list.
- Selection toolbar when items are selected.

Rules:

- Refresh is a list-level action when it reloads list data.
- Clear filters belongs near filters or StateView filter-empty action.
- Export current result belongs to list toolbar, not row menu.
- Batch actions should appear only after selection or in explicit selection mode.
- List actions should not be hidden below the table.
- On mobile, list actions may collapse into toolbar menu, but Refresh/Clear filters should remain reachable.

Examples:

```text
Table refresh -> FilterBar/list toolbar
Export current filtered rows -> list toolbar
Batch delete selected users -> selection toolbar
```

### Row actions

Use row actions for operations affecting one row/object.

Common examples:

- View details.
- Edit.
- Delete.
- View logs.
- Retry row task.
- Toggle row status.

Placement:

- Table action column.
- Card item action area.
- Row overflow menu.

Rules:

- Table row actions appear in the last action column by default.
- Expose at most 3 common row icon actions.
- Extra row actions go into overflow menu.
- Row action click must not trigger row click.
- Row action pending is row-scoped.
- Row destructive action usually goes in overflow or uses danger icon/action.
- If clicking row opens details, row action buttons must be visually and behaviorally separate.

Examples:

```text
Edit one user -> row action
Delete one invoice -> row overflow danger action
Retry one failed job -> row action
```

### Dialog actions

Use dialog actions for operations that affect the dialog task.

Placement:

- Dialog footer for submit/cancel/confirm.
- Dialog body only for local content actions.
- Dialog header only for close or header-level utilities.

Rules:

- Dialog header must keep close action.
- Dialog primary action belongs in footer.
- Footer actions align right on desktop.
- Most important footer action is rightmost on desktop.
- Dialog body should not contain the main submit action unless the dialog is a simple inline tool.
- Destructive confirmation dialog uses danger primary action in footer.
- If dialog content has local section actions, keep them near that section.

Examples:

```text
Create user dialog -> Cancel + Create in footer
Delete confirmation -> Cancel + Delete in footer
Dialog table row action -> inside table row, not footer
```

### Form actions

Use form actions for submitting, resetting, or leaving a form.

Placement:

- Form footer.
- Sticky form footer for long page forms.
- Dialog footer when form is inside dialog.
- Inline near field only for local field edit.

Rules:

- Submit/save action belongs to the form action area.
- Long forms should keep submit reachable with sticky footer when appropriate.
- Reset/discard actions are secondary and may need confirmation when dirty.
- Form submit action should not be duplicated in both header and footer unless the product intentionally supports long-form shortcuts.
- Field-level confirm/cancel actions stay near the field.

Examples:

```text
Page edit form -> sticky footer Save/Cancel
Dialog form -> dialog footer Save/Cancel
Inline rename -> small confirm/cancel near input
```

### Field actions

Use field actions for operations affecting one field value or field helper flow.

Common examples:

- Clear value.
- Show/hide secret.
- Copy token.
- Generate value.
- Confirm inline edit.
- Retry loading options.

Placement:

- Input suffix/prefix.
- Under the field as helper action.
- Dropdown content for option-related actions.

Rules:

- Field action must not submit the whole form unless explicitly designed.
- Field action feedback stays near the field.
- Secret copy/show actions must follow secret handling rules.
- Retry options belongs in dropdown/field error area.
- Keep field action hit area stable.

### StateView actions

Use StateView actions for recovery or next step from empty/error/loading-blocked state.

Placement:

- Inside StateView under description.
- Dialog StateView actions can use dialog footer if they are dialog-level actions.

Rules:

- StateView action must directly recover or advance the state.
- Do not place unrelated page actions inside StateView.
- StateView actions should preserve context.
- Use 0-2 visible actions.

### Navigation actions

Use navigation actions when the result is route/view change, not mutation.

Placement:

- Breadcrumb/back area.
- Link-style action near related content.
- StateView action area for not-found/forbidden recovery.

Rules:

- Use link/navigation semantics for route changes.
- Prefer specific labels such as `Back to users`.
- Do not use mutation button style for simple navigation.
- Do not lose dirty form state without confirmation.

### Scope conflicts

Rules:

- If an action affects selected rows, it is batch scope, not page scope.
- If an action affects one row, it is row scope, not list scope.
- If an action changes filters/query, it is list scope.
- If an action submits current dialog, it is dialog/form scope.
- If an action recovers empty/error state, it is StateView scope.
- If an action navigates route, it must use navigation semantics even when placed in a button group.

Bad:

```text
Delete selected users in page header before any selection exists.
Save dialog form in dialog body while footer has unrelated actions.
Row delete placed in page toolbar.
```

Better:

```text
Batch delete in selection toolbar after rows are selected.
Dialog Save in footer.
Row delete in row overflow menu.
```

---

## 5. Pending And Duplicate Prevention

Pending means an action has been accepted and its result is not final yet.

Rules:

- Mutation actions must show pending/loading after click.
- Pending action must prevent duplicate clicks.
- Disable only conflicting actions, not the entire page.
- Row mutation pending is row-scoped.
- Batch mutation pending is batch/action-scoped.
- Form submit pending disables submit and conflicting submit-like actions.
- If action affects navigation, prevent repeated navigation while pending.
- Failure restores action availability.
- Pending state must be scoped to the smallest safe area.
- Pending feedback must appear close to the triggering action.
- Read refresh pending and mutation pending should not look equally blocking.
- Do not use debounce alone as duplicate prevention for mutations.
- Backend/API should still be idempotent or duplicate-safe when possible.

### Pending types

| Type | Use when | UI behavior |
|---|---|---|
| button pending | one button action is running | button loading + disabled |
| row pending | one row/object mutation is running | row action disabled/loading |
| batch pending | selected items mutation is running | batch action loading + selected rows locked |
| form submitting | form submit is running | submit loading + conflicting actions disabled |
| dialog submitting | dialog action is running | footer action loading; close policy explicit |
| field pending | async field action/validation/options loading | field-level loading |
| navigation pending | route/action navigation is starting | disable repeated navigation |
| refresh pending | read refresh is running | refresh button loading; old data remains |

Rules:

- Pending type follows action scope.
- Do not upgrade row pending to page pending.
- Do not block unrelated sections for a local mutation.
- Do not clear visible content just because an action is pending.

### Duplicate prevention

Rules:

- Disable or lock the exact triggering control while pending.
- Disable actions that would submit the same payload again.
- Disable actions that mutate the same target in conflicting ways.
- Keep unrelated read/navigation actions available when safe.
- Use request idempotency keys for risky create/payment/import-like mutations when possible.
- If an action can be retried safely, make retry explicit after failure.
- Do not silently send the same mutation multiple times because of double click, Enter key, or repeated menu selection.

Examples:

```text
Double-click Save -> one submit request
Press Enter twice in form -> one submit request
Click row Delete twice -> one delete request
Click menu item twice -> second click ignored while pending
```

### Form submit pending

Rules:

- Submit button shows loading immediately.
- Submit button is disabled while submitting.
- Other submit-like actions are disabled.
- Cancel/close behavior must be explicit.
- If closing would lose pending result or dirty data, confirm or temporarily disable close.
- Validation errors stop submit before pending mutation starts.
- Submit failure restores submit action and preserves dirty input.
- Submit success clears dirty state and closes/navigates only after success.

Examples:

```text
Save profile -> Save loading, Cancel policy explicit
Create user dialog -> Create loading, no duplicate create
Validation fails -> no submit pending; show field errors
```

### Row pending

Rules:

- Row mutation pending is keyed by row id/rowKey.
- Disable conflicting actions only on that row.
- Other rows remain usable.
- Row pending must not trigger full table loading.
- If row action changes status, show pending on the action or target cell.
- Failure restores row action state and shows toast/row inline error.
- If optimistic update is used, failure rolls back or marks row failed.

Examples:

```text
Toggle one row -> only that switch pending
Delete one row -> only that row actions locked
Retry one task -> only that row retry action loading
```

### Batch pending

Rules:

- Batch pending applies to selected items and the batch action.
- Selection count remains visible.
- Selected rows involved in the batch should be locked or marked pending.
- Unselected rows can remain usable when safe.
- Batch destructive mutation requires confirmation before pending starts.
- Partial success must be represented after completion.
- After success, clear invalid selection and refresh affected data.
- Do not include disabled/unselectable rows in pending batch payload.

Examples:

```text
Batch delete 12 users -> Delete selected loading + selected rows locked
Partial success -> show result details and keep failed rows selectable
```

### Dialog pending

Rules:

- Dialog footer action shows loading.
- Dialog header close remains available only when closing is safe.
- Do not close dialog before mutation success unless action is intentionally backgrounded.
- If backgrounding is allowed, show toast/task state after close.
- Dialog body fields are disabled only when editing during submit would corrupt payload.
- Dialog submit failure keeps dialog open and preserves input.

### Field pending

Rules:

- Field pending stays near the field.
- Async validation should debounce and cancel stale requests.
- Options loading should not block the whole form.
- Dependent field loading disables only dependent field.
- Field pending should expose why input/action is temporarily unavailable when not obvious.

### Refresh and read pending

Rules:

- Refresh pending keeps old data visible.
- Refresh action shows loading and prevents repeated refresh clicks.
- Refresh pending should not disable row detail navigation unless data becomes unstable.
- Filter/search/page/sort request pending may show list-level loading when old data no longer matches query.
- Read pending failure keeps old data when available.

### Navigation pending

Rules:

- Prevent repeated route pushes while navigation is in progress.
- Preserve dirty form protection before navigation.
- Do not show mutation-style loading for simple route link unless route load is meaningfully delayed.
- If navigation depends on creating/updating data first, treat it as submit/mutation pending first.

### Optimistic update

Rules:

- Use optimistic update only when rollback is clear and safe.
- Show local pending state even when UI updates optimistically.
- Failure must rollback, restore edit mode, or mark failed state.
- Do not use optimistic update for irreversible destructive actions unless backend contract supports safe recovery.
- Toast or inline error should explain that the action did not complete.

### Pending copy and affordance

Rules:

- Loading label should be specific when visible: `Saving`, `Deleting`, `Uploading`.
- Icon-only pending action should still preserve size and tooltip when possible.
- Do not change button width dramatically during loading.
- Keep layout stable.
- Progress is preferred when duration is long and measurable.
- Long-running actions should expose task/progress instead of endless spinner.

Examples:

```text
Save form -> Save button loading
Delete row -> row delete action loading/disabled
Batch delete -> batch action loading, selected rows locked
Refresh list -> refresh button loading, rows remain readable
Import file -> progress/task state instead of endless button loading
```

---

## 6. Disabled

Disabled must explain why when reason is not obvious.

Rules:

- Permission-disabled actions need tooltip/reason.
- State-disabled actions need tooltip/reason when visible.
- Hide actions the user can never perform in the current role.
- Disable actions that may become available after state changes.
- Disabled action must not be the only recovery path.
- Disabled icon buttons still need tooltip explaining reason.
- Disabled is not a permission system by itself; backend/API must still enforce permission.
- Do not expose sensitive capabilities through disabled labels if the user should not know they exist.
- Disabled visual state must be readable and accessible.
- Disabled action must not trigger any mutation.

### Visibility decision

Choose action visibility in this order:

1. Is the action relevant to the current feature/state?
2. Is the user allowed to know this action exists?
3. Is the user allowed to perform it?
4. Can the action become available after selection/input/state changes?
5. Does showing it help the user understand what to do next?

Rules:

- If action is irrelevant, hide it.
- If user should not know the capability exists, hide it.
- If user lacks role/permission permanently in current context, usually hide it.
- If user may request access or learn what permission is needed, disabled with reason is allowed.
- If action is temporarily unavailable due to state, disable it with reason.
- If action is unavailable because of validation, keep it visible and disabled with reason or inline errors.

### Hidden vs disabled

| State | Use when |
|---|---|
| hidden | irrelevant, not permitted to know, never allowed in current role |
| disabled | visible but temporarily unavailable or educational |
| readonly | value visible but not editable |
| pending | action accepted and waiting for result |
| unavailable state | feature blocked by setup/dependency |

Rules:

- Hidden removes the action from layout.
- Disabled keeps layout and teaches why action is unavailable.
- Readonly is for data display/editability, not action execution.
- Pending is not the same as disabled; it means action is running.
- Setup/dependency unavailable should usually be explained by StateView, banner, or disabled reason.

Examples:

```text
Viewer role can never delete project -> hide Delete or show disabled only if policy wants education
No row selected -> Batch delete disabled: "Select at least one item"
Required fields invalid -> Save disabled or enabled with validation on submit, based on form policy
Integration not connected -> Sync disabled: "Connect GitHub first"
```

### Permission-disabled

Rules:

- Permission-disabled action must explain required role/permission when safe.
- Explanation should be specific but not leak sensitive policy details.
- Use tooltip for compact actions and helper text for larger action groups.
- For icon-only disabled action, tooltip is required.
- For menu item disabled by permission, menu item may stay visible if education is useful.
- If request-access flow exists, provide `Request access`, `Contact admin`, or `Ask owner` path.
- Do not show permission-disabled action as the primary recovery path unless a request-access flow exists.

Copy examples:

```text
Only workspace owners can delete this project.
You need billing admin permission to configure invoices.
Ask an admin to enable this integration.
```

Avoid:

```text
Forbidden.
RBAC_POLICY_DENIED_DELETE_PROJECT.
You cannot do this.
```

### State-disabled

Rules:

- State-disabled action explains the missing state or prerequisite.
- Use disabled state for actions that can become available after user changes selection/input/status.
- Use inline errors for form validation when the field can be fixed.
- Use StateView/config empty when a whole area is blocked by missing setup.
- If a row status blocks an action, show reason near action or in tooltip.
- If multiple prerequisites are missing, show the most actionable reason first.

Examples:

```text
Batch export disabled -> Select at least one item
Save disabled -> Fix required fields before saving
Retry disabled -> Task is already running
Sync disabled -> Connect GitHub first
```

### Disabled in menus and icon buttons

Rules:

- Disabled icon button must still show tooltip on hover/focus.
- Disabled menu item should show reason when hovered/focused when possible.
- If menu system cannot show disabled reason, prefer hiding permission-disabled actions and using visible guidance elsewhere.
- Disabled danger action keeps danger semantics only if visible reason is clear.
- Do not make disabled items look identical to enabled items.

### Disabled and accessibility

Rules:

- Disabled reason must be accessible to keyboard and screen reader users.
- Do not rely only on color to communicate disabled.
- Disabled text/icon must have sufficient contrast for readability.
- If native disabled prevents tooltip/focus, use an accessible wrapper/pattern.
- Keyboard users should not get trapped on disabled actions.

### Disabled and forms

Rules:

- Required field errors can either disable submit until valid or allow submit then show validation; choose one policy per form context.
- Long forms often allow submit and show validation after click.
- Small forms can disable submit when clearly invalid.
- Disabled submit must explain what needs fixing if not obvious.
- Pending submit is loading, not ordinary disabled.
- Readonly form fields should remain readable and copyable when appropriate.

### Disabled and batch selection

Rules:

- Batch action disabled when no eligible selected items exist.
- If some selected items are ineligible, show selected/eligible counts or explain partial eligibility.
- Disabled rows must not be included in batch payload.
- If all selected items are disabled for an action, disable batch action with reason.
- Partial batch eligibility should be explicit before confirmation.

Examples:

```text
Delete disabled -> "Only owners can delete this project"
Batch delete disabled -> "Select at least one item"
Save disabled -> "Fix required fields before saving"
Batch delete 5 selected, 2 eligible -> confirmation should name eligible count
```

---

## 7. Dangerous Actions

Rules:

- Dangerous actions include delete, revoke, reset, disconnect, disable critical service, irreversible changes.
- Danger color applies to text/icon/action affordance.
- Dangerous menu items should be visually separated when needed.
- Dangerous action usually requires confirmation.
- Confirmation must name the target object and action.
- Bulk dangerous confirmation must include selected count.
- Pending destructive action must clearly prevent duplicate execution.
- Dangerous action rules define when confirmation is required; dialog rules define how the confirmation dialog looks and reads.
- Destructive/high-risk confirmation always uses ConfirmDialog regardless of trigger source.

### Dangerous action levels

| Level | Meaning | Examples | Confirmation |
|---|---|---|---|
| low-risk reversible | easy to undo or low impact | remove filter, clear local draft | usually no |
| risky reversible | affects shared state but can recover | disable non-critical config, remove from group | sometimes |
| destructive | deletes/removes/revokes real data or access | delete user, revoke token, disconnect integration | yes |
| irreversible/critical | cannot recover or affects service availability | reset secret, clear production data, terminate job | yes, stronger copy |
| batch destructive | destructive action across selected items | delete 12 users, revoke selected keys | yes, include count |

Rules:

- Use confirmation for destructive, irreversible, critical, and batch destructive actions.
- Use confirmation for risky reversible actions when impact is not obvious.
- Do not use confirmation for every low-risk action; too many confirmations reduce trust.
- If undo is available and reliable, a toast with Undo may replace confirmation for low-risk reversible actions.
- If undo is not reliable, use confirmation.

### Confirmation requirements

Confirmation must include:

- title naming the action and target type
- body naming the exact object/scope
- consequence after the action succeeds
- irreversibility or recovery path
- cancel action
- danger confirm action

Rules:

- Do not use generic copy such as `Are you sure?`, `Confirm delete?`, or `OK`.
- Do not write only `Confirm delete?`.
- Write `Confirm deleting {object type} "{object name}"?` or equivalent.
- For batch actions, include selected count and target type.
- For permission/access actions, name whose access or which token/key is affected.
- Confirm button should be short and action-specific: `Delete`, `Delete 12 items`, `Revoke access`, `Reset key`.
- If the user must type the object name for very high-risk actions, the typed value must match the target exactly.

Good:

```text
Delete project "Production API"?
This will permanently delete the project and its environment settings. This cannot be undone.
Confirm: Delete project
```

Bad:

```text
Confirm
Are you sure?
Confirm: OK
```

### Dangerous action placement

Rules:

- Row destructive actions usually live in row overflow unless they are very frequent and safe to expose.
- Batch destructive actions live in selection toolbar after selection exists.
- Page-level destructive actions usually belong in overflow or danger zone, not next to primary create/save.
- Destructive dialog confirm action can be primary danger inside the confirmation dialog.
- Do not place destructive action as the default highlighted action in normal edit/create forms.

### Dangerous pending and failure

Rules:

- Pending destructive action disables confirm and conflicting cancel/close behavior according to dialog rules.
- Do not allow double execution.
- Success closes confirmation and refreshes/removes affected data.
- Failure keeps context visible and clearly states the action did not complete.
- For optimistic destructive UI, rollback must be guaranteed; otherwise do not use optimistic removal.

---

## 8. Icon Actions

Rules:

- Use semantic icons.
- Do not reuse the same icon for different actions in the same context.
- Icon-only action requires tooltip.
- Table row should expose at most 3 common icon actions.
- Extra actions go into More/overflow menu.
- Icon button hit area must be stable and accessible.
- Tooltip text uses action verb: `Edit`, `Delete`, `View logs`.

---

## 9. Menu / Overflow Actions

Rules:

- Use overflow for low-frequency or extra row actions.
- Menu width should be consistent.
- Menu item uses icon + label when possible.
- Icon and label spacing is 8px.
- Dangerous menu item icon and text use danger color.
- Menu action order: common safe actions first, dangerous last.
- Do not hide the only primary path in overflow.

---

## 10. Batch Actions

Rules:

- Batch actions require selected items.
- Selection count must be visible.
- Batch destructive action requires confirmation.
- Confirmation names action and selected count.
- Batch action must handle partial success/failure.
- After successful batch mutation, clear invalid selection and refresh affected data.
- Disabled selected rows must not be included.

---

## 11. Feedback

Rules:

- Successful mutation usually shows toast.
- Failed single action shows toast or local inline error.
- Failed form submit shows inline/form-level error.
- Failed page/list load uses StateView.
- Refresh failure keeps old data and shows toast/local error.
- Do not use toast as the only feedback for field validation.

---

## 12. AI Review Checklist

Before accepting AI-generated action code, verify:

- Action semantics are chosen before visual variant.
- Each action has a clear intent and label.
- Action priority is clear and only one primary exists per area.
- Risk, frequency, and permission are considered before exposing an action.
- Destructive action is not primary unless in destructive confirmation.
- Low-frequency actions are moved to overflow instead of competing with primary.
- Hidden vs disabled is chosen intentionally.
- Navigation actions use link/navigation semantics when route changes.
- Toggle actions use Switch when changing immediate binary state.
- Action scope matches placement.
- Action scope is based on affected target, not available visual space.
- Page actions do not depend on row selection.
- List actions are placed near FilterBar/list toolbar and remain reachable on mobile.
- Batch actions appear in selection toolbar only after selection or selection mode.
- Row actions are placed in table action column/card item area and do not trigger row click.
- Dialog submit/confirm actions are in dialog footer.
- Form submit actions are in form/dialog footer, with sticky footer for long page forms when needed.
- Field actions stay near the field and do not submit the whole form unexpectedly.
- StateView actions directly recover or advance the StateView state.
- Pending prevents duplicate execution.
- Pending scope is the smallest safe area: button, row, batch, form, dialog, field, navigation, or refresh.
- Mutation actions do not rely on debounce alone for duplicate prevention.
- Double click, Enter key, and repeated menu selection cannot create duplicate mutations.
- Form submit pending disables submit-like actions and preserves dirty input on failure.
- Row pending is keyed by row id/rowKey and does not trigger full table loading.
- Batch pending keeps selection count visible and handles partial success/failure.
- Dialog pending keeps close behavior explicit and preserves input on failure.
- Field pending stays near the field and cancels stale async requests.
- Refresh pending keeps old data visible when possible.
- Optimistic update has a clear rollback or failed-state path.
- Long-running actions use progress/task state instead of endless spinner.
- Loading labels and button dimensions remain stable during pending.
- Disabled actions explain reason or are hidden.
- Hidden, disabled, readonly, pending, and unavailable states are not confused.
- Disabled is not used as the only permission protection; backend/API permission is still required.
- Permission-disabled actions do not leak sensitive capabilities or internal policy codes.
- Permission-disabled actions provide role/permission reason only when safe.
- State-disabled actions explain the missing prerequisite or next fix.
- Disabled icon buttons/menu items expose reason on hover/focus when visible.
- Disabled reason is accessible to keyboard and screen reader users.
- Disabled submit policy is consistent within the form context.
- Batch disabled state handles eligible/ineligible selected item counts correctly.
- Permission rules are respected.
- Dangerous actions are visually marked and confirmed.
- Dangerous action level is identified before deciding confirmation.
- Destructive/irreversible/batch destructive actions require confirmation.
- Dangerous confirmation names target object/scope, action, consequence, and irreversibility/recovery.
- Dangerous confirmation does not use generic copy such as `Are you sure?` or `OK`.
- Batch dangerous confirmation includes selected count and target type.
- Very high-risk action requires stronger confirmation such as exact target-name input when appropriate.
- Destructive action pending prevents duplicate execution and has rollback/non-optimistic strategy.
- Icon-only actions have tooltips.
- Row actions expose at most 3 icons before overflow.
- Overflow menu uses icon + label and marks danger actions.
- Batch actions depend on selection and handle partial failure.
- Feedback matches action result and scope.
