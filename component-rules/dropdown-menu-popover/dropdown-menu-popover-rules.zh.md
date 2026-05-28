# Dropdown / Menu / Popover 组件系统规范

> 用于 2B 产品中承载选项、命令或小型辅助控制的紧凑浮层。

---

## 1. 组件边界

`Dropdown/Menu` 用于操作或选择，`Popover` 用于小型交互内容。

| 组件 | 用于 | 不用于 |
|---|---|---|
| DropdownMenu | command list、row overflow、user menu | 多字段表单 |
| Select menu | 单选/多选值 | 破坏性命令 |
| Popover | 紧凑筛选、详情、小型控制 | 长流程 |
| Tooltip | hover/focus 说明，包括有边界的较长只读解释 | 交互内容 |
| Context menu | 右键辅助命令 | 主流程 |
| Command palette | 全局命令搜索 | 局部 row overflow |

规则：

- Menu item 触发命令或导航。
- Popover 可以包含控件，但必须保持紧凑。
- 长表单属于 dialog/drawer/page，不属于 popover。
- Menu 中危险命令必须视觉标记，必要时确认。
- 不要用 DropdownMenu 替代 Select。
- 不要用 Tooltip 承载可点击内容。
- 不要用 Popover 承载需要持久 URL 状态的流程。
- 如果 overlay 内容需要滚动、分区、校验或 save/cancel 流程，考虑 Dialog/Drawer。

决策：

| 需求 | 选择 |
|---|---|
| 表单中选择值 | Select / Combobox |
| 展示额外 row actions | DropdownMenu |
| 展示紧凑高级筛选 | Popover，移动端可用 Sheet |
| 展示非交互说明 | Tooltip |
| 展示带链接/控件的帮助 | Popover |
| 长编辑/创建流程 | Dialog / Drawer / Page |

---

## 2. 结构

Menu item 结构：

```text
Icon  Label                 Shortcut/Meta
```

规则：

- 尽量使用 icon + label。
- Icon 和 label 间距 8px。
- 同一产品上下文中 menu 宽度保持一致。
- Item label 使用清晰动词。
- 危险 item 的 icon 和 text 使用 danger color。
- 危险项通常放最后，必要时分隔。
- Disabled item 尽量在 hover/focus 时说明原因。
- Item 高度保持一致。
- Menu item 文案默认不换行。
- 长 item label 必要时截断，实在需要再用 tooltip。
- 相关 items 可用 separator 或 group label 分组。
- 不要每个 item 后都加 separator 造成视觉噪音。
- Shortcut/meta text 可选，并右对齐。

### Menu item 类型

| 类型 | 使用场景 |
|---|---|
| command item | 执行局部操作 |
| navigation item | 跳转 route/view |
| external link item | 打开外部页面 |
| checkbox item | 切换 menu 内可见选项 |
| radio item | 在 menu 内选择一个选项 |
| danger item | 破坏性/高风险命令 |
| disabled item | 可见但不可用命令 |
| loading item | 命令 pending 中 |
| submenu item | 展开嵌套命令组 |

规则：

- Navigation item 使用 link/navigation 语义。
- External link item 必须清楚表达会打开外部目标。
- Checkbox/radio menu items 用于轻量 menu-local choices；复杂表单选择使用 Select/Popover。
- Danger item 不藏在 checkbox/radio group 中。
- Loading item 必须防止重复执行命令。
- Disabled item 不触发 command。
- Submenu item 应少量使用，并且只用于强相关命令。

### 排序

推荐顺序：

```text
Primary safe commands
Secondary safe commands
Navigation/help
Separator
Dangerous commands
```

规则：

- 最常用安全操作在前。
- 危险操作在最后。
- 误点风险高时，不要把 Delete 紧挨 View/Edit 放置而不分隔。

### 分组

Menu 中存在不同命令类别时使用分组。

规则：

- 相关命令放在同一组。
- 组之间使用 separator。
- Group label 只有在能增加清晰度时才使用。
- 很短的 menu 不要过度分隔。
- Danger group 放最后。
- Help/docs/navigation group 不应打断 primary command group。
- 相似 menu 的分组顺序保持稳定。

示例：

```text
Edit
Duplicate
Move
---
View logs
Open in external console
---
Delete
```

### 多级菜单

只有在扁平 menu 过长，或命令天然形成二级分类时，才使用 submenu。

适合：

- Move to group -> group list
- Change status -> status options
- Export as -> CSV / XLSX / JSON
- More permissions -> role options

规则：

- 最多 2 层。不要创建第 3 层 menu。
- 不要把危险命令深藏在 submenu 中，除非 submenu 本身明确是危险分组。
- Parent item 必须表达会打开 submenu。
- Submenu 按平台模式通过 hover/focus/click 打开。
- 键盘用户必须能进入和离开 submenu。
- Submenu 必须保持在 viewport 内，且不要完全遮挡 parent menu。
- 移动端 submenu 通常变成 drill-in sheet/list，而不是 hover submenu。
- 如果 submenu 包含很多可搜索选项，改用 dialog/drawer/select。

禁止：

```text
More -> Advanced -> Danger Zone -> Delete
```

