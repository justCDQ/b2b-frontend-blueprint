# Page Header / Layout Shell 页面框架规范

> 用于 2B 控制台页面框架：shell、sidebar、topbar、breadcrumb、page title、page actions 和内容宽度。

---

## 1. 用途

Layout Shell 提供稳定的产品导航和持久上下文。

Page Header 提供当前页面的身份、定位和操作区域。

规则：

- Shell 负责全局导航和 account/workspace 上下文。
- Page Header 负责当前页面标题、状态和页面级 actions。
- Main content 负责页面 sections、lists、forms 和局部 actions。
- 不要把 row/list/field-specific actions 放进 global shell。
- 不要把页面身份隐藏在 cards 或 section headings 里。

---

## 2. Layout Shell

常见 shell 部分：

- sidebar 或 primary navigation
- topbar
- workspace/account/tenant switcher
- user menu
- notification/help entry
- content area

规则：

- Shell navigation 在认证后页面保持稳定。
- 当前 route 必须有 visible active state。
- Workspace/account scope 会改变数据范围时必须可见。
- Shell 不应随页面内容变化发生不可预测 reflow。
- 页面级 loading、empty、forbidden、not-found 状态应尽量保留 shell。
- Global shell actions 不应和 page actions 竞争。
- 移动端 shell 可预测折叠，并保持 active route 可达。

避免：

- 没有 scope 变化却在模块间改变 primary navigation。
- 把 create/delete/edit row actions 放进 topbar。
- 在 scoped data pages 隐藏 workspace context。

---

## 3. Page Header 结构

推荐结构：

```text
Breadcrumb / Back
Title row: title + status badge + key metadata
Description，可选
Actions
```

规则：

- Routed pages 必须有 page title。
- Title 命名当前 resource、module 或 workflow。
- Status badge 在影响决策时靠近 title。
- 短 metadata 可放在 title 附近增强定位。
- Description 可选，不重复 title。
- Page actions 放在 header action area。
- 低频 actions 放入 overflow。
- Header 不应变成密集表单或 toolbar。

Title 示例：

```text
Users
Project "Acme Sync"
Import customers
Security settings
```

---

## 4. Header Actions

Page header actions 影响整个页面/resource。

规则：

- Header 中最多一个 primary action。
- Primary action 应代表主要页面/resource 操作。
- Secondary actions 靠近 primary 或进入 overflow。
- Dangerous resource actions 通常放 overflow 或 danger zone。
- Refresh/filter/list actions 通常属于 FilterBar/list toolbar，不属于 page header。
- Row actions 永远不属于 page header。
- Navigation actions 使用 link/router 语义。

常见 header actions：

| 页面类型 | 常见 actions |
|---|---|
| list page | Create、Import、Export；有时是 global settings |
| detail page | Edit、Archive、Configure、More |
| settings page | 当页面是 edit form 时使用 Save |
| workflow page | Cancel、Save draft、Continue/Submit |

---

## 5. Breadcrumb 与 Back

Breadcrumb 和 Back 职责不同。

使用 Breadcrumb：

- 页面在稳定层级中。
- 用户需要跨 resource/module levels 定位。
- 父级 routes 是有意义的目的地。

使用 Back：

- 用户来自明确父流程，比如 list to detail。
- 已知 canonical return destination。
- 返回应保留 list query/page/scroll。

规则：

- Breadcrumb 反映真实 route/resource hierarchy。
- 除当前页外，breadcrumb items 都是 links。
- 不展示 fake breadcrumbs。
- 已知时 Back 优先 canonical destination，而不是只依赖 browser history。
- 不展示多个互相竞争的 Back actions。
- Back 必须遵守 dirty state protection。

---

## 6. 内容宽度与页面类型

按页面目的使用宽度。

| 页面类型 | 宽度策略 |
|---|---|
| dense list/table | 使用完整可用内容宽度 |
| card grid | 响应式内容宽度 + 安全 grid constraints |
| detail page | 中到宽的 constrained width |
| form/edit page | 可读的 constrained width |
| dashboard | 响应式 grid bands |
| workflow/wizard | 根据复杂度 constrained 或 full |

规则：

- 多列表格可使用 full width。
- 表单字段不应横向拉得过宽。
- 详情页首屏要清楚展示 identity。
- 避免 page sections 使用 nested cards。
- 优先使用 content bands/sections，而不是 cards-inside-cards。
- Page header 和 content 对齐保持一致。

---

## 7. 页面状态

规则：

- 初始页面加载保持 shell 稳定。
- Page skeleton 应匹配页面类型。
- Page-level StateView 出现在 content area，不覆盖 global shell。
- Forbidden state 不能暗示 resource 不存在。
- Not-found state 提供 canonical parent/back action。
- Refresh 保持当前 route 和 page header 稳定。
- Permission-hidden actions 不应造成 header 布局空洞。

---

## 8. 响应式行为

规则：

- Sidebar 可折叠为 rail、menu button 或 sheet。
- 折叠后 active route 仍可发现。
- Header actions 应先折叠进 overflow，再牺牲 title 可读性。
- Breadcrumb 在窄屏可折叠为 parent/back + current title。
- Page title 必须保持可见。
- Primary page action 保持可达。
- 移动端避免堆叠过多 header rows。

---

## 9. 可访问性

规则：

- Shell navigation 使用语义化 navigation landmarks。
- Active route 暴露 `aria-current` 或等价语义。
- Page title 是 main heading。
- Breadcrumb 使用 breadcrumb semantics。
- Header actions 有 accessible labels。
- Route change 后 focus 移动到 main title/content。
- 复杂 shell 提供 skip-to-content。

---

## 10. 示例

List page：

```text
Shell: sidebar + workspace switcher
Header: Users + Create user
FilterBar: search/filter/refresh/import/export
Content: table
```

Detail page：

```text
Breadcrumb: Projects / Acme Sync
Header: Acme Sync + Active badge + Edit + More
Content: summary, tabs, related tables, activity
```

Settings page：

```text
Shell: Settings active
Header: Security settings
Secondary nav: Profile / Security / Billing / API Keys
Content: sectioned form
```

---

## 11. AI 审查清单

- Shell navigation 是否稳定且 route-aware。
- Workspace/account scope 改变数据时是否可见。
- Page title 是否存在并命名当前页面/resource。
- Header actions 是否是 page/resource scoped。
- Row/list/local actions 是否没有错误放入 shell/header。
- Breadcrumb/back behavior 是否 canonical。
- Content width 是否匹配页面类型。
- Loading/empty/error/forbidden states 是否保持 shell 稳定。
- 响应式 header 是否保留 title、active route 和 primary action。
- Accessibility landmarks 和 focus behavior 是否存在。
