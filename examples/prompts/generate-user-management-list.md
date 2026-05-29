# Prompt: Generate User Management List

```text
You are generating a B2B console page.

Follow these rules:
- component-rules/_ai-bundles/all-ai-rules.md
- component-rules/_ai-bundles/list-crud-ai-bundle.md
- component-rules/list-page/list-page-ai-rules.md
- component-rules/filter-bar/filter-bar-ai-rules.md
- component-rules/table/table-ai-rules.md
- component-rules/action-system/action-system-ai-rules.md
- component-rules/dialog/dialog-ai-rules.md
- component-rules/status-badge/status-badge-ai-rules.md

Task:
Generate a User Management list page.

Page requirements:
- PageHeader with title, description, refresh action, and primary create action.
- FilterBar with keyword search, role select, status select, created time range, and advanced filters.
- Default collapsed filter area; show only high-frequency filters.
- Table with selectable rows, sortable columns, status badge, role tag, created time, updated time, and operation column.
- Row operation column exposes at most three icon buttons and moves overflow actions into More menu.
- Batch actions include disable, enable, export, and delete.
- Dangerous actions use ConfirmDialog.
- Permission-disabled actions remain visible, disabled, and explain the reason with tooltip.
- Include loading, empty, error, pending, disabled, and selected states.
- Protect refresh, row mutation, and batch mutation from duplicate clicks.
- Keep query state recoverable from URL.
- Clear or reconcile selected rows when filters, pagination, or data identity changes.

Do not:
- Create a landing page.
- Use cards for the table version.
- Use toast as the only feedback for blocking errors.
- Trigger row detail navigation when clicking row action buttons, checkboxes, switches, or links.
```

