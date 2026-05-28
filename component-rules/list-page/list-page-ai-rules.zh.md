# List Page AI 执行规则

> 用于 AI 生成 2B 列表页的压缩版规则。
> 详细解释参考 `list-page-rules.zh.md`。

---

## 1. 页面类型

使用 Table list：

- 用户需要比较结构化 records。
- 多个 columns 都重要。
- sorting/filtering/batch actions 重要。
- row-level operations 高频。

使用 Card list：

- 用户浏览/识别 objects。
- 视觉身份或摘要更重要。
- 更适合 infinite scroll。
- item layout 比列对比更重要。

如果桌面端是 table，移动端变 cards，这是 `MobileDataCard`，不是 Card List。

---

## 2. 标准结构

List page 应包含：

```text
Page Header: title + page/list actions
FilterBar: search, filters, refresh, clear, batch/list actions
Content: Table or CardList
Pagination / Load more
State handling: loading, empty, error
```

规则：

- Page actions 影响整个页面/资源域。
- Row/card actions 影响单个 item。
- Batch actions 影响 selected items。
- 不要混用 action scopes。

---

## 3. Filter 与 URL State

规则：

- 页面级 search/filter/sort/pagination/view mode 应可从 URL 恢复。
- Search 使用 debounce。
- Filter changes 重置 page。
- Query changes 默认清空 selection，除非明确安全。
- Refresh 保持当前 query。
- Clear filters 重置 filter/search 和 page。
- Invalid query params 安全 fallback。

---

## 4. Table/List 内容

规则：

- Table 使用稳定 rowKey 和结构化 column config。
- Card list 使用稳定 item identity 和安全最小卡片宽度。
- Status 使用 StatusBadge/Tag。
- Links 使用 navigation 语义。
- 长文本截断，并可访问完整值。
- Empty/error/loading state 出现在 content area，不放在 global shell。
- 移动端 table 使用共享字段配置的 `MobileDataCard`。

---

## 5. Row/Card Actions

规则：

- 最多外露 3 个常用 row/card icon actions。
- 额外 actions 放入 More menu。
- 危险 actions 使用 danger 样式和 ConfirmDialog。
- 点击 action 不能触发行/卡片导航。
- Toggle/switch pending 防止重复切换。
- Disabled action 原因不明显时需要说明。

---

## 6. 详情入口

规则：

- 存在 detail route 时，identity field 链接到 route detail。
- 小型临时 detail 可使用 dialog。
- 中等上下文 detail 可使用 drawer。
- 大型/可分享/含相关数据 detail 使用 route page。
- 从 route detail 返回时，尽量恢复 list query/page/scroll。

---

## 7. Pagination

规则：

- 传统 pagination 使用 `pageNum`、`pageSize`、`total`。
- Card layout 可使用 infinite scroll。
- Next-token pagination 使用 `pageSize` + `nextToken`，不展示 total。
- Table 中使用 token pagination 时，展示 next/previous，直到没有 next token。
- 50+ rows/items 且高度足够稳定时，可使用 virtual scroll。

---

## 8. Data Flow 与竞态

规则：

- Query state 驱动 request params。
- 每次请求使用 params snapshot。
- 只有和当前 query 匹配的最新响应可以写入 list data。
- 过期响应不能覆盖 items、total、error 或 loading state。
- Refresh 优先级高于过期 in-flight results。
- Mutation 成功后更新或 refetch list，但不丢失 query context。
- Mutation 失败 rollback 乐观更新或标记 affected row/item failed。

---

## 9. Selection 与 Batch

规则：

- Selection 使用稳定 keys。
- Disabled rows/items 不能被选择。
- Batch toolbar 只有存在 selection 后出现。
- 展示 selected count。
- 说明 selected items、current page、all matched results 的范围。
- 改变 filters/sort/page 默认清空 selection，除非明确安全。
- 危险 batch actions 必须使用 ConfirmDialog。

---

## 10. State 与反馈

规则：

- 首次加载根据已知布局使用 skeleton/spinner。
- Refresh 尽量保留旧数据。
- Filter/search empty 保留 FilterBar 和 active chips。
- 有旧数据可用时，error 不替换内容。
- Blocking first-load error 使用 StateView + Retry。
- Toast 用于成功或非阻塞失败，不用于阻塞内容错误。

---

## 11. AI 检查清单

- Table vs Card 选择是否合理。
- 页面结构是否包含 header、FilterBar、content、pagination/load strategy。
- Query state 是否可从 URL 恢复。
- Filter/search/page changes 是否处理 selection 和 request params。
- 是否有请求竞态保护。
- Refresh 是否尽量保留 query 和旧数据。
- Row/card actions 是否作用域正确且数量受限。
- Detail container 是否匹配复杂度。
- Pagination mode 是否匹配后端。
- Batch operations 是否展示 count/scope，并确认危险操作。
- Mobile representation 是否保留数据/action 语义。
