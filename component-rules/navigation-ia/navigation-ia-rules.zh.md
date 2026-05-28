# Navigation / IA 信息架构规则

> 用于 2B 控制台产品的信息架构和页面级导航。
> 导航不只是菜单，它决定用户如何理解系统、如何在工作区之间移动，以及如何找回上下文。

---

## 1. 核心原则

导航应匹配用户心智模型和业务结构。

规则：

- 按用户任务和资源域组织 routes，不要按后端表名组织。
- 认证后的页面应保持稳定的全局导航。
- 用户在任何时候都应清楚自己在哪里。
- 在 list、detail、edit、related pages 之间移动时，保留用户上下文。
- 不要创建无法从导航、链接或有效操作进入的 routes。
- 页面级导航不要使用 local state。
- 导航使用 link/router 语义，不使用 mutation button 语义。

好的 IA：

```text
Workspace -> Module -> Resource list -> Resource detail -> Resource sections/actions
```

避免：

```text
一堆随机功能页只靠按钮互相连接，没有稳定层级和返回路径。
```

---

## 2. 导航层级

使用清晰层级。不要把每个区块都做成顶级模块。

| 层级 | 目的 | 示例 |
|---|---|---|
| Global / Product | 跨产品或账号级入口。 | workspace switcher、user menu、billing account |
| L1 Module | 控制台主业务域。 | Projects、Users、Integrations、Billing、Settings |
| L2 Section | L1 业务域内的子模块。 | Settings/Security、Billing/Invoices |
| L3 Resource | 具体对象或工作面。 | `/projects/:projectId`、`/users/:userId` |
| L4 Subsection | 详情页内的 section/tab。 | Overview、Activity、Audit Log、Permissions |

规则：

- L1 modules 放在主导航中。
- L2 sections 可以放在 sidebar group、route nav 或 module landing page 中。
- L3 resource pages 应从列表、搜索或链接进入。
- L4 subsections 通常使用 tabs、side nav、anchors、route segments/query 承载。
- 避免 L5 navigation。改用页面分区、accordion、drawer 或单独 workflow。
- 只有当 route level 会显著改变用户上下文时，才需要这一层级。

---

## 3. 路由设计

Routes 应稳定、可读、规范。

规则：

- Route path 使用名词/资源。
- Resource route 使用稳定 id。
- 每个主要页面保留一个 canonical route。
- Legacy/alternate paths 使用 redirects。
- 避免把同一个页面重复挂在多个无关路径下。
- 页面级 selected state 放在 path 或 query，不放在组件 local state。
- Query params 用于 filters、search、sort、pagination、view mode、selected tab 和临时页面状态。
- Path segments 用于 route identity 和 hierarchy。
- 不要用 URL hash 承载核心导航状态。

示例：

```text
/projects
/projects/:projectId
/projects/:projectId/activity
/users?status=active&page=2
/settings/security
```

避免：

```text
/projectDetail?id=123
/settings?page=security
/users/detail/123/edit/logs/deep/more
```

---

## 4. 主导航

主导航展示产品核心模块。

规则：

- 主导航保持稳定、可预测。
- 根据当前 route 展示 active module。
- 模块很多时进行分组。
- 不要把低频一次性操作放进主导航。
- 不要把 row-level 或 resource-specific actions 放进全局 shell。
- 标签应短，并且贴近业务域。
- Icon 只有在能增强识别时使用；复杂控制台中仍需要文字。
- 除非产品上下文发生变化，否则顶级导航不应在不同模块间剧烈变化。

当模块数量变多：

- 按业务域分组。
- Search/command palette 只能作为增强入口，不能作为唯一导航。
- 可以视觉折叠，但不能语义消失：隐藏模块仍必须可达。

---

## 5. 次级导航

次级导航帮助用户在模块或详情页内部移动。

使用次级导航：

- Settings sections。
- Detail page sections。
- Billing sections。
- Admin submodules。
- 长运营工作台。

