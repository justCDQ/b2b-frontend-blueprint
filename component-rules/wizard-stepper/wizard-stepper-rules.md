# Wizard / Stepper Rules

> Use these rules for guided multi-step workflows in 2B products.
> Wizard is the workflow pattern. Stepper is the visual/navigation component that represents progress.

---

## 1. Component Boundary

Use Wizard / Stepper when the task has real sequence, dependency, or risk:

- Later input depends on earlier input.
- The task is too complex for one form but still belongs to one workflow.
- Each step has meaningful validation or user decision.
- The user needs to understand progress before final submission.
- The final action creates, changes, imports, deploys, or connects important resources.

Common 2B examples:

- Create project / workspace / application.
- Connect integration or data source.
- Import data with mapping and validation.
- Configure billing, permissions, deployment, or automation.
- Guided onboarding or system setup.
- Multi-step approval or publish flow.

Do not use Wizard / Stepper when:

- All fields are independent and fit one clear form.
- Splitting the form only reduces vertical height but adds navigation cost.
- The user needs to compare many sections at once.
- The page is primarily read-only detail.
- The workflow is better expressed as tabs, accordions, or one editable detail page.

Boundary with other components:

| Pattern | Use when |
|---|---|
| Single Form | Fields are few, independent, and can be saved together. |
| Dialog Form | Task is short, focused, and can be completed without leaving context. |
| Detail Edit Page | Form is large, shareable, review-heavy, or needs rich side data. |
| Tabs | Sections are peers and can be visited in any order. |
| Wizard / Stepper | Steps are sequential and progress affects completion. |

---

## 2. Step Design

Each step must define:

- `id`: stable key, not display text.
- `title`: short and specific.
- `description`: optional, only when it clarifies user intent.
- `content`: fields, options, preview, upload, mapping, or review content.
- `validation`: fields and rules owned by this step.
- `nextAvailability`: when the user may continue.
- `backBehavior`: whether going back is allowed and what state is preserved.
- `sideEffects`: whether this step triggers request, upload, preview, validation, or draft save.

Step titles should describe the actual decision, not a generic phase:

- Good: `Select source`, `Map fields`, `Review changes`, `Configure permissions`.
- Avoid: `Step 1`, `Basic info`, `More settings`, `Finish`.

Step count rules:

- 2-5 steps is the default comfortable range.
- 6-7 steps is acceptable only for complex setup/import flows.
- More than 7 visible steps should usually become grouped stages or a full setup page.
- Do not create a step for one trivial field unless that field changes the whole workflow.

Recommended layout:

```text
Header: workflow title + short description
Stepper: step label + status
Body: current step content
Footer: Back / Cancel / Next / Submit
```

Layout rules:

- Header stays consistent across steps.
- Footer action placement stays consistent across steps.
- The primary action is rightmost on desktop.
- Do not hide critical progress.
- Do not place unrelated global page actions inside the wizard footer.
- If a step contains a table/list, keep its local actions inside the step body.

---

## 3. Navigation Modes

Choose one navigation mode per wizard. Do not mix strategies without a clear reason.

| Mode | Use when | Behavior |
|---|---|---|
| Linear locked | Strict dependency exists. | User can only move by Back / Next. Future steps are locked. |
| Linear with completed jump | Most setup flows. | User can jump back to completed steps. Future steps remain locked. |
| Free navigation | Steps are independent sections. | User can move between steps freely; final submit validates all. |
| Route-backed steps | Long, recoverable, or shareable workflows. | Current step is represented by URL path/query. |

Navigation rules:

- `Next` validates the current step before moving forward.
- `Back` must preserve previous input.
- Jumping to completed steps is allowed only when it does not corrupt dependent later steps.
- If changing an earlier step invalidates later steps, mark affected later steps as stale or reset them explicitly.
- Do not silently discard later-step data after an earlier dependency changes.
- Future locked steps should be visible only if their presence helps explain progress.
- Locked steps need a reason when hover/focus/clicked.

Button rules:

- First step: show `Cancel` or context-specific secondary action, not disabled `Back`.
- Middle steps: show `Back` and `Next`.
- Last step: show `Back` and `Submit` / `Create` / `Import` / `Publish`.
- Button labels should describe the final action on the last step.
- Avoid generic `Done` for operations that create or mutate data.

---

## 4. Validation And Constraints

Validation follows ownership:

- Current-step fields are validated when clicking `Next`.
- Final submit validates all required data across all steps.
- Cross-step constraints appear near the affected field when possible.
- If a cross-step error cannot map to one field, show it in the step body and mark the step as error.
- Server validation errors must map back to the relevant step and field when possible.

Validation timing:

- Required fields: validate on Next / Submit.
- Simple format rules: validate on blur or Next.
- Expensive async validation: validate on blur, debounce, or Next; show pending.
- Upload/import validation: validate after file parse or server check.
- Review step: validate all steps again before final submit.

Error handling:

- Failed Next keeps the user on the current step.
- Failed Submit preserves all input and highlights affected steps.
- If server returns errors for a previous step, move the user to the first error step or provide a clear error summary with jump actions.
- Do not clear valid step data because another step failed.

---

## 5. Data Persistence And Recovery

In-step state must survive step navigation.

Rules:

- Going back and forward must not reset fields.
- Dirty data is preserved unless the user explicitly cancels or resets.
- File uploads, parsed previews, and mapping results must show stable pending/error/success states.
- If the workflow may take time, provide draft saving or autosave.
- If refresh/share recovery matters, persist current step in route/query and recover form state from server or local draft.

