# Page Header / Layout Shell AI Rules

> Compact execution rules for AI-generated 2B page shell and header behavior.
> Use `page-header-layout-shell-rules.md` as the detailed reference.

---

## 1. Scope

Shell owns:

- global navigation
- workspace/account context
- user/help/notification entry
- content frame

Page Header owns:

- page title
- status/metadata
- breadcrumb/back
- page-level actions

Rules:

- Do not put row/list/field actions in shell.
- Do not put row actions in page header.
- Page title is required for routed pages.
- Current route and workspace scope must be visible when relevant.

---

## 2. Shell Rules

Rules:

- Navigation stays stable across authenticated pages.
- Active route is visible.
- Workspace/account/tenant switcher is visible when it changes data scope.
- Shell remains visible during page loading/error/forbidden when possible.
- Mobile shell collapses predictably and keeps active route reachable.
- Global shell actions must not compete with page actions.

---

## 3. Page Header

Recommended:

```text
Breadcrumb / Back
Title + status badge + key metadata
Optional description
Actions
```

Rules:

- Title names current resource/module/workflow.
- Status badge appears near title when decision-relevant.
- Description does not repeat title.
- Header has at most one primary action.
- Low-frequency actions go into overflow.
- Refresh/filter/list actions usually belong near FilterBar/list toolbar.

---

## 4. Breadcrumb And Back

Rules:

- Breadcrumb reflects real hierarchy.
- Breadcrumb items are links except current page.
- Back uses canonical destination when known.
- List -> detail back restores query/page/scroll when possible.
- Back respects dirty state protection.
- Do not show multiple competing back actions.

---

## 5. Width, State, Responsive

Rules:

- Dense tables may use full content width.
- Forms use constrained readable width.
- Detail pages use medium/wide constrained width.
- Page StateView appears in content area, not over shell.
- Header actions collapse before title becomes unreadable.
- Page title and primary action remain reachable on narrow screens.
- Breadcrumb may collapse to parent/back + current title.

---

## 6. Accessibility

Rules:

- Shell nav uses navigation landmarks.
- Active route exposes `aria-current` or equivalent.
- Page title is main heading.
- Breadcrumb uses breadcrumb semantics.
- Route change focus moves to main title/content.

---

## 7. AI Checklist

- Shell/global/page/local action scopes are not mixed.
- Page title exists.
- Active route and scope are visible.
- Header action priority is clear.
- Breadcrumb/back are canonical.
- Content width matches page type.
- Loading/error states keep shell stable.
- Responsive header preserves title and primary action.
