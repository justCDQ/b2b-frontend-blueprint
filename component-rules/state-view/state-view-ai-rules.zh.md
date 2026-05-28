# StateView AI 执行规则

> 用于 AI 生成 2B 前端代码的压缩版规则。
> 详细解释参考 `state-view-rules.zh.md`。

---

## 1. 什么时候使用 StateView

只有当前区域无法展示正常内容时，才使用 StateView。

作用范围必须匹配失败/空状态区域：

- 页面级 StateView：整页没有可用内容。
- 列表级 StateView：table/card list 无法展示 rows/items。
- 区块级 StateView：单个模块/区块失败或为空。
- 弹窗级 StateView：dialog body 无法展示内容。
- 字段状态：loading/error 保持在字段附近，不升级为页面 StateView。

不要用于：

- 单个按钮 pending。
- 字段校验错误。
- 表单提交校验错误。
- 旧数据仍可用时的刷新失败。
- 短暂成功/失败反馈。

---

## 2. Loading

规则：

- 首次加载且布局已知：使用 skeleton。
- 首次加载且布局未知/区域很小：使用居中 spinner。
- 已有旧数据时刷新：保留旧数据，展示轻量 refreshing。
- 按钮操作 pending：立即展示 button loading，并防止重复点击。
- 字段 options loading：只在字段/dropdown 内展示。
- 无限滚动：使用底部 loading，不替换整个列表。
- 快速请求避免 loading 闪烁。
- 首次请求完成前，不展示 empty/error。

示例：

```text
首次 table 加载 -> table skeleton
刷新已有 table -> 保留 rows + refresh button loading
删除行 -> 行操作/button pending
远程 select 加载 -> dropdown spinner
```

---

## 3. Empty 判断顺序

展示 empty 前，按顺序判断：

1. 请求失败 -> show error。
2. 用户无权限 -> show forbidden。
3. 缺少必要 setup/integration -> show config/integration empty。
4. 搜索关键词无结果 -> show search-empty。
5. 筛选条件无结果 -> show filter-empty。
6. 父资源存在，但区块没有关联数据 -> show local empty。
7. 模块从未创建过记录 -> show initial empty。

在排除 error、permission、setup、search、filters 前，不要归类为 initial empty。

---

## 4. Empty Actions

使用具体 empty 状态。

| Empty state | 主操作 |
|---|---|
| initial empty | Create / Import，仅有权限时 |
| filter-empty | Clear filters |
| search-empty | Clear search |
| config-empty | Configure |
| integration-empty | Connect integration |
| permission-empty | 只有存在流程时 Contact admin |
| local empty | 可选 Add/Create |
| async-pending empty | View task / Refresh |

规则：

- filter/search empty 保留 FilterBar 和 active chips。
- 无权限时不展示 create/configure/connect。
- 不要暗示被权限隐藏的数据不存在。
- 必要 setup 缺失前，不展示下游 create 操作。
- local empty 保持紧凑，并保留父级上下文。

---

## 5. Error 边界

根据内容是否仍可用选择错误 UI。

| 场景 | UI |
|---|---|
| 首次加载失败 | StateView + Retry |
| 列表加载失败且无 rows | list StateView + Retry |
| 刷新失败但旧数据可用 | 保留旧数据 + toast/local error |
| 区块失败 | section StateView |
| 弹窗内容失败 | dialog body StateView |
| 表单校验失败 | inline field/form error |
| 字段 options 失败 | field/dropdown error |
| 行/操作失败 | toast + rollback/row error |
| not-found 页面 | StateView + Go back |
| forbidden 页面 | StateView + Go back/Contact admin |

规则：

- 不要为了展示 error 清空有用旧数据。
- Error UI 必须限制在失败区域。
- Retry 必须用相同 route/query/filter/page 上下文重试失败请求。
- 表单提交失败必须保留 dirty input。
- 服务端字段错误应映射回字段。
- 乐观更新失败必须 rollback 或标记失败。

---

## 6. Toast 边界

Toast 是短暂反馈，不是内容替代。

Toast 用于：

- 成功反馈。
- 旧内容仍可用时的刷新失败。
- 内容仍可用时的单个操作失败。
- 后台任务开始/失败。
- copied/export/import started。
- 页面内容仍可用时的 offline/reconnected。

以下情况不能只用 toast：

- 首次加载失败。
- 页面/list/dialog 没有可用内容。
- 字段/表单校验错误。
- 缺少必要 setup。
- 页面级 forbidden/not-found。

规则：

- 重复相同 error toast 需要去重。
- Toast 最多有一个轻量 action。
- Toast Retry 只用于安全/幂等操作。
- 移动端 toast 不能遮挡主操作。

---

## 7. StateView Actions

规则：

- 展示 0-2 个可见 actions。
- 通常只使用 1 个主操作。
- 不要使用两个 primary buttons。
- 主操作必须直接解决或推进当前状态。
- 隐藏用户不能执行的操作。
- Disabled action 需要说明原因；不要把 disabled primary 当作主要恢复路径。
- Actions 尽量保留当前上下文。
- 文案必须是具体动词，不使用 `OK` 或 `Submit`。

默认优先级：

```text
Failed request -> Retry
Filter empty -> Clear filters
Search empty -> Clear search
Initial empty -> 有权限时 Create/Import
Missing setup -> Configure/Connect
Async pending -> View task 或 Refresh
Not found/forbidden -> Go back
Permission empty -> 只有存在流程时 Contact admin
```

---

## 8. 位置

规则：

- 页面 StateView：内容区居中或略偏上；保留全局导航。
- Table empty/error：table body；有价值时保留 header/filter。
- Filter/search empty：保留 FilterBar 和 active chips。
- Dialog StateView：body 居中；header 必须可见。
- Field loading/error：dropdown 或字段区域。
- 小区块 empty：紧凑 inline state。
- 移动端：更短文案，actions 纵向排列。

---

## 9. AI 检查清单

接受生成代码前，检查：

- StateView 作用范围是否匹配受影响区域。
- Loading 是否区分首次加载和刷新。
- Refresh 是否尽量保留旧数据。
- Empty 原因是否遵循判断顺序。
- Filter/search empty 是否保留 query 上下文和恢复操作。
- Error 是否没有替换仍可用旧数据。
- Toast 是否不是 blocking error 的唯一反馈。
- Field/form errors 是否 inline。
- Actions 是否权限感知，并限制在 0-2 个。
- Retry/Clear/Create/Configure/Go back 是否匹配当前状态。
- 移动端布局是否没有隐藏或遮挡主操作。
