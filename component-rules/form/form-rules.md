# Form Component System Rules

> Use these rules when building or reviewing forms in 2B products.
> Forms are for collecting, editing, validating, and submitting structured business data.

---

## 1. Form Types

Choose form type by task scope.

| Type | Use when |
|---|---|
| Inline form | small local edit inside a section |
| Dialog form | focused create/edit/config task |
| Page form | long workflow, shareable state, complex review |
| Wizard form | linear multi-step process |
| Editable table | low-risk quick edits in structured rows |

Rules:

- Simple focused tasks use dialog form.
- Long or shareable workflows use page form.
- Multi-step tasks use wizard form.
- Do not put a large workflow into a small dialog.
- Do not use editable table for risky or complex validation.

---

## 2. Form Contexts

Forms appear in different places and must use different feedback/submission strategies.

### FilterBar forms

Use in table/list filter area.

Behavior:

- Most controls provide near-real-time feedback.
- Radio/chips/select single choice triggers request immediately.
- Text input uses debounce and triggers request after typing stops.
- Multi-select triggers request after user confirms selection.
- Date range usually triggers request after both value and confirm are complete.
- Filter changes reset page and clear selection.
- Query state is URL-driven.

Examples:

```text
Status chip click -> request immediately
Search input -> debounce 300-500ms -> request
Multi-select group -> choose multiple -> click Apply -> request
Date range -> pick range -> click Apply -> request
```

Do not:

- Require a global Save button for normal filters.
- Trigger a request on every keystroke without debounce.
- Submit incomplete multi-select/date-range state.

### Table inline forms

Use for low-risk quick edits inside table rows.

Examples:

- Switch enable/disable.
- Rename.
- Edit short description.
- Change simple priority/order.

Behavior:

- Switch triggers immediately.
- Text input usually enters edit mode first.
- Text edit submits on explicit small confirm action, blur+confirm, or Enter if product defines it.
- Pending state is row-level.
- Failure rolls back or keeps edit mode.
- Must not trigger row click.

Rules:

- Use only for low-risk fields.
- Complex validation or risky changes must use dialog/page form.
- Row pending is based on rowKey.

### Dialog forms

Use for create/edit one object.

Behavior:

- No real-time submit.
- User fills fields first.
- Required validation runs before save.
- Save button submits the whole form.
- Success closes dialog and refreshes related data.
- Failure keeps dialog open and preserves input.

Rules:

- Submit button lives in footer.
- Submit loading prevents duplicate submit.
- Inline field errors show near fields.

### Detail page edit forms

Use when there are too many fields for dialog or the edit workflow needs a page.

Behavior:

- User enters edit mode from detail page.
- Interaction is similar to dialog form: edit many fields, then click Save.
- Required validation runs before save.
- Success exits edit mode or navigates back to detail.
- Failure keeps edit mode and preserves input.

Use page edit when:

- Many fields.
- Many sections.
- Need review before save.
- Need shareable/reloadable state.
- Need child tables or complex related data.

---

## 3. Layout

Default layout:

- Label above field.
- Help text below label or below field.
- Error text near the field.
- Required mark near label.

Rules:

- Mobile forms use one column.
- Desktop forms may use two columns only when fields are short and independent.
- Related fields should be grouped into sections.
- Dangerous settings should be visually separated.
- Do not place too many unrelated fields in one uninterrupted block.

Recommended:

```text
Section title
Description

Label
Input
Help/Error
```

Two-column rule:

- Good for first name / last name, start / end time, min / max.
- Bad for long text, textarea, complex select, dependent fields.

---

## 4. Field Semantics

Every field needs a clear semantic contract.

Field definition should include:

- name/key
- label
- type
- required/optional
- default value
- validation rules
- help text
- disabled logic
- parse/serialize logic if needed

Rules:

- Labels must be specific.
- Placeholder is not a replacement for label.
- Required fields must be explicit.
- Optional fields should not look required.
- Units must be visible for numeric fields.
- Empty value semantics must be clear.

Bad:

```text
Label: Value
Placeholder: Enter here
```

Good:

```text
Label: Monthly quota
Suffix: requests
Help: Leave empty to use team default.
```

---

## 5. Field Components And States

Common field components:

- Input
- Textarea
- Select
- Radio
- SegmentedControl
- Checkbox
- Switch
- DatePicker / DateRangePicker
- NumberInput
- Password / SecretInput
- FileUpload
- Combobox / Autocomplete
- TreeSelect
- TagInput
- CodeEditor / JSONEditor