Draft strategy:

| Strategy | Use when |
|---|---|
| Local in-memory | Short wizard, low risk, no refresh recovery needed. |
| Local storage/session draft | Medium workflow, browser refresh recovery helpful. |
| Server draft | Long, business-critical, multi-user, or resumable workflow. |

Cancel rules:

- If there is no dirty data, cancel can close/leave directly.
- If there is dirty data, show a confirmation before discarding.
- If a server draft exists, provide clear wording: discard draft, keep draft, or continue editing.

---

## 6. Async And Pending Behavior

Wizard steps often contain async actions: fetch options, validate uniqueness, parse file, preview result, save draft, submit final action.

Rules:

- Step-level pending blocks only the affected step action.
- Field-level pending blocks only the dependent field or Next when necessary.
- Final submit pending disables submit and prevents duplicate requests.
- Back should usually remain available during non-final field validation, unless leaving would corrupt state.
- During final submit, avoid allowing navigation that creates duplicate or inconsistent operations.
- Use idempotency/request dedupe for final create/import/deploy actions when possible.

Duplicate prevention:

- `Next` cannot be triggered repeatedly while validation is pending.
- `Submit` cannot be triggered repeatedly while submission is pending.
- If a step action starts a long task, show the task status and do not pretend completion is immediate.

---

## 7. Step States

Supported states:

- `upcoming`: visible but not reached.
- `current`: active step.
- `completed`: user completed required input for this step.
- `stale`: completed before, but affected by later dependency changes.
- `error`: contains validation or server error.
- `locked`: cannot be entered yet.
- `pending`: async validation/save/submit is running.
- `disabled`: inaccessible due to permission or workflow state.

Rules:

- Completed means the step is locally valid, not necessarily submitted to server.
- Error state has higher priority than completed state.
- Pending state must prevent duplicate Next/Submit.
- Locked/disabled steps need a reason if users can interact with their label.
- Stale steps require re-check before final submit.
- The stepper should not overuse color alone; use text, icon, or accessible status as needed.

---

## 8. Review And Confirmation

Use a review step when:

- The workflow spans multiple important decisions.
- The final action is hard to reverse.
- The user needs to verify generated mapping, permission, billing, deployment, or import result.
- The final submit affects many records or external systems.

Review step rules:

- Summarize only decision-critical information.
- Group summary by step or domain section.
- Provide edit actions that jump back to the relevant step.
- After editing a previous step, return the user to review when appropriate.
- Show warnings, estimated impact, record counts, and irreversible consequences before final submit.

Dangerous/high-risk final action:

- Follow `action-system-rules` and `dialog-rules`.
- Use ConfirmDialog for destructive/high-risk confirmation.
- Confirmation text must name the target object/scope, action, and consequence.
- Do not use generic confirmation text such as `Are you sure?`.

---

## 9. Route And Page Placement

Choose placement by workflow size:

| Placement | Use when |
|---|---|
| Dialog wizard | 2-3 short steps, small form, low context needs. |
| Drawer wizard | User should keep list/detail context while completing a medium flow. |
| Full page wizard | Long, business-critical, shareable, resumable, or review-heavy flow. |

Rules:

- Long import/setup flows should usually be full page.
- Dialog wizard must not exceed dialog complexity rules.
- Drawer wizard must not become a cramped full-page replacement.
- Route-backed wizard should preserve current step and important identifiers.
- Browser Back behavior must be intentional: previous step, previous page, or leave flow.

---

## 10. Mobile

Rules:

- Collapse full stepper into `Step 2 of 5` plus current title when horizontal space is limited.
- Avoid horizontal overflow from long step labels.
- Keep footer actions reachable.
- Long content scrolls in the body; header/footer remain stable when used inside dialog/drawer.
- Prefer one primary action per footer row on small screens.
- If step content is complex table/list work, consider sending the user to a full page instead of mobile dialog.

---

## 11. Accessibility

Rules:

- Stepper must expose current step and step status to assistive technology.
- Keyboard users can reach step labels when labels are interactive.
- Locked/disabled steps are announced as unavailable.
- Error summary should be focusable after failed Next/Submit.
- Focus moves to the new step title or first invalid field after navigation/validation.
- Do not rely only on color to communicate completed/error/locked states.

---

## 12. Examples

Create integration:

```text
1. Select provider
2. Connect account
3. Configure sync
4. Review and enable
```

Import data:

```text
1. Upload file
2. Map fields
3. Validate records
4. Review impact
5. Import
```

Permission setup:

```text
1. Select users
2. Assign roles
3. Configure scope
4. Review changes
```

Avoid:

```text
1. Name
2. Description
3. Save
```

This should usually be a single form.

---

## 13. AI Review Checklist

- Wizard is justified over single form, tabs, dialog form, or detail edit page.
- Step order matches real dependency.
- Step count is reasonable.
- Step titles describe user decisions.
- One navigation mode is chosen and followed consistently.
- Next validates only the current step.
- Final submit validates all required data.
- Back preserves data.
- Earlier-step changes handle later-step invalidation explicitly.
- Completed/error/stale/locked/pending states are visible.
- Submit failure preserves all input and maps errors back to steps.
- Draft/recovery strategy exists when the flow is long or important.
- Dangerous final actions use ConfirmDialog.
- Mobile stepper is compact and usable.
