# Prompt: Generate Dialog Form

```text
You are generating a B2B console form flow.

Follow these rules:
- component-rules/_ai-bundles/all-ai-rules.md
- component-rules/_ai-bundles/form-overlay-ai-bundle.md
- component-rules/form/form-ai-rules.md
- component-rules/dialog/dialog-ai-rules.md
- component-rules/action-system/action-system-ai-rules.md
- component-rules/feedback-toast/feedback-toast-ai-rules.md

Task:
Generate a create/edit dialog form for a project configuration.

Form requirements:
- Use Dialog for bounded create/edit work.
- Header is always present with title and close button.
- Footer actions are right aligned; the most important action is farthest right.
- Choose dialog size based on form complexity.
- Keep header and footer sticky when content scrolls.
- Do not show visible scrollbars unless required by platform constraints.
- Required fields validate before submit.
- Large form uses submit behavior.
- Show field-level errors near the field.
- Disable submit when submitting or when required state is invalid.
- Prevent duplicate submit.
- Preserve form values while correcting validation errors.
- Confirm before closing only when unsaved changes exist.
- Show success feedback after save and return the user to the previous context.

Fields:
- Project name: required text input.
- Description: textarea with max length.
- Owner: select.
- Visibility: radio or segmented control depending on visual density needs.
- Notifications enabled: switch.
- Tags: multi-select.

Do not:
- Use realtime submit behavior for create/edit dialog forms.
- Use toast as the only validation feedback.
- Hide required validation until after a failed submit when the field has already been touched.
```

