# MVP Scope

B2B Frontend Blueprint has two goals:

1. Provide AI-ready interaction rules for B2B console UI generation.
2. Provide a reusable console starter that can be scaffolded, inspected, and adapted to real backend APIs.

The MVP is intentionally a blueprint and starter, not a full admin framework.

## In Scope

The MVP includes:

- Human-readable and AI-executable component rules.
- English and Chinese rule files.
- Scenario-based AI rule bundles.
- A framework-agnostic vanilla demo.
- A local scaffold script.
- Runtime configuration through `blueprint.config.js`.
- Light/dark theme controller and density mode.
- Minimal i18n runtime and dictionaries.
- Request adapter and backend error protocol.
- Auth and permission skeleton.
- Form schema and validation helpers.
- Import workflow contract.
- Resource module pattern, module registry, and CRUD controller.
- A runnable generic resource page example.

## Out Of Scope

The MVP does not attempt to provide:

- A production-grade React/Vue component library.
- A full RBAC platform.
- A full login/register/user-account system.
- A low-code page designer.
- A complex workflow engine.
- A complete E2E test suite.
- A browser compatibility/polyfill package.
- A published npm CLI package.

These can be added later without changing the MVP direction.

## Product Boundary

The project should stay small enough that users can understand the generated code.

Prefer:

- Explicit contracts.
- Replaceable modules.
- Simple examples.
- AI-friendly rules and file layout.

Avoid:

- Hidden magic.
- Business-specific assumptions.
- Framework lock-in.
- Overbuilding a private admin framework.

## MVP Success Criteria

The MVP is useful when a user can:

1. Read the rules and understand B2B interaction boundaries.
2. Generate a starter project with scaffold options.
3. Run the generated project locally.
4. Change app name, locale, theme, density, modules, and API base URL.
5. Add a resource module by following a documented pattern.
6. Replace mock APIs with real backend APIs.
7. Ask an AI coding agent to generate or review pages using the rules.
