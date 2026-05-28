# Dropdown / Menu / Popover AI Rules

> Compact execution rules for AI-generated 2B dropdown, menu, and popover behavior.
> Use `dropdown-menu-popover-rules.md` as the detailed reference.

---

## 1. Component Boundary

Use by intent:

| Component | Use for |
|---|---|
| Dropdown/Menu | command or navigation list |
| Select | choosing form value |
| Popover | contextual rich content or compact controls |
| Tooltip | short read-only hint |
| Dialog/Drawer | long, complex, or multi-step content |

Rules:

- Do not use Menu as Select.
- Do not use Tooltip for interactive content.
- Do not use Popover for long workflows.
- Menu item can open dialog/drawer, navigate, execute action, toggle, or open submenu.

---

## 2. Menu Structure

Menu item types:

- action item
- navigation item
- external link item
- destructive item
- toggle/check item
- submenu item
- disabled item

Rules:

- Group related items.
- Use separators sparingly.
- Put destructive items last or in separate group.
- Disabled item stays visible when it explains unavailable action.
- Item label uses specific verb/noun.
- Use icon + label when consistent.
- Icon and label gap should be consistent.

---

## 3. Submenus And Groups

Rules:

- Limit submenu depth to 2 levels.
- Use submenu only when grouping is clearer than a dialog/drawer.
- Parent disabled state disables access to children.
- Child disabled state does not necessarily disable parent.
- On mobile, submenu usually becomes drill-in sheet/list.

Do not create deep cascading menus for critical workflows.

---

## 4. Click Results

Rules:

- Dialog/drawer result: close menu, then open overlay.
- Internal navigation: use link/router semantics.
- External navigation: show external-link affordance when possible.
- Execute operation: show pending/feedback and prevent duplicate trigger.
- Toggle/check: update state and keep/close menu intentionally.
- Dangerous action: use danger style and ConfirmDialog when high-risk.

---

## 5. Popover

Use Popover for:

- compact advanced filters
- short contextual panel
- small pickers
- read-only rich explanation
- quick metadata/details

Rules:

- Bound width/height for long content.
- Long content may scroll internally.
- No hard max character count for B2B explanatory content.
- If content becomes multi-section, form-heavy, or workflow-like, use drawer/dialog.
- Popover must have clear trigger and close behavior.

---

## 6. State And Accessibility

Rules:

- Trigger indicates open state when useful.
- Escape closes menu/popover.
- Click outside closes when safe.
- Focus returns to trigger after close when appropriate.
- Keyboard navigation works inside menu.
- Disabled reason is accessible.
- Mobile cannot depend on hover.

---

## 7. AI Checklist

- Component matches intent: menu, select, popover, tooltip, dialog/drawer.
- Menu groups and danger placement are clear.
- Submenus are limited and mobile-safe.
- Item click result is handled correctly.
- Navigation uses link/router semantics.
- Dangerous actions use ConfirmDialog when needed.
- Popover content is bounded and not workflow-heavy.
- Disabled states and reasons are accessible.
