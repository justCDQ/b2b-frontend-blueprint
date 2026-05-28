# B2B Rules Inventory

> This inventory tracks whether each rule module has human-readable and AI-executable versions.
> Human-readable rules should explain context, boundaries, examples, and tradeoffs.
> AI-executable rules should be concise, strict, and easy to inject into coding agents.

---

## 1. Current Naming Convention

Each module lives in its own folder:

```text
b2b/component-rules/{module}/
```

Each module should contain four files:

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```

File purposes:

- `{module}-rules.md`: English human-readable detailed rules.
- `{module}-rules.zh.md`: Chinese human-readable detailed rules.
- `{module}-ai-rules.md`: English AI-executable compact rules.
- `{module}-ai-rules.zh.md`: Chinese AI-executable compact rules.

---

## 2. Status Summary

- All current component/interaction modules have English and Chinese human-readable versions.
- All current component/interaction modules have English and Chinese AI-executable versions.
- Each module is stored in its own folder under `b2b/component-rules/`.
- `_inventory` stores this tracking document and is not a component module.

---

## 3. Module Inventory

| Module | Human EN | Human ZH | Dedicated AI EN/ZH | Human completeness | Notes |
|---|---:|---:|---:|---|---|
| Action System | yes | yes | yes | mature | AI compact version exists. |
| Card List | yes | yes | yes | mature | AI compact version exists. |
| Detail Page | yes | yes | yes | mature | AI compact version exists. |
| Dialog | yes | yes | yes | mature | AI compact version exists. |
| Drawer / Side Panel | yes | yes | yes | mature | AI compact version exists. |
| Dropdown / Menu / Popover | yes | yes | yes | mature | AI compact version exists. |
| Feedback / Toast | yes | yes | yes | mature | AI compact version exists. |
| Filter Bar | yes | yes | yes | mature | AI compact version exists. |
| Form | yes | yes | yes | mature | AI compact version exists. |
| List Page | yes | yes | yes | mature | AI compact version exists. |
| Navigation / IA | yes | yes | yes | mature | AI compact version exists. |
| Page Header / Layout Shell | yes | yes | yes | mature | AI compact version exists. |
| Responsive Layout | yes | yes | yes | mature | AI compact version exists. |
| StateView | yes | yes | yes | mature | AI version exists. |
| Status Badge / Tag | yes | yes | yes | mature | AI compact version exists. |
| Table | yes | yes | yes | mature | AI compact version exists. |
| Tabs / Navigation | yes | yes | yes | mature | AI compact version exists. |
| Timeline / Activity / Audit Log | yes | yes | yes | mature | AI compact version exists. |
| Tooltip / HelpText | yes | yes | yes | mature | AI compact version exists. |
| Upload / Import Workflow | yes | yes | yes | mature | AI compact version exists. |
| Wizard / Stepper | yes | yes | yes | mature | AI compact version exists. |

---

## 4. Human-Readable Rule Standard

Human-readable rules should include:

- Purpose and component/system boundary.
- When to use and when not to use.
- Relationship to adjacent components.
- Layout and interaction details.
- State handling: loading, empty, error, disabled, permission, pending.
- Data and URL behavior when relevant.
- Responsive behavior.
- Accessibility notes.
- Good and bad examples.
- AI review checklist.

Human-readable rules can be longer because they are used for learning, discussion, review, and design judgment.

---

## 5. AI-Executable Rule Standard

AI-executable rules should include:

- Short purpose statement.
- Strict use / do-not-use boundaries.
- Required props/data contract when relevant.
- Interaction rules written as imperatives.
- State and error rules.
- Responsive transformation rules.
- Forbidden patterns.
- Tiny examples only when they remove ambiguity.

AI rules should avoid:

- Long explanations.
- Repeated rationale.
- Historical discussion.
- Large prose paragraphs.
- Soft wording like "maybe" unless the rule is truly optional.

Recommended shape:

```text
# {Module} AI Rules

Use when:
- ...

Do not use when:
- ...

Must:
- ...

Must not:
- ...

State rules:
- ...

Responsive rules:
- ...

Checklist:
- ...
```

---

## 6. Suggested Work Order

Phase 1: create AI versions for already mature rules.

Completed:

1. Action System
2. Dialog
3. Form
4. Table
5. Filter Bar
6. List Page

Completed:

1. Action System
2. Dialog
3. Form
4. Table
5. Filter Bar
6. List Page
7. Responsive Layout
8. Navigation / IA
9. Dropdown / Menu / Popover
10. Tabs / Navigation
11. Card List
12. Wizard / Stepper
13. Timeline / Activity / Audit Log
14. Feedback / Toast
15. Status Badge / Tag

Phase 2: expand shorter human-readable rules, then create AI versions.

Human-readable expansion completed:

1. Page Header / Layout Shell
2. Upload / Import Workflow
3. Drawer / Side Panel
4. Tooltip / HelpText
5. Detail Page

AI extraction completed:

1. Page Header / Layout Shell
2. Upload / Import Workflow
3. Drawer / Side Panel
4. Tooltip / HelpText
5. Detail Page

---

## 7. Current Gap

The component rule set now has both human-readable and AI-executable bilingual files for each module.

The next layer is packaging: module folders, prompt bundles, CLI template integration, and automated review presets.
