# Dropdown / Menu / Popover Rules

> Use these rules for compact overlays that expose choices, commands, or secondary controls in 2B products.

---

## 1. Component Boundary

Use `Dropdown/Menu` for actions or choices. Use `Popover` for small interactive content.

| Component | Use for | Not for |
|---|---|---|
| DropdownMenu | command list, row overflow, user menu | forms with many fields |
| Select menu | choosing one/multiple values | destructive commands |
| Popover | compact filters, details, small controls | long workflows |
| Tooltip | hover/focus explanation, including longer read-only explanations when bounded | interactive content |
| Context menu | secondary commands by right click | primary workflows |
| Command palette | global command search | local row overflow |

Rules:

- Menu items trigger commands or navigation.
- Popover can contain controls but must stay compact.
- Long forms belong in dialog/drawer/page, not popover.
- Destructive commands in menu must be visually marked and confirmed when needed.
- Do not use DropdownMenu as a substitute for Select.
- Do not use Tooltip for clickable content.
- Do not use Popover for a workflow that needs persistent URL state.
- If the overlay content needs scrolling, sections, validation, or save/cancel workflow, consider Dialog/Drawer.

Decision:

| Need | Choose |
|---|---|
| choose value in form | Select / Combobox |
| show extra row actions | DropdownMenu |
| show compact advanced filters | Popover or Sheet on mobile |
| show explanation without interaction | Tooltip |
| show help with links/controls | Popover |
| long edit/create flow | Dialog / Drawer / Page |

---

## 2. Structure

Menu item structure:

```text
Icon  Label                 Shortcut/Meta
```

Rules:

- Use icon + label when possible.
- Icon and label gap is 8px.
- Menu width should be consistent within product context.
- Item labels use clear verbs.
- Dangerous item icon and text use danger color.
- Dangerous items are usually last and separated when needed.
- Disabled item needs reason on hover/focus when possible.
- Item height should be consistent.
- Menu item text should not wrap by default.
- Use truncation for long item labels with tooltip only when unavoidable.
- Group related items with separators or group labels.
- Do not create visual noise with separators after every item.
- Shortcut/meta text is optional and right aligned.

### Menu item types

| Type | Use for |
|---|---|
| command item | run local action |
| navigation item | move to route/view |
| external link item | open external page |
| checkbox item | toggle menu-visible option |
| radio item | choose one menu-visible option |
| danger item | destructive/risky command |
| disabled item | visible but unavailable command |
| loading item | command currently pending |
| submenu item | reveal a nested command group |

Rules:

- Navigation item uses link/navigation semantics.
- External link item must clearly indicate it opens an external destination.
- Checkbox/radio menu items are for lightweight menu-local choices; complex form choices use Select/Popover.
- Danger item is not hidden inside checkbox/radio group.
- Loading item must prevent repeated command execution.
- Disabled item must not fire command.
- Submenu item should be used sparingly and only for closely related commands.

### Ordering

Recommended order:

```text
Primary safe commands
Secondary safe commands
Navigation/help
Separator
Dangerous commands
```

Rules:

- Most common safe action appears first.
- Dangerous actions appear last.
- Do not place Delete next to View/Edit without separation when accidental click risk is high.

### Grouping

Use groups when a menu has different command categories.

Rules:

- Group related commands together.
- Use separators between groups.
- Use group labels only when they add clarity.
- Do not over-separate tiny menus.
- Danger group is last.
- Help/docs/navigation group should not interrupt primary command group.
- Keep group order stable across similar menus.

Example:

```text
Edit
Duplicate
Move
---
View logs
Open in external console
---
Delete
```

### Submenus

Use submenu only when a flat menu would become too long or commands naturally form a second-level category.

Good submenu cases:

- Move to group -> group list
- Change status -> status options
- Export as -> CSV / XLSX / JSON
- More permissions -> role options

Rules:

- Avoid more than 2 levels. Do not create third-level menus.
- Do not put dangerous commands deep inside a submenu unless the submenu itself is clearly dangerous.
- Parent item must indicate it opens a submenu.
- Submenu opens on hover/focus/click according to platform pattern.
- Keyboard users must be able to enter and leave submenu.
- Submenu must stay inside viewport and not cover the parent menu completely.
- On mobile, submenu should usually become a drill-in sheet/list instead of hover submenu.
- If submenu contains many searchable choices, use dialog/drawer/select instead.

Forbidden:

