# Component Architecture Rules

> Use these rules for building reusable, customizable, and maintainable components in 2B console templates.
> The goal is to separate interaction logic, visual style, data contract, and business integration.

---

## 1. Core Principle

2B components must support customization without rewriting business logic.

Rules:

- Separate behavior from presentation when the component is reused widely.
- Prefer design tokens over hardcoded styles.
- Prefer composition over large prop lists.
- Keep business-specific logic outside base components.
- Make permission, i18n, loading, disabled, and error states explicit.
- Components should be easy to test without depending on one product page.
- Components should degrade gracefully across supported browsers.

Recommended mental model:

```text
headless behavior -> styled primitive -> domain wrapper -> feature usage
```

---

## 2. Component Layers

Use layered components.

| Layer | Purpose | Examples |
|---|---|---|
| Primitive | Low-level accessible UI building block. | Button, Input, Dialog, Tooltip |
| Headless hook / controller | State, keyboard, validation, selection, interaction logic. | useTableSelection, useDialogState |
| Styled component | Product visual implementation using tokens. | AppButton, AppTable, AppDialog |
| Domain component | Business meaning and data mapping. | UserStatusBadge, ProjectTable |
| Feature component | Page-specific composition. | UsersPage, ImportCustomersWizard |

Rules:

- Primitive components should not know business domain.
- Headless logic should not depend on CSS classes.
- Styled components should use tokens and variants.
- Domain components can map API data to generic components.
- Feature components compose domain components and own page-specific data flow.

---

## 3. Headless And Styled Separation

Use headless separation when:

- interaction logic is complex
- visual style needs replacement
- component will be reused across products/themes
- accessibility behavior is non-trivial
- state management needs testing independently

Examples:

```text
useDisclosure -> Dialog/Drawer open state
useTableSelection -> selected rows and disabled selection
usePagination -> page/pageSize/nextToken
useFilterState -> filter/query/url sync
```

Rules:

- Headless APIs expose state and event handlers.
- Styled components consume headless state and render UI.
- Do not put theme tokens inside headless hooks.
- Do not put API requests inside low-level primitives.
- Keep escape hatch for custom rendering when needed.

---

## 4. Composition Patterns

Prefer composition for complex components.

Use compound components when child structure matters:

```tsx
<Dialog>
  <Dialog.Header />
  <Dialog.Body />
  <Dialog.Footer />
</Dialog>
```

Use slots when consumers need to replace parts:

```tsx
<DataTable
  toolbarSlot={<UserTableToolbar />}
  emptySlot={<UserEmptyState />}
/>
```

Use render callbacks when row/item rendering is data-specific:

```tsx
<DataTable
  columns={columns}
  renderRowActions={(row) => <UserRowActions user={row} />}
/>
```

Rules:

- Avoid boolean prop explosion.
- Prefer named slots over many one-off props.
- Use render callbacks for data-dependent custom UI.
- Use compound components for structured overlays/forms/navigation.
- Keep the default path easy for common use.

---

## 5. Props And API Design

Component APIs should be explicit and stable.

Rules:

- Props should describe intent, not visual hacks.
- Use `variant`, `size`, `tone`, `state`, `density` for design-system variants.
- Use `disabledReason`, `pending`, `permission`, `danger`, `required` when behavior matters.
- Do not expose raw CSS values as primary API unless it is a low-level primitive.
- Prefer controlled APIs for reusable stateful components.
- Support uncontrolled mode only when it simplifies simple usage.
- Event names should describe user intent: `onSubmit`, `onOpenChange`, `onSelectionChange`.

Avoid:

```tsx
<Button isBlueBigRounded />
<Table showThing disableOtherThing weirdMode />
```

Prefer:

```tsx
<Button variant="primary" size="md" />
<DataTable density="compact" selection={selection} />
```

---

## 6. State Contract

Reusable components should expose state clearly.

Common states:

- default
- hover/focus
- active/selected
- loading/pending
- disabled
- readonly
- error
- empty
- success/warning/info

Rules:

- Loading and pending state must define blocked scope.
- Disabled state should support reason when useful.
- Error state should define whether it is local, field-level, section-level, or page-level.
- Selection state uses stable keys.
- Components should not silently reset controlled state.
- Responsive transformation must preserve component state.

---

## 7. Styling And Theming

Use token-driven styling.

Rules:

- Use semantic tokens, not hardcoded colors.
- Support light and dark mode.
- Support brand/theme override through tokens.
- Keep layout tokens separate from color tokens.
- Component variants should map to tokens.
- Avoid one-off CSS values inside feature components.
- Avoid style overrides that break component states.

Token groups:

- color
- typography
- spacing
- radius
- border
- shadow
- z-index
- motion
- density

---

## 8. Permission, i18n, And Data Boundaries

Permission:

- Base components can render disabled/hidden states.
- Permission decisions should come from caller/domain layer.
- Components accept `disabledReason` or permission-derived state, not raw role logic.

i18n:

- Base components should not hardcode product copy.
- Labels, aria labels, empty text, errors, and tooltips must be injectable.
- Components must tolerate longer translated text.

Data:

- Base components accept normalized data contracts.
- Domain components map API shape into component shape.
- Do not let generic components know backend-specific response structure.

---

## 9. Accessibility

Rules:

- Accessibility belongs in primitives by default.
- Keyboard interaction should be built into primitives for menu, dialog, tabs, table selection, tooltip.
- ARIA semantics must match actual behavior.
- Icon-only actions require labels/tooltips.
- Focus management is required for overlays.
- Error/help text should be associated with fields.
- Components should not rely only on color.

---

## 10. Browser Compatibility And Degradation

Rules:

- Components should define fallback when using modern APIs.
- Do not require unsupported CSS features without fallback.
- Container queries, popover, dialog, clipboard, drag/drop, sticky, and virtual scroll need compatibility decisions.
- Degrade interaction safely before breaking layout.
- Feature detection is preferred over user-agent checks.
- Keep core tasks usable in supported browser range.

---

## 11. Testing Contract

Reusable components should be testable.

Rules:

- Test behavior, not implementation details.
- Test keyboard and focus behavior for interactive primitives.
- Test disabled/pending/error states.
- Test controlled/uncontrolled behavior when both exist.
- Test permission-derived disabled/hidden behavior at domain/feature layer.
- Test responsive transformation for critical components.
- E2E should cover main composed workflows, not every primitive state.

---

## 12. Folder And Naming Suggestions

Recommended structure:

```text
src/
  components/
    primitives/
    composed/
    data-display/
    feedback/
    forms/
    overlays/
  hooks/
  design-tokens/
  features/
  routes/
```

Component folder example:

```text
DataTable/
  DataTable.tsx
  DataTable.types.ts
  DataTable.styles.ts
  useDataTableSelection.ts
  DataTable.test.tsx
  index.ts
```

Rules:

- Use clear domain-free names for reusable components.
- Use domain names only in feature/domain components.
- Export public APIs through `index.ts`.
- Keep internal helpers private.

---

## 13. AI Review Checklist

- Component separates behavior, style, and domain mapping.
- Base component does not contain business-specific API logic.
- Design tokens are used instead of hardcoded styling.
- Component API avoids boolean prop explosion.
- Slots/render callbacks/compound components are used where appropriate.
- Loading, disabled, pending, error, selected states are explicit.
- Permission and i18n are injectable.
- Accessibility behavior is built in.
- Browser fallback/degradation is considered.
- Component is testable without one specific page.
