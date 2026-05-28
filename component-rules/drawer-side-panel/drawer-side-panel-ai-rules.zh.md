# Drawer / Side Panel AI 执行规则

> 用于 AI 生成 2B 抽屉/侧边面板交互的压缩版规则。
> 详细解释参考 `drawer-side-panel-rules.zh.md`。

---

## 1. 什么时候使用

使用 Drawer：

- 用户需要当前 page/list context。
- detail/edit 是中等复杂度。
- workflow 临时但比 popover 大。
- 用户可能扫描多个 list items。
- 关闭后回到同一上下文。

短而聚焦任务或小内容用 Dialog。

大型、可分享、多区块或 deep-review workflow 用 Route Page。

不要用 Drawer 承载 tiny confirmations，也不要把 Drawer 当隐藏 route page。

---

## 2. 宽度与位置

规则：

- 桌面 drawer 从右侧打开。
- 一级桌面 drawer 默认 `70vw`。
- 打开嵌套 drawer 时，parent 变 `100vw`，child 使用 `70vw`。
- 避免超过 2 层 drawer。
- 内容撑不起 70vw 时，使用 Dialog。
- 移动端 drawer 变 bottom sheet 或 full-screen sheet。

---

## 3. 结构

Drawer 结构：

```text
Header: title + optional status/subtitle + close
Body: content
Footer: optional actions
```

规则：

- Header 必须存在。
- Body 是唯一滚动区域。
- Body 滚动时 header/footer sticky。
- 有 submit/confirm actions 时出现 footer。
- Drawer title 命名对象或任务。

---

## 4. Actions 与 State

规则：

- Drawer-level actions 放在 footer。
- Local section actions 留在 section 内。
- Related row actions 只影响 related rows。
- Submit pending 禁用 submit，防止重复提交。
- Dirty close 需要确认。
- 危险 pending 中关闭需要禁用或确认。
- 危险确认使用 ConfirmDialog。

---

## 5. Route、Loading、Permission

规则：

- Drawer 默认是 local state。
- 只有 refresh/share 需要恢复时才 route-backed。
- Route-backed drawer 关闭到 canonical parent route。
- 从 list 打开时保留 query/page/scroll。
- 初始 drawer load 使用 body skeleton/spinner。
- Content failure 使用 drawer-body StateView + Retry。
- Forbidden 使用 permission state，不是 empty。

---

## 6. 可访问性

规则：

- Modal drawer trap focus。
- 打开时 focus 移动到 title/第一个可操作元素。
- 关闭时尽量返回 trigger。
- Background content inert。
- Escape 只有 dirty/pending state 允许时关闭。

---

## 7. AI 检查清单

- Drawer 是否比 Dialog/Route Page 更合理。
- 桌面宽度是否使用 70vw。
- Nested width 是否遵循 parent 100vw + child 70vw。
- Header/body/footer 结构是否存在。
- Body 是否是唯一滚动区域。
- Dirty/pending close behavior 是否存在。
- Route-backed behavior 是否有意设计。
- 移动端是否使用 sheet/full-screen sheet。
- Focus/inert behavior 是否处理。
