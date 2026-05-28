# 2B 列表页规范

> 用于创建、修改或审查 2B 列表页。
> 目标是保持一致性、可恢复性、安全操作和高效数据处理。

---

## 1. 页面类型

### 使用 Table

适用场景：

- 用户需要对比、扫描、排序、筛选、分页或批量操作。
- 数据结构稳定，每行字段一致。
- 页面是后台 CRUD / 管理列表。

示例：

- 用户列表
- 订单列表
- Token 列表
- 日志列表
- 成员列表
- 配置列表

### 使用卡片列表

适用场景：

- 用户主要是在识别、浏览或选择对象。
- 每项内容需要摘要、封面、描述、标签或富预览。
- 横向字段对比不是核心任务。

示例：

- 项目卡片
- 文档卡片
- 模板卡片
- 应用/资源卡片

注意：

- 卡片列表是一种列表形态。
- `MobileDataCard` 是 table 的移动端展示形态，不等同于卡片列表。

---

## 2. 标准页面结构

Table 列表页推荐结构：

```text
ConsolePage
  PageHeader / title actions
  FilterBar
    FilterBarSearch
    FilterBarChips
    FilterBarAdvanced
    List actions
  TableContainer
    Table
      selection column
      data columns
      action column
    Pagination
  ResponsiveDialog
  ConfirmDialog
  Toast feedback
```

规则：

- 默认页面宽度使用 Standard。
- CRUD table 使用 `TableContainer`。
- 详情区块中的辅助 table 使用 `ContentCard`。
- 同一个列表页不要混用多种 table 容器风格。

---

## 3. 筛选区域

筛选区域必须紧凑，页面空间优先留给数据。

第一层只外露：

- 主搜索。
- 主状态 chips。
- 高频且选项少的核心类型/分类。
- 高级筛选入口。
- 刷新。
- 有筛选时的清空筛选。
- 有选中项时的批量操作。

低频筛选放入高级筛选：

- 长枚举。
- 多选字段。
- 日期/时间范围。
- 数值范围。
- 标签、分组、渠道、来源。
- 组合条件。

规则：

- L1 筛选控件最多 3 个：搜索、chips、高级筛选。
- Refresh 和批量操作属于 actions，不计入筛选控件，但仍要紧凑。
- 刷新按钮必须存在。
- 清空筛选只在有筛选条件时显示。

推荐：

```text
Search + StatusChips + Advanced + Refresh
```

不推荐：

```text
Search + Status + Role + Group + Provider + Region + DateRange + Refresh
```

---

## 4. URL 与状态

URL/search params 是查询状态的唯一来源。

进入 URL：

- search
- filters
- sort
- page
- 需要分享完整视图时的 pageSize
- 需要刷新/分享恢复的 tab/sub tab

保留本地：

- dialog open
- dropdown/tooltip open
- 表单草稿
- row pending
- 当前编辑对象

规则：

- 默认值不写入 URL。
- request params 必须从解析后的 URL values 生成。
- reset 必须同时清 UI 和 URL。
- 不要 URL 一套筛选，组件 state 另一套筛选。

状态流：

```text
URL search params
  -> parsed values
  -> FilterBar / Table / Pagination
  -> request params
  -> API response
  -> table data
```

---

## 5. Table 基础

Table 基础样式由共享 table 组件负责。

基础组件负责：

- 表头高度、字号、字重、大小写、字距。
- 单元格字号和间距。
- 行 hover。
- 行分割线。
- 选中态。
- 骨架屏节奏。
- 空状态行节奏。

页面允许覆盖：

- 列宽。
- 对齐。
- cursor。
- 内容自身样式。

禁止：

```jsx
<TableHead className="h-12 text-sm font-semibold" />
<TableRow className="hover:bg-muted/80 border-border" />
```

每行必须有稳定 `rowKey`，禁止使用数组 index。

---

## 6. 列内容语义

规则：

- 状态使用 Badge，不只用彩色文字。
- 可跳转资源使用 Link 样式。
- ID/key/token/trace ID 使用等宽字体，必要时支持复制。
- 长文本截断，并通过 tooltip 或详情展示完整值。
- 空值展示 `-`，不要展示 `null` / `undefined`。
- 数字必须有单位，金额必须有币种。
- 错误/危险状态不能只依赖颜色。

对齐：

- 文本、名称、邮箱：左对齐。
- 数字、金额、百分比：右对齐。
- 操作列：右对齐。
- 选择列：居中。

---

## 7. 行操作

操作列始终在最后一列。

规则：