```text
More -> Advanced -> Danger Zone -> Delete
```

Better:

```text
Delete appears as a visible danger item in the final group.
```

---

## 3. Placement And Trigger

Rules:

- Row overflow trigger uses `MoreHorizontal`.
- Toolbar overflow can use `MoreHorizontal` or `MoreVertical` based on layout.
- Trigger must have accessible name.
- Overlay should align to trigger and stay inside viewport.
- Do not cover the triggering row's critical content when avoidable.
- On mobile, dense popovers should become bottom sheet or full-width menu.
- Trigger visual state should indicate open state.
- Icon-only trigger requires tooltip/accessibility label.
- Trigger must be large enough for touch on mobile.
- Do not use hover-only trigger for critical commands.
- Overlay should use collision detection/flip when near viewport edge.
- Overlay z-index must be above local content but below modal dialogs.

### Common triggers

| Context | Trigger |
|---|---|
| table row overflow | `MoreHorizontal` icon button |
| toolbar more actions | `MoreHorizontal` or labeled More |
| user/account menu | avatar/name button |
| advanced filter | labeled button with count |
| help popover | help/info icon or text link |

Rules:

- Advanced filter trigger should show active count when filters are active.
- Row overflow trigger must not trigger row click.
- Toolbar overflow trigger should not hide required primary actions.

---

## 4. Interaction

Rules:

- Click outside closes overlay.
- Escape closes overlay.
- Selecting a menu command closes menu unless the command opens a confirmation.
- Popover with form controls closes only on explicit apply/cancel or outside behavior defined by product.
- Keyboard users can move through items.
- Focus returns to trigger after close when appropriate.
- Enter/Space activates focused item.
- Arrow keys move within menu when menu semantics are used.
- Tab behavior must not trap the user unless overlay is modal.
- Opening one overlay should close sibling overlays in the same scope.
- Menu command that opens confirm dialog should close menu and open dialog.
- Do not keep a stale menu open after row/list data changes.

### Menu item result types

Menu item clicks usually have one of these results:

| Result | Behavior |
|---|---|
| open dialog/drawer | close menu, then open dialog/drawer |
| internal navigation | close menu and navigate using router/link semantics |
| external navigation | open external URL with clear affordance |
| execute action | close menu or keep item pending based on action duration |
| open submenu | keep parent menu context and reveal submenu |
| toggle/check | keep menu open when multiple choices are expected, close when choice is final |

Rules:

- Opening a dialog/drawer from menu should not leave the menu open behind it.
- Navigation items should use link semantics, not mutation-style button handlers.
- External navigation must show external-link affordance when possible.
- Executing a mutation must enter pending state and prevent duplicate execution.
- Long-running menu actions should close menu and show toast/task/progress state.
- Quick local toggles can keep menu open if user may toggle multiple items.
- Destructive menu action opens confirm dialog; menu is not the confirmation.

### External links

Rules:

- External link item should use external-link icon or text hint when helpful.
- External link opens in new tab/window when leaving the product context.
- Use `rel="noopener noreferrer"` for new-tab external links.
- Label should name destination, not just `Open`.
- If external destination requires permission or integration setup, disabled/hidden rules apply.

Examples:

```text
Open in Stripe
View in GitHub
Open provider console
```

### Close behavior

| Overlay | Close when |
|---|---|
| command menu | item select, outside click, Escape |
| select menu | option select or explicit close for multi-select |
| filter popover | Apply/Cancel/outside per product policy |
| help popover | outside click, Escape |
| mobile sheet | close button, Apply/Cancel, backdrop if safe |

Rules:

- If popover has unsaved local changes, outside close behavior must be explicit.
- If apply is required, outside close should discard or confirm based on product policy.
- If content is read-only, outside close is safe.

---

## 5. State

Rules:

- Loading menu action should show pending or disable the item.
- Disabled item must not fire command.
- Permission-hidden commands are not rendered when user should not know they exist.
- Permission-disabled commands explain reason when visible.
- Menu should not contain stale actions for the current object state.
- Pending state should be scoped to the command/item.
- Row menu pending should be keyed by rowKey.
- Menu should close or update after action success depending on action type.
- Action failure should restore item availability and show toast/inline reason by scope.
- If permissions change, menu content should update before opening.

### Permission and disabled

Rules:

- Hide commands the user should never see.
- Disable commands that may become available after state/permission changes.
- Disabled icon/menu items need accessible reason.
- Permission-disabled copy must not expose internal policy codes.
- Dangerous disabled item still needs clear disabled reason if visible.

