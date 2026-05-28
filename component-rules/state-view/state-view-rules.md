# StateView / Empty / Loading / Error Rules

> Use these rules when building or reviewing state containers in 2B products.
> StateView is used when a page, section, list, dialog, or data region cannot show normal content.

---

## 1. Core Purpose

StateView provides a consistent way to handle non-normal data states.

Common states:

- loading
- refreshing
- empty
- filter-empty
- search-empty
- error
- forbidden
- not-found
- offline

Rule:

- Use StateView when the current area cannot render normal content.
- Use button loading for a single pending action.
- Use inline error for field-level or form-level validation.
- Use toast for temporary feedback, not as the only recovery path.

---

## 2. Scope

Choose StateView scope by failure/loading boundary.

| Scope | Use when |
|---|---|
| Page-level | the whole page cannot show useful content |
| Section-level | one module/section cannot show useful content |
| List-level | table/card list has no data or failed request |
| Dialog-level | dialog body cannot show normal content |
| Field-level | select/options/async field cannot load choices |

Rules:

- Page-level StateView should not hide global navigation.
- List-level StateView should keep FilterBar and table header when useful.
- Dialog-level StateView stays inside dialog body and keeps dialog header.
- Field-level loading/error should stay near the field, not become page-level.
- Do not turn a small local issue into a full-page state.

---

## 3. Loading Strategy

Loading must distinguish first load from refresh.

| Loading type | Use when | UI behavior |
|---|---|---|
| first loading | no usable data yet | skeleton or centered loading |
| refreshing | old data exists | keep old data, show subtle refresh state |
| local loading | section/dialog/list loading | show local skeleton/spinner |
| button pending | one action is running | button loading/disabled |
| field loading | options/async validation loading | field-level spinner/pending |
| blocking loading | current area cannot be interacted with safely | overlay or disabled area |

Rules:

- First page load should use skeleton when layout is predictable.
- Use centered spinner only when layout is unknown or content is very small.
- Keep old data during refresh whenever possible.
- Refreshing should not clear the table/list unless data is no longer valid.
- Refreshing should not disable unrelated controls.
- A pending button must prevent duplicate submit/click.
- Avoid loading flicker for very fast requests.
- Do not show both full-area loading and button loading for the same small action.

### First loading

Use first loading when there is no usable content yet.

Rules:

- Use skeleton for table, card list, detail page, dialog content, and form sections when layout is known.
- Use centered spinner for unknown layout, short-lived utility pages, or tiny modules.
- Keep page chrome visible: navigation, page title, and stable layout should remain when possible.
- Do not show empty state before the first request finishes.
- Do not show error state until the request has actually failed.
- If required route params or permissions are still resolving, use first loading rather than forbidden/not-found.

Examples:

```text
Initial table request -> table skeleton
Initial detail request -> detail skeleton
Initial dialog content request -> dialog body skeleton
Unknown async tool result -> centered spinner
```

### Refreshing

Use refreshing when old data exists and a new request is running.

Rules:

- Keep old data visible by default.
- Show lightweight refresh feedback near the triggering control or list header.
- Refresh button should show pending and prevent repeated clicks.
- Pagination, sorting, and filters can stay usable unless the request contract cannot handle changes.
- Row selection should be preserved only if selected row keys still exist after refresh.
- If refreshed data invalidates current rows, update rows atomically when the request succeeds.
- If refresh fails, keep old data and show toast or local inline error.
- Do not replace old data with skeleton during refresh.

Examples:

```text
Manual refresh on table -> keep rows + refresh button loading
Filter change -> request new result + table loading/skeleton only if old rows are no longer relevant
Background polling -> keep rows + optional subtle "Updated" toast
```

### Skeleton vs spinner

Choose by layout predictability.

| UI | Use when |
|---|---|
| Skeleton | final layout is known and content has structure |
| Spinner | layout is unknown, action is short, or area is tiny |
| Progress | upload/import/export has measurable progress |
| Overlay loading | current visible area must not be interacted with |

Rules:

