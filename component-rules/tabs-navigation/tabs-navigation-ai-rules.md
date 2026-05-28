# Tabs / Navigation AI Rules

> Compact execution rules for AI-generated 2B tabs, segmented controls, and route navigation.
> Use `tabs-navigation-rules.md` as the detailed reference.

---

## 1. Core Distinction

Choose by what changes:

| Component | Changes | State |
|---|---|---|
| Tabs | same-page content panel | local/query |
| SegmentedControl | filter/mode value | query/form state |
| Route Navigation | page/route | path |

Rules:

- If it changes panel content, use Tabs.
- If it changes data condition or view mode, use SegmentedControl.
- If it changes URL path/page, use Route Navigation.
- Do not share semantic implementation between Tabs and SegmentedControl.
- Shared visual style primitive is allowed.

---

## 2. Tabs

Use Tabs for same-page panels.

Rules:

- Each tab has a matching panel.
- Tab labels are short.
- Use local state for temporary tabs.
- Use query params when selected tab must be shareable/recoverable.
- Do not use tabs as route links.
- Do not use tabs for filters like All/Active/Disabled.

---

## 3. SegmentedControl

Use SegmentedControl for compact single-choice mode/filter values.

Examples:

- All / Active / Disabled
- Day / Week / Month
- Table / Card

Rules:

- Semantically it is a form/radio-like control.
- It changes query/filter/mode, often triggering request.
- Option count should usually be 2-6.
- Changing value usually resets page and clears selection.
- Do not use it for route navigation or content panels.

---

## 4. Route Navigation

Use Route Navigation for switching pages/modules.

Rules:

- Items are real links.
- Active state derives from current path.
- New route needs navigation entry.
- Do not create dead routes.
- Do not duplicate same component under many paths except redirects.
- Path is for route-level navigation.

---

## 5. Levels And Variants

Rules:

- Max 2 tab levels: L1 + L2.
- Avoid L3 tabs.
- L1 and L2 look visually distinct.
- Page-level content tabs can use pill style.
- Nested/dialog tabs use underline style.
- Mobile route nav may use horizontal scrollable pills.

---

## 6. URL Persistence

Rules:

- Path: route/module/page.
- Query: same-page selected tab, filter, mode.
- Local state: temporary non-shareable panel.
- Invalid tab/query param falls back to default.
- Switching L1 route/tab clears invalid sub-tab params.
- Do not use hash for tab state.

---

## 7. AI Checklist

- Component matches semantics: panel, filter/mode, or route.
- Tabs have panels.
- SegmentedControl is not used as Tabs or Route Nav.
- Route Nav uses real links.
- Active state derives from route/query/local state correctly.
- URL persistence matches importance.
- Tab levels do not exceed 2.
- Mobile overflow is handled.
