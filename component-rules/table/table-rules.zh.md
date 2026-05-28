# Table 组件系统规范

> 用于创建、修改或审查 2B table 组件。
> Table 用于结构化数据工作：对比、扫描、排序、筛选、选择和操作。

---

## 1. Table vs Card

使用 table：

- 用户需要跨行对比字段。
- 数据结构稳定。
- 需要排序、筛选、分页、选择或批量操作。
- 页面偏管理/CRUD。

使用 card list：

- 用户主要浏览、识别或选择对象。
- 每个 item 内容差异较大。
- item 需要摘要、封面、标签或富预览。
- 横向字段对比不是主任务。

重要：

- `MobileDataCard` 是 table 在移动端的呈现方式。
- 它不等同于产品形态上的 card list。

---

## 2. 基础 Table

基础样式必须来自共享 table 组件。

基础组件负责：

- header 高度
- header 字号/字重/大小写/字距
- cell 字号和间距
- row hover 样式
- row border 样式
- selected row 样式
- skeleton row 节奏
- empty row 节奏

页面允许覆盖：

- column width
- alignment
- cursor
- 内容语义样式
- 必要时的 group hover

禁止：

```jsx
// Bad: 页面覆盖基础节奏
<TableHead className="h-12 text-sm font-semibold" />
<TableRow className="hover:bg-muted/80 border-border" />
<TableCell className="p-5 text-base" />
```

---

## 3. Row Identity

每行必须有稳定 `rowKey`。

规则：

- 使用业务 ID 作为 `rowKey`。
- 不要使用数组 index。
- selection 使用 `rowKey`。
- expanded rows 使用 `rowKey`。
- editing rows 使用 `rowKey`。
- row pending/loading 使用 `rowKey`。

---

## 4. Column Config

Columns 应集中定义。

Column config 应包含：

- key
- title
- width / minWidth
- alignment
- sortable
- hideable
- mobile priority
- render function

规则：

- 不要在 header、cell、mobile card 中重复字段逻辑。
- selection column 和 action column 是结构列。
- 结构列不参与业务排序。
- desktop table 和 mobile `MobileDataCard` 应尽量复用字段配置。

---

## 5. 内容语义

Cell 内容使用统一语义。

规则：

- Status：Badge。
- 可跳转资源：Link 样式。
- ID/key/token/trace ID：monospace，必要时可复制。
- 长文本：truncate + tooltip/detail。
- 空值：`-`，不要显示 `null` 或 `undefined`。
- 数字：带单位。
- 金额：带币种。
- Error/destructive 状态：使用文本 + destructive 语义，不只靠颜色。

---

## 6. 对齐、宽度、截断

对齐：

- text/name/email：左对齐。
- number/money/percent：右对齐。
- time：左对齐或统一固定格式。
- status/badge/switch：按产品统一。
- action column：右对齐。
- selection column：居中。

宽度：

- 身份列有稳定 min width。
- 描述列可截断。
- action column 宽度由暴露操作数量固定。
- time/status/money 列不应宽度跳动。
- 不要为了避免横向滚动而挤压所有列。

截断：

- 名称应保持可识别。
- 描述/错误可以截断并提供 tooltip。
- ID/token 可中间截断并提供 copy。
- URL 可展示 domain/path，并通过 tooltip/copy 暴露完整值。

---

## 7. Selection

只有存在或计划存在批量操作时才使用 selection。

规则：

- selection column 在第一列。
- 使用 Checkbox。
- Header Checkbox 只选择当前页可选择 rows。
- disabled rows 不被选中，也不计入数量。
- search/filter/sort/pageSize 变化清空 selection。
- 普通翻页默认清空 selection。
- 跨页选择必须显式表达。
- 批量操作完成后清空 selection。

Disabled selection：

- Checkbox disabled。
- 不计入 selection。
- 通过 tooltip 或 inline status 提供原因。
- Header select-all 忽略 disabled rows。