推荐：

```text
Delete 作为最后一组中可见的 danger item。
```

---

## 3. 位置与触发器

规则：

- Row overflow trigger 使用 `MoreHorizontal`。
- Toolbar overflow 根据布局使用 `MoreHorizontal` 或 `MoreVertical`。
- Trigger 必须有 accessible name。
- Overlay 对齐 trigger，并保持在 viewport 内。
- 尽量不要遮挡触发行的关键内容。
- 移动端密集 popover 应变成 bottom sheet 或全宽 menu。
- Trigger 视觉状态应表达 open state。
- Icon-only trigger 需要 tooltip/accessibility label。
- 移动端 trigger 触控区域必须足够。
- 关键命令不要使用 hover-only trigger。
- Overlay 靠近 viewport 边缘时应支持 collision detection/flip。
- Overlay z-index 应高于局部内容，但低于 modal dialogs。

### 常见 triggers

| 场景 | Trigger |
|---|---|
| table row overflow | `MoreHorizontal` icon button |
| toolbar more actions | `MoreHorizontal` 或带文案 More |
| user/account menu | avatar/name button |
| advanced filter | 带 active count 的按钮 |
| help popover | help/info icon 或 text link |

规则：

- Advanced filter trigger 在 filters active 时显示 active count。
- Row overflow trigger 不能触发 row click。
- Toolbar overflow trigger 不应该隐藏必需 primary actions。

---

## 4. 交互

规则：

- 点击外部关闭 overlay。
- Escape 关闭 overlay。
- 选择 menu command 后关闭 menu，除非该命令打开确认。
- 带表单控件的 popover 通过明确 apply/cancel 关闭，或按产品定义 outside behavior。
- 键盘用户可以在 items 中移动。
- 关闭后适当将 focus 返回 trigger。
- Enter/Space 激活 focused item。
- 使用 menu 语义时，Arrow keys 在 menu 内移动。
- 除非 overlay 是 modal，否则 Tab 行为不能困住用户。
- 打开一个 overlay 时，应关闭同一 scope 内的 sibling overlays。
- Menu command 打开 confirm dialog 时，应关闭 menu 并打开 dialog。
- row/list 数据变化后，不要保留 stale menu。

### Menu item 点击结果类型

Menu item 点击通常有以下几种结果：

| 结果 | 行为 |
|---|---|
| 打开 dialog/drawer | 关闭 menu，然后打开 dialog/drawer |
| 内部页面跳转 | 关闭 menu，并使用 router/link 语义跳转 |
| 外部页面跳转 | 打开外部 URL，并提供清晰 affordance |
| 执行操作 | 根据耗时关闭 menu 或保持 item pending |
| 打开 submenu | 保持 parent menu 上下文并展示 submenu |
| toggle/check | 预期多次选择时保持 menu，最终选择时关闭 |

规则：

- 从 menu 打开 dialog/drawer 时，不要让 menu 留在弹窗背后。
- Navigation items 使用 link 语义，不使用 mutation-style button handlers。
- External navigation 尽量展示 external-link affordance。
- 执行 mutation 必须进入 pending，并防止重复执行。
- 长任务 menu actions 应关闭 menu，并展示 toast/task/progress state。
- 快速本地 toggles 如果用户可能连续切换多个项，可以保持 menu 打开。
- 破坏性 menu action 打开 confirm dialog；menu 本身不是确认。

### 外部链接

规则：

- External link item 在有帮助时使用 external-link icon 或文案提示。
- 离开产品上下文时，外部链接在新 tab/window 打开。
- 新 tab 外链使用 `rel="noopener noreferrer"`。
- Label 应说明目标，而不是只写 `Open`。
- 如果外部目标需要权限或 integration setup，遵循 disabled/hidden 规则。

示例：

```text
Open in Stripe
View in GitHub
Open provider console
```

### 关闭行为

| Overlay | 关闭时机 |
|---|---|
| command menu | item select、outside click、Escape |
| select menu | option select，multi-select 可显式关闭 |
| filter popover | Apply/Cancel/outside，按产品策略 |
| help popover | outside click、Escape |
| mobile sheet | close button、Apply/Cancel、安全时 backdrop |

规则：

- Popover 有未保存 local changes 时，outside close 策略必须明确。
- 如果需要 Apply，outside close 应按产品策略 discard 或 confirm。
- 只读内容 outside close 安全。

---

## 5. 状态

规则：

- loading menu action 展示 pending 或禁用 item。
- disabled item 不触发 command。
- 用户不应知道的 permission-hidden commands 不渲染。
- 可见的 permission-disabled commands 说明原因。
- Menu 不应包含与当前对象状态不匹配的过期 actions。
- Pending state 应限制在 command/item。
- Row menu pending 应基于 rowKey。
- action 成功后，menu 根据 action 类型关闭或更新。
- action 失败后恢复 item 可用性，并按 scope 展示 toast/inline reason。
- permissions 变化时，menu content 应在打开前更新。

### Permission and disabled

规则：

