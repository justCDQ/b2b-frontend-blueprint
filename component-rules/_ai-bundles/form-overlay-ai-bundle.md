# Form Overlay AI Bundle

Use this bundle for form flows inside dialogs, drawers, detail edit pages, or wizards.

## Load These Rules

1. [`core-foundation-ai-bundle.md`](./core-foundation-ai-bundle.md)
2. [`form-ai-rules.md`](../form/form-ai-rules.md)
3. [`dialog-ai-rules.md`](../dialog/dialog-ai-rules.md)
4. [`drawer-side-panel-ai-rules.md`](../drawer-side-panel/drawer-side-panel-ai-rules.md)
5. [`detail-page-ai-rules.md`](../detail-page/detail-page-ai-rules.md)
6. [`wizard-stepper-ai-rules.md`](../wizard-stepper/wizard-stepper-ai-rules.md)
7. [`dropdown-menu-popover-ai-rules.md`](../dropdown-menu-popover/dropdown-menu-popover-ai-rules.md)

## Use For

- Create/edit dialogs.
- Drawer edit flows.
- Detail page edit mode.
- Multi-step forms.
- Forms with dropdowns, popovers, async fields, and dirty state.

## Must Enforce

- Form context determines realtime vs explicit submit.
- Required/validation/server errors map correctly.
- Submit pending prevents duplicate submit.
- Failed submit preserves input.
- Dirty close/route leave is guarded.
- Dialog/drawer/route choice matches content complexity.
- Dangerous/high-risk submit uses ConfirmDialog.