- Table skeleton should preserve header and approximate row height.
- Card skeleton should preserve card grid and card aspect ratio.
- Form skeleton should preserve label/field rhythm.
- Dialog skeleton should stay in body; header remains visible.
- Spinner should not be used as a large permanent placeholder for predictable pages.
- Progress should show percentage or step when the backend can provide it.

### Flicker control

Loading should not flash for very fast requests.

Rules:

- Delay showing non-critical loading for very fast requests.
- Once visible, keep loading long enough to avoid visual flicker.
- Button pending can appear immediately because it confirms the click was received.
- Do not delay loading for destructive or expensive actions where feedback is important.
- Do not delay loading when the user would otherwise think the UI is frozen.

Recommended timing:

```text
Show skeleton/spinner after roughly 150-300ms if request is still pending.
Keep visible loading for roughly 300ms once shown.
Show button loading immediately.
```

### Interaction while loading

Loading should block only what is unsafe to use.

Rules:

- Disable the exact action that triggered a mutation.
- Disable conflicting actions that would duplicate or corrupt the same data.
- Keep unrelated navigation and filters usable when safe.
- A submit button pending disables submit and conflicting close/discard actions.
- Refreshing a list should not disable row detail navigation unless row data is unstable.
- Blocking overlay is allowed only when partial interaction would create inconsistent state.

Examples:

```text
Saving form -> disable Save, disable conflicting submit actions, keep Cancel policy explicit
Deleting row -> disable that row's actions, not the whole table
Refreshing table -> disable Refresh, keep current rows readable
Uploading file -> show progress and disable submit until upload result is known
```

### List and table loading

Rules:

- First load: show table/list skeleton.
- Refresh: keep old rows and show refresh indicator.
- Filter/search change: if old rows no longer match the query, show table-level loading or skeleton in body.
- Pagination change: show table-level loading while preserving header and pagination placement.
- Sorting change: show table-level loading unless client-side sort is immediate.
- Virtualized list loading should preserve scroll container height.
- Infinite scroll should show bottom loading, not replace the full list.

### Dialog loading

Rules:

- Dialog header must remain visible.
- Initial dialog content loading appears in dialog body.
- Footer may be hidden or disabled until required data is ready.
- If loading only affects one field/section, use local loading instead of full dialog body loading.
- Closing behavior during loading must be explicit: allow close for read-only loading, confirm/disable close for risky submit.

### Field loading

Rules:

- Remote Select/Combobox loading appears inside dropdown or field suffix.
- Async validation loading appears near the field.
- Dependent field loading should disable only that field.
- Parent field changes should cancel stale child option requests.
- Field loading should not block the whole form unless the form cannot be submitted safely.

Examples:

```text
Open user list with no data loaded -> table skeleton
Click Refresh with existing rows -> keep rows + small refreshing indicator
Click Delete row -> delete button loading + row action disabled
Remote Select loading options -> spinner inside select
```

Skeleton rules:

- Use skeleton for page, table, card list, and dialog content when shape is known.
- Skeleton should match the final layout roughly.
- Do not use decorative skeletons that shift layout.
- Table skeleton should preserve columns/header when possible.
- Skeleton count should match visible density, not total data count.
- Mobile skeleton should use the mobile layout, not desktop table skeleton.

---

## 4. Empty Strategy

Empty state must explain why content is absent.

| Empty type | Meaning | Primary action |
|---|---|---|
| initial empty | no data has ever been created | Create / Import / Connect |
| filter-empty | data exists, filter matched nothing | Clear filters |
| search-empty | keyword matched nothing | Clear search |
| config-empty | setup is required first | Configure |
| integration-empty | external connection missing | Connect integration |
| permission-empty | data hidden by permission | Contact admin / no action |
| local empty | this section has no related data | optional create/add |
| archived/deleted empty | related resource was removed | Go back / Refresh |
| async-pending empty | data will appear after sync/import | Refresh / View task |

Rules:

