# Upload / Import Workflow Rules

> Use these rules for file upload, structured import, and bulk data ingestion in 2B products.

---

## 1. Upload vs Import

Use Upload for simple file attachment or asset submission.

Use Import Workflow for structured data ingestion that can create/update many records.

| Pattern | Use for | Typical complexity |
|---|---|---|
| Upload | attachment, avatar, logo, document | low |
| Bulk Upload | multiple files, documents, media | medium |
| Import Workflow | CSV/XLSX structured data, create/update records | high |
| Background Import | long-running import job | high/asynchronous |

Rules:

- Upload focuses on file transfer.
- Import focuses on validation, mapping, preview, confirmation, and result handling.
- Do not treat structured import as simple file upload.
- Do not hide validation and partial failure behind a generic success/error toast.

---

## 2. Upload Component Rules

Upload UI should show:

- accepted file types
- max file size
- single vs multiple policy
- current file list
- upload progress when non-trivial
- pending/success/error per file when multiple
- remove/replace/retry behavior

Rules:

- Validate file type and size before upload when possible.
- Prevent duplicate submit while upload is pending.
- For multiple files, show per-file status.
- Failed upload should preserve selected file context.
- Retry should target the failed file when possible.
- Re-upload policy must be clear: replace, append, or compare.
- Drag-and-drop must have keyboard-accessible alternative.

---

## 3. Structured Import Flow

Recommended flow:

```text
Download template
Upload file
Parse and validate
Map fields / preview
Confirm scope
Run import
Show result summary
Provide failed-row report
```

Rules:

- Provide template download for structured imports.
- Show required columns and accepted formats.
- Validate file type, size, row count, required columns, and data format.
- Validate before final import.
- Show preview/mapping before import when fields can vary.
- Final confirmation must name create/update scope and affected record count.
- Long import should become a background task with status.

---

## 4. Validation And Mapping

Validation should detect:

- missing required columns
- invalid data types
- duplicate keys
- invalid references
- permission-inaccessible records
- row count limit exceeded
- unsupported file format
- encoding/header issues

Mapping rules:

- Auto-map obvious fields when safe.
- Require user confirmation for ambiguous mapping.
- Show unmapped required fields as blocking errors.
- Allow optional fields to remain unmapped.
- Preserve mapping if user re-uploads compatible file.
- Field mapping should be reviewable before import.

---

## 5. Import Confirmation

Before final import, show:

- file name
- total rows
- valid rows
- invalid rows
- create/update/skip counts when known
- target object/scope
- all-or-nothing vs partial import policy

Rules:

- Confirm copy must be specific.
- Dangerous or broad import uses ConfirmDialog or review step.
- If import updates existing records, say so clearly.
- If import cannot be undone, state that before submit.

---

## 6. Partial Failure

Partial success is not generic failure.

Rules:

- Show imported count and failed count.
- Provide failed-row report download or detail view.
- Keep successful rows unless all-or-nothing transaction is required.
- All-or-nothing behavior must be explicit before import.
- Failed-row report should include row number, field, reason, and suggested fix when possible.
- Allow re-importing corrected failed rows when practical.

---

## 7. Background Tasks

Use background task behavior when:

- import may take longer than a short request
- user can safely leave the page
- processing happens server-side
- result may complete later

Rules:

- Show queued/running/succeeded/failed/canceled states.
- Provide task detail or activity log when useful.
- Toast can announce start/completion, but result page/summary must exist.
- Refresh should check task status without clearing context.
- Long task should not block unrelated navigation unless business state requires it.

---

## 8. State And Feedback

Rules:

- Initial upload area empty state should be actionable.
- Upload pending shows progress.
- Parse/validate pending shows step-specific loading.
- Validation errors are shown before import.
- Import pending prevents duplicate submit.
- Success shows result summary, not toast only.
- Failure preserves uploaded context and explains recovery.
- Refresh failure preserves last known task/result state.

---

## 9. Security And Permissions

Rules:

- Do not expose sensitive data in preview beyond user permission.
- Reject unsupported file types even if UI accepts accidentally.
- Scan/validate server-side as needed.
- Import action respects create/update permissions.
- Template download respects accessible fields.
- Failed-row reports should not leak inaccessible data.

---

## 10. Responsive Behavior

Rules:

- Upload zone remains usable on mobile without drag-only interaction.
- Mapping table may become stacked field mapping cards.
- Large preview should move to full page or dedicated step on mobile.
- Result summary stays readable with counts first.
- Long failed-row reports should be downloadable rather than cramped.

---

## 11. Examples

Simple upload:

```text
Upload logo -> validate PNG/JPG and size -> preview -> save
```

Structured import:

```text
Download customer template -> upload CSV -> validate rows -> map columns -> confirm import 1,240 customers -> show result and failed-row report
```

Background import:

```text
Upload 100k records -> validate sample -> start import job -> view task log -> receive completion toast -> open result summary
```

---

## 12. AI Review Checklist

- Upload vs import distinction is clear.
- File type/size/count constraints are visible.
- Structured import has template, validation, mapping, confirmation, and result.
- Long import becomes background task.
- Partial success/failure is handled.
- Failed-row report exists when useful.
- Duplicate submit is prevented.
- Permission and sensitive data handling are defined.
- Mobile flow is usable without drag-only interaction.
