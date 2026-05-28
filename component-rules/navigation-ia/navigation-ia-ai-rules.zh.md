# Navigation / IA AI 执行规则

> 用于 AI 生成 2B 信息架构和导航的压缩版规则。
> 详细解释参考 `navigation-ia-rules.zh.md`。

---

## 1. 核心规则

导航按用户任务和资源域组织，不按后端表名组织。

规则：

- 认证后的页面保持稳定 global navigation。
- 用户必须清楚当前在哪里。
- 每个 route 都需要可达入口或明确 redirect。
- 页面级导航使用 route/link 语义，不用 local state。
- 在 list、detail、edit、related pages 之间保留上下文。

---

## 2. 导航层级

使用清晰层级：

| 层级 | 用途 |
|---|---|
| Global/Product | workspace switcher、account、user menu |
| L1 Module | 主业务域：Projects、Users、Billing、Settings |
| L2 Section | 模块分区：Security、Invoices |
| L3 Resource | 详情页：`/projects/:id` |
| L4 Subsection | 详情 tabs/sections：Overview、Audit Log |

规则：

- L1 放在 primary navigation。
- L2 放在 sidebar/route nav/module landing page。
- L3 从 list/search/link 进入。
- L4 使用 tabs、side nav、anchors、route segment 或 query。
- 避免 L5 navigation。

---

## 3. Route 规则

规则：

- 使用名词/资源 path。
- Resource route 使用稳定 id。
- 每个主要页面只有一个 canonical route。
- Alternate/legacy paths 使用 redirects。
- Path segments 定义 hierarchy 和 page identity。
- Query params 定义可恢复页面状态。
- 不用 hash 承载核心导航状态。

Query params 用于：

- search
- filters
- sort
- pagination
- view mode
- selected tab，同页且可分享时
- date range

不要把 secrets、大 payload、raw drafts、临时 hover/open state 放入 URL。

---

## 4. 主导航与次级导航

规则：

- Primary navigation 展示产品主模块。
- 不要把低频 actions 或 row/resource actions 放进 global nav。
- Active module 从当前 route 推导。
- Secondary navigation 用于 module/detail page 内部移动。
- Route navigation 使用 links。
- Tabs 用于同页 panels，不用于无关 route pages。
- SegmentedControl 不是 route navigation。
- Breadcrumb 用于 hierarchy，不用于平级切换。

---

## 5. Breadcrumb 与 Back

规则：

- Breadcrumb 反映真实 route/resource hierarchy。
- 除当前页外，breadcrumb items 都是 links。
- 已知时，Back 优先使用 canonical destination，而不是只用 browser history。
- List -> detail 返回时尽量恢复 filters、search、sort、page、scroll。
- Back 不能在无确认时丢弃 dirty changes。
- 不要出现多个互相竞争的 back actions。

---

## 6. Workspace/Tenant Scope

规则：

- Workspace/account/tenant 会改变数据范围时，必须显示当前 scope。
- 数据有 scope 时，route 包含 workspace/account id。
- 切换 workspace 时，清理或协调 stale filters/selection/resources。
- 直接访问越界资源时，展示 access/scope state。

---

## 7. Permission 与 States

规则：

- 只有用户不应知道功能存在时才隐藏 nav item。
- 可以解释或申请权限时，使用 disabled/locked nav item。
- Forbidden route 展示 permission state，不是 empty data。
- 直接访问 route 仍需要 route guard。
- Loading 保留 shell navigation。
- Not-found 提供 canonical parent navigation。
- Retry 保留 route/query context。

---

## 8. 响应式与可访问性

规则：

- 桌面控制台通常使用 sidebar。
- 窄桌面可折叠为 rail/menu。
- 移动端使用 sheet navigation 或 horizontal route pills。
- 折叠后 active route 仍可见。
- Navigation 不依赖 hover。
- 使用语义化 nav landmarks。
- Active route 暴露 `aria-current` 或等价语义。
- Route change 后 focus 移动到 page title/main content。

---

## 9. AI 检查清单

- IA 是否遵循 tasks/resource domains。
- Global navigation 是否稳定且 route-aware。
- Navigation levels 是否清晰且不过度嵌套。
- 每个 route 是否可达或 redirected。
- Routes 是否 canonical 且可读。
- Query state 是否只用于可恢复页面状态。
- Breadcrumb 和 Back 职责是否不同。
- List/detail 返回是否恢复上下文。
- Permission state 是否没有表现成 empty data。
- Responsive nav 是否保持 active route 和 primary actions 可达。
