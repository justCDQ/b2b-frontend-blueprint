# Project Settings Detail Page Demo

## Page Goal

Project Settings Detail demonstrates a resource detail and configuration page in a B2B console.

Unlike list pages or import task pages, this page focuses on long-lived management around one resource:

- View resource information.
- Edit configuration.
- Manage members and permissions.
- Review security settings.
- Inspect related data.
- Review Activity Log / Audit Log.
- Run enable, disable, archive, and delete actions.

Use this page to define how Detail Page, Tabs, form edit mode, Drawer, ConfirmDialog, and Audit Log work together.

## Scenario

Administrators open a project or workspace detail page to configure and maintain it.

Common tasks:

- View project status and basic information.
- Edit project name, description, and owner.
- Configure notifications, access policy, and data retention.
- Manage project members.
- View integration settings.
- Review project activity.
- Review audit logs.
- Disable, archive, or delete project.

## Related Rules

Load these rules when generating or reviewing this page:

- [All AI Rules Entry](../../component-rules/_ai-bundles/all-ai-rules.md)
- [Navigation Layout AI Bundle](../../component-rules/_ai-bundles/navigation-layout-ai-bundle.md)
- [Form Overlay AI Bundle](../../component-rules/_ai-bundles/form-overlay-ai-bundle.md)
- [Detail Page AI Rules](../../component-rules/detail-page/detail-page-ai-rules.md)
- [Tabs / Navigation AI Rules](../../component-rules/tabs-navigation/tabs-navigation-ai-rules.md)
- [Form AI Rules](../../component-rules/form/form-ai-rules.md)
- [Drawer / Side Panel AI Rules](../../component-rules/drawer-side-panel/drawer-side-panel-ai-rules.md)
- [Dialog AI Rules](../../component-rules/dialog/dialog-ai-rules.md)
- [Action System AI Rules](../../component-rules/action-system/action-system-ai-rules.md)
- [Timeline / Activity Log AI Rules](../../component-rules/timeline-activity-log/timeline-activity-log-ai-rules.md)
- [StatusBadge / Tag AI Rules](../../component-rules/status-badge/status-badge-ai-rules.md)

## Page Boundary

Use Detail Page instead of Dialog or Drawer because:

- The page needs a URL that can refresh, share, and bookmark.
- Content contains multiple sections and many settings.
- Users run multiple actions around the same resource.
- Related members, permissions, and logs are present.
- The page is a primary work surface.

Do not use Dialog when:

- Content is large.
- Multiple sections exist.
- Route state matters.
- Users may stay for a long time.

Use Drawer inside the detail page for:

- Member detail.
- Quick local configuration edit.
- Secondary resource preview without leaving the detail page.

## User Roles

Use these roles for the demo:

| Role | Description |
|---|---|
| `owner` | Full project management access. |
| `admin` | Can edit settings, manage members, and view logs. Cannot delete owner-managed projects. |
| `operator` | Can view project and edit limited non-sensitive settings. |
| `viewer` | Can only view basic project information and visible logs. |

## Permission Matrix

| Action | owner | admin | operator | viewer |
|---|---:|---:|---:|---:|
| View detail | yes | yes | yes | yes |
| Edit basic info | yes | yes | partial | no |
| Edit security settings | yes | yes | no | no |
| Manage members | yes | yes | no | no |
| View Activity Log | yes | yes | yes | yes |
| View Audit Log | yes | yes | no | no |
| Disable project | yes | yes | no | no |
| Archive project | yes | yes | no | no |
| Delete project | yes | limited | no | no |

Rules:

- Permission-denied fields use disabled or readonly state and explain the reason.
- Permission-denied actions remain disabled and explain the reason with tooltip or text.
- Sensitive settings should not disappear unless visibility itself is a security risk.
- Dangerous actions must use ConfirmDialog.

## Layout Structure

Use this page structure:

