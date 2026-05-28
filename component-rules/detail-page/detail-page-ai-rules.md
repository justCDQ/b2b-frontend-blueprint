# Detail Page AI Rules

> Compact execution rules for AI-generated 2B detail pages.
> Use `detail-page-rules.md` as the detailed reference.

---

## 1. When To Use

Use Detail Page when users need:

- shareable/reloadable URL
- deep review
- related tables/logs/activity
- multiple resource actions
- edit mode or complex sections
- permission, audit, billing, or operational context

Use Dialog for short focused temporary content.

Use Drawer for medium contextual detail/edit while preserving list/page context.

Do not use Drawer as hidden route page. Do not use Dialog for large detail just to avoid routing.

---

## 2. Entry And URL

Rules:

- Identity field links to detail route when it exists.
- Opening detail from list preserves query/filter/sort/page state.
- Back to list restores previous query/page/scroll when possible.
- Detail identity belongs in route path.
- Detail tab/section state uses route segment or query when recoverable.
- Invalid tab/query falls back safely.
- Deleted/not-found resource shows explicit state and canonical back.

---

## 3. Structure

Detail page should include:

```text
Breadcrumb / Back
Page Header: title + status + metadata + actions
Summary / key facts
Tabs / sections
Related tables / logs / activity
```

Rules:

- Title/identity visible in first viewport.
- Status badge near title when relevant.
- Page actions affect the resource.
- Summary shows decision-critical facts.
- Related data stays in sections/tabs.
- Avoid unrelated card pile and nested cards.

---

## 4. Actions And Edit

Rules:

- Page actions affect resource.
- Section actions affect section only.
- Related row actions affect related rows only.
- Dangerous resource actions go to overflow/danger zone/ConfirmDialog.
- Edit pattern matches complexity: Dialog for 1-2 fields, Drawer for medium contextual edit, page edit mode for many fields/sections.
- Dirty edit requires leave confirmation.
- Save pending prevents duplicate submit.
- Save failure preserves input.

---

## 5. State And Responsive

Rules:

- Initial load uses detail skeleton when layout is known.
- Refresh keeps old detail visible when possible.
- Not found uses StateView + canonical back.
- Forbidden uses permission StateView, not empty state.
- Related section failure stays local.
- Mobile preserves title/status/actions.
- Related tables may become MobileDataCard.
- Heavy mobile workflows use route page instead of cramped overlay.

---

## 6. AI Checklist

- Detail Page is justified over Dialog/Drawer.
- Entry preserves list context.
- URL represents identity and recoverable state.
- Header includes title/status/actions.
- Summary, sections, and related data are separated.
- Action scopes are not mixed.
- Edit mode handles dirty/save/pending/failure.
- Not-found/forbidden/deleted states are explicit.
- Responsive layout preserves primary context.
