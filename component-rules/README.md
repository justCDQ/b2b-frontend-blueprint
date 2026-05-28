# B2B Component Rules

> A bilingual rules library for building 2B console interfaces.
> Each module has human-readable rules and AI-executable compact rules.

---

## File Convention

Each component/interaction module lives in its own folder:

```text
component-rules/{module}/
```

Each module contains four files:

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```

Use the human-readable files for product/design discussion and detailed review.

Use the AI files for code generation, code review, CLI template generation, and prompt bundles.

---

## Directory Map

| Module | Purpose |
|---|---|
| `action-system` | Button/action priority, scope, pending, disabled, dangerous actions. |
| `card-list` | Card list boundaries, compact cards, responsive grid, selection. |
| `detail-page` | Resource detail pages, route state, related data, edit mode. |
| `dialog` | Dialog sizes, structure, ConfirmDialog, form dialogs, route boundary. |
| `drawer-side-panel` | Drawer/side panel boundaries, width, nested drawer, mobile sheet. |
| `dropdown-menu-popover` | Dropdown, menu, submenu, popover, long content, disabled state. |
| `feedback-toast` | Toast boundary, placement, duration, severity, mobile behavior. |
| `filter-bar` | Search, filters, advanced filters, refresh, clear, batch actions. |
| `form` | Form contexts, field types, validation, submit, dirty state. |
| `list-page` | List page structure, table/card boundary, data flow, pagination, batch. |
| `navigation-ia` | Information architecture, route levels, breadcrumb/back, workspace scope. |
| `page-header-layout-shell` | Shell, page header, content width, header actions, responsive chrome. |
| `responsive-layout` | Container-aware layout, responsive transforms, state consistency. |
| `state-view` | Loading, empty, error, permission, toast boundary, StateView actions. |
| `status-badge` | StatusBadge/Tag color semantics, text, clickable status, tooltip. |
| `table` | Table base, columns, actions, selection, disabled, pagination, mobile. |
| `tabs-navigation` | Tabs, SegmentedControl, Route Navigation semantics. |
| `timeline-activity-log` | Timeline, Activity Log, Audit Log, Task Log. |
| `tooltip-helptext` | Tooltip, HelpText, disabled reasons, long explanations. |
| `upload-import-workflow` | Upload, structured import, validation, mapping, partial failure. |
| `wizard-stepper` | Wizard/Stepper flow, validation, draft, review, step states. |

Supporting folders:

| Folder | Purpose |
|---|---|
| `_inventory` | Status tracking for all rules. |
| `_ai-bundles` | Scenario-based AI rule bundles. |

---

## AI Bundle Entry Points

Use bundles when asking AI to generate or review a full interaction pattern.

| Bundle | Use for |
|---|---|
| [`core-foundation-ai-bundle.md`](./_ai-bundles/core-foundation-ai-bundle.md) | Baseline rules every 2B UI generation should load. |
| [`list-crud-ai-bundle.md`](./_ai-bundles/list-crud-ai-bundle.md) | Standard CRUD list pages with filter/table/detail/actions. |
| [`form-overlay-ai-bundle.md`](./_ai-bundles/form-overlay-ai-bundle.md) | Forms inside dialog/drawer/detail edit flows. |
| [`navigation-layout-ai-bundle.md`](./_ai-bundles/navigation-layout-ai-bundle.md) | Console shell, route IA, responsive page layout. |
| [`data-feedback-ai-bundle.md`](./_ai-bundles/data-feedback-ai-bundle.md) | Loading/empty/error/toast/status/log feedback behavior. |
| [`import-workflow-ai-bundle.md`](./_ai-bundles/import-workflow-ai-bundle.md) | Upload/import/wizard/task-log flows. |

---

## Recommended Loading Order

For broad page generation:

```text
1. core-foundation-ai-bundle
2. navigation-layout-ai-bundle
3. list-crud-ai-bundle or form-overlay-ai-bundle
4. data-feedback-ai-bundle
```

For import/setup flows:

```text
1. core-foundation-ai-bundle
2. form-overlay-ai-bundle
3. import-workflow-ai-bundle
4. data-feedback-ai-bundle
```

For reviewing a single component:

```text
1. Load the component's {module}-ai-rules.md
2. Load action-system-ai-rules.md when actions exist
3. Load responsive-layout-ai-rules.md when layout changes across widths
4. Load state-view-ai-rules.md when loading/empty/error states exist
```

---

## Maintenance Rules

- Add new modules as a subfolder.
- Every new module should include four files.
- Keep human-readable rules detailed and example-rich.
- Keep AI rules short, imperative, and boundary-focused.
- Update `_inventory` after adding, renaming, or moving modules.
- Update `_ai-bundles` when a new module changes common generation behavior.