- Do not use one generic "No data" for every empty state.
- Initial empty can explain what user should create next.
- Filter empty must provide Clear filters when filters are active.
- Search empty must show or reference the keyword when helpful.
- Config/integration empty should route user to setup when they have permission.
- Permission empty should not imply the data does not exist.
- Empty state must not remove the controls needed to recover.
- Empty state should preserve useful context such as active filters, tab, search keyword, or parent resource.
- Empty state should not appear until loading has completed successfully.
- Empty state should not hide errors. A failed request is error, not empty.
- Empty state should not hide permission issues. Forbidden is not empty.
- Empty state copy should be factual and calm.

### Empty decision order

Resolve empty cause in this order:

1. If request failed, show error.
2. If user has no access to the page/resource, show forbidden.
3. If required setup is missing, show config/integration empty.
4. If search keyword is active and no results, show search-empty.
5. If filters are active and no results, show filter-empty.
6. If the resource exists but this section has no related data, show local empty.
7. If the whole product/module has no records yet, show initial empty.

Rule:

- Do not classify a state as initial empty until filters/search/setup/permission have been ruled out.

### Initial empty

Use when the module has no records yet.

Rules:

- Explain what object is missing.
- Provide a create/import/connect action only if the user has permission.
- If create permission is missing, show a neutral explanation or contact/admin path when available.
- Do not show Clear filters if no filters are active.
- Do not imply failure; initial empty is a normal state.

Good:

```text
No projects yet.
Create a project to start grouping environments and deployments.
Primary action: Create project
```

Bad:

```text
No data.
```

### Filter empty

Use when filters are active and the result is empty.

Rules:

- Keep FilterBar visible.
- Keep active filter chips visible.
- Primary action should be Clear filters or Reset filters.
- Do not offer Create as the primary action unless creating is truly the next best recovery.
- If only some filters are likely too restrictive, allow clearing individual chips.
- Pagination should reset to first page when filters change.
- Selection should be cleared when filters change.

Example:

```text
No records match the current filters.
Primary action: Clear filters
Secondary action: Refresh
```

### Search empty

Use when keyword search has no results.

Rules:

- Mention the search keyword when it is safe and useful.
- Primary action should be Clear search.
- Keep other filters visible if they are also active.
- If search and filters are both active, prefer combined copy and Clear filters/search action.
- Do not show search-empty while debounce/request is still pending.

Example:

```text
No results for "invoice webhook".
Primary action: Clear search
```

### Config empty

Use when data cannot exist until required setup is complete.

Rules:

- Explain the missing setup, not just the missing data.
- Primary action should route to configuration when user has permission.
- If user lacks setup permission, show who can configure it or how to request help.
- Do not show Create for downstream objects before the required setup exists.
- Keep copy specific to the blocked capability.

Example:

```text
Billing is not configured.
Configure billing before creating invoices.
Primary action: Configure billing
```

### Integration empty

Use when data depends on an external connection or sync.

Rules:

- Explain which integration is missing or disconnected.
- Primary action should be Connect integration when allowed.
- If connection exists but sync has not completed, show async-pending empty instead.
- If the integration failed, show error rather than empty.
- Import/sync empty should provide task status or refresh when useful.

Example:

```text
GitHub is not connected.
Connect GitHub to sync repositories.
Primary action: Connect GitHub
```

### Permission empty

Use only when the area is intentionally visible but data is hidden by permission.

Rules:

- Do not say the data does not exist.
- Do not show create/configure actions the user cannot perform.
- Contact admin is shown only if the product supports such a workflow.
- For operation-level permission, prefer disabled action + tooltip instead of StateView.
- For page-level no access, use forbidden StateView rather than permission-empty.

Example:

```text
You do not have access to view these records.
Secondary action: Contact admin
```

### Local empty

Use when the parent resource exists but a child section has no related items.

Rules:

- Keep parent context visible.
- Keep the empty state compact.
- Action is optional.
- Do not use a large page-level empty state for a small tab/section.
- If the child item is important to the workflow, provide Add/Create when allowed.

Examples:

```text
User detail -> Audit Logs tab empty -> "No audit logs yet."
Project detail -> Members section empty -> "No members added." + Add member
```

