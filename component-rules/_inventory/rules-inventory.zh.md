# B2B Rules 规则盘点

> 这份盘点用于追踪每个规则模块是否具备“给人看的版本”和“给 AI 执行的版本”。
> 给人看的规则应讲清楚上下文、边界、例子和取舍。
> 给 AI 看的规则应简洁、明确、边界清晰，适合注入代码生成或代码审查流程。

---

## 1. 当前命名约定

每个模块独立放在自己的文件夹：

```text
b2b/component-rules/{module}/
```

每个模块默认包含四个文件：

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```

文件用途：

- `{module}-rules.md`：英文人读详细规则。
- `{module}-rules.zh.md`：中文人读详细规则。
- `{module}-ai-rules.md`：英文 AI 执行精简规则。
- `{module}-ai-rules.zh.md`：中文 AI 执行精简规则。

---

## 2. 当前状态总结

- 当前所有组件/交互模块都已经有英文和中文的人读版本。
- 当前所有组件/交互模块都已经有英文和中文的 AI 执行版本。
- 每个模块都独立存放在 `b2b/component-rules/` 下的子文件夹中。
- `_inventory` 存放盘点文档，不属于组件模块。

---

## 3. 模块盘点

| 模块 | 人看 EN | 人看 ZH | 独立 AI EN/ZH | 人看完整度 | 备注 |
|---|---:|---:|---:|---|---|
| Action System | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Card List | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Detail Page | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Dialog | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Drawer / Side Panel | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Dropdown / Menu / Popover | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Feedback / Toast | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Filter Bar | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Form | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| List Page | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Navigation / IA | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Page Header / Layout Shell | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Responsive Layout | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| StateView | 有 | 有 | 有 | 成熟 | 已有 AI 版本。 |
| Status Badge / Tag | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Table | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Tabs / Navigation | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Timeline / Activity / Audit Log | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Tooltip / HelpText | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Upload / Import Workflow | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |
| Wizard / Stepper | 有 | 有 | 有 | 成熟 | 已有 AI 精简版。 |

---

## 4. 给人看的规则标准

给人看的 rules 应包含：

- 用途和组件/系统边界。
- 什么时候使用，什么时候不使用。
- 与相邻组件的关系。
- 布局和交互细节。
- 状态处理：loading、empty、error、disabled、permission、pending。
- 相关的数据和 URL 行为。
- 响应式行为。
- 可访问性说明。
- 好例子和坏例子。
- AI review checklist。

给人看的版本可以更长，因为它用于学习、讨论、评审和设计判断。

---

## 5. 给 AI 看的规则标准

给 AI 看的 rules 应包含：

- 很短的用途说明。
- 明确的使用/禁用边界。
- 必要的 props/data contract。
- 用命令式语言写交互规则。
- 状态和错误规则。
- 响应式转换规则。
- 禁止模式。
- 只保留能消除歧义的小例子。

AI rules 应避免：

- 长解释。
- 重复解释原因。
- 历史讨论。
- 大段散文。
- 过多“可能”“视情况”这类软表达，除非规则确实可选。

推荐结构：

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

## 6. 建议推进顺序

第一阶段：先为已经成熟的规则创建 AI 版本。

已完成：

1. Action System
2. Dialog
3. Form
4. Table
5. Filter Bar
6. List Page

已完成：

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

第二阶段：先补全较短的人看版本，再创建 AI 版本。

人看版本已补全：

1. Page Header / Layout Shell
2. Upload / Import Workflow
3. Drawer / Side Panel
4. Tooltip / HelpText
5. Detail Page

AI 版已补全：

1. Page Header / Layout Shell
2. Upload / Import Workflow
3. Drawer / Side Panel
4. Tooltip / HelpText
5. Detail Page

---

## 7. 当前缺口

现在每个组件模块都已经具备中英文的人读版和 AI 执行版。

下一层工作是工程化封装：模块子文件夹、prompt bundle、CLI 模板集成和自动化审查预设。
