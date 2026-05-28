# FilterBar 组件系统规范

> 用于创建、修改或审查 2B 列表页筛选栏。
> FilterBar 不是装饰区域，而是 query、refresh、reset、batch actions 的紧凑控制面。

---

## 1. 目的

FilterBar 帮助用户快速缩小数据范围，同时不能占据页面主区域。

目标：

- 第一行保持紧凑。
- 只暴露高频筛选。
- 高级/低频筛选进入 popover。
- Query state 可从 URL 恢复。
- 提供 refresh。
- 有 active filters 时提供 clear filters。
- 为 batch/list actions 预留空间。

规则：

- 数据区域是主内容。FilterBar 不能膨胀成大型表单面板。

---

## 2. 组件结构

推荐结构：

```text
FilterBar
  FilterBarMain
    FilterBarSearch
    FilterBarChips
    FilterBarAdvanced
  FilterBarActions
    FilterBarClear
    FilterBarRefresh
    FilterBarBatchActions
    FilterBarMoreActions
```

实现不必使用完全相同命名，但必须保留相同职责。

---

## 3. 外层展示什么

只暴露 L1 controls。

L1 filters：

- 主搜索。
- 主要 status chips。
- 一个高频且小规模的核心 type/category group。
- Advanced filter trigger。

List actions：

- Refresh。
- 有 active filters 时 Clear filters。
- 有 selection 时 Batch actions。
- 必要时 More actions。

规则：

- L1 filter controls 最多 3 个：search、chips、advanced。
- Refresh 和 actions 不计入 filters，但必须保持紧凑。

---

## 4. 什么进入 Advanced

放入 `FilterBarAdvanced`：

- 低频字段。
- 长枚举列表。
- 多选筛选。
- 日期/时间范围。
- 数字范围。
- tags/groups/providers。
- region/channel/source。
- advanced match modes。
- 组合条件。

判断规则：

- 大多数用户不是每次都用 -> advanced。
- 需要解释 -> advanced。
- 会导致第一行换行 -> advanced。
- 超过 6 个 options -> advanced，除非它是主要 status。

---

## 5. FilterBarSearch

Search 用于主关键词。

示例：

- name
- email
- ID
- order number
- token name
- trace ID

规则：

- search input 左侧有 search icon。
- 有值时提供 clear button。
- placeholder 说明可搜索字段。
- search 通过 list query hook 更新 URL state。
- search change 重置 page。
- search change 清空 selection。

Search modes：

| Mode | 使用场景 | 规则 |
|---|---|---|
| Debounced search | request 便宜 | debounce 300-500ms |
| Explicit submit | request 昂贵或 query 复杂 | 仅 Enter/search button 后更新 URL |

必要链路：

```text
Search value -> query values -> URL -> request params
```

---

## 6. FilterBarChips

Chips 用于少量互斥筛选。

适合：

- all / active / disabled
- all / success / failed
- all / pending / completed
- all / api / webhook / manual

规则：

- 使用 chips/segmented control，不要使用多个 Select。
- options 通常不超过 6 个。
- chips change 重置 page。
- chips change 清空 selection。
- chips state 必须可从 URL 恢复。

---

## 7. FilterBarAdvanced

Advanced filter 是 secondary filters 的紧凑 popover/sheet 入口。

必需行为：

- advanced filters active 时展示 active count。
- 提供 advanced fields reset。
- 不重复 L1 filters。
- 使用 field labels。
- 支持 Select、multi-select、checkbox、date/time、numeric input。
- changed 后重置 page。
- changed 后清空 selection。

Active count：

- 默认只统计 advanced fields。
- 不统计 page、pageSize、sort。
- search/status 是否单独计数由产品决定，不要重复计数。

Reset：

- Advanced reset 只清除 advanced filters。
- Global clear filters 清除 search + chips + advanced filters。

Mobile：

- Popover content 必须适配 viewport。
- 移动端 controls 使用 full-width。
- popover 过密时使用 bottom sheet。

---

## 8. FilterBarActions

Actions 位于 filters 旁边，但它们不是 filters。

必需 actions：

- Refresh。

条件 actions：

- active 时 Clear filters。
- rows selected 时 Batch actions。
- list 支持时 Export/import/upload。
- 低频 actions 进入 More。

规则：

- Refresh 必须始终可用。
- 无 active filter 时不展示 Clear filters。
- Batch actions 不能挤占 search 宽度。
- 低频 actions 进入 More。
- 危险 batch action 使用 destructive 样式和确认。

Desktop layout：

```text
left:  Search + Chips + Advanced
right: Clear + Refresh + BatchActions + More
```

Mobile layout：

```text
row 1: Search full width
row 2: Chips horizontal scroll
row 3: Advanced + Refresh + More
```

