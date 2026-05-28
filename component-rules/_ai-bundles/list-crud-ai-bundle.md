# List CRUD AI Bundle

Use this bundle for standard 2B CRUD list pages.

## Load These Rules

1. [`core-foundation-ai-bundle.md`](./core-foundation-ai-bundle.md)
2. [`list-page-ai-rules.md`](../list-page/list-page-ai-rules.md)
3. [`filter-bar-ai-rules.md`](../filter-bar/filter-bar-ai-rules.md)
4. [`table-ai-rules.md`](../table/table-ai-rules.md)
5. [`card-list-ai-rules.md`](../card-list/card-list-ai-rules.md)
6. [`detail-page-ai-rules.md`](../detail-page/detail-page-ai-rules.md)
7. [`dialog-ai-rules.md`](../dialog/dialog-ai-rules.md)
8. [`drawer-side-panel-ai-rules.md`](../drawer-side-panel/drawer-side-panel-ai-rules.md)
9. [`status-badge-ai-rules.md`](../status-badge/status-badge-ai-rules.md)

## Use For

- Users/projects/orders/jobs list pages.
- CRUD pages with table, filter bar, row actions, batch actions.
- Table-to-detail, table-to-dialog, or table-to-drawer flows.

## Must Enforce

- Table vs Card choice is explicit.
- Query state is URL-recoverable.
- Filter/search/page changes handle selection and request params.
- Request race protection exists.
- Row actions do not conflict with selection/detail navigation.
- Dangerous row/batch actions use ConfirmDialog.
- Returning from detail restores list context when possible.