Every field component must support these states:

- default
- focus
- error
- disabled
- loading/pending when needed

### Input

Use for short text, number-like values, IDs, names, emails, URLs.

Rules:

- Use label; placeholder is only a hint.
- Support prefix/suffix only when semantic, such as unit, search, URL, warning.
- Mobile input font size should avoid browser auto zoom.
- Error state shows border/error message.
- Disabled state blocks editing and explains reason if not obvious.
- Numeric input must show unit or format expectation.

### Textarea

Use for long text.

Examples:

- description
- note
- prompt
- error reason
- custom message

Rules:

- Provide min height.
- Avoid tiny textarea for long content.
- Support character count when length matters.
- Error and disabled states follow normal field behavior.
- For very long content or code-like content, consider editor/full dialog.

### Select

Use for choosing from known options.

Rules:

- Single select can trigger immediately in FilterBar.
- In submit forms, select changes only update form state until Save.
- Long option lists need search.
- Multi-select should show selected count or selected labels.
- Multi-select in FilterBar should apply after user confirms.
- Disabled option should explain why when possible.

### Radio

Use for a small number of mutually exclusive choices.

Rules:

- Usually 2-5 options.
- All options should be visible.
- Use when comparison between options matters.
- Use when option labels need explanation, help text, or secondary description.
- Use RadioGroup semantics: one group name, one selected value, keyboard navigation within the group.
- The group must have a visible label; individual options must have clear labels.
- Option values should be stable business values, not display text.
- Required RadioGroup must validate that one option is selected.
- Optional RadioGroup must define whether empty selection is allowed and how to clear it.
- Disabled options must remain readable and explain the disabled reason when not obvious.
- A disabled selected option must still display the current value clearly.
- Radio selection in submit forms only updates form state until Save.
- In FilterBar, radio/chips selection can trigger immediately.
- Radio options should not wrap into unclear multi-line blocks unless descriptions are part of the design.
- Do not use radio for long lists.

Use Radio instead of SegmentedControl when:

- Options need descriptions or help text.
- The decision is important and needs slower comparison.
- Option labels are long.
- The choice is part of a long submit form.
- Disabled reasons or validation messages need to be shown per option.

Example:

```text
Billing cycle
( ) Monthly - easier to cancel
( ) Annual - lower yearly price
```

### SegmentedControl

Use for compact single-choice form values that look like tabs but behave like a RadioGroup.

Rules:

- Semantically closer to RadioGroup than Tabs.
- Use for short, mutually exclusive values.
- Good for high-frequency switching, simple filters, display mode, time granularity, or data scope.
- Usually 2-5 options; max 6 unless the product has a strong reason.
- Option labels must be short and scannable.
- Supports `value`, `onValueChange`, `name`, `required`, `disabled`, and `error` like other form controls.
- It may share pill/segmented visual styles with Tabs, but it must not use Tabs implementation or ARIA tab semantics.
- In FilterBar, changing value can trigger query immediately.
- In submit forms, changing value only updates form state until Save.
- If it affects list data, persist it in query params and reset page/selection on change.
- Disabled option must explain why when not obvious.

Use SegmentedControl instead of Radio when:

- Options are short and equally weighted.
- The choice is a mode/filter, not a careful business decision.
- User is expected to switch often.
- Space is limited, such as FilterBar or toolbar.

Do not use SegmentedControl for:

- Long option lists.
- Choices that need rich descriptions.
- Risky choices that require careful reading.
- Route navigation.
- Content panels with independent layout.

Examples:

```text
Status: All / Active / Disabled
View: Table / Card
Range: Day / Week / Month
```

### Checkbox

Use for independent boolean choices or multi-select groups.

Rules:

- Single checkbox is for independent yes/no agreement.
- Checkbox group is for multi-select.
- In FilterBar, multi-select group usually needs Apply.
- Disabled checkbox must explain why if not obvious.
- Do not use checkbox for mutually exclusive options.

### Switch

Use for immediate binary state changes.

Rules:

- Use for on/off, enabled/disabled, allowed/blocked.
- Switch usually triggers immediately.
- Risky switch requires confirmation.
- Pending state prevents repeated toggles.
- Failure rolls back and shows error.
- Switch is not a replacement for checkbox in long forms unless it means immediate setting.

### DatePicker / DateRangePicker

Use for dates, expiration time, created/updated filters, schedules.

Rules:

- Single date and date range must have clear semantics.
- DateTime must define whether it includes time.
- Timezone must be explicit when backend stores UTC or users span regions.
- Start date cannot be later than end date.
- Clear value semantics must be defined.
- In FilterBar, date range usually applies after user confirms a complete range.
- Mobile should use a mobile-friendly picker or native input when appropriate.

### NumberInput

Use for quota, price, count, threshold, weight, priority.

Rules:

- Define min, max, step, and precision.
- Show unit or currency.
- Distinguish empty value from `0`.
- Prevent invalid characters when possible.
- Format display carefully; do not break editing.
- For precise business values, prefer NumberInput over Slider.

Examples:

```text
Quota: 1000 requests
Price: $12.50
Weight: 0.8
```

### Password / SecretInput

Use for passwords, API keys, tokens, secrets.

Rules:

- Support show/hide when appropriate.
- Do not expose secret values by default.
- Existing secrets usually display masked value.
- Regenerate/reset requires confirmation.
- Copy action should be explicit.
- Do not log secret values.
- Do not send unchanged masked placeholder as real value.

### FileUpload

Use for import, document upload, avatar/logo upload, attachments.

Rules:

- Show accepted file types.
- Show max file size.
- Define single vs multiple upload.
- Show upload progress.
- Support retry on failure when possible.
- Validate before upload when possible.
- Import flows need error detail or failed-row report.
- Provide template download for structured import.

### Combobox / Autocomplete

Use for searchable selection.

Examples:

- user
- team
- project
- tag
- resource

Rules:

- Remote search uses debounce.
- Show loading state.
- Show empty result state.
- Selected value should display label, not only id.
- Disabled options should explain why.
- If creating new option is allowed, make it explicit.
- Avoid loading huge option lists at once.

### TreeSelect

Use for hierarchical choices.

Examples:

- organization tree
- folder tree
- category tree
- permission scope

Rules:

- Define single or multiple selection.
- Define parent-child selection behavior.
- Support half-selected state when needed.
- Lazy loading should show loading state per node.
- Search should preserve hierarchy context.
- Selected value display should be readable.

### TagInput

Use for labels, keywords, email lists, whitelist/blacklist values.

Rules:

- Define separators: Enter, comma, paste, etc.
- Trim whitespace.
- Deduplicate values.
- Validate each tag.
- Show invalid tag state.
- Define max count and max length.
- Bulk paste should be handled intentionally.

### CodeEditor / JSONEditor

Use for structured config, JSON payload, schema, rules, prompt/code-like content.

Rules:

- Provide syntax highlighting when useful.
- Provide format action for JSON.
- Validate before submit.
- Show error location if possible.
- Large content should use full dialog or page form.
- Do not use small textarea for complex JSON/config.
- Preserve indentation and user formatting where appropriate.

### State rules

Default:

- Field is editable.
- Help text may be visible.

Focus:

- Focus style must be visible.
- Focus does not remove error message.

Error:

- Error style is visible.
- Error message is close to field.
- Error message explains how to fix when possible.

Disabled:

- Field cannot be edited.
- Disabled reason is available if not obvious.
- Disabled value should still be readable.

Pending/loading:

- Used for async validation, row-level update, or dependent option loading.
- Must not block unrelated fields unless needed.

---

## 6. Validation

Validation must be close to the field.

Validation types:

- required
- format
- range
- length
- dependency
- async uniqueness
- permission/state constraint

Rules:

- Blocking validation shows inline error.
- Field error appears near the field.
- Form-level error appears near submit area or top of form.
- Toast is not a replacement for field errors.
- Async validation must show pending state.
- Do not validate too aggressively while user is still typing unless helpful.

Timing:

| Timing | Use when |
|---|---|
| on blur | format/range validation |
| on change | lightweight immediate feedback |
| on submit | required/business validation |
| async after debounce | uniqueness/check availability |

---

## 7. Form Interaction And Constraints

These rules are framework-agnostic, but reflect mature form-library patterns such as registered fields, default values, form state, dependency validation, field arrays, and controlled adapters.

### Field registration

Rules:

- Every submitted field must have a stable name/key.
- Field names should match request payload semantics when possible.
- Do not submit visual-only fields.
- Do not submit hidden stale child fields unless explicitly intended.
- Unmounted conditional fields must either unregister or keep value intentionally.

Example:

```text
provider = OpenAI -> submit apiKey
provider = Azure -> unregister apiKey, submit endpoint/deployment
```

### Default values

Rules:

- Every field should have an explicit default value.
- Create form defaults and edit form initial values are different concepts.
- Reset should restore initial values, not always empty values.
- Async-loaded initial values should reset the form once data arrives.
- Avoid switching fields between uncontrolled and controlled states.

Bad:

```text
Field starts undefined, later becomes string.
```

Good:

```text
Text field default: ''
Multi-select default: []
Switch default: false
```

### Form state

Track these states separately:

- dirty
- touched
- valid / invalid
- submitting
- submit successful
- field-level error
- form-level error

Rules:

- Dirty controls discard confirmation.
- Touched can control when to show field errors.
- Submitting disables conflicting actions.
- Submit success clears dirty state.
- Submit failure should not clear dirty state or input.

### Dependency rules

Fields often depend on other fields.

Rules:

- Parent field changes must reset invalid child values.
- Dependent validation must rerun when dependency changes.
- Dependent options must show loading if loaded async.
- Disabled dependent fields should explain what enables them.

Examples:

```text
startDate changes -> validate endDate
country changes -> reset city
provider changes -> reset provider-specific credentials
```

### Validation rules

Use declarative rules where possible:

- required
- min / max
- minLength / maxLength
- pattern / format
- custom validate
- dependency validate
- async validate

Rules:

- Validation error belongs to the field that user can fix.
- Cross-field error should appear near the related group or submit area.
- Async validation should be debounced and cancellable/stale-safe.
- Server validation errors should map back to field errors when possible.

### Field arrays

Use field arrays for repeated groups.

Examples:

- multiple emails
- webhook headers
- environment variables
- pricing tiers
- allowlist entries

Rules:

- Each item needs stable id.
- Add/remove/reorder must preserve other item values.
- Array-level validation should show near the group.
- Item-level validation should show near the item.
- Removing an item must remove its validation errors.
- Define min/max item count.

### Controlled component adapters

Some components need an adapter between form state and UI state.

Examples:

- Select
- DatePicker
- Combobox
- TreeSelect
- CodeEditor
- FileUpload

Rules:

- Adapter defines value shape.
- Adapter maps UI value to form value.
- Adapter maps disabled/error state to component.
- Adapter handles clear value.
- Adapter should not store a second unsynced state unless necessary.

### Error mapping

Errors can come from client validation or server response.

Rules:

- Field-specific server errors map to field errors.
- General server errors map to form-level error.
- Unknown errors may use toast, but should not erase field input.
- After failed submit, focus first invalid field.

---

## 8. Submit

Submit must be explicit and safe.

Rules:

- Required/rule validation must run before submit.
- Submit button enters loading immediately.
- Submit loading prevents duplicate submit.
- Submit loading disables conflicting actions.
- Success closes dialog or navigates as appropriate.
- Success refreshes related list/detail data.
- Failure keeps form open and preserves user input.
- Do not clear form before success.
- Do not close dialog on failure.

Submit flow:

```text
edit fields
click submit
validate
submit loading
success -> close/navigate -> refresh data
failure -> keep input -> show field/form error
```

Submission strategy:

| Form size | Strategy |
|---|---|
| few fields | direct validate in handler is acceptable |
| many fields | use `<form>` and `type="submit"` |
| dialog form | footer submit button should submit the form |
| page form | use form submit and stable action bar/footer |

Rules:

- Large forms should not manually call many field validators one by one in button click.
- Use native form submit semantics or a form library for many fields.
- Submit button outside form body should still be associated with the form.
- Enter key behavior should be intentional.
- Required validation must run before sending request.

---

## 9. Dirty State

Dirty state means user changed data but has not saved.

Rules:

- Track dirty state for edit/create forms.
- Closing dirty form should require confirmation when data loss matters.
- Reset should require confirmation if it discards user input.
- Successful submit clears dirty state.
- Changing route with dirty form should warn when possible.

Close behavior:

| State | Close behavior |
|---|---|
| pristine | close directly |
| dirty | confirm discard |
| submitting | block or explicit confirm |
| submit failed | allow close, preserve while open |

Discard confirmation must mention unsaved changes.

---

## 10. Default Values And Reset

Rules:

- Create form uses explicit defaults.
- Edit form uses loaded data.
- Reset returns to initial values, not always empty values.
- Dependent fields reset when parent field changes.
- Do not mutate original loaded object directly.

Examples:

```text
Create user: role defaults to "member"
Edit user: role defaults to existing user role
Reset edit form: restore existing user role, not empty
```

---

## 11. Disabled And Permission

Fields and actions can be disabled.

Rules:

