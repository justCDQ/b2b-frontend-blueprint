# Table AI 执行规则

> 用于 AI 生成 2B 表格交互的压缩版规则。
> 详细解释参考 `table-rules.zh.md`。

---

## 1. 什么时候使用 Table

当用户需要跨列比较结构化记录时，使用 Table。

使用 Table：

- 高密度运营数据。
- 可排序/筛选 rows。
- Row-level actions。
- 批量选择。
- 精确值和对比。

不要使用 Table：

- 用户浏览视觉化/摘要型对象。
- 每个 item 有丰富媒体或描述。
- 移动优先布局无法保留列语义。
- Card list 更适合识别和扫描。

---

## 2. 基础要求

Table 必须定义：

- 稳定 `rowKey`
- column config
- header labels
- cell renderers
- alignment
- 必要时 width/minWidth
- loading/empty/error state
- pagination 或 loading strategy

规则：

- 表头、字号、间距、线条样式保持统一。
- 不要在 desktop table 和 mobile card 中重复字段逻辑。
- 使用结构化 column config 驱动桌面和移动端呈现。

---

## 3. Column 与 Cell 规则

规则：

- 文本列左对齐。
- 需要比较的数字列右对齐。
- 状态使用 StatusBadge/Tag。
- 链接使用 link 语义。
- ID/request id 可提供 copy action。
- 长文本截断，并能访问完整值。
- 富文本 cell 仍需可扫描。
- 不要在 cell 中放大型表单或复杂布局。

Column config 应包含：

- key
- title
- width/minWidth
- render
- 相关时 sortable/filterable
- mobile priority

---

## 4. Row Detail

规则：

- 存在 detail route 时，identity field 应是 link。
- Row click 只有在不冲突 selection/actions 时才打开详情。
- 小详情可用 dialog。
- 中等上下文详情可用 drawer。
- 大型/可分享/含相关数据的详情使用 route page。
- 点击 row actions 不能触发行详情导航。

---

## 5. Action Column

规则：

- Row actions 放在最后一列 action column。
- 最多外露 3 个常用 icon actions。
- 超过 3 个放入 `MoreHorizontal` menu。
- Icon actions 需要 tooltip/accessible label。
- Icons 必须语义化，且不和已有含义冲突。
- 危险 menu item 的 icon 和 label 都使用 danger 样式。
- Action menu 宽度保持一致。

---

## 6. Selection 与 Batch

规则：

- Selection 依赖稳定 row keys。
- 不可选 row 的 checkbox 置灰且不可选。
- Row keys 不变时，selection 可在安全 refresh 后保留。
- Batch toolbar 只有存在 selection 后出现。
- Batch toolbar 展示 selected count。
- 必要时说明作用范围：当前页或全部匹配结果。
- 危险 batch action 必须使用 ConfirmDialog。

---

## 7. Disabled 与 Pending

规则：

- 原因重要时，disabled actions 保持可见。
- Permission-disabled actions 需要 reason/tooltip。
- State-disabled actions 说明所需状态。
- Row action pending 在安全时只阻塞受影响 row/action。
- Toggle/switch pending 必须防止重复切换。
- Loading button/state 防止快速重复点击。

---

## 8. Pagination 与数据流

规则：

- 传统 table pagination 使用 `pageNum`、`pageSize`、`total`。
- Next-token pagination 不展示 total，只展示 next/previous 可用性。
- Page/filter/sort 变化默认清空 selection，除非明确安全。
- 页面级 list 的 query state 应可从 URL 恢复。
- 旧请求响应不能覆盖新 query 结果。
- Refresh 尽量保留当前 query 和旧 rows。
- 50+ rows 或高密度数据可使用虚拟滚动，前提是 row height 足够稳定。

---

## 9. 复杂功能

只在需要时使用：

- 可比较列使用 sorting。
- 列特定筛选使用 header filters。
- 宽/长表格使用 fixed header/columns。
- Expanded rows 用于次要详情，不替代主详情页。
- Editable cells 只用于低风险小改动。
- 高密度可配置 table 可用 column visibility。

不要默认添加复杂 table 功能。

---

## 10. 移动端

规则：

- 复杂 table 移动端优先使用 `MobileDataCard`。
- 复用 column config 和 mobile priority。
- 不要单独维护 mobile field logic。
- 移动端 actions 不能依赖 hover。
- Selection、disabled reasons、batch actions 保持可访问。

---

## 11. AI 检查清单

- Table 是否比 card list 更合理。
- 是否存在稳定 rowKey。
- Columns 是否定义 render、width/minWidth、语义、mobile priority。
- Action column 是否最多 3 个外露 icon actions + More menu。
- Selection 和 disabled selection 是否处理。
- Batch toolbar 是否展示数量和作用范围。
- Pagination mode 是否匹配后端契约。
- 是否有请求竞态保护。
- Row detail 是否不冲突 actions/selection。
- Mobile representation 是否复用 column config。