```text
PageShell
└── DetailPage
    ├── Breadcrumb / Back
    ├── PageHeader
    │   ├── Title: project name
    │   ├── Status: Active / Disabled / Archived
    │   ├── Metadata: project ID, owner, created time
    │   └── Actions: Refresh, Edit, More
    ├── Summary
    └── Tabs / Route Navigation
        ├── Overview
        ├── Settings
        ├── Members
        ├── Security
        └── Activity
```

Rules:

- Resource identity must be visible above the fold.
- Status badge stays near the title.
- Page-level actions live in PageHeader.
- Section content lives in Tabs or Route Navigation.
- Do not turn the detail page into unrelated cards.
- Prefer clear sections over nested cards.

## Route And State

Recommended routes:

```text
/projects/:projectId
/projects/:projectId/settings
/projects/:projectId/members
/projects/:projectId/security
/projects/:projectId/activity
```

Rules:

- `projectId` belongs in path.
- Current tab may use path segment or query, but route segment is recommended for complex detail pages.
- Refresh preserves current tab.
- Returning to parent list should restore list filters, pagination, and scroll when possible.
- Invalid tab falls back to Overview.
- Missing resource shows Not Found StateView.
- Forbidden access shows Forbidden StateView instead of pretending the resource does not exist.

## PageHeader

Title:

```text
Project name
```

Status:

| Status | Meaning | Behavior |
|---|---|---|
| Active | success | Not clickable by default. |
| Disabled | warning | May open disabled reason. |
| Archived | neutral | May open archive information. |
| Error | error | May open error detail. |

Metadata:

- Project ID.
- Owner.
- Created time.
- Last updated time.

Actions:

| Action | Type | Scope | Rule |
|---|---|---|---|
| Refresh | icon button | page | Preserve current tab and local state. |
| Edit | primary button | detail | Enters edit mode or opens edit Drawer. |
| More | icon button | page | Shows disable, archive, delete, copy ID. |

Rules:

- PageHeader actions affect the whole project.
- Section actions affect only the current section.
- Do not place resource-level dangerous actions inside ordinary sections.
- Delete, archive, and disable are dangerous or high-risk actions and need confirmation.

## Summary

Summary shows the most important facts before users enter deep sections.

Content:

- Current status.
- Owner.
- Member count.
- Last activity time.
- Key configuration status.
- Latest sync status.

Rules:

- Summary stays compact.
- Summary does not replace detailed sections.
- Abnormal summary states may link to the corresponding tab.
- Summary loading failure should not break the whole detail page.

## Tabs / Route Navigation

Recommended sections:

| Section | Content | Rule |
|---|---|---|
| Overview | Basic info, key metrics, recent activity | Default entry. |
| Settings | General settings, notification settings, retention policy | Supports view/edit mode. |
| Members | Member list, roles, invites, removals | Uses related table. |
| Security | Access policy, MFA, API token, sensitive settings | Requires stronger permissions. |
| Activity | Activity Log / Audit Log | Uses log rules. |

Rules:

- Use Route Navigation if tabs need shareable and refreshable state.
- Use Tabs only for lightweight same-page panels.
- Page-level L1 sections use `pill` or route nav style.
- Do not create many tiny tabs.
- Do not use Tabs for filtering conditions.

## Overview

Overview helps users understand current project state quickly.

Content:

- Basic information.
- Current status.
- Owner.
- Member count.
- Recent activity.
- Recent error or abnormal state.
- Key setting summary.

Rules:

- Overview is mostly readonly.
- Keep only high-frequency actions.
- Complex editing goes to Settings or opens local Drawer.
- Abnormal states need reachable recovery entry.

## Settings

Settings manages project configuration.

Fields:

| Field | Type | Rule |
|---|---|---|
| Project name | input | Required. |
| Description | textarea | Optional, max length. |
| Owner | select | Required, permission-gated. |
| Notification enabled | switch | Use either instant update or form save consistently. |
| Data retention | select | Sensitive setting, permission-gated. |
| Default visibility | radio or segmented control | Affects access policy. |

