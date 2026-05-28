# Import Workflow AI Bundle

Use this bundle for upload, structured import, wizard, validation, and task progress flows.

## Load These Rules

1. [`core-foundation-ai-bundle.md`](./core-foundation-ai-bundle.md)
2. [`upload-import-workflow-ai-rules.md`](../upload-import-workflow/upload-import-workflow-ai-rules.md)
3. [`wizard-stepper-ai-rules.md`](../wizard-stepper/wizard-stepper-ai-rules.md)
4. [`form-ai-rules.md`](../form/form-ai-rules.md)
5. [`table-ai-rules.md`](../table/table-ai-rules.md)
6. [`timeline-activity-log-ai-rules.md`](../timeline-activity-log/timeline-activity-log-ai-rules.md)
7. [`feedback-toast-ai-rules.md`](../feedback-toast/feedback-toast-ai-rules.md)

## Use For

- CSV/XLSX import.
- Bulk create/update.
- Upload validation.
- Field mapping.
- Long-running background import jobs.
- Failed-row reports.

## Must Enforce

- Upload vs import distinction is clear.
- Structured import has template, validation, mapping, confirmation, result.
- Partial success is not generic failure.
- Failed-row report exists when useful.
- Long import becomes background task.
- Duplicate submit is prevented.
- Import result is not toast-only.