### Async-pending empty

Use when data may appear after import, sync, or background processing.

Rules:

- Explain that data is pending rather than absent.
- Provide Refresh or View task when useful.
- Do not show initial empty while an import/sync job is still active.
- If the async job failed, show error or failed task state.

Example:

```text
Repository sync is still running.
Refresh later or view sync task for progress.
```

### Empty copy

Rules:

- Title states the empty condition.
- Description explains the cause or next step.
- Avoid vague phrases such as "No data" when a specific cause is known.
- Avoid blaming the user.
- Do not expose sensitive permission or existence details.
- Use the product noun, not generic words.

Recommended pattern:

```text
Title: No {object} yet
Description: {Next step or cause}
Action: {Recovery action}
```

### Empty placement

Rules:

- Table empty appears in table body and usually keeps header.
- Filter/search empty keeps FilterBar and active chips.
- Card list empty appears in the list/grid area.
- Dialog empty appears in dialog body and keeps header.
- Small section empty should be compact and avoid large illustration.
- Mobile empty uses shorter copy and stacked actions.

Examples:

```text
No projects yet -> Create project
No results for current filters -> Clear filters
No GitHub integration connected -> Connect GitHub
No visible records due to permission -> Contact admin
```

---

## 5. Error Strategy

Error state depends on whether old data is still usable.

| Error type | Use StateView | Use toast | Recovery |
|---|---|---|---|
| first load failed | yes | optional | Retry |
| refresh failed with old data | no | yes | keep old data |
| list request failed and no data | yes | optional | Retry |
| section failed | local StateView | optional | Retry |
| dialog content failed | dialog StateView | optional | Retry / Close |
| form submit failed | no | sometimes | inline/form-level error |
| field options failed | no page StateView | optional | field-level retry |
| permission error | StateView or disabled tooltip | optional | Contact admin |
| not found | StateView | optional | Go back |
| background task failed | no, unless task page | yes | View task / Retry task |
| optimistic mutation failed | no, usually | yes + rollback/inline | rollback or restore edit |

Rules:

- First load failure must show a StateView with Retry.
- Refresh failure should keep old data and show toast or inline refresh error.
- Form validation errors must be inline, not only toast.
- Server field errors should map to fields when possible.
- Unknown submit failure may use form-level error and/or toast, while preserving input.
- List error with no usable data should use list-level StateView.
- Dialog loading error should keep header and show Retry/Close in body or footer.
- Do not clear useful old data just to show an error state.
- Error state should preserve user input and current context whenever possible.
- Error copy should explain what failed and what the user can do next.
- Do not expose raw backend stack traces or internal error codes as primary copy.
- Show technical details only in a secondary expandable area or copyable detail when useful for support.
- Retry must rerun the failed request, not reload the whole app unless necessary.
- Error UI must be scoped to the failed area.

### Error decision order

Resolve error display in this order:

1. If normal content cannot render and no old data is usable, show StateView.
2. If old data remains usable, keep content and show toast or local inline error.
3. If user can fix a specific field, show field-level inline error.
4. If submit failed due to general business/server error, show form-level error near submit area.
5. If a single action failed, show toast and restore/keep the relevant local state.
6. If a background task failed, show toast with View task only when the user can inspect it.

Rule:

- Never choose toast first for an error that leaves the current area unusable.

### Page and list errors

Rules:

- First page load failure uses page-level StateView with Retry.
- List first load failure uses list-level StateView with Retry.
- Table/list header, FilterBar, and page title should stay visible when useful.
- Refresh failure keeps old rows/cards and shows toast or local refresh message.
- Filter/search request failure should not be shown as empty.
- Pagination failure keeps current page data if still usable.
- Retry should keep the same query/filter/page parameters.

Examples:

```text
Open users page -> request fails -> page/list StateView + Retry
Refresh users with existing rows -> keep rows + toast "Refresh failed"
Change page -> request fails -> keep current rows if possible + local pagination error
```

### Section and dialog errors

Rules:

