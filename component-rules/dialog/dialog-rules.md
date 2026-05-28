# Dialog Component System Rules

> Use these rules when building or reviewing dialogs in 2B products.
> Dialogs are for focused tasks: view detail, edit data, confirm risk, or complete a short workflow.

---

## 1. Platform Behavior

Dialog behavior must differ between desktop web and mobile.

### Desktop web

Desktop dialogs are centered modal windows.

Size is based on content complexity:

| Size | Use when |
|---|---|
| xs | ConfirmDialog, tiny prompt, alert |
| s | short form, 1-2 fields |
| m | normal form, 3-6 fields |
| l | complex form, multiple sections, preview/detail |
| full | large editor, large detail, multi-section workflow |

Rules:

- Dialog width and height must never exceed 80% of viewport.
- Full dialog means large bounded modal, not browser fullscreen.
- Do not handwrite random widths per page.
- Use size props or a shared size token.
- Use `xs/s/m/l/full` as the standard dialog size scale.
- If content cannot reasonably fill a 70vw drawer, choose an appropriate dialog size instead.
- ConfirmDialog is a special dialog type, usually `xs` or `s`.

### Mobile

Mobile supports only:

- very small centered dialog for tiny confirmation or alert
- bottom sheet dialog sliding from bottom

Rules:

- Forms, details, and workflows use bottom sheet.
- Small confirmation may use compact dialog only when content is tiny.
- Mobile dialog must not exceed viewport height.
- Bottom sheet content uses sticky header and footer.

Forbidden:

```text
Mobile complex form inside centered desktop-style modal.
Desktop full-screen takeover for a normal form.
```

---

## 2. Required Structure

Every dialog must have a header.

Standard structure:

```text
Dialog
  Header
    left: Title
    right: Close button
  Body
    content
  Footer optional
    actions
```

Rules:

- Header is always required.
- Title is required.
- Close button is on the right side of header.
- Footer is optional.
- Footer contains action buttons.
- Footer actions are right aligned on desktop.
- The more important action is farther right.

Example:

```text
[Edit User                              X]

Form fields...

                         Cancel   Save
```

Button priority:

```text
left -> less important
right -> more important
```

Good:

```text
Cancel   Save
Cancel   Delete
Back     Next
```

Bad:

```text
Save   Cancel
Delete   Cancel
```

---

## 3. Header

Header rules:

- Always visible.
- Contains title on the left.
- Contains close button on the right.
- May include short description under title if needed.
- Close button must have accessible name.
- Close button touch target must be large enough on mobile.

Title rules:

- Title names the current task or object.
- Do not use vague titles such as “Prompt” or “Info” when a specific title is possible.

Good:

```text
Edit Token
Delete User
Order Details
Configure Channel
```

Bad:

```text
Dialog
Detail
Operation
```

---

## 4. Body

Body contains task content.

Rules:

- Body is the only area that scrolls when content is long.
- Header remains sticky.
- Footer remains sticky if present.
- Body should not create nested scroll containers unless absolutely required.
- Hide visual scrollbars while preserving scroll behavior.
- Content must not be hidden behind sticky header/footer.

Long content layout:

```text
sticky Header
scrollable Body
sticky Footer
```

Forbidden:

```text
Whole dialog scrolls and header disappears.
Footer scrolls away while user edits a long form.
Nested scroll areas inside dialog body.
Visible thick scrollbars inside the dialog.
```

---

## 5. Footer

Footer is optional.

Use footer when:

- dialog has submit/cancel actions
- dialog has destructive confirmation
- dialog has wizard navigation
- dialog changes data

Footer may be omitted when:

- dialog is read-only detail
- content has its own clearly scoped actions
- dialog is a simple preview with only close

Rules:

- Footer is sticky when body scrolls.
- Desktop footer actions align right.
- Mobile footer actions stack or use full-width buttons when needed.
- Primary action is visually primary.
- Destructive action uses destructive style.
- Loading state disables conflicting actions.

---

## 6. Scrolling

Use bounded dialog layout.

Rules:

- Desktop max width <= 80vw.
- Desktop max height <= 80vh.
- Mobile max height should fit viewport safely.
- Header and footer do not scroll out.
- Body scrolls.
- Scrollbar should be hidden visually.

Implementation concept:

```text
DialogContent: max-w <= 80vw, max-h <= 80vh, display flex column
Header: sticky top
Body: flex-1 overflow-y-auto scrollbar-none
Footer: sticky bottom
```

Do not:

```text
Set body to fixed height without considering header/footer.
Put overflow-y-auto on multiple nested children.
Let footer overlap body content.
```

---

## 7. Full Dialog Layout

`full` dialog is not browser fullscreen.

It is a large bounded workspace inside the viewport.

Use full dialog for:

- large detail view
- multi-section form
- tabs + form
- file upload
- token/config editor
- long JSON/prompt/log viewer
- split-pane editor
- content that needs a fixed-height workspace

