# All AI Rules Entry

Use this file as the top-level AI entry for B2B console generation and review.

Do not load every module blindly for every task. Start here, then select the scenario bundle and module rules that match the page being generated.

## Baseline Instruction

Generate B2B console UI, not a marketing page.

Prioritize:

- Dense but readable information layout.
- Clear action hierarchy.
- Predictable navigation.
- Explicit loading, empty, error, disabled, and permission states.
- Stable data flow.
- Responsive behavior that preserves business state.
- Reusable component boundaries.

Avoid:

- Decorative hero sections.
- Oversized cards for operational workflows.
- Ambiguous button placement.
- Toast-only handling for blocking errors.
- Dangerous actions without confirmation.
- UI state that depends only on visual style and lacks data contracts.

## Load Order

### 1. Always Load Foundation

Load:

- [Core Foundation AI Bundle](./core-foundation-ai-bundle.md)
- [Action System AI Rules](../action-system/action-system-ai-rules.md)
- [Responsive Layout AI Rules](../responsive-layout/responsive-layout-ai-rules.md)
- [StateView AI Rules](../state-view/state-view-ai-rules.md)
- [Feedback / Toast AI Rules](../feedback-toast/feedback-toast-ai-rules.md)
- [Tooltip / HelpText AI Rules](../tooltip-helptext/tooltip-helptext-ai-rules.md)

### 2. Pick One Primary Scenario

For CRUD lists:

- [List CRUD AI Bundle](./list-crud-ai-bundle.md)

For forms in overlays or detail pages:

- [Form Overlay AI Bundle](./form-overlay-ai-bundle.md)

For navigation and layout:

- [Navigation Layout AI Bundle](./navigation-layout-ai-bundle.md)

For data feedback:

- [Data Feedback AI Bundle](./data-feedback-ai-bundle.md)

For upload or import:

- [Import Workflow AI Bundle](./import-workflow-ai-bundle.md)

### 3. Add Specific Modules When Needed

Use specific modules for surfaces that are central to the task:

- [Table AI Rules](../table/table-ai-rules.md)
- [FilterBar AI Rules](../filter-bar/filter-bar-ai-rules.md)
- [Form AI Rules](../form/form-ai-rules.md)
- [Dialog AI Rules](../dialog/dialog-ai-rules.md)
- [Drawer / Side Panel AI Rules](../drawer-side-panel/drawer-side-panel-ai-rules.md)
- [Dropdown / Menu / Popover AI Rules](../dropdown-menu-popover/dropdown-menu-popover-ai-rules.md)
- [Card List AI Rules](../card-list/card-list-ai-rules.md)
- [Detail Page AI Rules](../detail-page/detail-page-ai-rules.md)
- [Tabs / Navigation AI Rules](../tabs-navigation/tabs-navigation-ai-rules.md)
- [StatusBadge / Tag AI Rules](../status-badge/status-badge-ai-rules.md)
- [Upload / Import Workflow AI Rules](../upload-import-workflow/upload-import-workflow-ai-rules.md)
- [Wizard / Stepper AI Rules](../wizard-stepper/wizard-stepper-ai-rules.md)
- [Timeline / Activity / Audit Log AI Rules](../timeline-activity-log/timeline-activity-log-ai-rules.md)

## Global AI Constraints

### Layout

- Use PageShell and PageHeader for console pages.
- Keep operational pages compact and scannable.
- Do not use landing-page hero composition for console workflows.
- Do not put page sections inside decorative cards unless the component is a repeated card item.
- Use responsive constraints instead of hardcoded widths whenever possible.

### Actions

- Every action must have a clear scope: page, section, batch, row, form, or inline field.
- Primary action count should be limited and visually obvious.
- Dangerous actions must use ConfirmDialog.
- Mutation actions must enter pending state and prevent duplicate clicks.
- Disabled actions caused by permission or state must expose the reason.

### Data

- Loading, empty, error, and success states must be scoped to the affected surface.
- Request race handling is required for filter, search, pagination, sorting, refresh, and mutation flows.
- Refresh should preserve valid query state unless the rule explicitly requires reset.
- Selection state must be cleared or reconciled when filters, pagination, or data identity changes.

### Forms

- Filter forms may trigger realtime query changes according to field type.
- Create/edit forms should validate before submit.
- Large forms should use submit behavior rather than independent field validation only.
- Disabled fields must not look like editable fields.
- Inline editing should be used only for low-risk, simple values.

### Overlays

- Use Dialog for bounded tasks.
- Use ConfirmDialog for destructive or irreversible confirmation.
- Use Drawer / Side Panel for contextual secondary work that benefits from keeping the source page visible.
- Use Detail Page for large content, complex operations, or route-recoverable workflows.

### Feedback

- Toast is for transient operation feedback.
- Inline errors are for field or local correction.
- StateView is for page, section, table, card list, or panel state.
- Blocking errors must not be toast-only.

## Common Generation Prompt

```text
Generate a B2B console interface.

Follow:
- component-rules/_ai-bundles/all-ai-rules.md
- component-rules/_ai-bundles/{scenario-bundle}.md
- component-rules/{specific-module}/{specific-module}-ai-rules.md

Requirements:
- Use compact console layout.
- Include loading, empty, error, disabled, permission, and pending states.
- Keep action scope explicit.
- Use ConfirmDialog for dangerous actions.
- Prevent duplicate mutation actions.
- Preserve query and navigation state where appropriate.
- Do not create a marketing landing page.
```

## Common Review Prompt

```text
Review the implementation against the B2B AI rules.

Check:
- component boundary correctness
- action hierarchy and placement
- disabled and permission behavior
- loading, empty, error, pending, and success states
- request race handling
- responsive behavior
- dangerous action confirmation
- consistency with table, form, dialog, drawer, and navigation rules

Return concrete findings and fixes.
```

