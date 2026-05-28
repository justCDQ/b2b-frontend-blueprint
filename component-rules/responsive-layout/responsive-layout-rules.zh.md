# Responsive Layout 响应式布局规则

> 用于 2B 产品中介于桌面 Web 和移动端之间的响应式交互逻辑。
> 响应式布局不只是视觉缩放，而是在空间变化时保持任务效率的交互策略。

---

## 1. 核心原则

响应式行为应由内容、容器尺寸和任务优先级驱动，而不是只由设备名称驱动。

规则：

- 优先使用感知容器宽度的布局，而不是只使用页面级固定断点。
- 除非组件确实存在最小可用尺寸，否则避免硬编码固定宽度。
- 使用 design tokens、spacing scale、grid constraints 和组件密度规则。
- 不同布局中保持相同任务语义和数据语义。
- 先改变布局，再考虑移除重要信息。
- 只有在主流程仍完整时，才折叠或隐藏次要信息。
- 不要为桌面端和移动端创建两套完全独立逻辑，除非交互确实不同。

推荐策略：

```text
同一数据模型 -> 同一组件契约 -> 不同布局呈现
```

避免：

```text
桌面组件和移动组件各自定义字段、操作、校验。
```

---

## 2. 响应式层级

响应式层级是设计指导，不是只能按像素执行的硬规则。

| 层级 | 典型行为 |
|---|---|
| Wide desktop | 完整布局、table/list 密度、side panel、常驻导航。 |
| Standard desktop | 默认 2B 控制台布局，完整 toolbar、table、dialog/drawer。 |
| Narrow desktop / tablet | 减少 columns、toolbar 换行、次级操作折叠。 |
| Mobile web | 单列布局、触控优先控件、sheet/full-screen detail。 |

规则：

- 当组件被嵌入窄容器时，应响应父容器，而不只是响应 viewport。
- Drawer、modal、split page、dashboard panel 都可能让组件在桌面端触发 compact layout。
- Breakpoints 只作为默认值；可复用组件应允许定义 container-based thresholds。
- 同时测试 viewport width 和 container width。

推荐判断顺序：

```text
1. 内容能否在保留层级的前提下 reflow？
2. 次级控件能否折叠菜单或 sheet？
3. 密集数据能否切换成按优先级堆叠的呈现？
4. 是否需要更换承载方式：dialog -> drawer -> page -> sheet？
```

---

## 3. 布局适配

使用灵活布局能力：

- Card 和 panel 使用带 `minmax()` 的 CSS grid。
- Action group 和轻量 filters 使用 flex wrap。
- 当组件宽度比 viewport 更重要时，使用 container queries。
- 使用 `max-width`、`min-width`、`clamp()` 和 design tokens，避免固定像素。
- 固定格式内容使用稳定 aspect ratio。

规则：

- 为 card、panel、table column、control 定义安全最小宽度。
- 当内容不能安全容纳时，先 reflow 或 collapse，不要压缩到文字/操作不可用。
- 组件文字不要使用 viewport-scaled typography。
- line-height、spacing、touch target size 保持稳定。
- 不要用负 letter spacing 挤压文本。
- hover state、label、badge、loading text 不应导致布局尺寸抖动。

示例：

```css
.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--card-min-width), 1fr));
  gap: var(--space-3);
}
```

---

## 4. 信息优先级

每个响应式组件都应该定义信息优先级。

优先级：

| 优先级 | 行为 |
|---|---|
| P0 | 始终可见。用于识别对象或继续任务。 |
| P1 | 空间允许时可见。对常见决策重要。 |
| P2 | 可折叠、移入详情或 expansion。 |
| P3 | 只放在 detail view、drawer、tooltip/popover 或 metadata section 中。 |

规则：

- P0 内容在窄布局中不能消失。
- P1 内容可以移动到标题下方或第二行。
- P2 内容可以折叠到 `More`、展开区或详情抽屉。
- P3 内容不应干扰主流程。
- 当折叠信息会影响决策时，仍必须可访问。

Table：

- 复用 column config 定义 mobile priority。
- 桌面 table 可以在移动端变成 `MobileDataCard`。
- 不要为桌面 table 和移动端 card 维护两套字段定义。

Form：

- 多列表单变成单列。
- 字段顺序跟随任务流程，而不是桌面视觉位置。
- inline helper/error text 仍然贴近对应字段。

---

## 5. 操作适配

操作必须保持可达且可预测。

规则：

- 当用户可以完成任务时，primary action 必须保持可见。
- Refresh、Save、Submit、Cancel、Apply、Clear filters 不能消失，除非存在等价入口。
- 次级操作可以折叠进 overflow menu。
- 危险操作即使折叠，也要和常用操作保持区分。
- Icon-only actions 在桌面端需要 tooltip，在移动端需要 accessible label 或可点击原因。
- Hover-only actions 在触控设备上必须变成可见、可点击或出现在 menu 中。

常见模式：

| 桌面端 | 窄屏 / 移动端 |
|---|---|
| 完整 toolbar actions | 主操作可见 + 次级操作 overflow |
| 行内 icon actions | 1-2 个可见 + More menu |
| Filter action row | Apply/Clear/Refresh sticky 或保持可达 |
| Page header actions | 主操作可见 + menu |
| Batch toolbar | 选中后出现 sticky bottom/action bar |

