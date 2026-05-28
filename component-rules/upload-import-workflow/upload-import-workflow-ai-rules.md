# Upload / Import Workflow AI Rules

> Compact execution rules for AI-generated 2B upload and import workflows.
> Use `upload-import-workflow-rules.md` as the detailed reference.

---

## 1. Upload vs Import

Use Upload for simple file transfer: attachment, avatar, logo, document.

Use Import Workflow for structured data ingestion that creates/updates records.

Rules:

- Upload focuses on file transfer.
- Import focuses on template, validation, mapping, confirmation, result.
- Do not treat structured CSV/XLSX import as simple upload.
- Do not hide validation or partial failure behind generic toast.

---

## 2. Upload Rules

Upload UI must show:

- accepted file types
- max file size
- single/multiple policy
- file list or current file
- progress for non-trivial upload
- per-file status when multiple
- remove/replace/retry behavior

Rules:

- Validate type/size before upload when possible.
- Prevent duplicate submit while pending.
- Failed upload preserves file context.
- Retry targets failed file when possible.
- Drag-and-drop needs keyboard-accessible alternative.

---

## 3. Import Flow

Structured import should include:

```text
Download template
Upload file
Parse and validate
Map fields / preview
Confirm scope
Run import
Result summary
Failed-row report
```

Rules:

- Provide template download.
- Validate file type, size, row count, required columns, data format.
- Show validation errors before final import.
- Auto-map obvious fields; require confirmation for ambiguous mapping.
- Final confirmation names create/update scope and affected count.
- Long import becomes background task.

---

## 4. Partial Failure And Results

Rules:

- Partial success is not generic failure.
- Show imported count and failed count.
- Provide failed-row report when useful.
- Failed report includes row number, field, reason, suggested fix when possible.
- Keep successful rows unless all-or-nothing transaction is explicit.
- Make all-or-nothing policy clear before import.
- Success shows result summary, not toast only.

---

## 5. State, Permission, Responsive

Rules:

- Upload pending shows progress.
- Parse/validate pending shows step loading.
- Import pending prevents duplicate submit.
- Failure preserves uploaded context and recovery path.
- Import action respects create/update permissions.
- Preview/report must not leak inaccessible data.
- Mobile upload cannot rely on drag-only interaction.
- Mapping/preview may become cards or full page on mobile.

---

## 6. AI Checklist

- Upload/import distinction is clear.
- Constraints are visible.
- Structured import has template, validation, mapping, confirmation, result.
- Long import becomes background task.
- Partial failure is handled.
- Failed-row report is available when useful.
- Duplicate submit is prevented.
- Permission/sensitive data rules are handled.
- Mobile flow is usable.