---

## 8. Action Column

Action column 始终是最后一列。

规则：

- 最多暴露 3 个常用操作。
- 使用 icon buttons。
- 每个 icon button 必须有 tooltip。
- 图标尽量语义化。
- 同一行中不要用相同图标表达不同操作。
- 超过 3 个操作进入 `MoreHorizontal`。
- 危险操作使用 destructive color。

Dropdown 规则：

- Trigger：`MoreHorizontal`。
- 宽度统一，例如 `min-w-[160px]`。
- Item = icon + text。
- icon/text 间距 8px。
- 危险项放最后，必要时分隔，icon 和 text 都使用 destructive 样式。

---

## 9. Row Detail

不要默认添加 row detail。

决策：

- Table 已经有足够信息：不启用 row click。
- 中等补充信息：打开 `ResponsiveDialog`。
- 大量详情/工作区/可分享状态：使用 route detail page。

规则：

- Row click 不能是唯一可访问的详情入口。
- 如果有 route detail page，身份字段应是 Link。
- Checkbox/action/link/switch/dropdown 点击不能触发 row click。
- clickable row 需要 cursor 和 hover 反馈。
- 不可点击 row 不能看起来可点击。

---

## 10. Switch Column

Switch 用于二元状态。

示例：

- enabled / disabled
- on / off
- allowed / blocked

规则：

- Switch column 可出现在语义正确的任意列。
- 不强制放入 action column。
- 点击不能触发 row detail。
- 高风险 switch 需要确认。
- pending 状态防止重复点击。
- 失败后回滚并显示错误。

---

## 11. Disabled State

Disabled state 必须解释操作为什么不可达。

Disabled selection：

- row locked
- row processing
- row archived
- system protected
- user lacks permission
- row cannot join current batch action

规则：

- Checkbox disabled。
- 不计入 selection。
- 提供原因。

Disabled actions：

显示 disabled + reason：

- 用户未来可能获得权限。
- row state 暂时阻止操作。
- selected rows 不满足条件。

隐藏：

- 用户不应该知道该能力存在。
- 能力对当前角色永久无关。

规则：

- disabled action 不打开弹窗。
- disabled action 不发送请求。
- tooltip 说明原因。
- 后端仍必须校验权限和状态。

---

## 12. Loading And Pending

使用具体 loading state。

Table-level：

- `isInitialLoading`
- `isFetching`
- `isRefreshing`
- `isSilentRefreshing`

Row/batch：

- `rowPending[rowKey]`
- `bulkPending`

规则：

- row pending 不让整个 table skeleton。
- refresh loading 属于 refresh button。
- silent refresh 不使用强 loading。
- row action pending 禁用冲突的行操作。
- 必须防止重复点击。

---

## 13. Pagination

默认 table pagination 使用传统分页。

传统请求：

- `pageNum`
- `pageSize`
- filters/search/sort

传统响应：

- `items`
- `total`
- `pageNum`
- `pageSize`

规则：

- 展示 total。
- 支持 page 和 pageSize 变化。
- 默认 pageSize：20。
- options：`[10, 20, 50, 100]`。
- API page index 和 UI page index 在边界转换。

next-token table：

- 不展示 total 或 total pages。
- 使用 next/previous 或 continue-loading 语义。
- 如果需要 previous page，维护 token stack。
- 用户需要跳页、total count 或全量批量操作时避免使用。

Virtual scroll：

- 只是渲染优化。
- 一次渲染 50+ rows 时考虑。
- 要求稳定 row height 和简单交互。
- 不替代 server pagination。

---

## 14. Data Flow

规则：

- Query state 来自 URL/search params。
- Request params 从 parsed query values 派生。
- Search/filter/sort/pageSize 变化重置 page 到 1。
- Search/filter/sort/pageSize 变化清空 selection。
- Refresh 保持 query state。
- 删除当前页最后一项时可能需要 page fallback。
- 批量操作完成后清空 selection 并刷新列表。

