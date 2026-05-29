# AI Rule Bundles

> Scenario-based entry points for AI code generation and review.

Bundles do not replace module rules. They define which compact AI rules should be loaded together for a common 2B interface task.

Use English bundles for code-generation prompts. Use Chinese module rules when the team wants to review the same constraints in Chinese.

---

## Bundles

| Bundle | Use for |
|---|---|
| `all-ai-rules.md` | Top-level AI loading guide for generation and review. |
| `all-ai-rules.zh.md` | Chinese top-level AI loading guide for generation and review. |
| `core-foundation-ai-bundle.md` | Baseline 2B interaction rules. |
| `list-crud-ai-bundle.md` | CRUD list page generation/review. |
| `form-overlay-ai-bundle.md` | Form + dialog/drawer/detail edit flows. |
| `navigation-layout-ai-bundle.md` | Route IA, shell, page header, responsive layout. |
| `data-feedback-ai-bundle.md` | StateView, toast, status badge, logs. |
| `import-workflow-ai-bundle.md` | Upload/import/wizard/task progress flows. |

---

## How To Use

1. Start with `all-ai-rules.md` when the task is broad or page-level.
2. Pick the closest scenario bundle.
3. Load the referenced AI rule files.
4. Add one or two component-specific AI rules if the task has a special surface.
5. Prefer the module's human-readable rules when judgment or discussion is needed.
