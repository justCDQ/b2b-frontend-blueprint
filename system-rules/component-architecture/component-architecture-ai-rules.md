# Component Architecture AI Rules

> Compact execution rules for AI-generated 2B component architecture.
> Use `component-architecture-rules.md` as the detailed reference.

---

## 1. Core Rule

Build components as reusable architecture, not one-off page UI.

Must separate:

- behavior
- presentation
- data mapping
- business integration

Recommended model:

```text
headless behavior -> styled primitive -> domain wrapper -> feature usage
```

---

## 2. Layer Rules

Rules:

- Primitive components must not contain business domain logic.
- Headless hooks/controllers own interaction state and handlers.
- Styled components consume tokens and variants.
- Domain components map API data to generic component props.
- Feature components own page-specific data flow and composition.

Do not put API requests, role logic, or backend response parsing in low-level primitives.

---

## 3. Composition Rules

Use:

- compound components for structured components
- slots for replaceable regions
- render callbacks for data-dependent UI
- controlled APIs for reusable stateful components

Avoid:

- boolean prop explosion
- raw CSS props as primary API
- business-specific props in generic components
- duplicated desktop/mobile business logic

---

## 4. State And API Rules

Rules:

- Component API describes intent, not visual hacks.
- Use `variant`, `size`, `tone`, `state`, `density` for visual variants.
- Use `pending`, `disabledReason`, `danger`, `required`, `readonly` for behavior.
- Loading/pending must define blocked scope.
- Disabled state supports reason when useful.
- Selection uses stable keys.
- Responsive transformation preserves state.

---

## 5. Styling And Theming

Rules:

- Use semantic design tokens.
- Support light/dark mode.
- Support theme/brand override through tokens.
- Keep color/layout/motion/density tokens separate.
- Avoid one-off hardcoded style values in feature components.
- Component variants map to tokens.

---

## 6. Permission, i18n, Accessibility

Rules:

- Permission decisions come from caller/domain layer.
- Components receive permission-derived state, not raw role logic.
- Product copy is injectable.
- Labels, aria labels, errors, empty text, and tooltips are i18n-ready.
- Primitives include accessibility and keyboard behavior.
- ARIA semantics match actual behavior.
- Icon-only actions have accessible labels/tooltips.
- Components do not rely on color only.

---

## 7. Compatibility And Tests

Rules:

- Modern CSS/JS features need fallback or documented support boundary.
- Prefer feature detection over user-agent checks.
- Core tasks remain usable in supported browsers.
- Test behavior, not implementation details.
- Test keyboard/focus for interactive primitives.
- Test disabled/pending/error states.
- Test responsive transformation for critical components.

---

## 8. AI Checklist

- Behavior, style, data mapping, and business integration are separated.
- Generic component has no business API logic.
- Props avoid boolean explosion.
- Tokens replace hardcoded styling.
- Permission and i18n are injectable.
- State contract is explicit.
- Accessibility is built in.
- Browser fallback is considered.
- Component can be tested outside a single page.