---

## 6. 组件转换规则

组件在不同空间下使用一致的转换策略。

| 桌面模式 | 窄屏 / 移动端转换 |
|---|---|
| 多列表格 | MobileDataCard 或按优先级堆叠的 row |
| Card grid | 减少列数，保留安全最小宽度，最后变单列 |
| FilterBar | 重要 filters 外露，高级 filters 放入 drawer/sheet |
| Dialog | 小弹窗保持 dialog，复杂弹窗变 bottom sheet 或 full-screen sheet |
| Drawer | 右侧 drawer 变 bottom sheet 或 full-screen sheet |
| Sidebar navigation | 折叠 rail、top tabs 或 mobile sheet navigation |
| Dropdown/Menu | 内容密集时变 bottom sheet 或 full-width menu |
| Popover | 内容长/可交互时变 inline、drawer/sheet 或 dialog |
| Tabs | 可横向滚动 tabs/pills，或页面级 route navigation |

规则：

- 当内容不再适合原承载方式时，转换承载方式。
- 不要把桌面 table、drawer、dialog 的交互强行塞进移动端。
- 转换后必须保留 data、state、pending、disabled、permission rules。
- 尽量复用相同 event handlers 和 validation rules。

---

## 7. 密度与间距

2B 响应式设计应保留可用的信息密度。

规则：

- 窄布局不等于使用大面积营销式留白。
- 先减少列数，再大幅增加纵向空白。
- 重复出现的 list/card/table items 应保持紧凑。
- 使用 spacing tokens，不使用一次性 margin。
- 提高触控区域，但不要让每个 item 都显得臃肿。
- 当 sticky header/footer 能保护主操作或上下文时，可以使用。

密度变化：

| 场景 | 桌面端 | 窄屏 / 移动端 |
|---|---|---|
| Table/list | 高密度 rows | 字段堆叠但保持紧凑 |
| Form | 1-2 列 | 单列，中等间距 |
| Toolbar | Inline groups | 换行或折叠 groups |
| Card list | Grid | 更少列，紧凑单列 |

---

## 8. 溢出与滚动

规则：

- 避免页面级横向滚动。
- 只有在保留数据列比 reflow 更重要时，才允许特定数据区域内部横向滚动。
- Sticky footer/header 不应造成双重滚动混乱。
- 长 overlay 需要限制高度，并在内部滚动。
- 只有在滚动提示仍然清楚时，才隐藏装饰性滚动条。
- 不要让 body scroll 和 overlay scroll 互相抢滚动。

推荐顺序：

```text
Reflow -> collapse secondary content -> bounded region internal scroll -> dedicated full page
```

---

## 9. 状态与数据一致性

响应式转换不能改变业务行为。

规则：

- Table 和 card 形态之间 selection state 保持一致。
- 布局变化后 batch actions 仍然可用。
- Filter state、pagination、sorting、search 保持不变。
- Pending/loading/error/empty states 使用适合当前布局的 skeleton。
- Disabled reason 和 permission explanation 仍然可访问。
- Route/query state 不应因为布局变化被重置。
- 不要因为布局变化重新请求数据，除非 page size strategy 有意变化。

当 page size 改变时：

- Infinite card layout 可以使用和 table layout 不同的 page size。
- 改变 page size 时，应有意重置或协调 pagination。
- 不要让响应式变化造成重复记录或遗漏记录。

---

## 10. 实现规则

优先使用：

- 可复用组件使用 container queries。
- CSS grid/flex 和 tokens。
- 桌面端和移动端形态共用 field/action config。
- 使用语义化 component states，而不是 viewport-specific duplicated state。
- 基于 token 的 max/min sizes。

避免：

- 在组件逻辑里写大量一次性像素断点。
- 独立维护容易和桌面端漂移的 mobile-only field list。
- 隐藏控件但不给移动端替代入口。
- 使用在 drawer/dialog 中会失效的 hardcoded viewport math。
- 只根据 user agent 做布局判断。

示例组件契约：

```ts
type ResponsiveField = {
  key: string
  label: string
  priority: 0 | 1 | 2 | 3
  minWidth?: number
  render: (item: unknown) => React.ReactNode
}

type ResponsiveAction = {
  key: string
  label: string
  priority: 'primary' | 'secondary' | 'overflow'
  danger?: boolean
  disabledReason?: string
}
```

---

## 11. AI 审查清单

- 布局变化是否由内容、容器和任务优先级驱动，而不只是 viewport width。
- 重要信息和重要操作是否仍然可达。
- 响应式策略是否避免重复业务逻辑。
- 组件是否使用 flexible constraints，而不是硬编码固定宽度。
- Table 是否定义 mobile field priority。
- Toolbar 和 actions 是否有清晰折叠行为。
- Dialog/drawer/popover 的转换是否遵循已有组件规则。
- Loading/empty/error/disabled states 在布局变化后是否仍可用。
- 是否没有页面级横向滚动，除非被明确限制在数据区域内部。
- 移动端/触控行为是否不依赖 hover。
- 响应式变化是否不会重置 filters、selection、pagination 或 dirty form data。