### Disabled menu items

Rules:

- Disabled item remains visible only when it helps explain availability.
- Disabled item cannot receive action execution.
- Disabled item should expose reason on hover/focus when possible.
- Disabled item should not be styled the same as enabled item.
- If disabled reason is critical on mobile, provide tap-accessible reason or inline text.
- If a disabled parent submenu has no enabled children, disable the parent and explain why.
- If only some submenu children are disabled, keep parent enabled and disable specific children.

Examples:

```text
Export disabled -> "No export permission"
Delete disabled -> "Archived records cannot be deleted"
Move to group disabled -> "Select at least one active item"
```

### Dangerous items

Rules:

- Danger item icon and label use danger color.
- Danger item is last in its group.
- Danger command opens confirm dialog when destructive/high-risk.
- Confirm dialog must name object/scope/action/consequence.
- Menu itself does not serve as confirmation.

---

## 6. Popover For Filters

Rules:

- Use popover for compact advanced filters.
- Show active count on trigger.
- Provide Reset/Apply when changes are not immediate.
- Do not duplicate L1 FilterBar controls.
- If content becomes tall or multi-section, use dialog/drawer instead.
- Filter popover should use field labels.
- Filter popover should preserve draft values until Apply when using explicit apply.
- Reset inside popover clears only popover filters unless labeled global clear.
- Apply updates URL/query state and closes popover when successful.
- Query-changing Apply resets page and clears selection.
- Loading inside popover should not block the whole list unless query is applying.

### Popover size and content limits

Rules:

- Keep popover content to one compact task.
- Popover can contain long read-only explanatory content when bounded by max width and max height.
- Long popover content must scroll inside the popover body, not grow beyond viewport.
- Popover should define max-width and max-height relative to viewport.
- Header/action areas should remain visible when popover content scrolls if the popover has Apply/Reset.
- Do not set hard character-count limits for B2B explanatory content.
- Use readability constraints instead: width, line length, spacing, and scroll area.
- Avoid too many editable fields in one popover; if the user must fill many fields, use Drawer/Dialog.
- Avoid nested popovers.
- Avoid table/list inside popover except tiny pickers.
- If content needs search, multi-section layout, or long interactive scrolling, use Drawer/Dialog.

Recommended sizing:

```text
Small popover: content-sized, bounded by viewport
Filter popover: fixed/min width, max-height within viewport
Long help popover: readable width + max-height + internal scroll
```

---

## 7. Mobile Behavior

Rules:

- Menus must be touch-friendly.
- Hover-only affordances do not work on mobile.
- Dense row overflow menus can remain menus if item count is small.
- Advanced filter popover should become bottom sheet when content is dense.
- Bottom sheet should have title, close, and Apply/Reset when filter state is edited.
- Menu item height should support touch targets.
- Tooltip-only disabled reasons need mobile alternative.

---

## 8. Accessibility

Rules:

- Trigger has accessible name and expanded state when applicable.
- Menu items are keyboard reachable.
- Focus moves predictably on open/close.
- Disabled reason is accessible.
- Icon-only items have labels.
- Danger state is not color-only.
- Popover with form controls has labeled fields.
- Escape closes non-modal overlays.

---

## 9. AI Review Checklist

- Dropdown/Menu/Popover choice matches content complexity.
- Menu items use clear icon + label.
- Dangerous menu items are marked and confirmed when needed.
- Disabled/permission states are handled.
- Trigger has accessible name.
- Keyboard and Escape behavior works.
- Mobile dense overlay has bottom-sheet alternative.
- Menu item order separates common safe commands from dangerous commands.
- Menu grouping is meaningful and not overused.
- Submenus are limited to 2 levels and have mobile drill-in alternative when needed.
- Disabled parent/child submenu states are handled correctly.
- Row overflow does not trigger row click.
- Popover does not contain long workflow or many fields.
- Long popover content has bounded width/height and internal scroll.
- No hard max character count is enforced for explanatory B2B tooltip/popover content.
- Filter popover updates URL/query state correctly.
- Pending/disabled commands do not fire.
- Menu item result type is handled correctly: dialog, navigation, external link, operation, submenu, toggle.
- External links have clear destination labels and safe new-tab behavior when needed.
- Command items close/update menu according to action duration and pending state.
- Focus returns to trigger when appropriate.
