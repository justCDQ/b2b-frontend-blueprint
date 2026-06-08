# Import Records Page Demo

## Page Goal

Import Records demonstrates an asynchronous task page in a B2B console.

Unlike a standard CRUD list, this page focuses on a long-running workflow:

- Upload file.
- Map fields.
- Validate data.
- Confirm import.
- Track task progress.
- Handle failed rows.
- Review activity logs.

Use this page to define reusable rules for upload, import, async processing, and failure recovery.

## Scenario

Operators or administrators import customer, user, product, or configuration data in bulk.

Common tasks:

- Download import template.
- Upload import file.
- Preview file content.
- Map fields.
- Validate data.
- Confirm import.
- Track import progress.
- Download failed rows.
- Retry failed rows.
- Cancel unfinished task.
- Review activity log.

## Related Rules

Load these rules when generating or reviewing this page:

- [All AI Rules Entry](../../component-rules/_ai-bundles/all-ai-rules.md)
- [Import Workflow AI Bundle](../../component-rules/_ai-bundles/import-workflow-ai-bundle.md)
- [Upload / Import Workflow AI Rules](../../component-rules/upload-import-workflow/upload-import-workflow-ai-rules.md)
- [Wizard / Stepper AI Rules](../../component-rules/wizard-stepper/wizard-stepper-ai-rules.md)
- [Table AI Rules](../../component-rules/table/table-ai-rules.md)
- [StateView AI Rules](../../component-rules/state-view/state-view-ai-rules.md)
- [Feedback / Toast AI Rules](../../component-rules/feedback-toast/feedback-toast-ai-rules.md)
- [Timeline / Activity Log AI Rules](../../component-rules/timeline-activity-log/timeline-activity-log-ai-rules.md)
- [Dialog AI Rules](../../component-rules/dialog/dialog-ai-rules.md)
- [Action System AI Rules](../../component-rules/action-system/action-system-ai-rules.md)

## Page Boundary

The page has two major areas:

1. **Import entry and workflow**: creates a new import task.
2. **Import task list**: tracks historical tasks, progress, and failure recovery.

Do not reduce the full import workflow to a simple upload button when field mapping, validation, failed rows, or async processing exists.

## User Roles

Use these roles for the demo:

| Role | Description |
|---|---|
| `owner` | Full access to import, cancel, download, and view actions. |
| `admin` | Can import, cancel own tasks, download error files, and view all tasks. |
| `operator` | Can import and view own tasks. |
| `viewer` | Can only view task list. |

## Permission Matrix

| Action | owner | admin | operator | viewer |
|---|---:|---:|---:|---:|
| View task list | yes | yes | yes | yes |
| Download template | yes | yes | yes | no |
| Create import task | yes | yes | yes | no |
| Cancel task | yes | limited | limited | no |
| Download failed rows | yes | yes | own tasks only | no |
| Retry failed rows | yes | yes | own tasks only | no |
| View activity log | yes | yes | own tasks only | yes |

Rules:

- Permission-denied actions remain disabled with a reason.
- Cancel is valid only for `pending`, `validating`, and `importing`.
- Completed, failed, and cancelled tasks cannot be cancelled.
- Download failed rows is available only when `failedCount > 0`.
- Retry failed rows requires failed rows and import permission.

## Layout Structure

Use this page structure:

```text
PageShell
└── PageHeader
    ├── Title: Import Records
    ├── Description: Upload files, validate data, and track bulk import progress.
    └── Actions
        ├── Refresh
        ├── Download Template
        └── New Import

Content
├── State Summary
├── FilterBar
└── Task Table
    ├── Task information
    ├── Target type
    ├── Status
    ├── Progress
    ├── Success / failed counts
    ├── Creator
    ├── Created time
    └── Operations
```

Notes:

- The main page surface is the task list.
- New import uses Wizard / Stepper.
- Task detail may use Drawer or Detail Page.
- Failed reasons, validation results, and activity logs live in the detail surface.