- Section error replaces only the failed section.
- Other page sections remain usable.
- Dialog content error stays inside dialog body and keeps header.
- Dialog action submit failure should not replace the whole dialog body.
- Dialog form submit failure keeps input and shows field/form-level error.
- Dialog read-only content load failure can show Retry and Close.

### Form and field errors

Rules:

- Client validation errors are field-level inline errors.
- Server field validation errors map back to fields when possible.
- Cross-field errors appear near the related field group or submit area.
- General submit failure appears as form-level error near submit buttons.
- Toast can supplement submit failure only when it does not replace inline/form-level error.
- Submit failure must not clear dirty input.
- First invalid field should receive focus after failed submit when possible.

Examples:

```text
Name is required -> field inline error
Start date after end date -> group error near date range
Server says email already exists -> email field error
Unknown save failure -> form-level error + optional toast
```

### Action and optimistic errors

Rules:

- Single action failure usually uses toast.
- If optimistic UI was applied, rollback or mark the item as failed.
- Row-level action failure should not replace the whole table.
- Failed row mutation can show row-level error, restore action button, and toast.
- Destructive action failure should clearly say the action did not complete.
- Retrying a mutation should be explicit; do not silently retry destructive operations without user awareness.

Examples:

```text
Delete row fails -> row remains + toast "Delete failed"
Toggle switch fails -> switch rolls back + toast or inline row error
Rename inline fails -> keep edit mode + inline error
```

### Permission, forbidden, and not found errors

Rules:

- Page-level no access uses forbidden StateView.
- Operation-level no access uses disabled action + tooltip when action is visible.
- Resource not found uses not-found StateView with Go back when appropriate.
- Do not use generic empty for forbidden/not-found.
- Do not reveal sensitive resource existence if backend intentionally masks forbidden as not-found.
- Permission copy should be calm and specific without overexposing policy internals.

### Offline and network errors

Rules:

- If no content can load, show error/offline StateView with Retry.
- If old content exists, keep it and show offline/connection toast or banner.
- Reconnect success can use a subtle toast or silent refresh.
- Do not repeatedly spam offline toasts while the connection remains down.
- Disable actions that cannot work offline, or explain why they are unavailable.

---

## 6. Toast Boundary

Toast is short-lived feedback. StateView is a content replacement.

Use toast for:

- successful create/update/delete
- refresh failed while old data remains visible
- background sync result
- non-blocking warning
- copied/export started/import started
- single row/action failure when content remains usable
- refresh failure when old content remains usable
- offline/reconnected status when page content remains usable

Do not use toast as the only feedback for:

- first load failed
- page has no usable content
- field validation error
- missing required setup
- no permission to access current page
- form submit validation errors
- dialog content load failure
- not-found resource page

Rule:

- If the user needs a recovery action to see content, use StateView.
- If the content remains usable and the message is temporary, use toast.
- If the user can fix a field, use inline error.
- If the error belongs to a specific area, prefer local inline/StateView over global toast.
- Toast should not be the only place where critical recovery actions live.

### Toast severity

| Toast type | Use for |
|---|---|
| success | completed create/update/delete/copy/export start |
| error | non-blocking failed action while content remains usable |
| warning | partial success, degraded state, non-blocking risk |
| info | background task started, sync queued, connection restored |

Rules:

- Success toast should be short and confirm completion.
- Error toast should name the failed action.
- Warning toast should explain impact briefly.
- Info toast should not interrupt workflow.
- Avoid stacking multiple toasts for the same repeated failure.
- Deduplicate identical errors within a short time window.

### Toast actions

Rules:

- Toast may include one lightweight action.
- Use View task/View details when there is a real destination.
- Use Retry only for safe idempotent actions.
- Do not put complex forms or confirmations in toast.
- Do not use toast action as the only way to recover from page-level failure.

Examples:

```text
Refresh failed, old rows still visible -> error toast: Retry
Import started -> info toast: View task
Copy succeeded -> success toast, no action
Delete failed -> error toast, row remains visible
```

### Toast placement and duration

Rules:

- Desktop default placement is bottom-right unless product layout reserves that area.
- Use bottom-left only when bottom-right conflicts with persistent panels.
- Use top-center sparingly for global connection or session status.
- Mobile toast should appear near bottom and avoid covering primary actions.
- Success/info toast can be shorter.
- Error/warning toast should remain longer.
- Persistent critical issues should become banner/StateView, not long-lived toast.

Recommended duration:

```text
Success/info: 2-4s
Warning/error: 4-6s
Actionable toast: 6-8s or until user dismisses, depending on product policy
```

---

## 7. Action Button Strategy

StateView actions must match the recovery path.

Common actions:

- Retry
- Refresh
- Clear filters
- Clear search
- Create
- Import
- Configure
- Connect integration
- Go back
- Contact admin
- View docs
- View task
- View details

Rules:

- Use at most two visible actions.
- Primary action is the most direct recovery.
- Secondary action is optional and less important.
- Do not show actions the user cannot perform.
- Disabled actions must explain why, or be hidden if they add no value.
- Destructive actions should not appear in StateView unless the state is specifically about recovery from that destructive flow.
- Page-level StateView may include `Go back`.
- List filter-empty should prioritize `Clear filters`.
- Initial empty should prioritize `Create` only when user has create permission.
- Permission state should prioritize `Contact admin` only if such workflow exists.
- Do not show a primary action that cannot actually resolve or advance the state.
- Do not use a generic action label such as `OK` or `Submit`.
- Action labels should be verbs and name the target when helpful.
- Actions must keep current context when possible: query, filters, parent id, dialog state.
- If the action opens a route, use real navigation/link behavior.
- If the action retries data, it must retry the failed request with the same parameters.
- If no useful action exists, it is acceptable to show no action.

### Action priority by state

| State | Primary action | Secondary action |
|---|---|---|
| first load error | Retry | Go back / View details |
| list load error | Retry | Refresh |
| refresh error with old data | none in StateView | toast Retry if safe |
| initial empty | Create / Import | View docs |
| filter-empty | Clear filters | Refresh |
| search-empty | Clear search | Clear filters |
| config-empty | Configure | View docs |
| integration-empty | Connect integration | View docs |
| async-pending empty | View task / Refresh | View details |
| permission-empty | Contact admin | View docs |
| forbidden page | Go back | Contact admin |
| not-found detail | Go back to list | Refresh |
| offline with no data | Retry | none |
| local section empty | Add/Create, optional | none |

Rules:

- The table defines defaults; product context may override only with a clearer recovery path.
- `Retry` is primary only for failed requests.
- `Refresh` is primary only when the state is expected to change without user configuration.
- `Clear filters/search` is primary when query conditions caused the empty result.
- `Create` is primary only for true initial empty and when user can create.
- `Configure`/`Connect` is primary when data cannot exist before setup.
- `Go back` is primary for not-found/forbidden when no direct recovery exists.
- `View task` is primary when async processing is the reason data is missing.

### Permission rules

Rules:

- Permission decides whether an action is shown, hidden, or disabled.
- Hide actions that the user can never perform in the current role.
- Disable actions only when the user may become eligible after a state change, and provide reason.
- Do not show `Create`, `Import`, `Configure`, or `Connect` without permission.
- `Contact admin` appears only when the product has an actual admin/contact/request-access workflow.
- If request-access workflow exists, label it specifically: `Request access`, `Contact admin`, or `Ask owner`.
- Do not use disabled primary actions as the main recovery path.

Examples:

```text
Initial empty + canCreate -> Create project
Initial empty + cannotCreate + hasAdminFlow -> Contact admin
Initial empty + cannotCreate + noAdminFlow -> no action
Config empty + cannotConfigure -> View docs or no action
```

### Retry and refresh actions

Rules:

- `Retry` repeats the failed request that produced the StateView.
- `Retry` should keep current route, query, filters, pagination, and parent resource.
- `Retry` should show loading/pending on the action itself.
- `Retry` should be idempotent or safe for read requests.
- Mutation retry should be explicit and only shown when safe.
- `Refresh` asks for latest data when current state may change externally.
- Do not use `Refresh` to recover validation errors.