Edit mode:

- Use Dialog or Drawer for few fields.
- Use page edit mode for many fields across sections.
- This demo recommends page edit mode inside Settings tab.

Page edit mode rules:

- View mode and edit mode are visually distinct.
- Edit mode has Save and Cancel.
- Unsaved changes require confirmation before leaving.
- Save pending prevents duplicate submit.
- Save failure preserves input.
- Server field errors map to fields when possible.
- Permission-denied fields remain disabled or readonly with a reason.

## Members

Members manages project users.

Structure:

```text
Section Header
├── Search / Role Filter
├── Invite Member
└── Members Table
```

Table columns:

- Member.
- Role.
- Status.
- Last access.
- Joined time.
- Operations.

Actions:

- Invite member.
- Change role.
- Remove member.
- View member detail.

Rules:

- Members is a related table with its own loading, empty, and error states.
- Member search and filters are section local state.
- Role changes may use Dialog or inline select, but save strategy must be clear.
- Remove member is dangerous and must use ConfirmDialog.
- Member detail can use Drawer to preserve current project context.

## Security

Security manages sensitive settings.

Content:

- MFA requirement.
- IP allowlist.
- API token.
- Webhook secret.
- Data access policy.

Rules:

- Sensitive values are not fully visible by default.
- Copy token, reset secret, and delete token require permission checks.
- Reset secret is high-risk and must use ConfirmDialog.
- Users without permission see readonly or permission state.
- Security save failure appears inside the section, not toast-only.

## Activity / Audit Log

Activity shows project operations.

Content:

- Actor.
- Action type.
- Target.
- Time.
- Change summary.
- Result.

Example:

```text
小明 changed the project visibility from Private to Organization.
```

Rules:

- Activity Log is reverse chronological.
- Audit Log is stricter than Activity Log and keeps key fields and result.
- Log list has pagination or load more.
- Log loading failure affects only the log section.
- Sensitive logs require permission checks.

## Drawer Usage

Use Drawer for:

- Member detail.
- API token usage records.
- Log item detail.
- Single local setting edit.

Rules:

- Drawer opens from the right by default.
- Default width is 70%.
- If content cannot fill 70%, prefer Dialog.
- For nested drawers, the current level may become 100%, and the next level uses 70%.
- Closing Drawer preserves the current tab.

## ConfirmDialog

### Disable Project

Title example:

```text
Disable project?
```

Description example:

```text
Disable "Project A"? Members will no longer be able to access this project.
```

### Archive Project

Title example:

```text
Archive project?
```

Description example:

```text
Archive "Project A"? The project will become readonly after archiving.
```

### Delete Project

Title example:

```text
Delete project?
```

Description example:

```text
Delete "Project A"? Project data cannot be recovered after deletion.
```

Rules:

- ConfirmDialog must name the target object.
- It must describe the consequence.
- Delete action uses danger style.
- Confirm button enters pending state.
- After delete succeeds, navigate back to project list or a safe parent page.

## Data Contract

### Route Params

```ts
type ProjectDetailRouteParams = {
  projectId: string;
  section?: "overview" | "settings" | "members" | "security" | "activity";
};
```

### Project Detail

```ts
type ProjectDetail = {
  id: string;
  name: string;
  description?: string;
  status: "active" | "disabled" | "archived" | "error";
  owner: {
    id: string;
    name: string;
  };
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
  settings: {
    notificationEnabled: boolean;
    dataRetentionDays: number;
    visibility: "private" | "organization";
  };
  permissions: {
    canEditBasic: boolean;
    canEditSettings: boolean;
    canManageMembers: boolean;
    canViewSecurity: boolean;
    canEditSecurity: boolean;
    canViewAuditLog: boolean;
    canDisable: boolean;
    canArchive: boolean;
    canDelete: boolean;
  };
  disabledReasons?: Partial<Record<
    "editBasic" | "editSettings" | "manageMembers" | "viewSecurity" | "editSecurity" | "viewAuditLog" | "disable" | "archive" | "delete",
    string
  >>;
};
```