模式：

| 模式 | 使用场景 |
|---|---|
| Horizontal route pills | 2-5 个平级 section。 |
| Sidebar section nav | section 较多，或需要图标/标签扫描。 |
| Tabs | 同一页面内的 panels，不是独立页面。 |
| Anchors | 单页很长，有多个 sections。 |
| Breadcrumb | 层级定位和返回方向，不用于平级切换。 |

规则：

- L1 和 L2 navigation 视觉上应能区分。
- Route navigation 使用 links，并从 route 推导 active state。
- Tabs 不用于无关的 route pages。
- SegmentedControl 不用于 route navigation。
- 当能增强定位感时，可以使用 sticky secondary nav。

---

## 6. Breadcrumb 与 Back

Breadcrumb 和 Back 解决的是不同问题。

| 模式 | 使用场景 |
|---|---|
| Breadcrumb | 页面位于稳定深层级中。 |
| Back | 用户来自清晰的父流程，比如 list -> detail。 |
| Both | 深层详情页既需要定位，也需要快速返回。 |

Breadcrumb 规则：

- Breadcrumb 必须反映 route/resource hierarchy。
- 除当前页外，breadcrumb items 都是 links。
- 不要展示不匹配 IA 的 fake breadcrumbs。
- Breadcrumb 中的 resource name 应足够稳定；加载中可使用 fallback id 或 loading state。
- Breadcrumb 不能替代 page title。

Back 规则：

- 已知目的地时，优先使用 canonical back destination，而不是只依赖 browser history。
- List -> detail 返回时，应尽量恢复 list filters、search、sort、page 和 scroll。
- 没有安全 previous context 时，back 回到 canonical parent route。
- Back 不能在没有确认的情况下丢弃 dirty changes。
- 一个页面不要出现多个互相竞争的 back actions。

---

## 7. List 到 Detail 的导航

List/detail navigation 是 2B 的核心流程。

规则：

- 当存在 detail route 时，table/list/card 的 identity field 应链接到 detail。
- 只有当 detail 是临时/上下文型内容时，row click 才适合打开 drawer。
- 用户需要分享、刷新、相关数据、audit、permissions 或深层操作时，必须使用 detail page route。
- 进入 detail 时保留 list query state。
- 返回 list 时，应恢复用户之前的工作上下文。
- 如果 detail resource 已删除，展示 not-found/deleted state，并提供 canonical back。

推荐状态：

```text
/users?status=active&role=admin&page=3
-> /users/user_123
Back -> /users?status=active&role=admin&page=3
```

如果需要恢复 scroll position，优先存放在 router/browser state，而不是 query 中。

---

## 8. Workspace、Account 与 Tenant 上下文

2B 产品经常存在 organization/workspace context。

规则：

- 当前 workspace/account/tenant 会改变数据范围时，应在 shell 中可见。
- 切换 workspace 时，必须清楚表达 scope 变化。
- 跨 workspace navigation 不能静默复用过期 filters 或 selected resources。
- 当页面不是全局范围时，route 应包含 workspace/account id。
- 如果 resource 属于另一个 workspace，展示清晰的 access/scope state。
- Breadcrumb 和 page title 应帮助用户理解当前 scope。

Route 示例：

```text
/workspaces/:workspaceId/projects
/orgs/:orgId/billing/invoices
```

只有当数据确实是全局的，才使用 global routes。

---

## 9. Query State 与 History

Query state 应让重要页面状态可恢复，同时不污染历史记录。

放入 query params：

- search keyword
- filters
- sort
- pagination
- view mode
- selected tab，限同页且需要分享/恢复时
- date range

不要放入 query params：

- transient hover/open state
- raw form drafts
- sensitive tokens/secrets
- large payloads
- scroll position，除非有强理由

History 规则：