Examples:

```text
List load failed -> Retry same list query
Sync still running -> Refresh
Form validation failed -> no Retry; fix fields
```

### Clear filters and search actions

Rules:

- `Clear filters` clears all active filters that caused filter-empty.
- `Clear search` clears keyword only.
- If search and filters are both active, choose the action that removes the smallest useful blocker.
- Keep the user on the same page/list route.
- Reset pagination to first page.
- Clear selection when query conditions change.
- Preserve unrelated view mode or route tab unless invalid.

Examples:

```text
status=failed -> Clear filters
keyword="invoice" -> Clear search
keyword + status filter -> Clear search or Clear filters, based on product default
```

### Create, import, configure, connect

Rules:

- `Create` opens the normal creation flow for the missing object.
- `Import` is primary only when bulk import is the expected starting path.
- `Configure` opens the required setup screen, not a generic settings page.
- `Connect integration` opens the integration connection flow.
- These actions must return or refresh the original context after completion when appropriate.
- Do not show downstream create actions when prerequisite setup is missing.
- If the action opens a dialog, dialog rules apply.
- If the setup is long or shareable, use route navigation.

Examples:

```text
No projects yet -> Create project
No users yet in enterprise import flow -> Import users
Billing not configured -> Configure billing
GitHub not connected -> Connect GitHub
```

### Go back and navigation actions

Rules:

- `Go back` is useful for not-found, forbidden, deleted resource, or expired deep link.
- Prefer specific labels when destination is clear: `Go back to users`, `Back to projects`.
- Avoid browser-history-only back when a canonical list route is known.
- Navigation action should not discard unsaved user input without confirmation.
- Page-level StateView can show navigation action; section-level StateView usually should not.

### View details, docs, and task actions

Rules:

- `View details` is for technical/support details, failed import rows, or task error report.
- `View docs` is secondary and only useful when docs can help the user recover.
- `View task` opens the task/import/sync progress page or drawer.
- Do not use docs as the primary recovery when a direct product action exists.
- Do not show `View details` if it only exposes raw internal errors.

### Action count and layout

Rules:

- 0 actions: acceptable for read-only local empty or permission states with no workflow.
- 1 action: default for most StateViews.
- 2 actions: allowed when there is one clear primary and one useful secondary.
- More than 2 actions: move extras to secondary help text, docs, or a menu only if truly needed.
- Primary action should use primary button styling.
- Secondary action should use secondary/ghost/link styling depending on visual weight.
- Do not use two primary buttons.

Button order:

- Desktop: secondary on the left, primary on the right.
- Mobile: stack vertically when width is limited, primary first or visually strongest.
- In centered StateView, actions are grouped under description.
- In dialog StateView, actions may appear in footer when they are dialog-level actions.
- In table/list body StateView, actions stay inside the empty/error body unless they are global list actions.

Examples:

```text
First load failed: Retry
Filter empty: Clear filters
Initial empty with permission: Create project
Initial empty without permission: no primary action or Contact admin
Not found from detail page: Go back to list
Sync pending: View task + Refresh
Config missing: Configure billing + View docs
```

---

## 8. Content Structure

StateView uses a consistent structure.

```text
Icon / Illustration
Title
Description
Actions
Secondary help
```

Rules:

- Icon is optional but recommended for quick recognition.
- B2B products usually use simple icons, not large decorative illustrations.
- Title should be short and specific.
- Description explains cause or next step.
- Description should not blame the user.
- Actions should be concrete verbs.
- Secondary help can link to docs or admin contact when useful.

Length:

- Title: one short sentence or phrase.
- Description: usually 1-2 lines.
- Actions: 0-2 visible actions.

---

## 9. Placement And Layout

Placement depends on scope.

| Scope | Placement |
|---|---|
| page-level | content area center or slightly above center |
| list/table | list body center; keep header/filter when useful |
| card list | grid area center |
| dialog | dialog body center; header remains visible |
| field/options | inside dropdown or below field |
| sidebar/small panel | compact inline state |