- 最多外露 3 个常用操作。
- 使用图标按钮。
- 每个图标按钮必须有 tooltip。
- 图标尽量语义化。
- 超过 3 个操作收进 `MoreHorizontal`。
- 危险操作使用 destructive 色。

Dropdown 规则：

- 触发图标：`MoreHorizontal`。
- 宽度统一，如 `min-w-[160px]`。
- 菜单项由 icon + text 组成。
- icon 和 text 间距 8px。
- 危险操作放最后，前面加分隔线，图标和文字都使用 destructive。

禁止：

```jsx
<Button size="sm">Edit</Button>
<Button size="icon"><Pencil /></Button> // 无 tooltip
```

---

## 8. 行详情

不要默认给每行都加详情。

决策：

- table 已经展示足够信息：不启用行点击。
- 中等补充详情：点击行或 Eye 操作打开 `ResponsiveDialog`。
- 大型详情、复杂操作、可分享状态：进入路由详情页。

规则：

- 行点击不能是唯一的详情入口。
- 有详情页时，主身份字段应该是 Link。
- Checkbox、操作按钮、Link、Switch、DropdownMenu 点击不能触发行点击。
- 可点击行需要 cursor 和 hover 反馈。
- 不可点击行不要伪装成可点击。

---

## 9. 弹窗与确认

普通操作使用 `ResponsiveDialog`。

尺寸：

- 1-2 字段：small。
- 3-6 字段：medium。
- 多区块/Tabs：large。
- 向导：large 或 full。
- 大型内容：full。

危险操作使用 destructive confirm。

确认文案必须包含：

- 具体对象或范围。
- 具体动作。
- 操作后果。

推荐：

```text
删除 Token
确认删除 Token "prod-api-key"？使用该 Token 的请求将立即失败，此操作不可恢复。
```

不推荐：

```text
确定操作？
```

---

## 10. Switch 列

二元状态使用 Switch。

示例：

- 启用/禁用。
- 开启/关闭。
- 允许/禁止。

规则：

- Switch 列按语义放置，不强制放到操作列。
- 点击 Switch 不能触发行点击。
- 高风险切换需要确认。
- pending 状态防止重复点击。
- 失败时回滚并提示错误。

---

## 11. Disabled 状态

Disabled 表示当前不可达，必须能解释原因。

选择禁用：

- Checkbox disabled。
- 不参与 selection 和计数。
- 表头全选只选择可选行。
- 原因通过 tooltip 或行内状态说明。

操作禁用：

- 用户可能获得权限或状态可能变化：disabled + reason。
- 用户永远不该知道该能力：隐藏。
- disabled 操作不能打开弹窗或发送请求。
- 后端仍必须校验权限和业务状态。

---

## 12. 分页

### 传统分页

Table 默认使用传统分页。

请求：

- `pageNum`
- `pageSize`
- filters/search/sort

响应：

- `items`
- `total`
- `pageNum`
- `pageSize`

规则：

- 展示 total。
- 支持页码和 pageSize 切换。
- 默认 pageSize：20。
- 选项：`[10, 20, 50, 100]`。
- API 和 UI page index 在边界处转换。

### 无限滚动

卡片布局默认使用无限滚动。

规则：

- pageSize 要保证至少填满一屏。
- 使用 scroll sentinel。
- 加载完成显示轻量提示。
- 卡片网格不使用 Pagination。

### next-token 分页

规则：

- 不展示 total 和总页数。
- 适合卡片/连续浏览。
- 用于 table 时只能用上一页/下一页或继续加载语义。
- 如果需要上一页，需要保存 token 栈。
- 需要跳页、总数、全量批量操作时，不建议使用 next-token。

### 虚拟滚动

虚拟滚动只是渲染优化，不是数据分页。

适用：

- 单页渲染 50+ 行/卡片。
- 高度稳定。
- 交互简单。

---

## 13. 数据流

状态变化规则：

- search 变化 -> page 1，清空 selection。
- filter 变化 -> page 1，清空 selection。
- sort 变化 -> page 1，清空 selection。
- pageSize 变化 -> page 1，清空 selection。
- page 变化 -> 默认清空 selection。
- refresh -> 保持查询状态。
- batch action 完成 -> 清空 selection 并刷新列表。

加载状态分离：

- `isInitialLoading`
- `isFetching`
- `isRefreshing`
- `isSilentRefreshing`
- `rowPending[rowKey]`
- `bulkPending`

空/错状态区分：

- 完全无数据。
- 筛选后无结果。
- 无权限。
- page 越界。
- 首次加载失败。
- 刷新失败。
- 行操作失败。