Race handling：

- 新请求胜过旧请求。
- 用户查询胜过 silent refresh。
- response 只有 params snapshot 仍匹配时才更新 table。
- stale/canceled responses 不写入 items、total、loading、error。
- stale/canceled responses 不弹 toast。

推荐：

- `requestId + params snapshot`
- 支持时添加 `AbortController`。

---

## 15. Batch Operations

批量操作必须有明确 scope。

Scopes：

- 当前页 selected rows。
- 跨页手动 selected rows。
- 当前 filters 命中的全部 rows。

规则：

- 默认 scope 是当前页 selected rows。
- 跨页/all-filter scope 必须显式表达。
- 确认中必须包含 action、scope、count、consequence。
- payload 必须发送 `ids` 或 `filter scope`。
- 后端必须逐项校验。
- 使用 `bulkPending`。
- 结果使用一个聚合 toast。
- 部分失败展示 success/failure count 和 details 入口。
- 完成后清空 selection、刷新 list、重新计算有效 page。

---

## 16. Complex Features

Sorting：

- sort state 应可从 URL 恢复。
- sort 变化重置 page。
- 默认单列排序。
- 多列排序需要明确优先级。

Header filter：

- 只用于轻量 column filter。
- 不要重复 FilterBar 条件。
- 复杂筛选属于 Advanced Filter。

Fixed header/columns：

- 多行使用 fixed header。
- 多列使用 fixed first/last column。
- 没有强理由不要固定超过 2 列。
- 移动端优先 `MobileDataCard`。

Expanded rows：

- 只用于轻量补充信息。
- 不要放完整 workflow。
- 中等详情 -> dialog。
- 复杂详情 -> route page。

Editable cells/rows：

- 用于低风险快速编辑。
- 需要显式 save/cancel。
- 校验错误保持 edit mode。
- 复杂/危险编辑使用 dialog。

Column visibility：

- 提供默认 column set。
- identity/status/action columns 通常不可隐藏。
- 有价值时持久化偏好。
- mobile field priority 复用 column config。

---

## 17. Mobile Table

分层策略：

| 条件 | 策略 |
|---|---|
| 7+ columns 或复杂交互 | desktop table，mobile `MobileDataCard` |
| 4-6 columns | 隐藏次要列，提供详情入口 |
| 3 列以内 | 保留 table + horizontal scroll |

规则：

- mobile actions 不能依赖 hover。
- touch targets 必须可用。
- 操作拥挤时合并到 More。
- Dialog 在移动端变 bottom sheet。
- MobileDataCard 必须保持和 desktop columns 相同的数据语义。

---

## 18. Accessibility

规则：

- Icon buttons 有 accessible names。
- Tooltip 不是移动端关键说明的唯一来源。
- Checkbox、Switch、Dropdown、Link 可键盘访问。
- Sort header 暴露当前 sort state。
- Disabled action 解释原因。
- Row click 不是进入详情的唯一路径。
- Status 不只依赖颜色。

---

## 19. AI 审查清单

接受 AI 生成的 table code 前，检查：

- Table 是正确模式，不应使用 card list。
- 没有覆盖 base table 样式节奏。
- 使用稳定 rowKey。
- Column config 集中定义。
- Cell content 使用 Badge/Link/Code/Number/Empty 语义。
- 对齐和截断是有意设计的。
- Selection 基于 rowKey。
- Disabled rows 被排除在 selection 外。
- Action column 在最后。
- 最多暴露 3 个 row actions。
- More actions 使用 `MoreHorizontal`。
- 危险操作使用 destructive 并确认。
- Row detail 策略合理。
- Switch column 不触发 row click。
- Disabled actions 解释原因。
- Loading states 已分离。
- Pagination 协议清晰。
- Race handling 防止 stale response overwrite。
- Batch operation scope 和 payload 明确。
- Mobile strategy 已定义。
- Accessibility basics 已覆盖。