Rules:

- Page StateView should not cover global navigation.
- Table empty should usually preserve table header.
- Filter empty should preserve FilterBar and active filter chips.
- Dialog StateView should not remove the required dialog header.
- Avoid oversized empty illustrations in dense 2B pages.
- Mobile StateView should use shorter text and vertical actions.

---

## 10. Forbidden

Do not:

- Use one generic empty state for all causes.
- Clear old data during refresh failure if old data is still valid.
- Show a full-page error for a field-level failure.
- Use toast as the only validation error.
- Hide recovery controls when they are needed.
- Show create/configure actions to users without permission.
- Use large marketing-style empty illustrations in dense console pages.
- Show loading states that cause layout jump.

---

## 11. Data Contract

StateView should be driven by explicit data status.

Recommended status:

```ts
type DataStatus =
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'success'
  | 'empty'
  | 'filter-empty'
  | 'search-empty'
  | 'error'
  | 'forbidden'
  | 'not-found'
  | 'offline';
```

Rules:

- `loading` means no usable data yet.
- `refreshing` means old data exists and is still shown.
- `empty` means request succeeded but there is no data.
- `filter-empty` means filters/search caused no results.
- `error` should include retry availability and message.
- `forbidden` should not be confused with empty.
- `not-found` should be used for missing/deleted resources.
- Retry handler should be passed explicitly.

Example:

```ts
type StateViewModel = {
  status: DataStatus;
  title?: string;
  description?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  retry?: () => void;
};
```

---

## 12. AI Review Checklist

Before accepting AI-generated state code, verify:

- StateView is used only when normal content cannot render.
- Loading distinguishes first load from refresh.
- Refresh keeps old data when possible.
- Refresh failure does not replace usable old data with error/empty state.
- Button pending prevents duplicate action.
- Loading blocks only unsafe or conflicting interactions.
- Loading flicker is controlled for fast requests.
- Skeleton matches final layout and does not shift content.
- Table/card/form/dialog skeletons match their final layout patterns.
- Infinite scroll uses bottom loading instead of replacing the whole list.
- Empty state cause is specific: initial, filter, search, config, integration, permission, local, async-pending.
- Empty decision order does not misclassify error/forbidden/setup/filter/search as initial empty.
- Filter/search empty provides clear recovery.
- Filter/search empty preserves FilterBar, active chips, and query context.
- Initial empty shows create/import/connect only when the user has permission.
- Config/integration empty explains missing setup and does not show downstream create actions too early.
- Permission empty does not imply data does not exist.
- Local empty stays compact and keeps parent context visible.
- Error state keeps old data when available.
- Error UI is scoped to failed area: page, list, section, dialog, form, field, or action.
- First load/list load failure uses StateView instead of toast-only feedback.
- Refresh/pagination/action failure keeps usable old content when possible.
- First load failure has Retry.
- Form validation errors are inline, not only toast.
- Server field errors map back to fields when possible.
- Form-level submit errors preserve dirty input and appear near submit area.
- Action/optimistic failures rollback or restore local state.
- Toast is used only for temporary feedback.
- Toasts are deduplicated for repeated identical errors.
- Toast actions are lightweight and never the only recovery for page-level failure.
- Toast placement/duration follows severity and does not cover primary mobile actions.
- Actions are limited to 0-2 and match user permission.
- Primary action directly resolves or advances the current state.
- StateView does not show actions the user cannot perform.
- Retry repeats the failed request with the same route/query/filter/page context.
- Clear filters/search resets query state correctly and clears selection/page when needed.
- Create/import/configure/connect actions are shown only for the correct empty/setup state.
- Go back uses a canonical destination when available, not only browser history.
- View docs/details/task actions are secondary unless they are the clearest recovery path.
- No StateView uses two primary buttons.
- Page/list/dialog/field scopes are not mixed.
- Table empty preserves header/filter when useful.
- Permission and not-found states are not mislabeled as generic empty.
- Mobile layout uses shorter copy and stacked actions when needed.
