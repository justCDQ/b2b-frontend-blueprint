# User Management Page Demo

## Page Goal

User Management is the first reference CRUD page for the B2B console template.

It demonstrates how a standard enterprise list page combines:

- PageHeader.
- FilterBar.
- Table.
- Row actions.
- Batch actions.
- Dialog form.
- ConfirmDialog.
- Permission-disabled actions.
- Loading, empty, error, pending, and success states.

This page should feel like an operational console screen, not a marketing page or a visual showcase.

## Scenario

Administrators use this page to manage organization users.

Common tasks:

- Search users.
- Filter users by role, status, team, and creation time.
- View user details.
- Create a user.
- Edit user profile and role.
- Enable or disable a user.
- Reset user password.
- Delete a user.
- Select multiple users for batch operations.
- Export selected or filtered users.

## Related Rules

Load these rules when generating or reviewing this page:

- [All AI Rules Entry](../../component-rules/_ai-bundles/all-ai-rules.md)
- [List CRUD AI Bundle](../../component-rules/_ai-bundles/list-crud-ai-bundle.md)
- [List Page AI Rules](../../component-rules/list-page/list-page-ai-rules.md)
- [FilterBar AI Rules](../../component-rules/filter-bar/filter-bar-ai-rules.md)
- [Table AI Rules](../../component-rules/table/table-ai-rules.md)
- [Action System AI Rules](../../component-rules/action-system/action-system-ai-rules.md)
- [Form AI Rules](../../component-rules/form/form-ai-rules.md)
- [Dialog AI Rules](../../component-rules/dialog/dialog-ai-rules.md)
- [StatusBadge / Tag AI Rules](../../component-rules/status-badge/status-badge-ai-rules.md)
- [StateView AI Rules](../../component-rules/state-view/state-view-ai-rules.md)
- [Feedback / Toast AI Rules](../../component-rules/feedback-toast/feedback-toast-ai-rules.md)

## User Roles

Use these roles for the demo:

| Role | Description |
|---|---|
| `owner` | Full access to all user management actions. |
| `admin` | Can create, edit, enable, disable, reset password, and export users. Cannot delete owners. |
| `operator` | Can view and export users. Cannot create, edit, disable, reset password, or delete. |
| `viewer` | Can only view users. |

## Permission Matrix

| Action | owner | admin | operator | viewer |
|---|---:|---:|---:|---:|
| View list | yes | yes | yes | yes |
| View detail | yes | yes | yes | yes |
| Create user | yes | yes | no | no |
| Edit user | yes | yes | no | no |
| Enable user | yes | yes | no | no |
| Disable user | yes | yes | no | no |
| Reset password | yes | yes | no | no |
| Export users | yes | yes | yes | no |
| Delete user | yes | limited | no | no |

Rules:

- Permission-denied actions remain visible when they are important for user understanding.
- Disabled permission actions must show a tooltip explaining the reason.
- Hide actions only when showing them would add noise and the user has no realistic path to permission.
- `admin` cannot delete `owner` users.
- A user cannot disable or delete their own account from the list.

## Layout Structure

Use this page structure:

```text
PageShell
└── PageHeader
    ├── Title: Users
    ├── Description: Manage organization members, roles, and access status.
    └── Actions
        ├── Refresh
        ├── Export
        └── Create User

Content
├── FilterBar
├── BatchActionBar
└── Table
    ├── Selection column
    ├── Data columns
    └── Operation column
```

The page should not use card containers around the entire table section. Keep the list surface compact and scannable.

## PageHeader

Title:

```text
Users
```

Description:

```text
Manage organization members, roles, and access status.
```

Actions:

| Action | Type | Scope | Rule |
|---|---|---|---|
| Refresh | icon button | page | Always available unless page is already refreshing. |
| Export | secondary button | filtered result | Disabled when no export permission. |
| Create User | primary button | page | Opens create dialog. Disabled when no create permission. |

Refresh rules:

- Refresh keeps current filters, sorting, pagination, and URL query.
- Refresh does not clear selected rows unless returned data identity changes.
- Refresh enters pending state and prevents duplicate refresh clicks.

## FilterBar