Structure:

```text
ResponsiveDialogContent size="full"
  Header sticky
    Title / Description
    Close button

  Body scrollable
    Main content
    Forms / Tabs / Editor / Table / Preview

  Footer sticky optional
    Secondary action
    Primary action
```

Required layout:

```text
DialogContent: flex flex-col overflow-hidden, max <= 80vw/80vh
Header: shrink-0 sticky top-0 z-10
Body: flex-1 overflow-y-auto scrollbar-none
Footer: shrink-0 sticky bottom-0 z-10
```

Example:

```jsx
<ResponsiveDialogContent size="full" className="flex flex-col overflow-hidden">
  <ResponsiveDialogHeader className="shrink-0 sticky top-0 z-10">
    <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
    <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
  </ResponsiveDialogHeader>

  <div className="flex-1 overflow-y-auto scrollbar-none px-4 sm:px-6">
    {children}
  </div>

  <ResponsiveDialogFooter className="shrink-0 sticky bottom-0 z-10">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </ResponsiveDialogFooter>
</ResponsiveDialogContent>
```

Rules:

- Outer content never exceeds `80vw` / `80vh` on desktop.
- Header is always visible.
- Footer is always visible when present.
- Only body scrolls.
- Body keeps enough bottom padding so footer does not cover content.
- Scrollbar is visually hidden but scrolling still works.
- Do not create multiple large scroll containers inside body.
- Tabs may live below header or at body top.
- Decide whether tabs should be sticky; do not leave this accidental.
- Use full dialog only when users need a temporary large workspace but not a route page.

Forbidden:

```text
Full dialog for a 2-field form.
Full dialog that fills the browser without viewport margin.
Whole full dialog scrolls and header disappears.
Footer overlaps the last form fields.
Nested body sections each scroll independently.
```

---

## 8. Size Choice

Choose size by task complexity.

| Content | Size |
|---|---|
| confirmation only / alert | xs |
| ConfirmDialog | xs or s |
| 1-2 fields | s |
| 3-6 fields | m |
| 7+ fields | l |
| tabs / multi-section | l |
| wizard | l or full |
| large read-only detail | l or full |
| editor / upload / large dataset | full |

Rules:

- Prefer slightly larger over cramped forms.
- Do not use full size for simple forms.
- Do not force complex forms into xs/s dialogs.
- Dialog size is based on content, not on who opened it.
- If content is too large for `l`, use `full` or route page depending on shareability.
- If content feels sparse at `l/full` or 70vw drawer, choose smaller dialog size.
- Do not handwrite one-off widths; use shared size tokens.

Recommended size scale:

```text
xs: compact confirmation / alert
s: short form
m: standard form
l: complex form/detail
full: bounded workspace dialog, max 80vw/80vh
```

---

## 9. Confirm Dialog

Use confirm dialog for destructive or high-risk actions.

ConfirmDialog is a special dialog type for short confirmation content.

Examples:

- delete
- disable
- remove member
- reset key/token
- cancel subscription
- clear data
- revoke access
- terminate task

Rules:

- Destructive/high-risk confirmation uses ConfirmDialog no matter where the action is triggered: page, table row, card, menu, drawer, dialog, or form.
- ConfirmDialog contains only title, description/body, and action buttons.
- ConfirmDialog does not contain forms, tables, tabs, or long workflows.
- ConfirmDialog is usually `xs` or `s`.
- Use destructive style for destructive actions.
- Destructive confirm dialog should have a visually distinct danger treatment.
- Danger treatment may include danger icon, danger title/accent, and danger confirm button.
- Keep danger styling controlled; do not turn the whole dialog into a large red panel.
- Confirmation must name the exact object or scope.
- Confirmation must name the exact action.
- Confirmation must explain the consequence.
- Confirmation must explain whether the action is irreversible or how it can be recovered.
- Confirm button text must be action-specific.
- Loading state disables confirm and cancel.
- Success closes dialog.
- Failure keeps dialog open and shows error.
- Do not use browser `confirm()`.

Required structure:

```text
ConfirmDialog
  Title: {Action} {object type}
  Description:
    Primary confirmation sentence naming object/scope.
    Consequence sentence.
    Irreversible/recovery sentence.
  Actions:
    Cancel
    Danger confirm action
```

Copy rules:

- Do not write only `Confirm delete?`.
- Do not use vague title such as `Confirm` for dangerous actions.
- Prefer `Delete {object type}` as title.
- Body should say `Confirm deleting {object type} "{object name}"?` or equivalent.
- If object name is unknown, use stable identifier, count, or scope.
- Batch body must include selected count and object type.
- Confirm button should be a short action verb, optionally with count.
- Avoid generic confirm labels such as `OK`, `Confirm`, or `Submit`.

Good:

```text
Title: Delete Token
Description: Confirm deleting Token "prod-api-key"? Requests using this token will fail immediately. This cannot be undone.
Cancel: Cancel
Confirm: Delete
```

