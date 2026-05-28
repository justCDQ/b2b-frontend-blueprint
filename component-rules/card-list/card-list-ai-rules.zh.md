# Card List AI 执行规则

> 用于 AI 生成 2B 卡片列表交互的压缩版规则。
> 详细解释参考 `card-list-rules.zh.md`。

---

## 1. 什么时候使用 Card List

当用户需要浏览、识别、比较摘要或视觉化选择对象时，使用 Card List。

使用 Card List：

- object summary。
- visual identity/logo/thumbnail。
- compact metadata。
- status 和 key metrics。
- responsive grid。
- infinite scroll。

不要使用 Card List：

- 精确列对比很重要。
- 很多字段需要跨行对齐。
- 批量操作是主任务。
- 桌面主模式是 table，只是移动端把 rows 重排。

如果桌面 table 变成移动端 cards，这是 `MobileDataCard`，不是 Card List。

---

## 2. Card 内容优先级

Card 应定义：

- identity/title
- status
- short summary
- key metadata
- 有用时 key metrics
- tags/badges
- optional image/logo/icon
- actions

规则：

- Title/identity 必须存在。
- Status 应易扫描。
- 2B cards 保持紧凑。
- 不使用过多营销式留白。
- 长文本截断，并可访问完整值。

---

## 3. 布局

规则：

- 使用 responsive grid/flex。
- 定义安全最小 card width。
- 宽度随 screen/container 自适应。
- 高度尽量稳定。
- 不要让 cards 无限缩小。
- 模块之间使用紧凑 spacing。
- Loading/pending 状态局部展示，不要过大。

推荐：

```css
grid-template-columns: repeat(auto-fit, minmax(var(--card-min-width), 1fr));
```

---

## 4. Actions 与点击

规则：

- Card click 只有在不冲突 selection/actions 时才打开详情。
- Identity/title 可以链接到 detail。
- 只外露常用 actions。
- 额外 actions 放入 More menu。
- 危险 actions 使用 danger 样式和 ConfirmDialog。
- 点击 action 不能触发 card click。
- Disabled actions 原因不明显时需要说明。

---

## 5. Selection 与 Batch

规则：

- Selection 使用稳定 item keys。
- Checkbox/selection affordance 必须足够可见。
- Selected state 必须清楚。
- Disabled items 不能被选择。
- Batch toolbar 只有存在 selection 后出现。
- 展示 selected count 和 scope。

---

## 6. States

支持：

- default
- hover/focus
- selected
- disabled
- pending
- error
- empty/list loading

规则：

- Pending 限制在受影响 card/action。
- Error card 有价值时可展示局部 retry/detail。
- Skeleton 匹配 card layout。
- Empty state 属于 list area。

---

## 7. 响应式

规则：

- Web 使用 responsive grid。
- 窄布局减少列数，最后变单列。
- Tags/actions 可更积极折叠。
- Touch layout 不能依赖 hover。
- 移动端 card 仍保持紧凑。

---

## 8. AI 检查清单

- Card List 是否比 Table 更合理。
- Card 是否有 identity、status、key metadata 和 actions。
- Responsive grid 是否有安全最小宽度。
- Layout 是否紧凑且稳定。
- Click/action/selection 是否不冲突。
- Disabled/pending/error states 是否处理。
- Batch actions 是否展示 count 和 scope。
- 移动端布局是否可用且不过大。
