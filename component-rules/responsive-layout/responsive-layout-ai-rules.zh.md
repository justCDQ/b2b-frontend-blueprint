# Responsive Layout AI 执行规则

> 用于 AI 生成 2B 响应式布局的压缩版规则。
> 详细解释参考 `responsive-layout-rules.zh.md`。

---

## 1. 核心规则

响应式行为由内容、容器尺寸和任务优先级驱动，不只由设备名称驱动。

规则：

- 优先使用容器感知布局，而不是只写 viewport 断点。
- 使用 tokens、grid/flex constraints、min/max sizes 和安全最小宽度。
- 不同布局中保持相同 data/action 语义。
- 先 reflow，再考虑隐藏重要内容。
- 只有主流程仍完整时，才折叠次要内容。
- 不要为桌面端和移动端复制两套业务逻辑。

---

## 2. 信息优先级

每个响应式组件都应定义：

| 优先级 | 行为 |
|---|---|
| P0 | 始终可见；用于识别对象或完成任务。 |
| P1 | 空间允许时可见；对决策重要。 |
| P2 | 可折叠到 More/expansion/detail。 |
| P3 | 只在详情或 metadata 中展示。 |

规则：

- P0 在窄布局中不能消失。
- P1 可以移动到第二行。
- P2 可以折叠。
- P3 不应干扰主流程。

---

## 3. 布局规则

优先使用：

- 带 `minmax()` 的 CSS grid。
- Toolbar/action group 使用 flex wrap。
- 可复用组件使用 container queries。
- `max-width`、`min-width`、`clamp()` 和 tokens。
- 固定格式元素使用稳定 aspect ratio。

不要：

- 把控件压缩到文字/操作不可用。
- 组件文字随 viewport width 缩放。
- 用负 letter spacing 挤压文本。
- 让 badge/loading/hover label 改变布局尺寸。
- 产生页面级横向滚动。

---

## 4. 组件转换规则

使用一致转换：

| 桌面端 | 窄屏/移动端 |
|---|---|
| 多列表格 | MobileDataCard / 按优先级堆叠 row |
| Card grid | 减少列数 -> 单列 |
| FilterBar | 核心 filters 外露 + advanced 进 sheet/drawer |
| Dialog | 小 dialog 或 bottom/full-screen sheet |
| Drawer | bottom/full-screen sheet |
| Sidebar navigation | rail/menu/sheet/horizontal pills |
| Dropdown/Menu | 密集时 bottom sheet 或 full-width menu |
| Popover | 长/可交互内容变 inline/drawer/sheet/dialog |
| Tabs | scrollable pills 或 route nav |

规则：

- 内容不再适合原承载方式时，转换承载方式。
- 保留 data、state、pending、disabled、permission、validation rules。
- 桌面和移动端复用 field/action config。

---

## 5. Actions 与 State

规则：

- Primary action 保持可达。
- Refresh/Save/Submit/Cancel/Apply/Clear filters 不能没有等价入口就消失。
- Secondary actions 可折叠进 overflow。
- Dangerous actions 保持视觉隔离。
- Hover-only actions 在触控设备上必须变成可见、可点击或 menu-based。
- Filter、selection、pagination、sorting、dirty data、route/query state 不能因为布局变化被重置。

---

## 6. AI 检查清单

- 布局是否响应 content/container/task priority。
- 重要数据和操作是否可达。
- 是否没有重复桌面/移动业务逻辑。
- 是否用 flexible constraints 替代硬编码固定宽度。
- Table/card 移动呈现是否共享 config。
- Actions 是否有折叠行为。
- Overlay 转换是否遵循 dialog/drawer/popover 规则。
- 是否没有非预期页面级横向滚动。
- Touch 行为是否不依赖 hover。
- Layout change 是否不重置业务状态。