Bad:

```text
Title: Confirm
Description: Are you sure?
Confirm: OK
```

Batch confirm:

```text
Title: Delete selected Tokens
Description: Confirm deleting 12 selected Tokens? These tokens will stop working immediately. This cannot be undone.
Confirm: Delete 12 items
```

Very high-risk confirm:

```text
Title: Clear production data
Description: Confirm clearing all production events for Project "Production API"? Existing analytics and audit exports will no longer include this data. This cannot be undone.
Required input: Production API
Confirm: Clear data
```

---

## 10. Form Dialog

Use form dialog for focused create/edit/config tasks.

Rules:

- Form dialog must have header.
- Form dialog normally has footer.
- Submit button lives in footer.
- Cancel/close is secondary.
- Submit loading prevents duplicate submit.
- Submit loading disables conflicting actions.
- Validation errors show inline near fields.
- Submit success closes dialog and refreshes related data.
- Submit failure keeps dialog open and preserves user input.
- Do not clear form before submit success.

Footer examples:

```text
Cancel   Save
Cancel   Create
Back     Next
Cancel   Upload
```

Dirty state:

- If form has unsaved changes, closing may require confirmation.
- Dirty close confirmation should explain that changes will be lost.
- If form is submitting, do not allow accidental close unless explicitly supported.

Close behavior:

| State | X / Cancel / Overlay / ESC |
|---|---|
| pristine | allow close |
| dirty | confirm before close |
| submitting | block or require explicit confirmation |
| submit failed | allow close, but preserve input while open |

Validation:

- Blocking validation uses inline errors.
- Toast may be used only for form-level or cross-field errors.
- Field errors should not be replaced by generic toast.

Good:

```text
User edits fields
Click Save
Save button loading
Success -> close dialog -> refresh list
Failure -> keep dialog open -> preserve input -> show field/form error
```

Bad:

```text
Failure -> close dialog
Failure -> clear form
Click Save repeatedly sends duplicate requests
```

---

## 11. Dialog vs Route Page

Do not use dialog as a replacement for every page.

Use dialog when:

- Task is short and focused.
- User should return to current list context after finishing.
- Content is supplementary detail.
- Form is limited in scope.
- The state does not need a shareable URL.

Use route page when:

- Detail is a workspace.
- Content has multiple major sections.
- User may stay for a long time.
- User needs shareable URL.
- Browser refresh/back/forward should preserve state.
- The page contains child tables, audit logs, charts, or complex operations.
- The workflow is too large for one temporary modal.

Use full dialog only when:

- User needs a temporary large workspace.
- The task still belongs to the current context.
- A route page would be too heavy for the workflow.

Rules:

- Full dialog must not become a hidden route page.
- If users need to copy a link to the detail, use route page.
- If users need several independent operations inside the detail, use route page.
- If the dialog requires deep navigation, use route page.

Decision:

| Need | Use |
|---|---|
| quick confirm | confirm dialog |
| small create/edit | form dialog |
| quick read-only detail | detail dialog |
| large temporary workspace | full dialog |
| shareable/detail workspace | route page |

---

## 12. AI Review Checklist

Before accepting dialog code, verify:

- Mobile and desktop behavior are different.
- Desktop dialog stays within 80vw and 80vh.
- Mobile complex dialog uses bottom sheet.
- Header always exists.
- Header has title left and close button right.
- Footer is optional but correct when actions exist.
- Footer buttons are ordered from less important to more important.
- Long content scrolls only in body.
- Header and footer are sticky when content scrolls.
- Scrollbars are visually hidden.
- No nested scroll containers unless strongly justified.
- Dialog size matches content complexity.
- Dialog uses standard `xs/s/m/l/full` size scale.
- Small confirmation uses ConfirmDialog, usually `xs` or `s`.
- Content that cannot fill 70vw drawer uses Dialog instead of Drawer.
- Full dialog is bounded workspace, not browser fullscreen.
- Full dialog uses `flex flex-col overflow-hidden`.
- Full dialog body is the only scroll area.
- Full dialog footer does not cover body content.
- Tabs inside full dialog have an intentional sticky/non-sticky decision.
- Dangerous actions use confirm dialog with object, action, and consequence.
- Dangerous confirm dialog uses distinct but controlled danger styling.
- ConfirmDialog contains only title, description/body, and actions.
- Dangerous confirm title names the action and target type.
- Dangerous confirm body names the exact object/scope and explains consequence.
- Dangerous confirm copy states irreversibility or recovery path.
- Dangerous confirm does not use generic copy such as `Confirm`, `Are you sure?`, or `OK`.
- Batch dangerous confirm includes selected count and target type.
- Very high-risk confirm requires exact target-name input when appropriate.
- Confirm loading disables confirm and cancel.
- Form submit loading prevents duplicate submit.
- Form submit failure preserves input and keeps dialog open.
- Dirty form close behavior is defined.
- Dialog vs route page choice is justified.