---

## 14. 请求竞态与刷新优先级

请求优先级：

1. 用户查询变化：search/filter/sort/page/pageSize。
2. 手动刷新。
3. 行操作后的刷新。
4. 弹窗提交后的刷新。
5. 静默刷新/轮询。
6. 预加载/后台请求。

规则：

- 新请求优先于旧请求。
- 用户主动请求优先于静默刷新。
- 响应只有在 params snapshot 仍匹配当前 query 时才能写入 table。
- 过期响应不能写入 `items`、`total`、`error`、loading。
- 过期或取消请求不弹 toast。

推荐：

- `requestId + params snapshot`。
- 支持时增加 `AbortController`。
- 搜索使用 300-500ms debounce 或显式提交。

---

## 15. 批量操作

批量操作必须明确 scope。

Scope：

- 当前页已选择项。
- 手动跨页选择项。
- 当前筛选结果全部项。

规则：

- 默认只操作当前页已选择项。
- 跨页/全部筛选结果必须显式说明。
- 确认文案包含动作、范围、数量、后果。
- payload 明确传 `ids` 或 `filter scope`。
- 后端逐项校验权限和状态。
- 使用 `bulkPending` 防重复提交。
- 结果用一条汇总 toast。
- 部分失败展示成功/失败数量和明细入口。
- 完成后清空 selection、刷新列表、重新计算合法 page。

Payload 示例：

```json
{
  "scope": "ids",
  "ids": ["id1", "id2"]
}
```

```json
{
  "scope": "filter",
  "filters": { "status": "expired" },
  "excludeIds": []
}
```

---

## 16. 复杂 Table 能力

### 排序和表头筛选

- 排序状态应可从 URL 恢复。
- 排序变化重置 page。
- 默认单列排序。
- 多列排序必须有明确优先级。
- 表头筛选只用于轻量列级筛选。
- 不要和 FilterBar 重复同一个筛选条件。

### 固定表头/固定列

- 行很多时使用固定表头。
- 列很多时可固定第一列/最后操作列。
- 不要无理由固定超过 2 列。
- 移动端优先使用 `MobileDataCard`。

### 展开行

- 只用于轻量补充信息。
- 不承载完整工作流。
- 中等详情用弹窗。
- 复杂详情用路由页。

### 可编辑单元格/行

- 只用于低风险快速编辑。
- 必须有明确保存/取消。
- 校验失败保持编辑态。
- 复杂/危险编辑用弹窗。

### 列显示控制

- 必须有默认列集。
- 身份列、状态列、操作列通常不可隐藏。
- 用户偏好可持久化。
- 移动端字段优先级复用列配置。

---

## 17. 移动端 Table

| 条件 | 策略 |
|---|---|
| 7+ 列或复杂交互 | 桌面 table，移动端 `MobileDataCard` |
| 4-6 列 | 隐藏次要列，提供详情入口 |
| 3 列及以下 | 保留 table，允许横向滚动 |

规则：

- 移动端操作不能依赖 hover。
- 触控目标必须可用。
- 操作拥挤时收进 More。
- 弹窗变为 bottom sheet。
- `MobileDataCard` 的数据含义必须和桌面列一致。

---

## 18. Toast

显示 toast：

- 用户主动 CRUD 成功/失败。
- 复制结果。
- 权限拒绝。
- 阻止提交的校验。
- 批量操作汇总结果。

不显示 toast：

- 普通数据加载成功。
- 登录/跳转成功。
- 轮询成功。
- 静默刷新失败。
- 取消/过期请求。

规则：

- 批量操作只弹一条 toast。
- 相同错误需要去重。
- 错误文案要可理解或可操作。

---

## 19. AI 审查清单

接受 AI 生成的列表页代码前，检查：

- 查询状态是否由 URL 驱动。
- request params 是否从 parsed URL values 生成。
- table/card 选择是否符合用户任务。
- 是否没有覆盖基础 table 样式。
- 是否使用稳定 rowKey。
- 操作列最多外露 3 个 icon action。
- icon action 和 disabled action 是否有 tooltip。
- 危险操作是否有具体确认文案。
- disabled 状态是否说明原因。
- selection scope 是否明确。
- 批量 payload 是否使用 ids 或 filter scope。
- 分页协议是否明确。
- 请求竞态是否防止旧响应覆盖新响应。
- loading 状态是否分离。
- empty/error 状态是否区分。
- 移动端 table 策略是否明确。
- toast 是否克制。
