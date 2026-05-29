# 规则写作指南

这份文档定义本仓库中规则的写作和维护方式。

规则需要同时服务两类对象：

- 人：需要完整理解产品、交互、边界和取舍。
- AI 编程工具：需要短、明确、可执行的约束。

## 默认模块结构

每个组件或系统模块都应该有独立文件夹。

```text
component-rules/{module}/
├── {module}-rules.md
├── {module}-rules.zh.md
├── {module}-ai-rules.md
└── {module}-ai-rules.zh.md
```

系统级规则使用相同结构：

```text
system-rules/{module}/
├── {module}-rules.md
├── {module}-rules.zh.md
├── {module}-ai-rules.md
└── {module}-ai-rules.zh.md
```

## 文件职责

### 人类可读规则

文件：

- `{module}-rules.md`
- `{module}-rules.zh.md`

用于说明：

- 组件解决什么问题。
- 什么时候使用。
- 什么时候不要使用。
- 布局和摆放规则。
- 交互细节。
- 状态处理。
- 数据和权限契约。
- 响应式行为。
- 常见错误。
- 示例。

人类可读规则可以包含产品判断、场景边界和取舍说明。

### AI 规则

文件：

- `{module}-ai-rules.md`
- `{module}-ai-rules.zh.md`

用于告诉 AI 必须怎么做。

AI 规则应该：

- 短。
- 明确。
- 可执行。
- 有清晰边界。
- 方便直接放进 prompt。
- 避免长篇讨论。

避免使用模糊表达：

- “可以考虑……”
- “最好……”
- “尽量做得好看……”

优先使用可执行表达：

- “危险操作必须使用 ConfirmDialog。”
- “当行不可选择时，多选 checkbox 必须禁用。”
- “阻塞错误不能只用 toast 表达。”

## 写作顺序

新增规则模块时，推荐顺序：

1. 写中文人类可读版本。
2. 写英文人类可读版本。
3. 提炼中文 AI 版本。
4. 提炼英文 AI 版本。
5. 将模块加入 inventory。
6. 如果影响常见页面生成，将模块加入对应 AI bundle。

## 人类可读规则推荐结构

除非模块明显不需要，否则建议使用以下结构：

```text
# {Component} Rules

## Purpose
## When To Use
## When Not To Use
## Structure
## Interaction Rules
## States
## Disabled And Permission Rules
## Responsive Behavior
## Data Contract
## Accessibility
## Examples
## Anti-Patterns
```

不要求每个文件都有完整章节，但每个模块至少要回答：

- 这个组件解决什么问题？
- 它和相邻组件的边界是什么？
- 哪些行为是必须的？
- 哪些行为是禁止的？
- AI 默认生成时必须包含什么？

## AI 规则推荐结构

建议使用紧凑结构：

```text
# {Component} AI Rules

## Use When
## Do
## Do Not
## Required States
## Examples
```

示例要短，强调模式，不需要写完整应用代码。

## 边界规则

好的 2B 规则通常不是只描述样式，而是明确边界。

典型边界包括：

- Table vs Card List。
- Dialog vs Drawer vs Detail Page。
- Toast vs Inline Error vs StateView。
- Route Navigation vs Tabs vs SegmentedControl。
- 权限导致 disabled vs 当前状态导致 disabled。
- 传统分页 vs next-token 分页 vs 无限滚动。

当存在边界时，规则必须说明：

- 默认选择是什么。
- 什么条件会改变默认选择。
- 切换选择后必须发生什么。
- 哪些场景禁止使用某种方案。

## 示例质量标准

好的示例应该包含：

- 真实的 2B 场景。
- 选择了哪个组件。
- 为什么选择它。
- 重要状态或权限。

好的示例：

```text
从表格行操作中删除用户时，必须使用 ConfirmDialog。弹窗标题需要说明目标操作，描述中必须写明具体用户，并说明删除后不可撤回。
```

较弱示例：

```text
需要时显示一个弹窗。
```

## AI 文件写作规范

AI 文件应该：

- 优先使用 bullet list。
- 使用直接命令。
- 避免长段落。
- 除非仓库明确要求，否则避免绑定具体实现库。
- 除非影响交互或布局，否则少写视觉样式细节。
- 只保留能帮助生成行为的示例。

## Bundle 维护

Bundle 位于：

```text
component-rules/_ai-bundles/
```

以下情况需要更新 bundle：

- 新增模块。
- 某个模块成为常见页面生成的必要规则。
- 某条规则改变了某个场景 bundle 的生成行为。

不要把所有模块都塞进所有 bundle。Bundle 应该保持场景化。

## Inventory 维护

Inventory 位于：

```text
component-rules/_inventory/
```

以下情况需要更新 inventory：

- 新增模块。
- 模块重命名。
- 模块从草稿变成稳定。
- 模块新增或移除 AI 规则文件。

## 完成标准

一次规则修改完成时，应该满足：

- 英文人类可读文件已更新。
- 中文人类可读文件已更新。
- 英文 AI 文件已更新。
- 中文 AI 文件已更新。
- 相关 bundle 已更新。
- 链接仍然有效。
- 与相邻模块没有策略冲突。

