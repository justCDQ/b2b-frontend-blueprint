# Prompt: Generate Import Workflow

```text
You are generating a B2B console import workflow.

Follow these rules:
- component-rules/_ai-bundles/all-ai-rules.md
- component-rules/_ai-bundles/import-workflow-ai-bundle.md
- component-rules/upload-import-workflow/upload-import-workflow-ai-rules.md
- component-rules/wizard-stepper/wizard-stepper-ai-rules.md
- component-rules/state-view/state-view-ai-rules.md
- component-rules/timeline-activity-log/timeline-activity-log-ai-rules.md
- component-rules/dialog/dialog-ai-rules.md

Task:
Generate a customer import workflow.

Workflow requirements:
- Use Wizard / Stepper for multi-step import.
- Steps: upload file, map fields, validate data, confirm import, view result.
- File upload supports pending, success, validation error, network error, and retry states.
- Validation errors are visible in the page, not toast-only.
- Long-running import task shows progress and status.
- Failed rows can be downloaded or inspected.
- Activity Log records upload, validation, import start, import success, and import failure.
- Dangerous interruption or reset actions use ConfirmDialog.
- Prevent duplicate upload and duplicate import submit.
- Preserve completed step data when moving between steps.
- Mobile layout stacks step content and keeps primary action reachable.

Do not:
- Hide import errors only in a toast.
- Allow users to submit import before validation is complete.
- Reset uploaded data during responsive layout changes.
```