Default visible filters:

| Filter | Type | Behavior |
|---|---|---|
| Keyword | search input | Debounced query. Searches name, email, and phone. |
| Role | select | Immediate query after selection. |
| Status | select | Immediate query after selection. |
| Created time | date range | Query after complete range selection. |

Collapsed advanced filters:

| Filter | Type | Behavior |
|---|---|---|
| Team | select or tree select | Query after selection. |
| Last active time | date range | Query after complete range selection. |
| MFA enabled | segmented control or radio | Query after selection. |
| Invite source | select | Query after selection. |

FilterBar action rules:

- Refresh is always present.
- Reset appears when any filter differs from default.
- Advanced filter toggle appears when advanced filters exist.
- Batch actions do not live inside FilterBar; they live in BatchActionBar.
- Keyword input uses debounce.
- Select and status filters update immediately.
- Multi-select filters query after confirm.
- Changing filters resets `pageNum` to `1`.
- Changing filters clears or reconciles selected rows.
- Query state must be recoverable from URL.

## Table Columns

Use table layout, not card layout, for this page.

Columns:

| Column | Content | Notes |
|---|---|---|
| Selection | Checkbox | Disabled for rows that cannot be selected. |
| User | Avatar, name, email | Name is primary. Email is secondary. |
| Role | Tag | Role names should not wrap by default. |
| Status | StatusBadge | Active, Invited, Disabled, Locked. |
| Team | Text or link | Show `-` when empty. |
| MFA | StatusBadge or text | Enabled, Disabled. |
| Last active | Date time | Use relative or absolute format consistently. |
| Created at | Date time | Sortable. |
| Operations | Icon buttons + More menu | Sticky right when horizontal scroll exists. |

Table style rules:

- Header typography, body typography, spacing, borders, and hover states follow table rules.
- Keep rows compact but readable.
- Rich cell content such as badges, links, and secondary text must remain aligned.
- Long text truncates with tooltip when needed.
- Empty cell values use a consistent placeholder.
- Row hover may indicate clickability only when row detail navigation is enabled.

## Row Detail Behavior

Clicking a row opens user detail only when the page has meaningful detail content.

For this demo:

- Row click opens a user detail drawer or detail page depending on implementation phase.
- MVP documentation may specify drawer first.
- Later full demo app may use route detail page if the user detail includes audit logs, sessions, permissions, and security settings.

Do not trigger row detail when clicking:

- Selection checkbox.
- Row action icon.
- More menu.
- Link inside a cell.
- Switch or inline control.

## Row Actions

Expose at most three common row actions as icon buttons:

| Action | Placement | Behavior |
|---|---|---|
| Edit | visible icon | Opens edit user dialog. |
| Reset password | visible icon | Opens reset password ConfirmDialog. |
| More | visible icon | Opens dropdown menu. |

Move less common actions into More:

- View detail.
- Enable.
- Disable.
- Delete.
- Copy user ID.

Action rules:

- Every icon button has tooltip.
- Icons must be semantic and not duplicate conflicting meanings.
- Dropdown menu items use icon + text with 8px gap.
- Dangerous menu items use danger color for both icon and text.
- Disabled menu items remain visible when they explain permissions or invalid state.
- Disabled menu items show reason with tooltip or menu item description.
- Row mutation actions enter row-level pending state.
- Pending state prevents duplicate clicks.

## BatchActionBar

Show BatchActionBar only when one or more rows are selected.

Content:

```text
{n} selected
Enable
Disable
Export
Delete
Clear selection
```

Rules:

- Batch actions operate only on selected row IDs.
- Batch actions must validate whether all selected rows are eligible.
- If some rows are ineligible, either disable the action with explanation or show a confirmation that lists skipped rows.
- Dangerous batch actions use ConfirmDialog.
- Batch pending state disables related actions and prevents duplicate clicks.
- Batch success reconciles table data and selected rows.
- Batch failure shows scoped error and keeps recoverable selection when possible.

## Dialogs

### Create User Dialog

Use Dialog.

Suggested size:

- `m` for basic account creation.
- `l` if role, team, invite, and advanced security options are included.

Fields:

| Field | Type | Rule |
|---|---|---|
| Name | input | Required. |
| Email | input | Required, email format. |
| Phone | input | Optional, phone format when filled. |
| Role | select | Required. |
| Team | select or tree select | Optional or required based on product setting. |
| Send invite email | switch | Default on. |
| Note | textarea | Optional, max length. |

Submission:

- Validate before submit.
- Submit button enters pending state.
- Prevent duplicate submit.
- On success, close dialog, refresh list, and show success toast.
- On validation error, show field-level errors.
- On server error, show form-level error and keep values.

### Edit User Dialog

Use Dialog.

Rules:

- Load current user data before editing.
- Show loading state inside dialog while data loads.
- Keep header and footer visible if form scrolls.
- Disable role changes when current operator lacks permission.
- Confirm before close only when there are unsaved changes.

### Reset Password ConfirmDialog

Use ConfirmDialog.

Title example:

```text
Reset password?
```

Description example:

```text
Reset password for "小明"? The user will need to sign in with the new temporary password.
```

Rules:

- Must name the target user.
- Must describe the consequence.
- Confirm button enters pending state.
- Success returns generated temporary password only if the product supports showing it securely.

### Delete User ConfirmDialog

Use ConfirmDialog for delete from row action or batch action.

Title example:

```text
Delete user?
```

Single delete description:

```text
Delete "小明"? This action cannot be undone.
```

Batch delete description:

```text
Delete 8 selected users? This action cannot be undone.
```

Rules:

- Do not use vague text such as `Confirm delete?`.
- Always name the target user or selected count.
- Always state that deletion cannot be undone.
- Delete button uses danger style.
- Confirm button enters pending state.

## Data Contract

### Query Params

Use URL-recoverable query state:

```ts
type UserListQuery = {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  role?: "owner" | "admin" | "operator" | "viewer";
  status?: "active" | "invited" | "disabled" | "locked";
  teamId?: string;
  createdFrom?: string;
  createdTo?: string;
  lastActiveFrom?: string;
  lastActiveTo?: string;
  mfaEnabled?: boolean;
  sortBy?: "createdAt" | "lastActiveAt" | "name";
  sortOrder?: "asc" | "desc";
};
```

### Response

Traditional pagination is the default:

```ts
type UserListResponse = {
  list: UserRow[];
  pageNum: number;
  pageSize: number;
  total: number;
};
```

User row:

```ts
type UserRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "owner" | "admin" | "operator" | "viewer";
  status: "active" | "invited" | "disabled" | "locked";
  team?: {
    id: string;
    name: string;
  };
  mfaEnabled: boolean;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
  permissions: {
    canViewDetail: boolean;
    canEdit: boolean;
    canEnable: boolean;
    canDisable: boolean;
    canResetPassword: boolean;
    canDelete: boolean;
    canSelect: boolean;
  };
  disabledReasons?: Partial<Record<
    "select" | "edit" | "enable" | "disable" | "resetPassword" | "delete",
    string
  >>;
};
```

Rules:

- Row-level permissions should come from data or be derived from a stable permission contract.
- UI must not infer sensitive permissions from visual state only.
- Disabled reasons should be available for disabled actions.
- Selection uses stable `id`, not row index.

## Pagination

Default:

- Use traditional pagination with `pageNum`, `pageSize`, and `total`.
- Default `pageSize` may be `20`.
- Supported sizes may include `20`, `50`, and `100`.

Rules:

- Filter changes reset to page 1.
- Sort changes reset to page 1 unless product requires current page retention.
- Refresh keeps the current page when still valid.
- If current page becomes invalid after deletion, move to the nearest valid page.
- Use virtual scroll only when one page contains 50+ rows and rendering becomes expensive.

## Request Race And Refresh Priority

Rules:

- Every list request has a request identity.
- Only the latest request may update table data.
- Filter/search/sort/page changes cancel or ignore older requests.
- Manual refresh has higher priority than stale automatic requests.
- Mutation success should refresh affected data or patch the affected row predictably.
- Do not let an older request overwrite a newer mutation result.

Recommended priority:

1. Mutation result.
2. Manual refresh after mutation.
3. User-triggered query change.
4. Background refresh.