- Filter/search/sort changes 通常在 debounce 后使用 replace navigation。
- 明确分页跳转可以 push history。
- 打开 route detail page 使用 push history。
- 关闭 local drawer/dialog 通常不 push history，除非它是 route-backed。
- Invalid query params 应安全 fallback 并清理。

---

## 10. 权限与导航

权限会影响导航，但不能让 IA 变得混乱。

规则：

- 只有当用户不应该知道功能存在时，才隐藏 navigation item。
- 当功能存在且可申请/解释权限时，使用 disabled 或 locked state。
- Forbidden routes 必须展示 permission state，而不是 empty data。
- 用户无权访问时，不要在导航中暴露敏感 resource names。
- 如果某模块因权限被隐藏，直接访问 route 时仍必须有 forbidden handling。
- Navigation availability 和 route guards 必须使用同一个 permission source。

---

## 11. 响应式导航

以 responsive layout rules 作为基础。

规则：

- 桌面控制台通常使用 sidebar navigation。
- 窄桌面可将 sidebar 折叠为 rail 或 grouped menu。
- 移动端根据产品结构使用 sheet navigation、horizontal route pills 或底部安全入口。
- 折叠后仍要让 active route 可见。
- Header actions 和 navigation 不应在小空间里互相争抢。
- 次级 route nav 可以变成横向滚动 pills。
- Breadcrumb 在窄屏可折叠为 parent/back + current title。

不要：

- 隐藏主导航却不给明显打开入口。
- 依赖 hover 暴露导航。
- 把太多 route levels 塞进移动端 header。

---

## 12. Loading、Error 与 Missing Routes

导航在数据状态变化中也要保持稳定。

规则：

- Page-level loading 应保留 shell navigation。
- Loading 期间 active route 仍应可见。
- Not-found state 应提供 canonical parent navigation。
- Forbidden state 不能暗示 resource 不存在。
- Redirects 应明确且集中管理。
- Route params 加载中时，不要在权限/资源检查完成前闪烁 forbidden/not-found。
- Retry 应保持当前 route 和 query context。

---

## 13. 可访问性

规则：

- 主导航使用语义化 navigation landmarks。
- 当前 route 暴露 `aria-current` 或等价 active semantics。
- 键盘用户可以访问和操作 navigation groups。
- 折叠导航具备 accessible labels。
- Breadcrumb 使用 breadcrumb navigation 语义。
- Route change 后，focus 移动到 page title/main content，而不是随机控件。
- 复杂 shell 应提供 skip-to-content。

---

## 14. 示例

Project module：

```text
Primary nav: Projects
/projects
/projects/:projectId
/projects/:projectId/activity
/projects/:projectId/settings
```

Settings module：

```text
Primary nav: Settings
Secondary nav: Profile / Security / Billing / API Keys
/settings/profile
/settings/security
/settings/billing
/settings/api-keys
```

Workspace scoped module：

```text
Workspace switcher: Acme
/workspaces/acme/projects
/workspaces/acme/users
/workspaces/acme/audit-logs
```

---

## 15. AI 审查清单

- IA 是否遵循用户任务和资源域，而不是后端表结构。
- Global navigation 是否稳定且 route-aware。
- L1/L2/L3/L4 层级是否清晰，且没有过度嵌套。
- 每个 route 是否都有可达入口或明确 redirect。
- Route path 是否规范、可读、没有重复挂载。
- 当前所在位置是否通过 active nav、title 和/或 breadcrumb 清楚表达。
- Breadcrumb 是否反映真实 hierarchy。
- Back 是否有 canonical destination，并能保留 list context。
- List/detail navigation 是否能恢复 filters、sort、page 和必要 scroll。
- Query params 是否用于可恢复页面状态，而不是临时 UI 状态。
- Permission states 是否没有被表现成 empty data。
- 响应式导航是否保持 active route 和 primary actions 可达。
- Loading/not-found/forbidden states 中导航是否保持稳定。