## PageHeader

Title:

```text
Import Records
```

Description:

```text
Upload files, validate data, and track bulk import progress.
```

Actions:

| Action | Type | Scope | Rule |
|---|---|---|---|
| Refresh | icon button | page | Always present. Refreshes list and active task states. |
| Download Template | secondary button | page | Disabled without template download permission. |
| New Import | primary button | page | Opens import workflow. Disabled without import permission. |

Refresh rules:

- Refresh keeps current filters, pagination, and sorting.
- Refresh does not reset an open task detail.
- Active tasks may poll automatically, but manual refresh has higher priority.
- Refresh enters pending state and prevents duplicate clicks.

## State Summary

The page may show a compact status summary.

Example:

```text
12 imports today
2 in progress
1 partial success
3 failed
```

Rules:

- Summary stays compact.
- Summary supports scanning but does not replace the task table.
- Summary loading/error is independent from the task table.
- Summary error should not block the main table.

## FilterBar

Default visible filters:

| Filter | Type | Behavior |
|---|---|---|
| Keyword | search input | Debounced query. Searches file name, task ID, and creator. |
| Target type | select | Immediate query after selection. |
| Status | select | Immediate query after selection. |
| Created time | date range | Query after complete range selection. |

Collapsed advanced filters:

| Filter | Type | Behavior |
|---|---|---|
| Creator | select | Query after selection. |
| File type | select | Query after selection. |
| Has failed rows | segmented control or radio | Query after selection. |
| Source | select | Query after selection. |

FilterBar rules:

- Refresh is always present.
- Reset appears when filters differ from defaults.
- Filter changes reset `pageNum` to `1`.
- Keyword uses debounce.
- Status changes query immediately.
- Query state must be recoverable from URL.

## Task Table

Use table as the default layout.

Columns:

| Column | Content | Notes |
|---|---|---|
| Task | File name, task ID | File name is primary. Task ID is secondary. |
| Target type | Tag | Customer, user, product, config. |
| Status | StatusBadge | pending, validating, importing, success, partial_success, failed, cancelled. |
| Progress | progress or text | Active tasks show progress. Finished tasks show final state. |
| Counts | total, success, failed | Failed count may be clickable. |
| Creator | text | Use generic sample names such as `小明`. |
| Created at | date time | Sortable. |
| Finished at | date time | Empty placeholder when unfinished. |
| Operations | icon buttons + More menu | Sticky right when horizontal scroll exists. |

Status rules:

- `pending`: task created and waiting.
- `validating`: file and data are being validated.
- `importing`: import is running.
- `success`: all rows imported.
- `partial_success`: some rows failed.
- `failed`: task failed or all rows failed.
- `cancelled`: task was cancelled.

## Row Actions

Expose at most three common operations:

| Action | Placement | Behavior |
|---|---|---|
| View detail | visible icon | Opens task detail Drawer or Detail Page. |
| Download failed rows | visible icon | Enabled only when failed rows exist. |
| More | visible icon | Opens overflow actions. |

More contains:

- Retry failed rows.
- Cancel task.
- Copy task ID.
- View activity log.

Rules:

- Every icon button has tooltip.
- Download failed rows is disabled when no failed rows exist.
- Cancel task is dangerous and must use ConfirmDialog.
- Retry failed rows starts a new import workflow with failed file prefilled.
- Row pending affects only the current row.
- Row actions must not trigger row detail click.

## New Import Workflow

Use Wizard / Stepper.

Steps:

```text
1. Upload file
2. Map fields
3. Validate data
4. Confirm import
5. View result
```

Rules:

- Every step has a clear title and primary action.
- Completed steps may be revisited unless the import has started.
- Switching steps does not lose completed data.
- Closing the workflow with unsaved progress uses ConfirmDialog.
- After import starts, uploaded file and field mapping cannot be modified.

### Step 1: Upload File

Content:

- Download template entry.
- File upload area.
- File format instruction.
- File size limit.
- Latest upload result or error.

