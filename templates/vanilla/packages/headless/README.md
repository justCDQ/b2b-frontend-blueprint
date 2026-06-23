# Headless Package

Framework-agnostic behavior controllers for B2B console components.

This package does not depend on React, Vue, Svelte, CSS, or DOM APIs. Framework adapters and DOM controllers should wrap these primitives instead of reimplementing state behavior.

## Controllers

- `createDisclosure`: open/close/toggle state for dialogs, drawers, popovers, and collapsible panels.
- `createPendingAction`: duplicate-action prevention for async mutations.
- `createRequestRaceGuard`: latest-request guard for search, filters, pagination, refresh, and mutations.
- `createSelectionController`: stable-key table/list selection with disabled-row support.
- `createPaginationController`: traditional page/pageSize/total pagination.
- `createFilterState`: filter state, reset detection, and URLSearchParams conversion.
- `createListQueryController`: composed filters, pagination, and sorting for list pages.

## Rules

- Keep this package UI-free.
- Keep this package framework-free.
- Do not put business API requests here.
- Do not put product copy here.
- Keep permission decisions in domain/feature layers; pass disabled predicates or reasons into controllers.

