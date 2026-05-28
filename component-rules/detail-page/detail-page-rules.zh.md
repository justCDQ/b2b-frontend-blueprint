# Detail Page 详情页规范

> 用于 2B 资源详情页。
> Detail Page 支持深度查看、相关数据、资源操作和可分享 route state。

---

## 1. Detail Page vs Dialog vs Drawer

使用 Detail Page：

- 用户需要可分享/可刷新的 URL。
- 数据量太大，不适合 table/dialog/drawer。
- 存在 related tables/logs/activity。
- 用户围绕一个 resource 进行多个操作。
- detail 包含 edit mode 或复杂 sections。
- 用户可能 refresh、bookmark 或 share。
- permission、audit、billing 或 operational context 重要。
- 页面会成为主要工作面。

使用 Dialog：

- 内容短且聚焦。
- 任务是临时的。
- 不需要 shareable state。
- 用户应立即回到当前上下文。
- 内容符合 dialog size rules。

使用 Drawer：

- 用户查看/编辑时需要 list/current page context。
- detail 是中等复杂度。
- 用户可能快速扫描多个 list items。
- workflow 是临时的但比 dialog 大。
- 关闭后回到同一任务流。

规则：

- 不要为了避免路由，把大型只读 detail 放进 Dialog。
- 不要把 Drawer 当作隐藏 route page。
- 不要为 tiny temporary content 创建 Detail Page。
- 如果 share/refresh/bookmark 重要，使用 Detail Page。
- 如果用户边读详情边比较列表上下文，Drawer 可能更好。

---

## 2. 从 List/Card 进入

规则：

- 存在 detail route 时，table/list/card 的 identity field 应链接到 Detail Page。
- Row click 只有在 detail 是上下文型和临时内容时才打开 Drawer/Dialog。
- Card click 根据复杂度打开 Detail Page 或 Drawer。
- `View details` action 必须匹配选定 detail container。
- 打开 Detail Page 时保留 list query/filter/sort/page state。
- 返回 list 时尽量恢复 query/page/scroll。
- 打开 Drawer/Dialog 时，背后的 list 保持视觉稳定。

示例：

```text
User row -> identity link -> /users/:id
Project card -> /projects/:id
Job row -> View logs -> drawer
Token row -> quick detail -> dialog/drawer
```

---

## 3. URL 与 State

规则：

- Detail Page identity 属于 route path。
- Detail tabs/sections 可使用 route segments 或 query params。
- 临时 UI state 保持 local，除非 recovery/share 重要。
- 返回 parent list 时保留 query state。
- Refresh 保持当前 route、section 和 selected tab。
- Invalid tab/section query 安全 fallback。
- Deleted resource 展示 deleted/not-found state 和 canonical back。

示例：

```text
/projects/:projectId
/projects/:projectId/activity
/users/:userId?tab=permissions
```

---

## 4. 页面结构

推荐结构：

```text
Breadcrumb / Back
Page Header: title, status, metadata, primary actions
Summary / Key facts
Tabs / Sections
Related tables / logs / activity
```

规则：

- Identity/title 在首屏可见。
- Status badge 在相关时靠近 title。
- Primary resource actions 放在 page header。
- Summary 展示进入深层 sections 前需要的关键事实。
- Related data 放在 sections/tabs 中。
- 避免把详情页变成一堆无关 cards。
- 尽量使用 sections/bands，而不是 nested cards。

---

## 5. 信息架构

常见 detail sections：

- Overview
- Settings / Configuration
- Members / Permissions
- Usage / Metrics
- Related records
- Activity Log
- Audit Log
- Billing / Plan
- Integrations

规则：

- 平级 sections 使用 tabs/route nav。
- 长单页 detail 使用 anchors。
- Child resources 使用 related tables。
- Logs 使用 Activity/Audit Log rules。
- 不要创建很多 tiny tabs。
- L1/L2 navigation 视觉上保持区分。

---

## 6. Actions

规则：

- Page-level actions 影响 resource。
- Section actions 只影响 section。
- Related table row actions 影响 related rows。
- Dangerous resource actions 放入 overflow、danger zone 或 ConfirmDialog。
- Edit 根据复杂度打开 edit mode、dialog、drawer 或 route。
- Actions 遵守 permission 和 disabled reasons。
- 不要混用 action scopes。

常见 actions：

```text
Edit
Configure
Archive
Disable/Enable
Duplicate
Delete
Export
View audit log
```

---

## 7. Edit Mode

按复杂度选择编辑模式：

| 复杂度 | Edit pattern |
|---|---|
| 1-2 fields | Dialog |
| medium contextual edit | Drawer |
| many fields / sections | Page edit mode |
| shareable edit workflow | Route edit page |

规则：

- Edit mode 必须有 Save 和 Cancel。
- Dirty state 需要 leave confirmation。
- Save pending 防止重复提交。
- Save failure 保留输入。
- Server field errors 尽量映射到 fields。
- Readonly 和 permission-disabled fields 保持可理解。

---

## 8. Related Data

规则：

- Related tables/lists 有自己的 loading/empty/error states。
- Related row actions 留在 related table/list 内。
- Related filters/search 是 section local。
- Section empty 保持紧凑，不占据整个页面。
- Related data refresh 不应重置整个 detail page。
- Audit/Activity logs 遵循 log rules。

---

## 9. State Handling

规则：

- 初始 loading 在 layout 已知时使用 detail skeleton。
- Refresh 尽量保留旧 detail。
- Not found 使用 StateView + canonical back。
- Forbidden 使用 permission StateView，不暗示 resource 不存在。
- Deleted resource state 在已知时说明删除。
- Partial section failure 保持在 section 内。
- 只有整个 detail 无法渲染时才使用 page-level error。

---

## 10. 响应式行为

规则：

- Header title/status/actions 保持可见和可用。
- Header actions 先折叠进 overflow，再牺牲 title 可读性。
- Detail sections 可堆叠。
- 宽 summary metadata 可变成 stacked key-value rows。
- Related tables 可变成 MobileDataCard。
- 移动端重型 detail workflow 可使用专门 route page，而不是拥挤 drawer/dialog。

---

## 11. 可访问性

规则：

- Page title 是 main heading。
- Breadcrumb/back 可被键盘访问。
- Tabs/route nav 暴露 active state。
- Status badge 不只依赖颜色。
- Save/cancel/dirty confirmation 可被键盘访问。
- Related tables 保留 table/list 语义。
- Route/detail load 后 focus 移动到 main heading 或相关 section。

---

## 12. 示例

User detail：

```text
Header: Rebecca Chen + Active + Edit + More
Summary: role, team, last login
Sections: Overview / Permissions / Activity / Audit Log
Related: sessions, API keys
```

Project detail：

```text
Header: Acme Sync + Running + Configure + More
Summary: owner, environment, sync status
Sections: Overview / Jobs / Members / Settings / Audit Log
```

避免：

```text
Tiny token preview as full detail page
Large multi-section account detail inside dialog
Drawer with tabs, related tables, audit log, and many resource actions
```

---

## 13. AI 审查清单

- Detail Page 是否比 Dialog/Drawer 更合理。
- 从 list/card 进入是否保留 back context。
- Route path/query 是否表达 identity 和 recoverable state。
- Header 是否包含 title、status、metadata 和 page actions。
- 页面结构是否区分 summary、sections、related data。
- Related data 是否有 local states 和 local actions。
- Action scopes 是否没有混用。
- Edit pattern 是否匹配复杂度。
- Dirty/save/failure behavior 是否存在。
- Not-found/forbidden/deleted states 是否明确。
- 响应式行为是否保留 title、status 和 primary actions。
