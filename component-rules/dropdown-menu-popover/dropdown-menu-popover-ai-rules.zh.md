# Dropdown / Menu / Popover AI 执行规则

> 用于 AI 生成 2B 下拉菜单、菜单、浮层交互的压缩版规则。
> 详细解释参考 `dropdown-menu-popover-rules.zh.md`。

---

## 1. 组件边界

按意图选择：

| 组件 | 用途 |
|---|---|
| Dropdown/Menu | 命令或导航列表 |
| Select | 选择表单值 |
| Popover | 上下文富内容或紧凑控件 |
| Tooltip | 短只读提示 |
| Dialog/Drawer | 长、复杂或多步骤内容 |

规则：

- 不要把 Menu 当 Select。
- 不要用 Tooltip 承载可交互内容。
- 不要用 Popover 承载长 workflow。
- Menu item 可以打开 dialog/drawer、导航、执行操作、toggle 或打开 submenu。

---

## 2. Menu 结构

Menu item 类型：

- action item
- navigation item
- external link item
- destructive item
- toggle/check item
- submenu item
- disabled item

规则：

- 相关 items 分组。
- 谨慎使用 separators。
- Destructive items 放最后或单独分组。
- Disabled item 能解释不可用操作时保持可见。
- Item label 使用具体动词/名词。
- 系统一致时使用 icon + label。
- Icon 和 label 间距保持一致。

---

## 3. Submenus 与 Groups

规则：

- Submenu 深度最多 2 层。
- 只有 submenu 比 dialog/drawer 更清楚时才使用。
- Parent disabled 会禁用 children 访问。
- Child disabled 不一定禁用 parent。
- 移动端 submenu 通常变成 drill-in sheet/list。

不要为关键流程创建很深的级联菜单。

---

## 4. 点击结果

规则：

- Dialog/drawer：关闭 menu，再打开 overlay。
- Internal navigation：使用 link/router 语义。
- External navigation：尽量展示 external-link affordance。
- Execute operation：展示 pending/feedback，并防重复触发。
- Toggle/check：有意决定更新后保持或关闭 menu。
- Dangerous action：使用 danger 样式，高风险时使用 ConfirmDialog。

---

## 5. Popover

Popover 用于：

- 紧凑 advanced filters。
- 短上下文面板。
- 小型 picker。
- 只读富解释。
- 快速 metadata/details。

规则：

- 长内容限制宽高。
- 长内容可内部滚动。
- 2B 解释性内容不设硬字符上限。
- 内容变成多区块、重表单或 workflow 时，使用 drawer/dialog。
- Popover 必须有清晰 trigger 和关闭行为。

---

## 6. State 与可访问性

规则：

- 有价值时，trigger 表达 open state。
- Escape 关闭 menu/popover。
- 安全时，点击外部关闭。
- 关闭后适当将 focus 返回 trigger。
- Menu 内支持键盘导航。
- Disabled reason 可访问。
- 移动端不能依赖 hover。

---

## 7. AI 检查清单

- 组件是否匹配意图：menu、select、popover、tooltip、dialog/drawer。
- Menu 分组和危险项位置是否清楚。
- Submenus 是否受限且移动端安全。
- Item click result 是否正确处理。
- Navigation 是否使用 link/router 语义。
- Dangerous actions 是否在需要时使用 ConfirmDialog。
- Popover 内容是否有边界且不是重 workflow。
- Disabled states 和 reasons 是否可访问。