- Disabled field must have reason when not obvious.
- Permission-disabled fields should not submit changed values.
- Hidden fields are for fields user should not know or cannot use.
- Disabled fields are for visible but unavailable fields.
- Submit disabled reason should be explainable.

Examples:

```text
Cannot edit role: only owner can change roles.
Cannot change email: verified email is locked.
```

Backend must still validate permission and state.

---

## 12. Dynamic Fields

Dynamic fields appear based on other values.

Rules:

- When parent changes, invalid child values must reset.
- Hidden child fields should not submit stale values unless explicitly intended.
- Conditional fields should have clear transition.
- Validation schema must match visible/active fields.

Example:

```text
Provider = OpenAI -> show API key field
Provider = Azure -> show endpoint + deployment fields
```

---

## 13. Form In Dialog

Dialog form rules:

- Header required.
- Footer normally required.
- Submit button in footer.
- Submit success closes dialog and refreshes data.
- Submit failure keeps dialog open.
- Long form body scrolls; header/footer stay sticky.
- Dirty close may require confirmation.

Size:

- 1-2 fields: small.
- 3-6 fields: medium.
- 7+ fields or sections: large.
- wizard/editor/large content: full.

---

## 14. Form On Page

Use page form when:

- workflow is long
- URL/share/reload should preserve state
- user needs review before submit
- form has many sections
- form includes child tables or complex previews

Rules:

- Page form should have clear page title.
- Primary submit action should be stable and easy to find.
- Long forms should use sections.
- Consider sticky action bar for very long forms.
- Dirty route leave should warn when possible.

---

## 15. Wizard Form

Use wizard for linear multi-step flows.

Rules:

- Show current step.
- Show completed/upcoming states.
- Back/Next controls in footer.
- Final step uses submit action.
- Validate current step before moving next.
- Preserve previous step values.
- Do not use tabs for linear required steps.

---

## 16. Accessibility

Rules:

- Label is associated with input.
- Error text is associated with field.
- Required state is exposed.
- Keyboard users can reach every field and action.
- Disabled reason is accessible.
- Focus first invalid field after failed submit.
- Do not rely on color only for errors.

---

## 17. AI Review Checklist

Before accepting AI-generated form code, verify:

- Form type matches task scope.
- Form context is clear: FilterBar, table inline, dialog, or detail page.
- FilterBar form uses real-time/debounced feedback, not global save.
- Table inline form is low-risk and uses row-level pending.
- Dialog/detail edit form uses whole-form save and required validation before submit.
- Labels are explicit.
- Placeholder is not used as label.
- Required/optional is clear.
- Units and empty value semantics are clear.
- Common field states are handled: default, focus, error, disabled.
- Input/Textarea/Select/Radio/SegmentedControl/Checkbox/Switch usage matches field semantics.
- Radio is used for visible, comparable choices and handles required/optional/disabled option rules.
- SegmentedControl is used only for compact single-choice mode/filter values, not content tabs or routes.
- Switch is used only for immediate binary state changes.
- DatePicker/DateRangePicker defines time, timezone, clear value, and range validation.
- NumberInput defines min/max/step/precision and distinguishes empty from zero.
- SecretInput does not expose or submit masked placeholder as real secret.
- FileUpload defines file type, size, progress, retry, and import error details.
- Combobox/Autocomplete handles debounce, loading, empty result, and selected label.
- TreeSelect defines parent-child behavior, half-selected state, and lazy loading if needed.
- TagInput handles separators, dedupe, validation, max count, and invalid tag state.
- CodeEditor/JSONEditor validates before submit and uses full dialog/page for large content.
- Submitted fields have stable names and clear payload semantics.
- Default values are explicit and reset behavior is correct.
- Conditional fields unregister/reset stale values intentionally.
- Dirty/touched/submitting/form-level error states are separated.
- Dependent fields reset and revalidate when parent value changes.
- Field arrays use stable item ids and clear removed item errors.
- Controlled components have clear value adapters and do not keep unsynced state.
- Server validation errors map back to field errors when possible.
- Validation is inline and field-specific.
- Required/rule validation runs before submit.
- Many-field forms use form submit semantics instead of ad-hoc button validation.
- Submit loading prevents duplicate submit.
- Failure preserves input.
- Dirty close behavior is defined.
- Reset restores correct initial values.
- Disabled fields/actions explain why.
- Dynamic fields reset stale child values.
- Dialog form uses sticky header/footer when long.
- Page form is used for large/shareable workflows.
- Accessibility basics are present.