Rules:

- Permissions and disabled reasons belong in the data contract.
- Do not hardcode permissions only on the frontend.
- Section data may be lazy-loaded.
- Local section failures should not break the whole detail page.

## Requests And Refresh

Rules:

- Initial page load fetches basic detail data first.
- Members, Security, and Activity may lazy-load by tab.
- Switching tabs preserves loaded valid data.
- Manual refresh in a tab refreshes current tab and necessary summary.
- Page-level refresh may refresh key data but must not reset current tab.
- Mutation success patches the affected area first and refreshes detail when needed.
- Older requests must not overwrite newer save results.

Recommended priority:

1. Mutation result, such as save, delete, archive, disable.
2. Manual refresh.
3. Current tab request.
4. Background refresh.

## State Handling

### Initial Loading

- Use detail page skeleton.
- Keep PageShell and known structure visible.
- Use title skeleton if title is unknown.

### Not Found

When resource is missing:

```text
Project does not exist or has been deleted
```

Rules:

- Provide back to project list.
- Do not show a blank detail page.

### Forbidden

When access is forbidden:

```text
You do not have permission to view this project
```

Rules:

- Treat Forbidden and Not Found differently.
- Do not imply refresh can solve permission denial.

### Section Error

Rules:

- Members failure affects only Members.
- Security failure affects only Security.
- Activity failure affects only Activity.
- Use page-level error only when base detail cannot load.

### Empty

Examples:

- Members: no members.
- Activity: no activity records.
- Security token: no tokens.

Rules:

- Empty state stays inside the current section.
- Provide next action when permission allows.

## Responsive Behavior

Desktop:

- Use full Detail Page.
- Section navigation may be horizontal route nav or left sidebar.
- Forms may use two-column layout.
- Related table uses full table.

Tablet:

- Section navigation may scroll horizontally.
- Forms shift from two columns to one column or compact two columns.
- Related table may scroll horizontally.

Mobile:

- Section navigation uses horizontal pills.
- Forms use one column.
- Drawer may become bottom drawer or full-screen page.
- Dangerous actions stay in More or Danger Zone.
- Responsive changes must not lose current tab, edit values, or dirty state.

## Accessibility

Rules:

- Current tab / route section must be identifiable.
- Form fields need labels, errors, and disabled reasons.
- Icon-only actions need accessible names.
- ConfirmDialog needs focus trap.
- Save / Cancel in edit mode must be keyboard-accessible.
- Log list needs clear time and actor.

## AI Generation Requirements

When generating this page, AI must:

- Use B2B console detail layout.
- Use Detail Page, not Dialog, for the main content.
- Include PageHeader, Summary, and Tabs / Route Navigation.
- Include at least Overview, Settings, Members, Security, and Activity sections.
- Settings supports view and edit modes.
- Members uses related table with local states.
- Security handles permissions and sensitive fields.
- Activity uses Activity Log / Audit Log pattern.
- Resource-level dangerous actions use ConfirmDialog.
- Local detail or secondary resource uses Drawer.
- Include loading, empty, error, forbidden, not found, pending, and disabled states.
- Save and dangerous actions must prevent duplicate clicks.
- Responsive changes must preserve current tab and unsaved input.

## Acceptance Criteria

The page is acceptable when:

- Users can identify current project, status, and key actions above the fold.
- Page has recoverable and shareable URL.
- Overview, Settings, Members, Security, and Activity boundaries are clear.
- Settings view/edit mode is clear and save failure preserves input.
- Members behaves as related table with its own states and actions.
- Security has permission and display strategy for sensitive fields.
- Activity / Audit Log clearly records actor, time, target, and result.
- Drawer is used only for secondary detail or local tasks.
- Delete, archive, and disable use specific ConfirmDialog.
- Not Found, Forbidden, and Section Error are handled differently.
- Core viewing and configuration tasks work on desktop, tablet, and mobile.