## State Handling

### Page Initial Loading

Use table or page section loading state.

Rules:

- Keep PageHeader visible.
- Keep FilterBar visible when possible.
- Show table skeleton or loading rows.

### Empty State

Use different empty copy for different causes:

No data:

```text
No users yet
```

No search results:

```text
No users match the current filters
```

Rules:

- Empty due to filters should offer reset filters.
- Empty due to no data may offer create user when permission allows.
- Empty state should live in the table/list area, not replace the entire page shell.

### Error State

Use scoped StateView inside the table area.

Rules:

- Provide retry.
- Keep filters visible.
- Blocking fetch errors are not toast-only.
- Toast may accompany retry success or mutation success.

### Pending State

Use the smallest meaningful pending scope:

- Refresh pending: refresh button.
- Row mutation pending: target row action.
- Batch mutation pending: batch action bar.
- Dialog submit pending: submit button and form-level busy state.

### Disabled State

Disabled scenarios:

- Row cannot be selected.
- Action is unavailable due to permission.
- Action is unavailable due to current user status.
- Action is pending.
- Action would affect the current signed-in user in an unsafe way.

Rules:

- Disabled permission actions explain the reason.
- Pending actions should show loading or a stable pending state.
- Disabled controls must remain visually consistent with the table and action system.

## StatusBadge And Tag Rules

Status values:

| Status | Tone | Click behavior |
|---|---|---|
| Active | success | Not clickable by default. |
| Invited | neutral or warning | May show invite status detail. |
| Disabled | neutral or warning | May show disabled reason. |
| Locked | error | Clickable when lock reason exists. |

Rules:

- Status text should be short and not wrap.
- Long status or reason text uses tooltip.
- Error status may open dialog with reason details when the reason is important.
- Badge colors must work in light and dark mode.

## Responsive Behavior

Desktop:

- Use full table.
- Keep operation column visible or sticky when horizontal scroll exists.
- Keep FilterBar collapsed by default when many filters exist.

Tablet:

- Keep table if key columns remain readable.
- Allow horizontal scroll for table.
- Reduce visible filters to keyword, status, and role.
- Move lower-priority page actions into More menu if needed.

Mobile:

- Prefer simplified list or card list only if table becomes unusable.
- Preserve query state when switching layout.
- Use bottom drawer for create/edit if dialog size is unsuitable.
- Keep primary action reachable.
- Do not reset filters, pagination, or selection solely because viewport changed.

## Accessibility

Rules:

- Icon-only actions must have accessible names.
- Tooltip cannot be the only accessible label.
- Row selection checkbox must have row-specific label.
- ConfirmDialog must trap focus and return focus after close.
- Disabled reason should be available to keyboard users.
- Table headers should expose sorting state.
- Batch selection count should be announced or visible.

## AI Generation Requirements

When generating this page, AI must:

- Use a 2B console layout.
- Use table as the primary list representation.
- Include PageHeader, FilterBar, BatchActionBar, Table, Dialog, ConfirmDialog, StateView, Toast, StatusBadge, and Tooltip.
- Include URL-recoverable query state.
- Include request race protection.
- Include row-level permissions and disabled reasons.
- Include loading, empty, error, pending, disabled, and selected states.
- Include dangerous action confirmation.
- Prevent duplicate mutation actions.
- Avoid marketing hero layout.
- Avoid toast-only blocking errors.
- Avoid hiding permission behavior in implementation details.

## Acceptance Criteria

The page is acceptable when:

- A user can understand page purpose from PageHeader.
- High-frequency filters are visible and advanced filters are collapsed.
- Table columns are compact, aligned, and readable.
- Row actions expose no more than three visible operation buttons.
- More menu contains overflow actions with icon and text.
- Dangerous actions use ConfirmDialog with specific target and consequence.
- Batch actions appear only after selection.
- Selection state behaves correctly across filtering, pagination, refresh, and mutation.
- Disabled actions explain permission or state reasons.
- Loading, empty, error, pending, and success states are present and scoped.
- URL query can restore the list state.
- The page remains usable on desktop, tablet, and mobile.