Rules:

- Support drag-and-drop and click upload.
- Show pending while uploading.
- Upload failure can retry.
- Invalid file type shows local validation error.
- Oversized file shows local validation error.
- Successful upload shows file name, file size, and estimated row count.
- Do not use toast as the only upload error.

### Step 2: Map Fields

Content:

- System fields.
- File fields.
- Required field markers.
- Optional skipped fields.

Rules:

- Required fields must be mapped before moving forward.
- Auto-mapped fields must remain editable.
- Incompatible field types show errors.
- Large field sets need search or grouping.
- On mobile, complex mapping may recommend desktop completion.

### Step 3: Validate Data

Content:

- Validation progress.
- Validation summary.
- Failed row preview.
- Error file download.

Rules:

- Validation shows progress or loading.
- Validation failure is not toast-only.
- Blocking errors use StateView or step-level error area.
- Failed rows can be downloaded.
- Warnings may allow users to continue.
- Blocking errors prevent import.

### Step 4: Confirm Import

Content:

- File name.
- Target type.
- Total rows.
- Importable rows.
- Failed rows.
- Warning count.
- Field mapping summary.

Rules:

- Start import is the primary action.
- Warnings must be visible before import.
- Start import enters pending state.
- Duplicate submit is prevented.
- Starting import creates a task and moves to task tracking or result step.

### Step 5: View Result

Content:

- Task status.
- Import progress.
- Success count.
- Failed count.
- Error file download.
- View task detail.

Rules:

- Result step may show active progress.
- Long tasks can be closed and tracked from the task list.
- Success shows success toast.
- Partial success or failure must show a recovery path.

## Task Detail

Task detail can use Drawer or Detail Page.

Default strategy:

- Use Drawer for moderate content.
- Use Detail Page when there are many failed rows, mappings, logs, and retry actions.

Detail content:

- Task basic information.
- File information.
- Target type.
- Field mapping.
- Validation result.
- Import result.
- Failed rows.
- Activity Log.

Rules:

- Drawer opens from the right.
- Detail may use tabs: Overview, Errors, Mapping, Activity.
- Large failed row lists use paginated table.
- Activity Log is reverse chronological.

## ConfirmDialog

### Cancel Task

Title example:

```text
Cancel import task?
```

Description example:

```text
Cancel the customer import task created by "小明"? Successfully imported data will not be rolled back automatically.
```

Rules:

- Must name the task being cancelled.
- Must describe the consequence.
- If imported data will not roll back, state it clearly.
- Confirm button enters pending state.

### Close Unfinished Import Workflow

Title example:

```text
Leave import workflow?
```

Description example:

```text
The current upload and field mapping have not been submitted. These changes will not be saved after leaving.
```

Rules:

- Confirm only when unsaved progress exists.
- If a task has already been created, return to task tracking instead.

## Data Contract

### Query Params

```ts
type ImportTaskQuery = {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  targetType?: "customer" | "user" | "product" | "config";
  status?: "pending" | "validating" | "importing" | "success" | "partial_success" | "failed" | "cancelled";
  creatorId?: string;
  hasFailedRows?: boolean;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: "createdAt" | "finishedAt";
  sortOrder?: "asc" | "desc";
};
```

### Response

```ts
type ImportTaskListResponse = {
  list: ImportTaskRow[];
  pageNum: number;
  pageSize: number;
  total: number;
};
```

```ts
type ImportTaskRow = {
  id: string;
  fileName: string;
  targetType: "customer" | "user" | "product" | "config";
  status: "pending" | "validating" | "importing" | "success" | "partial_success" | "failed" | "cancelled";
  progress?: number;
  totalCount: number;
  successCount: number;
  failedCount: number;
  warningCount?: number;
  creator: {
    id: string;
    name: string;
  };
  createdAt: string;
  finishedAt?: string;
  permissions: {
    canViewDetail: boolean;
    canCancel: boolean;
    canDownloadErrors: boolean;
    canRetryFailedRows: boolean;
    canViewActivity: boolean;
  };
  disabledReasons?: Partial<Record<
    "cancel" | "downloadErrors" | "retryFailedRows" | "viewActivity",
    string
  >>;
};
```

