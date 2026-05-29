# Prompt: Review B2B Console Page

```text
You are reviewing a B2B console page implementation.

Follow these rules:
- component-rules/_ai-bundles/all-ai-rules.md
- Add the scenario bundle that matches the page.
- Add specific module AI rules for the main components used by the page.

Review focus:
- Is the page using console layout instead of marketing layout?
- Are component boundaries correct?
- Are action scopes clear?
- Are primary, secondary, batch, row, inline, and dangerous actions placed correctly?
- Are dangerous actions confirmed with ConfirmDialog?
- Are disabled actions explained when caused by permission or business state?
- Are loading, empty, error, pending, and success states scoped correctly?
- Are request races handled for search, filters, refresh, pagination, sorting, and mutations?
- Does responsive behavior preserve business state?
- Are table row click, selection, row actions, links, switches, and menus free of event conflicts?
- Are blocking errors shown inline or in StateView instead of toast-only?

Return:
- Findings first, ordered by severity.
- File and line references when available.
- A short fix suggestion for each finding.
- A brief summary only after findings.
```