- 用户不应该看到的 commands 直接隐藏。
- 因状态/权限变化未来可能可用的 commands 可以 disabled。
- Disabled icon/menu items 需要 accessible reason。
- Permission-disabled copy 不能暴露内部 policy codes。
- 可见的 dangerous disabled item 仍需要清晰 disabled reason。

### Disabled menu items

规则：

- Disabled item 只有在有助于解释可用性时才保持可见。
- Disabled item 不能执行 action。
- Disabled item 尽量在 hover/focus 时暴露 reason。
- Disabled item 不能看起来和 enabled item 一样。
- 移动端如果 disabled reason 很关键，需要 tap-accessible reason 或 inline text。
- 如果 disabled parent submenu 没有任何 enabled children，禁用 parent 并说明原因。
- 如果只有部分 submenu children disabled，parent 保持 enabled，只禁用具体 children。

示例：

```text
Export disabled -> "No export permission"
Delete disabled -> "Archived records cannot be deleted"
Move to group disabled -> "Select at least one active item"
```

### Dangerous items

规则：

- Danger item 的 icon 和 label 使用 danger color。
- Danger item 放在分组最后。
- 破坏性/高风险 danger command 打开 confirm dialog。
- Confirm dialog 必须说明 object/scope/action/consequence。
- Menu 本身不作为确认。

---

## 6. 筛选 Popover

规则：

- Popover 可用于紧凑 advanced filters。
- Trigger 显示 active count。
- 如果不是即时生效，提供 Reset/Apply。
- 不重复 L1 FilterBar controls。
- 内容变高或多区块时，改用 dialog/drawer。
- Filter popover 使用 field labels。
- 显式 Apply 模式下，filter popover 在 Apply 前保留 draft values。
- popover 内 Reset 只清除 popover filters，除非标明 global clear。
- Apply 更新 URL/query state，成功后关闭 popover。
- Query-changing Apply 重置 page 并清空 selection。
- popover 内 loading 不应阻塞整个 list，除非正在 apply query。

### Popover 尺寸与内容限制

规则：

- Popover 内容只承载一个紧凑任务。
- Popover 可以承载较长的只读解释内容，但必须限制最大宽高。
- 长 popover 内容必须在 popover body 内部滚动，不能超出 viewport 生长。
- Popover 应定义相对 viewport 的 max-width 和 max-height。
- 如果 popover 有 Apply/Reset，内容滚动时 header/action areas 应保持可见。
- 2B 说明内容不设置硬性最大字符数。
- 使用可读性约束代替字符数约束：宽度、行长、间距和滚动区域。
- 避免在一个 popover 内放太多可编辑字段；如果用户需要填写很多字段，使用 Drawer/Dialog。
- 避免 nested popovers。
- 除极小 picker 外，不要在 popover 中放 table/list。
- 如果内容需要 search、多区块布局或长交互式滚动，使用 Drawer/Dialog。

推荐尺寸：

```text
Small popover: content-sized, bounded by viewport
Filter popover: fixed/min width, max-height within viewport
Long help popover: readable width + max-height + internal scroll
```

---

## 7. 移动端行为

规则：

- Menus 必须适配触控。
- Hover-only affordances 在移动端不可用。
- item 数量少时，密集 row overflow menus 可以保持 menu。
- Advanced filter popover 内容较密时应变成 bottom sheet。
- Bottom sheet 应有 title、close，并在编辑 filter state 时提供 Apply/Reset。
- Menu item 高度支持 touch targets。
- Tooltip-only disabled reasons 需要移动端替代方案。

---

## 8. 可访问性

规则：

- Trigger 有 accessible name，适用时表达 expanded state。
- Menu items 可键盘访问。
- open/close 时 focus 移动可预测。
- Disabled reason 可访问。
- Icon-only items 有 labels。
- Danger state 不只依赖颜色。
- 带表单控件的 Popover 有 labeled fields。
- Escape 关闭非 modal overlays。

---

## 9. AI 审查清单

- Dropdown/Menu/Popover 选择是否匹配内容复杂度。
- Menu items 是否使用清晰 icon + label。
- Dangerous menu items 是否标记并必要时确认。
- Disabled/permission states 是否处理。
- Trigger 是否有 accessible name。
- Keyboard 和 Escape 行为是否可用。
- 移动端密集 overlay 是否有 bottom-sheet 替代。
- Menu item 顺序是否将常用安全命令和危险命令分开。
- Menu 分组是否有意义且没有过度使用。
- Submenus 是否限制在 2 层，并在移动端必要时有 drill-in 替代。
- Disabled parent/child submenu states 是否正确处理。
- Row overflow 是否不会触发 row click。
- Popover 是否没有承载长流程或过多字段。
- 长 popover 内容是否限制宽高并使用内部滚动。
- 2B tooltip/popover 解释性内容是否没有硬性最大字符数。
- Filter popover 是否正确更新 URL/query state。
- Pending/disabled commands 是否不会触发。
- Menu item 点击结果类型是否正确处理：dialog、navigation、external link、operation、submenu、toggle。
- 外部链接是否有清晰目标文案，并在需要时使用安全新 tab 行为。
- Command items 是否根据 action 时长和 pending state 正确关闭/更新 menu。
- 关闭后 focus 是否在合适时回到 trigger。
