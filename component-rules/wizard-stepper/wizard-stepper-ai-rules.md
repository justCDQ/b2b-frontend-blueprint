# Wizard / Stepper AI Rules

> Compact execution rules for AI-generated 2B wizard/stepper behavior.
> Use `wizard-stepper-rules.md` as the detailed reference.

---

## 1. When To Use

Use Wizard/Stepper when:

- task is truly sequential
- later steps depend on earlier input
- each step has meaningful validation or decision
- progress matters
- final action creates/changes/imports/deploys/connects important resources

Do not use when:

- fields are independent and fit one form
- tabs/accordion/detail edit page is more natural
- splitting only reduces height but adds friction
- user needs to compare sections freely

---

## 2. Step Contract

Each step must define:

- stable `id`
- specific `title`
- optional description
- content
- validation owner
- next availability
- back behavior
- side effects/request behavior

Rules:

- Step title describes the user decision.
- Default comfortable range is 2-5 steps.
- More than 7 visible steps usually needs grouping or full setup page.
- Do not create a step for one trivial field unless it changes later workflow.

---

## 3. Navigation

Choose one mode:

- linear locked
- linear with completed jump
- free navigation
- route-backed steps

Rules:

- `Next` validates current step.
- `Back` preserves input.
- Completed steps can be revisited only when safe.
- Future locked steps stay locked unless workflow allows.
- If earlier changes invalidate later data, mark later steps stale or reset explicitly.
- Do not silently discard later-step data.
- Last action label describes final operation: Create, Import, Publish, Save.

---

## 4. Validation And Submit

Rules:

- Next validates only current step fields.
- Final submit validates all required data.
- Cross-step errors map to affected field/step when possible.
- Server errors map back to step/field when possible.
- Failed submit preserves all input.
- Async validation shows pending and prevents duplicate Next/Submit.
- Review step revalidates before final submit.

---

## 5. Persistence And Pending

Rules:

- Step navigation must not reset fields.
- Dirty data is preserved unless user explicitly cancels/resets.
- Long/critical workflows need draft saving or autosave.
- Refresh/share recovery uses route/query plus server/local draft.
- Final submit pending disables submit and prevents duplicate requests.
- Non-final field validation should not block Back unless leaving corrupts state.

---

## 6. Step States

Support:

- upcoming
- current
- completed
- stale
- error
- locked
- pending
- disabled

Rules:

- Completed means locally valid, not server-submitted.
- Error has higher priority than completed.
- Stale requires re-check before final submit.
- Locked/disabled steps need reason when interactive.
- Do not rely on color only.

---

## 7. Review And Confirmation

Use review step when:

- final action is hard to reverse
- decisions span multiple steps
- import/deploy/billing/permission impact needs confirmation

Rules:

- Review summarizes only decision-critical information.
- Provide edit actions back to specific steps.
- Dangerous/high-risk final action uses ConfirmDialog.
- Confirm text names target, action, and consequence.

---

## 8. Placement And Responsive

Rules:

- Dialog wizard: 2-3 short steps.
- Drawer wizard: medium flow while preserving context.
- Full page wizard: long/shareable/resumable/review-heavy flow.
- Mobile collapses stepper to step count + current title.
- Complex mobile step content should use full page, not cramped dialog.

---

## 9. AI Checklist

- Wizard is justified over single form/tabs/detail edit.
- Step order matches real dependency.
- One navigation mode is chosen.
- Next validates current step.
- Final submit validates all steps.
- Back preserves input.
- Earlier-step changes handle later invalidation.
- Step states include error/stale/pending/locked.
- Draft/recovery exists for long workflows.
- Dangerous final action uses ConfirmDialog.
