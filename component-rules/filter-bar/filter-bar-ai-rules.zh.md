# FilterBar AI 执行规则

> 用于 AI 生成 2B 筛选栏交互的压缩版规则。
> 详细解释参考 `filter-bar-rules.zh.md`。

---

## 1. 用途

FilterBar 用于控制列表 query state，同时不占据过多页面空间。

可包含：

- search
- core filters
- advanced filters
- active filter chips
- refresh
- clear filters
- batch/list actions

---

## 2. 外露筛选 vs 高级筛选

外露 filters 应该是：

- 高频使用。
- 对决策关键。
- 紧凑。
- 易理解。
- 适合频繁修改。

Advanced filters 应包含：

- 低频 filters。
- 宽或复杂控件。
- 长选项列表。
- 非主要 date ranges。
- 技术/内部 filters。
- 需要解释的 filters。

规则：

- 不要默认展示所有 filters。
- 第一行保持紧凑。
- Advanced filters 根据空间和复杂度放入 popover/drawer/sheet。
- 已启用的 advanced filters 必须通过 chips 或 count 可见。

---

## 3. Search 与变化行为

规则：

- Text search 使用 debounce。
- Single select/radio/segmented value 可立即触发请求。
- Multi-select 通常确认后 apply。
- Date range 在有效范围选择后 apply。
- 改变 query 的 filters 重置 page number。
- Query changes 默认清空 selection，除非明确安全。
- 无效/空值应从 query params 移除。

---

## 4. URL State

规则：

- 页面级 list filters 应可从 URL 恢复。
- Search、filters、sort、pagination、view mode、tab/mode 可使用 query params。
- Debounce-driven query changes 使用 replace navigation。
- 只有明确分页跳转或有意义历史记录才 push。
- 不要把复杂原始对象、secrets 或 transient open state 放入 URL。

---

## 5. Actions

必需：

- List page 必须有 Refresh action。

条件出现：

- 存在 active filters/search 时显示 Clear filters。
- 存在 selection 时显示 Batch actions。
- Import/export/create 等 list-scoped actions 可放在 list toolbar 附近。

规则：

- Refresh 保持当前 query。
- Refresh 不应清空 selection，除非 row keys 已失效。
- Clear filters 清空 filter/search query 并重置 page。
- Clear filters 不清空 view mode，除非 view mode 属于筛选意图。
- Batch actions 展示 selected count 和作用范围。

---

## 6. Loading、Disabled、Permission

规则：

- Filter changes 可触发 list loading/refreshing。
- Refresh button 在请求中展示 pending。
- Refresh 期间 filter controls 可保持可用，除非变化会造成竞态混乱。
- Disabled filter/action 原因不明显时需要说明。
- Permission-hidden actions 不应留下布局空洞。
- Permission-disabled actions 在安全时说明角色/权限。

---

## 7. 响应式

规则：

- 尽量保留 search 和最重要 filters 可见。
- 窄屏将 advanced filters 移入 drawer/sheet。
- 移动端 controls 可 full-width。
- 不要默认把所有 filters 堆成 table 上方的长表单。
- Refresh/Clear filters 保持可达。
- Hover-only explanations 需要 tap/inline 替代。

---

## 8. AI 检查清单

- 默认是否只外露核心 filters。
- Advanced filters 是否可访问，且 active state 可见。
- Search 是否 debounce。
- Single/multi/date filter 的 apply timing 是否正确。
- Query state 是否可从 URL 恢复。
- Filter changes 是否 reset page 并处理 selection。
- Refresh 是否存在且保留当前 query。
- Clear filters 是否只在有用时出现。
- Batch actions 是否依赖 selection。
- 移动/窄屏布局是否没有变成巨大筛选表单。
