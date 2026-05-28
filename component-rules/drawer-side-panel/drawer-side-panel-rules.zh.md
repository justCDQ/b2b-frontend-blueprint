# Drawer / Side Panel 抽屉侧边栏规范

> 用于 2B 产品中的侧边面板。
> Drawer 用于在不完全离开当前页面的情况下完成上下文相关工作。

---

## 1. 组件边界

使用 Drawer / Side Panel：

- 用户需要当前页面/list context。
- detail/edit 是中等复杂度。
- workflow 是临时的，但比 popover 更大。
- 用户可能从列表快速扫描多个 items。
- 关闭后应回到同一页面上下文。
- 内容适合纵向阅读或表单布局。

使用 Dialog：

- 任务短且聚焦。
- 内容不需要宽横向空间。
- 内容放进 70vw 会显得空。
- 只有 confirmation。
- 任务符合 `xs/s/m/l/full` dialog size rules。

使用 Route Page：

- workflow 大、可分享或多区块。
- 用户需要 deep review。
- 需要 related tables/logs/activity。
- 用户可能 bookmark/refresh/share。
- drawer 会变成主要工作台。

规则：

- Drawer 不是隐藏 route page。
- Drawer 不用于 tiny confirmation-only flows。
- Confirm/delete 不管从哪里触发都使用 ConfirmDialog。

---

## 2. 位置与宽度

桌面端：

- 默认从右侧打开。
- 一级 drawer 默认宽度是 `70vw`。
- Modal drawer 打开时，主页面上下文仍可见但不可操作。

嵌套 drawer：

| 场景 | 宽度 |
|---|---|
| first-level drawer | 70vw |
| nested parent drawer | 100vw / full current workspace |
| nested child drawer | 70vw |

规则：

- 打开下一级 drawer 时，当前 drawer 变成 full workspace，子 drawer 使用 `70vw`。
- 避免超过 2 层 drawer。
- 如果嵌套内容很小，使用 Dialog。
- Drawer width 必须遵守 viewport constraints 和 safe margins。
- 如果内容撑不起 70vw，使用 Dialog。

移动端：

- Drawer 变成 bottom sheet 或 full-screen sheet。
- 复杂 drawer content 通常使用 full-screen sheet。
- 移动端避免窄侧边 drawer。

---

## 3. 结构

推荐结构：

```text
Header: title + optional subtitle/status + close
Body: detail/form/list/workflow content
Footer: optional actions
```

规则：

- Header 必须存在。
- Close button 在 header 右侧。
- 有 submit/confirm actions 时出现 footer。
- Body 是唯一滚动区域。
- Body 滚动时 header/footer sticky。
- Footer actions 遵循 Dialog action ordering。
- Drawer title 命名对象或任务。

---

## 4. 内容类型

适合 drawer 的内容：

- row detail preview
- medium edit form
- related object picker
- log preview
- configuration side task
- contextual compare/review

避免 drawer 内容：

- 巨大的 multi-step workflow
- full dashboard
- page-level navigation tree
- dense audit investigation
- tiny rename form
- delete confirmation only

规则：

- 如果内容有 tabs、related tables 和许多 resource actions，优先 Detail Page。
- 如果内容只是一个短表单，优先 Dialog。
- 如果用户需要边看列表边读详情，Drawer 合适。

---

## 5. Actions

规则：

- Drawer-level actions 放在 footer。
- Local section actions 留在 section 内。
- Drawer 内 related row actions 只影响对应 rows。
- Dangerous drawer action 通常进入 overflow 或 ConfirmDialog。
- Submit pending 禁用 submit，防重复。
- Pending 中关闭会破坏状态时，关闭应禁用或二次确认。
- Dirty close 需要确认。

---

## 6. Navigation 与 Route State

规则：

- Drawer 通常是 local state。
- 只有 refresh/share 需要恢复时，才使用 route-backed drawer。
- Route-backed drawer 必须能关闭到 canonical parent route。
- 从列表打开 drawer 应保留 list query/page/scroll。
- 关闭 drawer 回到同一 list/detail context。
- Route-backed drawer 的 Browser Back 行为必须明确。

---

## 7. Loading、Error、Empty、Permission

规则：

- 初次 drawer load 使用 drawer body skeleton/spinner。
- 可能时，body loading 期间 header 保持可见。
- Section empty states 保持紧凑。
- Drawer 内容加载失败使用 drawer-body StateView + Retry。
- Refresh failure 尽量保留旧 drawer content。
- Forbidden content 展示 permission state，不是 empty。
- Resource deleted/not-found 展示清晰 unavailable state 和 close/back action。

---

## 8. 响应式行为

规则：

- 桌面端使用 right-side panel。
- 窄桌面只有内容仍可用时才缩小宽度。
- 移动端使用 bottom sheet 或 full-screen sheet。
- Footer actions 保持可达。
- 长表单不要挤压；改用 full-screen sheet 或 route page。
- 触控布局不能依赖 hover-only actions/tooltips。

---

## 9. 可访问性

规则：

- Modal drawer 打开时 trap focus。
- 打开时 focus 移动到 drawer title 或第一个可操作元素。
- 关闭时尽量把 focus 返回 trigger。
- Escape 只有在 dirty/pending state 安全时关闭。
- Drawer 通过 title 提供 accessible name。
- Modal drawer 打开时 background content inert。

---

## 10. 示例

推荐：

```text
User table -> user detail drawer: 70vw
User detail drawer -> edit permissions drawer: parent 100vw, child 70vw
Job row -> view logs drawer
Project list -> configure integration drawer
```

改用 Dialog：

```text
Rename project
Confirm delete
Edit one short label
```

改用 Route Page：

```text
Project detail with Overview / Members / Audit Logs / Billing
Multi-section permission editor
Large import wizard
```

---

## 11. AI 审查清单

- Drawer 是否比 Dialog 和 Route Page 更合理。
- 内容是否能合理填充 drawer width。
- 桌面默认宽度是否使用 70vw。
- Nested drawer 是否使用 parent 100vw 和 child 70vw。
- Header/body/footer 结构是否清楚。
- Body 是否是唯一滚动区域。
- Drawer actions 是否作用域正确。
- Dirty/pending close behavior 是否存在。
- Route-backed behavior 是否有意设计。
- 移动端是否使用 sheet/full-screen sheet。
- Accessibility focus 和 inert background 是否处理。