Rules:

- Task status comes from backend data.
- Frontend must not guess final status.
- Active tasks may refresh through polling.
- Row-level permissions and disabled reasons must be represented in the contract.
- Error file download should request by task ID, not expose unstable file URLs directly.

## Request Race And Polling

Rules:

- Task list requests need request identity.
- Only the latest request may update the list.
- Filter, pagination, and sorting changes cancel or ignore older requests.
- Active tasks may poll status.
- Polling should reduce or pause when the page is hidden.
- Manual refresh has higher priority than polling results.
- Mutation result has higher priority than stale list requests.
- Successful cancel should update the row immediately or refresh the list.

Recommended priority:

1. Mutation result, such as cancel, start import, or retry import.
2. Manual refresh.
3. Polling result for the currently visible detail task.
4. Polling result for active tasks in the list.
5. Background refresh.

## State Handling

### Initial Loading

- PageHeader and FilterBar remain visible.
- Table area shows skeleton or loading rows.
- Summary area may load independently.

### Empty

No tasks:

```text
No import records yet
```

No filter results:

```text
No import records match the current filters
```

Rules:

- No tasks state may offer New Import when permitted.
- No filter results state offers reset filters.
- Empty state lives in the task table area.

### Error

Rules:

- Task list fetch error uses StateView inside table area.
- Upload error appears in upload step.
- Validation error appears in validation step.
- Import failure appears in result step and task detail.
- Blocking errors are not toast-only.

### Toast

Good toast cases:

- Upload succeeded.
- Import task created.
- Task cancelled.
- Error file download started.
- Retry import task created.

Do not use toast-only feedback for:

- Invalid file type.
- Data validation failure.
- Import task failure.
- Error file download failure that requires retry.

## Responsive Behavior

Desktop:

- Use full task table.
- Wizard can use Dialog or in-page workflow.
- Field mapping uses two-column layout.

Tablet:

- Table may scroll horizontally.
- Field mapping can change from two columns to stacked layout.
- Lower-priority page actions move into More.

Mobile:

- Task list may become compact list or card list.
- Upload entry may use bottom drawer or single-page flow.
- Complex field mapping may recommend desktop completion.
- Layout changes must not lose uploaded file, mapping config, validation result, or task state.

## Accessibility

Rules:

- Upload area must be keyboard-triggerable.
- File input needs clear label.
- Progress information must be visible and screen-reader friendly when needed.
- Wizard current step must be clear.
- ConfirmDialog traps focus and returns focus after close.
- Error download and retry actions must be keyboard-accessible.

## AI Generation Requirements

When generating this page, AI must:

- Use B2B console layout.
- Separate import workflow from import task list.
- Use Wizard / Stepper for multi-step import.
- Use table for task list.
- Include state summary, FilterBar, task table, task detail, and Activity Log.
- Include upload, validation, mapping, confirm, and result phases.
- Include loading, empty, error, pending, disabled, success, partial success, and failed states.
- Include task polling and request race handling.
- Include permission disabled states and disabled reasons.
- Use ConfirmDialog for dangerous actions.
- Avoid toast-only blocking errors.
- Preserve workflow data during responsive layout changes.

## Acceptance Criteria

The page is acceptable when:

- Users can clearly start a new import.
- Every import step has a clear goal and primary action.
- Upload, mapping, validation, confirm, and result states are continuous.
- Task list tracks historical and active tasks.
- Failed tasks provide recovery paths, such as download failed rows or retry import.
- Cancel task uses specific confirmation and explains consequences.
- Active task status is not overwritten by stale requests.
- Permission-denied actions show disabled state and reason.
- Blocking errors are visible in the page, not toast-only.
- Core viewing tasks remain usable on desktop, tablet, and mobile.

