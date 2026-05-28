# Tabs / SegmentedControl / Route Navigation Rules

> Use these rules when building or reviewing tab-like navigation in 2B products.
> Many controls look like tabs, but their semantics are different.

---

## 1. Core Distinction

Choose by what changes.

| Component | Changes | URL behavior | Use for |
|---|---|---|---|
| Tabs | content panel | optional | same-page content sections |
| SegmentedControl | filter/mode value | often query params | data condition or display mode |
| Route Navigation | route/page | path | modules or pages |

Rule:

- If it changes content panel, use Tabs.
- If it changes data filter or mode, use SegmentedControl.
- If it changes URL path/page, use Route Navigation.

---

## 2. Tabs

Use Tabs for switching content panels in the same page or dialog.

Examples:

- User detail: Overview / Orders / Audit Logs
- Settings page: General / Security / Billing
- Dialog content: Basic / Advanced

Rules:

- Tabs switch content panels.
- Tabs do not represent data filters.
- Each tab should have a matching panel.
- Do not use tabs as a jump page with only links.
- Tab labels should be short.
- Use local state when share/reload is not needed.
- Use query params when selected tab should be shareable/recoverable.

Forbidden:

```text
Tabs: All / Active / Disabled
```

Use SegmentedControl for that.

---

## 3. SegmentedControl

Use SegmentedControl for small mutually exclusive values.

Examples:

- All / Active / Disabled
- Day / Week / Month
- Table / Card
- Success / Failed / Pending

Rules:

- Semantically, SegmentedControl is a form control, not a tab component.
- It is a compact visual variant of RadioGroup/single-choice control.
- Changes data condition or display mode.
- Often triggers request or recalculation.
- Common in FilterBar.
- Option count should usually be 2-6.
- State should be query-driven when it affects list result.
- Changing value usually resets page and clears selection.
- It may share pill/segmented styles with Tabs.
- It must not reuse Tabs behavior, Tabs implementation, or ARIA tab semantics.

Do not use SegmentedControl for:

- content panels with separate layout
- route-level navigation
- long option lists

Implementation rule:

- Sharing a style primitive is allowed.
- Sharing a semantic component with Tabs is not allowed.
- Build/export separate `Tabs` and `SegmentedControl` components even if they use the same design tokens.

---

## 4. Route Navigation

Use Route Navigation for switching modules/pages.

Examples:

```text
/settings/profile
/settings/security
/settings/billing
```

Rules:

- Path changes.
- State is restored by URL.
- Use links/navigation, not local state.
- Route nav should have real route content.
- Do not create dead routes with no entry.
- Do not register the same component under many paths except redirects.

Use route navigation for:

- settings modules
- billing sections
- detail page submodules
- admin console modules

---

## 5. Levels

Limit tab depth.

| Level | Use |
|---|---|
| L1 | page-level major sections |
| L2 | nested section or dialog tabs |
| L3 | avoid |

Rules:

- Max 2 levels: L1 + L2.
- Do not create L3 tabs.
- L1 and L2 should look visually different.
- Dialog tabs are scoped to the dialog and should use lightweight style.
- Sidebar L1 + content L2 is acceptable.

---

## 6. Variant Rules

Use variants consistently.

| Context | Variant |
|---|---|
| L1 page content tabs | `pill` |
| L2 nested tabs | `underline` |
| Dialog tabs | `underline` |
| SegmentedControl | compact segmented style |
| Mobile route nav | horizontal pills |

Rules:

- Page-level content tabs use `pill` by default.
- Nested or dialog tabs use `underline`.
- Dialog tabs are scoped to the dialog and do not behave like page L1 tabs.
- Do not mix L1 and L2 visual styles in the same level.
- Use component variants instead of hand-written active styles.

---

## 7. Route Nav Shape

Choose route navigation shape by item count and layout.

| Scenario | Shape |
|---|---|
| 2-5 route items | horizontal pill links |
| 5+ route items with icons | desktop sidebar + mobile horizontal pills |
| detail page submodules | sidebar on desktop, horizontal pills on mobile |
| simple top-level section nav | horizontal links/pills |

Rules:

- Desktop route nav may use sidebar when modules are many.
- Mobile route nav should become horizontal scrollable pills.
- Route nav items should be real links.
- Active route should derive from current path.
- New route must have a navigation entry.
- Do not create dead routes without entry.

---

## 8. URL Persistence

Choose persistence by importance.

| Scenario | Persistence |
|---|---|
| temporary local panel | local state |
| shareable same-page tab | query param |
| route module | path |
| filter/mode | query param |
| nested sub tab | query param |

Rules:

- Do not use hash for tab state.
- Path is for route-level navigation.
- Query param is for same-page selected state.
- Local state is only for non-shareable temporary state.
- Switching L1 route/tab should clear invalid sub-tab params.
- Invalid tab param should fall back to default.
- Route tab id should match route path segment when possible.
- For route layouts, active tab can be derived from the final path segment.

Example:

```text
/users/123?tab=orders
/settings/security
/logs?status=failed
```

---

## 9. Routing Rules

Rules:

- Route path uses kebab-case.
- One component should have one canonical path.
- Old paths should redirect with replace.
- Redirect routes should be centralized and easy to find.
- New routes must have a navigation entry.
- Tab route pages must render real content.
- Do not create jump pages that only contain link cards.
- If multiple modules can link to the same feature, keep one canonical route.

Good:

```text
/settings/api-keys
/billing/invoices
```

Bad:

```text
/settings/apiKeys
/settings/api_keys
```

---

## 10. Mobile Behavior

Rules:

- Tabs/segmented controls should not wrap by default.
- Use horizontal scroll when items overflow.
- Active item should scroll into view.
- Touch target should be at least 36px, key nav near 44px.
- Labels should not be too long.
- Avoid too many tabs on mobile.
- Sticky route nav is allowed when it improves orientation.
- Dialog tabs should scroll within dialog body, not create page-level sticky nav.
- Deep-linked active item should scroll into view on initial load.
- Active item should scroll into view when route/query changes.

If items are too many:

- For route nav, consider sidebar on desktop and horizontal pills on mobile.
- For filters, move low-frequency options into Advanced Filter.
- For content sections, consider route page or sidebar navigation.

Sticky rules:

| Context | Sticky |
|---|---|
| mobile route pills | allowed / recommended |
| page content tabs | usually not sticky |
| dialog tabs | not page-sticky |
| sidebar route nav | sidebar can remain visible on desktop |

---

## 11. Styling Semantics

Visual style should reinforce semantics.

Common styles:

- L1 Tabs: pill or strong active background.
- L2 Tabs: underline or lighter style.
- SegmentedControl: compact equal-choice control.
- Route Nav: link/nav item style, may look like pills on mobile.

Rules:

- Do not style filters exactly like content tabs if it creates semantic confusion.
- Do not style route links as ARIA tabs unless they behave like tabs.
- SegmentedControl may visually align with Tabs, but must keep form/radiogroup semantics.
- Active state must be clear.
- Disabled tab/nav item must explain why if visible.

---

## 12. Implementation Forbidden List

Forbidden:

- Do not handwrite ARIA tabs with raw buttons when a Tabs component exists.
- Do not use Tabs with grid layout for filtering; use SegmentedControl.
- Do not implement SegmentedControl with Tabs primitives or `role="tab"`.
- Do not handwrite active colors per page.
- Do not use hash for tab state.
- Do not duplicate the same route component under multiple non-redirect paths.
- Do not create tabs with no corresponding panel/content.
- Do not use route links but label them as ARIA tabs.
- Do not let mobile tab labels wrap into multiple lines by default.

Bad:

```jsx
<button role="tab" aria-selected={active}>Overview</button>
```

```jsx
<TabsList className="grid grid-cols-4">
  <TabsTrigger value="all">All</TabsTrigger>
  <TabsTrigger value="active">Active</TabsTrigger>
</TabsList>
```

Use SegmentedControl for the second example.

---

## 13. Accessibility

Rules:

- Real Tabs should use correct tabs/tabpanel semantics.
- Route Navigation should use nav/link semantics.
- SegmentedControl should expose selected state.
- SegmentedControl should use form/radiogroup semantics, not tabs/tabpanel semantics.
- Keyboard users must be able to move and activate items.
- Active item must be communicated beyond color.
- Disabled item must not be focus-trapping.

Important:

- Route links should not pretend to be ARIA tabs.
- Tabs without panels are not tabs.

---

## 14. AI Review Checklist

Before accepting tab/navigation code, verify:

- Component choice matches semantics: panel, filter/mode, or route.
- Tabs are not used for filtering.
- SegmentedControl is not used for route navigation.
- SegmentedControl is not implemented with Tabs semantics.
- Route nav uses path/link, not local state.
- URL persistence is appropriate.
- Hash is not used.
- Invalid tab param falls back safely.
- Route tab id matches path segment when applicable.
- New route has a navigation entry.
- Old path redirects use replace.
- L3 nesting is avoided.
- L1 uses pill and L2/dialog tabs use underline when variants exist.
- Mobile overflow uses horizontal scroll.
- Active item scrolls into view when needed.
- Deep-linked active tab scrolls into view on initial load.
- Visual style distinguishes L1/L2/filter/route.
- Implementation uses component variants instead of hand-written active colors.
- Accessibility semantics match component type.