---

## 9. Refresh

每个列表页必须有 refresh。

规则：

- Refresh 保持当前 search、filters、sort、page、pageSize。
- Refresh 不应清空 selection，除非返回数据使 rowKeys 失效。
- manual refresh 时 refresh button loading。
- manual refresh 失败可显示 error toast。
- manual refresh 失败保留旧数据。
- silent refresh 不使用 refresh button loading state。

---

## 10. Clear Filters

只有 filters active 时展示 Clear filters。

Global clear：

- 清除 search。
- 清除 chips/status。
- 清除 advanced filters。
- 重置 page 到 1。
- 清空 selection。
- 更新 URL。

Advanced reset：

- 只清除 advanced filters。
- 保留 search 和 primary status。
- 重置 page 到 1。
- 清空 selection。

禁止：

- 只清 UI，不清 URL params。
- 清 URL，但 input values 仍旧。

---

## 11. Batch Actions In FilterBar

FilterBar 必须为 batch actions 预留位置。

规则：

- 有 selected rows 时展示 batch actions，或 disabled + reason。
- batch count 必须可见。
- 多个 batch actions 进入 DropdownMenu。
- 危险 batch actions 需要确认。
- batch operation result 使用一个聚合 toast。
- batch action 后：清空 selection、刷新 list、重新计算有效 page。

Disabled reasons：

- 没有 rows selected。
- 部分 selected rows locked。
- 无权限。
- 当前 selection scope 不支持。

---

## 12. URL State

FilterBar 必须接入 URL-driven query state。

规则：

- 默认值不写入 URL。
- 每个 filter field 有 parse/serialize 逻辑。
- query changes 使用 replace navigation，避免污染 history。
- reset 移除相关 params。
- back/forward 恢复 filter state。
- shared link 恢复 filter state。

禁止：

```js
window.location.hash = 'status=active';
```

---

## 13. State Change Rules

Filter change effects：

| Change | page | selection |
|---|---|---|
| search | reset to 1 | clear |
| chips/status | reset to 1 | clear |
| advanced filter | reset to 1 | clear |
| clear filters | reset to 1 | clear |
| refresh | keep | keep if rowKeys valid |

规则：

- 任何 result-set change 都重置 page。
- 任何 result-set change 都清空 selection。
- Refresh 不是 result-set definition change。

---

## 14. Disabled And Permission

FilterBar actions 可以 disabled。

规则：

- disabled action 必须解释原因。
- 使用 Tooltip 或 inline reason。
- disabled action 不发送请求。
- permission logic 应集中管理，不散落在 JSX 中。

隐藏而非 disabled：

- 用户不应该知道能力存在。
- 操作对当前角色永久无关。

Disabled + reason：

- 用户可能获得权限。
- 当前状态暂时阻止操作。
- selected rows 不满足条件。

---

## 15. Loading

使用具体 loading states。

规则：

- search/filter fetch 使用 table fetching state。
- manual refresh 使用 refresh button loading。
- batch operation 使用 bulk pending state。
- silent refresh 不使用强视觉 loading。
- advanced reset 除非请求很慢，否则不显示 full-page loading。

不要：

- row-level action 让整个 table skeleton。
- silent polling 显示 refresh button loading。
- refresh 中允许重复点击。

---

## 16. Mobile Behavior

规则：

- Search full width。
- Chips 横向滚动。
- Advanced trigger 保持可见。
- Refresh 保持可达。
- More actions 收纳 overflow actions。
- Batch actions 变成 compact bar 或 More menu。
- touch target 至少 36px，关键 actions 接近 44px。
- 375px 不应横向溢出。

禁止：

```text
All filter fields stacked as a long mobile form above table.
```

---

## 17. Accessibility

规则：

- Search input 有 accessible label 或清晰 placeholder。
- Icon-only buttons 有 accessible names。
- Tooltip 不是移动端理解关键 disabled state 的唯一方式。
- Advanced filter trigger 宣告 active count。
- Keyboard users 可访问 search、chips、advanced、refresh、clear、batch actions。

---

## 18. AI 审查清单

接受 FilterBar 实现前，检查：

- L1 filters 紧凑：search + chips + advanced。
- 低频 filters 在 advanced 内。
- Refresh 始终存在。
- Clear filters 只在 active 时出现。
- Batch actions 有预留位置。
- Filter state 由 URL 驱动。
- defaults 不污染 URL。
- query changes 重置 page 并清空 selection。
- Refresh 保持 query state。
- Search 有 clear button 和 search icon。
- Chips 用于 primary small status filters。
- Advanced 显示 active count 和 reset。
- Disabled actions 解释原因。
- Mobile layout 不溢出。
- 没有手写重复 search/chips/date picker。
- 没有 hash-based persistence。
