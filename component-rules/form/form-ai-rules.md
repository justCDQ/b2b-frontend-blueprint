# Form AI Rules

> Compact execution rules for AI-generated 2B form behavior.
> Use `form-rules.md` as the detailed reference.

---

## 1. Form Contexts

Choose behavior by context:

| Context | Behavior |
|---|---|
| FilterBar form | realtime or debounce-driven query changes |
| Table inline form | small safe immediate edit |
| Dialog form | create/edit, submit once with validation |
| Detail page form | large edit mode, submit once with validation |
| Wizard form | step-owned validation plus final full validation |

Rules:

- Filter fields may trigger request immediately or after debounce.
- Dialog/detail/wizard forms submit only after explicit Save/Submit.
- Inline table edits must be low-risk and easy to recover.
- Large or multi-section forms should be page edit mode, not cramped dialog.

---

## 2. Field Components

Use semantic field components:

- Input: short text.
- Textarea: long text.
- Select: finite option list.
- Combobox/Autocomplete: searchable remote or large option list.
- Radio: small visible single-choice set.
- SegmentedControl: compact single-choice mode/filter value, not route/tab.
- Checkbox: boolean or multi-select list.
- Switch: immediate on/off state.
- DatePicker/DateRangePicker: date/time range.
- NumberInput: numeric value with min/max/step when relevant.
- Password/SecretInput: masked sensitive value.
- FileUpload: file input with validation.
- TreeSelect: hierarchical options.
- TagInput: multiple freeform/known tokens.
- Code/JSON editor: structured technical input.

---

## 3. Field States

Every field must support:

- default
- focus
- filled
- error
- disabled
- readonly when needed
- loading/pending when async

Rules:

- Error text stays near the field.
- Disabled field has a reason when not obvious.
- Required state is visually and semantically clear.
- Focus state must be visible.
- Do not use placeholder as the only label.
- Mobile inputs must avoid font sizes that trigger browser zoom.

---

## 4. Validation

Rules:

- Required fields validate before submit.
- Simple format rules validate on blur or submit.
- FilterBar input uses debounce before request.
- Expensive async validation uses debounce/blur/submit and shows pending.
- Multi-select popover usually applies after user confirms selection.
- Server field errors map back to fields when possible.
- Cross-field errors appear near affected fields or as a form-level error.
- Do not clear valid inputs when another field fails.

For many fields:

- Use native form submit semantics or a form controller.
- The submit button should be `type="submit"` or equivalent semantic submit.

---

## 5. Dependencies And Dynamic Fields

Rules:

- Dependent fields reset or become stale when parent value changes.
- Do not silently keep invalid child values after parent changes.
- Hide dynamic fields only when they are irrelevant.
- Preserve hidden field values only when the workflow expects recovery.
- Field arrays must support add/remove/reorder with stable keys.
- Conditional required rules must be explicit.

---

## 6. Submit

Rules:

- Submit validates required and rule-based fields before request.
- Submit pending disables submit and prevents duplicate submit.
- Cancel remains available unless leaving would corrupt state.
- Submit success clears dirty state and closes/navigates only after success.
- Submit failure preserves all input.
- Server errors map to fields or form-level message.
- Destructive/high-risk submit uses ConfirmDialog.

Do not:

- Navigate away before save succeeds.
- Reset form on failed submit.
- Use vague submit labels like `OK` for mutations.

---

## 7. Dirty State And Reset

Rules:

- Dirty form leaving/closing requires confirmation.
- Reset restores initial/default values intentionally.
- Async-loaded default values must not overwrite user edits.
- Changing route with dirty form should warn when possible.
- Draft/autosave is required for long or critical forms.

---

## 8. Disabled And Permission

Rules:

- Field disabled due to permission must explain when safe.
- Readonly is preferred when value should be visible but not editable.
- Hide fields only when the user should not know they exist.
- Submit action should be hidden/disabled according to permission rules.
- Disabled form controls must remain accessible.

---

## 9. Responsive

Rules:

- Multi-column forms become single-column on narrow layouts.
- Field order follows task flow, not desktop visual position.
- Helper/error text remains close to field.
- Dialog form may become sheet on mobile.
- Long forms should use page edit mode on mobile when dialog would be cramped.

---

## 10. AI Checklist

- Form context determines realtime vs explicit submit.
- Fields use semantic components.
- Labels are not placeholder-only.
- Required/error/disabled/focus states exist.
- Validation timing matches field cost and context.
- Server errors map to fields when possible.
- Dependencies handle stale/reset values explicitly.
- Submit has pending and duplicate prevention.
- Failed submit preserves input.
- Dirty close/route leave is guarded.
- Responsive layout keeps field order and errors usable.
