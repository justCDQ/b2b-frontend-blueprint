# Button / Action System 操作系统规范

> 用于创建、修改或审查 2B 产品中的操作。
> Action 指任何用户触发的操作：按钮、图标按钮、菜单项、行操作、批量操作、弹窗 footer 操作、StateView action。

---

## 1. 核心概念

Action 必须表达意图、优先级、权限、风险和 pending 状态。

每个 action 应定义：

- label
- intent
- priority
- scope
- permission rule
- disabled rule
- loading/pending behavior
- confirmation need
- success/failure feedback

Action 不只是按钮样式。

规则：

- 先确定 action 语义，再选择视觉 variant。
- 视觉权重必须匹配 action 优先级。
- 摆放位置必须匹配 action scope。
- disabled/hidden 状态必须匹配权限和数据状态。
- pending 行为必须匹配 mutation 风险和影响范围。
- feedback 必须匹配 action 结果和受影响区域。

### Action 意图

每个 action 应该只有一个主要意图。

| Intent | 含义 | 示例 |
|---|---|---|
| create | 创建新数据 | Create project, Add user |
| edit | 修改已有数据 | Edit, Rename, Update settings |
| submit | 提交表单/流程 | Save, Publish, Confirm |
| navigate | 跳转到其他视图 | View details, Go back |
| refresh | 获取最新状态 | Refresh, Retry |
| clear/reset | 清除当前本地/query 状态 | Clear filters, Reset form |
| import/export | 数据导入/导出 | Import users, Export CSV |
| connect/configure | 完成前置 setup | Connect GitHub, Configure billing |
| toggle | 二元状态切换 | Enable, Disable |
| destructive | 删除/撤销/重置高风险状态 | Delete, Revoke, Disconnect |
| support | 暴露帮助/详情 | View docs, View task, Contact admin |

规则：

- label 应该能表达 intent。
- 不使用 `OK`、`Submit`、`Handle`、`Process` 这类模糊文案，除非上下文已经足够明确。
- 一个 action 不应混合无关 intent。
- 如果 action 同时提交并跳转，先按 submit 处理，成功后再导航。
- 如果 action 同时删除并跳转，先按 destructive 处理。

---

## 2. Action 类型

| 类型 | 使用场景 |
|---|---|
| primary action | 页面/弹窗/表单/状态恢复的主操作 |
| secondary action | 有用但优先级更低的操作 |
| ghost/link action | 低强调或类似导航的操作 |
| icon action | 紧凑重复操作，常见于 table row/toolbar |
| danger action | 破坏性或高风险操作 |
| menu action | overflow action 或低频命令 |
| batch action | 作用于选中项的操作 |
| inline action | row/field 内的局部编辑/确认 |
| split action | 主命令旁带相关变体菜单 |
| toggle action | 二元状态切换 |

规则：

- 每个区域只使用一个 primary action。
- 同一 action group 内不要出现多个同等强度的 primary buttons。
- Danger actions 必须视觉上可区分。
- Icon actions 必须有 tooltip。
- Menu actions 尽量包含 icon + label。
- Action 类型和视觉样式有关，但不完全等同。
- Danger action 可以根据上下文表现为 menu item、icon action 或 dialog primary action。
- Navigation action 即使出现在 action group 中，也可以使用 link 样式。
- Toggle action 如果表示即时 on/off 状态，应使用 Switch。
- 跳转到其他 route 时，不要用 button 替代语义上的 link。

### Primary action

用于某个区域中最重要的下一步。

规则：

- 一个视觉决策区域最多一个 primary action。
- 页面级 primary action 通常位于 page header 或 main toolbar。
- 弹窗 primary action 位于 footer。
- StateView primary action 用于恢复或推进当前状态。
- Form primary action 用于提交或保存表单。
- 除非整个页面/弹窗是危险确认，否则不要让危险操作成为 primary。

示例：

```text
User list page -> Create user
Edit dialog -> Save
Load failed StateView -> Retry
Delete confirmation dialog -> Delete can be primary danger
```

### Secondary action

用于有用但不是主路径的替代操作。

规则：

- Secondary action 不能在视觉上和 primary 竞争。
- 常见 secondary actions：Cancel、Refresh、Export、View docs、Go back。
- 如果 secondary actions 很多，低频项进入 menu。
- 不要把每个“有用命令”都做成可见 secondary button。

### Ghost/link action

用于低强调操作或类似导航的操作。

规则：

- Route navigation、help/docs 不是主恢复路径时，使用 link style。
- 操作仍在当前上下文内但需要轻量展示时，使用 ghost style。
- 不要对危险操作使用 link style。
- 不要用 ghost style 承载主要不可逆确认。

### Icon action

用于空间有限且操作重复出现的场景。

规则：

- 常见于 table row actions、紧凑 toolbar、input adornments。
- 必须有 tooltip。
- 图标必须语义化，同一上下文中不能用同一图标表示不同含义。
- 罕见或含义模糊的命令不要使用 icon-only action。
- Row 中最多暴露 3 个 icon actions，超出进入 overflow。

### Menu action

用于 overflow、低频命令或成组替代项。

规则：

- Menu action 仍然需要清晰 intent 和权限处理。
- 不要把唯一主路径藏在 menu 中。
- 危险 menu actions 放在最后，并使用 danger color。
- Menu item label 必须明确。

### Batch action

用于作用于 selected items 的操作。

规则：

- Batch actions 依赖 selection。
- Selection count 必须可见。
- Batch primary action 应反映当前 selection 上下文。
- 批量危险操作需要包含 selected count 的确认。
- 不要把 disabled/unselectable rows 纳入批量操作。

### Inline action

用于小范围局部编辑。

规则：

- Inline action 属于被编辑字段/行附近。
- 不应触发父级 row click。
- Pending 和 error 都是局部的。
- 当变更不能安全自动保存时，inline edit 应使用明确 confirm/cancel。

### Toggle action

用于即时二元状态。

规则：

- 直接改变 enabled/disabled 或 on/off 时，使用 Switch。
- Toggle pending 必须防止反复切换。
- 失败后回滚或清楚标记失败状态。
- 高风险 toggle 需要确认。

### Split action

少量使用：当一个主命令有紧密相关的变体时使用。

规则：

- 主按钮执行默认操作。
- 菜单侧展示变体。
- 不要用 split action 承载无关命令。
- 如果用户必须先做选择，不要用 split action 隐藏这个决策。

---

## 3. 优先级

Action 优先级必须匹配用户工作流。

规则：

- Primary action 是当前最佳下一步。
- Secondary action 支持恢复或替代路径。
- 低频操作进入 menu/overflow。
- 除非整个任务是危险确认，否则破坏性操作不应该成为默认 primary action。
- 弹窗 footer 中，桌面端越靠右越重要。
- 移动端纵向排列时，primary action 在前或视觉最强。
- 优先级由任务重要性、频率和风险决定，不由个人偏好决定。
- 如果 action 高风险、低频或属于辅助路径，即使空间足够，也不应该更突出。
- 不要因为有空位就提升 action 优先级。
- 不展示当前状态下无用的 action。

### 优先级层级

| Priority | 含义 | 视觉处理 |
|---|---|---|
| primary | 当前最佳下一步 | primary button |
| secondary | 有用的替代/配套操作 | secondary/outline button |
| tertiary | 低强调辅助操作 | ghost/link |
| overflow | 可用但低频 | menu item |
| hidden | 不相关或无权限 | 不渲染 |
| disabled | 可见但暂时不可用 | disabled + reason |

规则：

- 页面/弹窗/StateView action group 通常只有一个 primary，或没有 primary。
- Tertiary actions 不能干扰主工作流。
- Overflow actions 应可发现，但不能主导布局。
- 当用户当前角色永远无法执行时，优先 hidden。
- 当用户能通过修复状态使操作可用时，优先 disabled。

### 优先级判断顺序

按以下顺序决定 action priority：

1. 当前状态下 action 是否相关？
2. 用户是否有权限执行？
3. 它是否是主要下一步？
4. 它是否高频到需要暴露？
5. 它是否高风险或破坏性？
6. 它是否需要确认？
7. 它是局部、页面级、行级还是批量级？

规则：

- 风险会降低视觉优先级，即使这个 action 很重要。

### 常见优先级默认值

| Context | Primary | Secondary | Overflow |
|---|---|---|---|
| list page | Create/Add | Refresh/Export | Import, Settings |
| table row | 最多 3 个 icon actions | 无 | 额外行操作 |
| dialog form | Save/Create | Cancel | 很少使用 |
| destructive confirm | Delete/Confirm danger | Cancel | 无 |
| StateView error | Retry | Go back/View details | 无 |
| filter-empty | Clear filters | Refresh | 无 |
| detail page | Edit | Refresh/Back | Delete, Audit logs |
| batch toolbar | 主批量操作 | 次批量操作 | 额外批量操作 |

### 一个 primary 规则

规则：

- 一个视觉区域不应包含两个 primary buttons。
- 如果两个 action 看起来都像 primary，按用户目标选择一个，另一个降为 secondary。
- 如果两个选项同等重要且代表必须选择的决策，使用中性选择，而不是 primary/secondary。
- 确认弹窗中，确认操作可以是 primary danger，cancel 是 secondary。
- Wizard/footer 可以有 `Back` secondary 和 `Next/Submit` primary。

不推荐：

```text
[Create user] [Import users] both primary
```

推荐：

```text
[Create user] primary
[Import users] secondary or overflow
```

### 优先级与风险

规则：

- 危险操作通常在确认前降低视觉优先级。
- 在危险确认弹窗中，危险确认操作可以成为 primary action，但必须使用 danger 样式。
- 高风险非破坏性操作可能需要确认，并且不应该藏在令人意外的位置。
- 可逆操作可以比不可逆操作更暴露。

### 优先级与频率

规则：

- 高频安全操作可以可见。
- 低频操作进入 overflow。
- 重复出现的 row actions 只有在含义明确且有 tooltip 时才使用 icon buttons。
- 罕见操作需要文字 label，不要只用 icon。

---

## 4. 作用范围

Action scope 决定摆放位置和反馈范围。

| Scope | 示例 | 位置 |
|---|---|---|
| page | Create, Export | page header/tool area |
| list | Refresh, Batch delete | FilterBar/list toolbar |
| row | View, Edit, Delete | table action column |
| dialog | Cancel, Save | dialog footer |
| form | Submit, Reset | form footer/action area |
| field | Confirm edit, Clear | 字段附近 |
| StateView | Retry, Clear filters | StateView action area |
| batch | Delete selected, Export selected | selection toolbar |
| navigation | Back, View details | link/nav area |

规则：

- 不要把 row actions 放在 page header。
- 不要把页面级危险操作塞进行菜单。
- Batch actions 只在存在 selection 或进入 selection mode 时出现。
- Dialog submit actions 属于 footer。
- Action 应放在用户能理解其影响范围的位置。
- Action feedback 应和 action 本身保持同一作用范围。
- 把 action 放到更高 scope 会增强用户对影响范围和风险的感知。
- 把 action 放到更低 scope 可能让需要它的用户找不到。
- 不要在多个 scope 中重复同一个 action，除非产品有意支持多入口。

### Scope 判断顺序

按以下顺序选择 action scope：

1. 这个 action 影响哪个对象或区域？
2. 它是 global、page-level、list-level、row-level、field-level，还是 dialog-level？
3. 它是否依赖 selection？
4. 它是否提交表单或修改某个具体对象？
5. 它是否跳转到其他 route？
6. 它是否属于 empty/error 这类临时状态？

规则：

- Scope 由受影响目标决定，不由哪里有空间决定。

### Page actions

用于影响当前页面/模块整体的操作。

常见示例：

- Create resource。
- 打开 import flow。
- Export page-level data。
- Page-level settings。
- 跳转到相关模块。

位置：

- Page header。
- Page-level toolbar。
- 布局支持时，放在页面标题区域右侧。

规则：

- 页面 primary action 应稳定且容易找到。
- Page actions 不应该依赖单行 selection。
- 页面级 create/import actions 必须遵守权限。
- 不要把 row-specific actions 放在 page header。
- 不要在 header 直接放太多 page actions；低频操作进入 overflow。

示例：

```text
Projects page -> Create project in page header
Users page -> Import users as secondary/overflow
Settings page -> Save is not page action if it submits a form section
```

### List 与 toolbar actions

用于影响列表数据、query state 或 selected rows 的操作。

常见示例：

- Refresh。
- Clear filters。
- Export current result。
- Toggle view mode。
- Batch actions。

位置：

- FilterBar action area。
- Table/card list 上方的 list toolbar。
- items 被选中时的 selection toolbar。

规则：

- 当 Refresh 重新加载列表数据时，它是 list-level action。
- Clear filters 属于 filters 附近，或 StateView filter-empty action。
- Export current result 属于 list toolbar，不属于 row menu。
- Batch actions 只在 selection 存在或显式 selection mode 中出现。
- List actions 不应藏在 table 下方。
- 移动端 list actions 可以折叠进 toolbar menu，但 Refresh/Clear filters 应保持可达。

示例：

```text
Table refresh -> FilterBar/list toolbar
Export current filtered rows -> list toolbar
Batch delete selected users -> selection toolbar
```

### Row actions

用于影响单行/单对象的操作。

常见示例：

- View details。
- Edit。
- Delete。
- View logs。
- Retry row task。
- Toggle row status。

位置：

- Table action column。
- Card item action area。
- Row overflow menu。

规则：

- Table row actions 默认放在最后的 action column。
- 最多暴露 3 个常用 row icon actions。
- 额外 row actions 进入 overflow menu。
- Row action 点击不能触发 row click。
- Row action pending 是 row-scoped。
- Row destructive action 通常进入 overflow，或使用 danger icon/action。
- 如果点击 row 进入详情，row action buttons 必须在视觉和行为上与 row click 分离。

示例：

```text
Edit one user -> row action
Delete one invoice -> row overflow danger action
Retry one failed job -> row action
```

### Dialog actions

用于影响弹窗任务的操作。

位置：

- Dialog footer 放 submit/cancel/confirm。
- Dialog body 只放局部内容操作。
- Dialog header 只放关闭或 header-level utilities。

规则：

- Dialog header 必须保留 close action。
- Dialog primary action 属于 footer。
- Footer actions 桌面端右对齐。
- 桌面端 footer 中越靠右越重要。
- Dialog body 不应放主 submit action，除非该弹窗是极简单 inline tool。
- 危险确认弹窗在 footer 中使用 danger primary action。
- 如果 dialog content 有局部 section actions，放在对应 section 附近。

示例：

```text
Create user dialog -> Cancel + Create in footer
Delete confirmation -> Cancel + Delete in footer
Dialog table row action -> inside table row, not footer
```

### Form actions

用于提交、重置或离开表单。

位置：

- Form footer。
- 长页面表单使用 sticky form footer。
- 表单在弹窗中时，使用 dialog footer。
- 只有局部字段编辑才放在字段附近。

规则：

- Submit/save action 属于 form action area。
- 长表单在合适时使用 sticky footer，保持 submit 可达。
- Reset/discard 是 secondary，dirty 时可能需要确认。
- Form submit action 不应同时重复出现在 header 和 footer，除非产品有意支持长表单快捷入口。
- Field-level confirm/cancel actions 放在字段附近。

示例：

```text
Page edit form -> sticky footer Save/Cancel
Dialog form -> dialog footer Save/Cancel
Inline rename -> small confirm/cancel near input
```

### Field actions

用于影响单个字段值或字段辅助流程。

常见示例：

- Clear value。
- Show/hide secret。
- Copy token。
- Generate value。
- Confirm inline edit。
- Retry loading options。

位置：

- Input suffix/prefix。
- 字段下方 helper action。
- Dropdown content 中的 option-related actions。

规则：

- Field action 不应该提交整个表单，除非明确这样设计。
- Field action feedback 保持在字段附近。
- Secret copy/show actions 必须遵守 secret handling rules。
- Retry options 属于 dropdown/field error area。
- Field action hit area 要稳定。

### StateView actions

用于从 empty/error/loading-blocked 状态中恢复或进入下一步。

位置：

- StateView 内部，description 下方。
- Dialog StateView actions 如果是弹窗级操作，可以使用 dialog footer。

规则：

- StateView action 必须直接恢复或推进当前状态。
- 不要把无关 page actions 放进 StateView。
- StateView actions 应保留上下文。
- 使用 0-2 个可见 actions。

### Navigation actions

用于结果是 route/view change，而不是 mutation 的操作。

位置：

- Breadcrumb/back area。
- 相关内容附近的 link-style action。
- not-found/forbidden 恢复时的 StateView action area。

规则：

- Route changes 使用 link/navigation 语义。
- 优先使用具体文案，例如 `Back to users`。
- 不要用 mutation button style 表示简单导航。
- 不能在没有确认的情况下丢失 dirty form state。

### Scope 冲突

规则：

- 影响 selected rows 的 action 是 batch scope，不是 page scope。
- 影响单行的 action 是 row scope，不是 list scope。
- 改变 filters/query 的 action 是 list scope。
- 提交当前弹窗的 action 是 dialog/form scope。
- 恢复 empty/error 状态的 action 是 StateView scope。
- 跳转 route 的 action 必须使用 navigation 语义，即使它放在 button group 中。

不推荐：

```text
Delete selected users in page header before any selection exists.
Save dialog form in dialog body while footer has unrelated actions.
Row delete placed in page toolbar.
```

推荐：

```text
Batch delete in selection toolbar after rows are selected.
Dialog Save in footer.
Row delete in row overflow menu.
```

---

## 5. Pending 与防重复

Pending 表示 action 已被接收，但结果尚未最终确定。

规则：

- Mutation actions 点击后必须展示 pending/loading。
- Pending action 必须防止重复点击。
- 只禁用冲突操作，不禁用整个页面。
- Row mutation pending 是行级的。
- Batch mutation pending 是批量/action 级的。
- Form submit pending 禁用 submit 和冲突的 submit-like actions。
- 如果 action 会触发导航，pending 时防止重复导航。
- 失败后恢复 action 可用性。
- Pending 状态必须限制在最小安全范围内。
- Pending feedback 必须靠近触发 action。
- 读请求 refresh pending 和 mutation pending 不应该表现得一样阻塞。
- 对 mutation 来说，不能只依赖 debounce 防重复。
- 后端/API 在可能时仍应支持幂等或重复安全。

### Pending 类型

| 类型 | 使用场景 | UI 行为 |
|---|---|---|
| button pending | 单个按钮 action 执行中 | button loading + disabled |
| row pending | 单行/单对象 mutation 执行中 | row action disabled/loading |
| batch pending | selected items mutation 执行中 | batch action loading + selected rows locked |
| form submitting | 表单提交中 | submit loading + 禁用冲突操作 |
| dialog submitting | 弹窗操作执行中 | footer action loading；关闭策略明确 |
| field pending | 异步字段 action/校验/options 加载 | 字段级 loading |
| navigation pending | route/action navigation 开始中 | 防止重复导航 |
| refresh pending | 读请求刷新中 | refresh button loading；保留旧数据 |

规则：

- Pending 类型跟随 action scope。
- 不要把 row pending 升级成 page pending。
- 不要因为局部 mutation 阻塞无关区块。
- 不要因为 action pending 就清空可见内容。

### 防重复策略

规则：

- Pending 时禁用或锁定触发控件本身。
- 禁用会重复提交同一 payload 的 action。
- 禁用会对同一目标产生冲突 mutation 的 action。
- 安全时保留无关读请求/导航 action 可用。
- 对高风险 create/payment/import 类 mutation，尽可能使用 request idempotency key。
- 如果 action 可以安全重试，失败后显式提供 retry。
- 不要因为 double click、Enter key 或重复选择 menu item 而静默发送多次同一 mutation。

示例：

```text
Double-click Save -> one submit request
Press Enter twice in form -> one submit request
Click row Delete twice -> one delete request
Click menu item twice -> second click ignored while pending
```

### Form submit pending

规则：

- Submit button 立即展示 loading。
- Submitting 期间 submit button disabled。
- 其他 submit-like actions disabled。
- Cancel/close 行为必须明确。
- 如果关闭会丢失 pending 结果或 dirty data，需要确认或临时禁用 close。
- Validation errors 会在 pending mutation 开始前阻止 submit。
- Submit failure 恢复 submit action，并保留 dirty input。
- Submit success 成功后才清除 dirty state，并关闭/导航。

示例：

```text
Save profile -> Save loading, Cancel policy explicit
Create user dialog -> Create loading, no duplicate create
Validation fails -> no submit pending; show field errors
```

### Row pending

规则：

- Row mutation pending 基于 row id/rowKey。
- 只禁用该 row 上的冲突操作。
- 其他 rows 保持可用。
- Row pending 不应触发整个 table loading。
- 如果 row action 改变状态，在 action 或目标 cell 上展示 pending。
- 失败后恢复 row action state，并展示 toast/row inline error。
- 如果使用 optimistic update，失败后 rollback 或标记 row failed。

示例：

```text
Toggle one row -> only that switch pending
Delete one row -> only that row actions locked
Retry one task -> only that row retry action loading
```

### Batch pending

规则：

- Batch pending 作用于 selected items 和 batch action。
- Selection count 保持可见。
- 参与 batch 的 selected rows 应 locked 或 marked pending。
- 安全时，未选中 rows 可保持可用。
- 批量危险 mutation 在 pending 前需要确认。
- 完成后必须表达部分成功。
- 成功后清理无效 selection，并刷新受影响数据。
- 不要把 disabled/unselectable rows 纳入 pending batch payload。

示例：

```text
Batch delete 12 users -> Delete selected loading + selected rows locked
Partial success -> show result details and keep failed rows selectable
```

### Dialog pending

规则：

- Dialog footer action 展示 loading。
- Dialog header close 只有在安全时保持可用。
- 除非 action 被明确设计为后台执行，否则 mutation 成功前不要关闭 dialog。
- 如果允许后台执行，关闭后展示 toast/task state。
- 只有 submit 期间继续编辑会破坏 payload 时，才禁用 dialog body fields。
- Dialog submit failure 保持 dialog 打开并保留输入。

### Field pending

规则：

- Field pending 保持在字段附近。
- 异步校验需要 debounce，并取消过期请求。
- Options loading 不阻塞整个表单。
- 依赖字段 loading 只禁用依赖字段。
- 原因不明显时，field pending 应说明为什么输入/action 暂时不可用。

### Refresh 与读请求 pending

规则：

- Refresh pending 保留旧数据可见。
- Refresh action 展示 loading，并防止重复刷新点击。
- Refresh pending 不应禁用 row detail navigation，除非数据变得不稳定。
- Filter/search/page/sort 请求 pending 时，如果旧数据不再匹配 query，可以展示 list-level loading。
- 读请求 pending 失败时，在有旧数据的情况下保留旧数据。

### Navigation pending

规则：

- Navigation 进行中，防止重复 route push。
- 导航前保留 dirty form protection。
- 简单 route link 不要展示 mutation-style loading，除非 route load 明显延迟。
- 如果 navigation 依赖先 create/update data，则优先按 submit/mutation pending 处理。

### Optimistic update

规则：

- 只有 rollback 清晰且安全时才使用 optimistic update。
- 即使 UI 已乐观更新，也要展示局部 pending。
- 失败后必须 rollback、恢复 edit mode，或标记 failed state。
- 不可逆危险操作不要使用 optimistic update，除非后端契约支持安全恢复。
- Toast 或 inline error 应说明 action 没有完成。

### Pending 文案与形态

规则：

- 可见 loading label 应具体：`Saving`、`Deleting`、`Uploading`。
- Icon-only pending action 应尽量保持尺寸和 tooltip。
- 不要让 button 在 loading 时宽度剧烈变化。
- 保持布局稳定。
- 当时长很长且可度量时，优先使用 progress。
- 长任务应暴露 task/progress，不要无限 spinner。

示例：

```text
Save form -> Save button loading
Delete row -> row delete action loading/disabled
Batch delete -> batch action loading, selected rows locked
Refresh list -> refresh button loading, rows remain readable
Import file -> progress/task state instead of endless button loading
```

---

## 6. Disabled

Disabled 原因不明显时必须解释。

规则：

- 权限导致 disabled 的 action 需要 tooltip/reason。
- 状态导致 disabled 的 action 可见时需要 tooltip/reason。
- 当前角色永远不能执行的 action，隐藏。
- 因状态变化未来可能可用的 action，禁用。
- Disabled action 不能作为唯一恢复路径。
- Disabled icon buttons 也需要 tooltip 说明原因。
- Disabled 本身不是权限系统；后端/API 仍必须强制校验权限。
- 如果用户不应该知道某能力存在，不要通过 disabled label 暴露。
- Disabled 视觉状态必须可读且可访问。
- Disabled action 不能触发任何 mutation。

### 可见性判断

按以下顺序决定 action 可见性：

1. 该 action 在当前 feature/state 下是否相关？
2. 用户是否允许知道该 action 存在？
3. 用户是否允许执行？
4. 该 action 是否可能因 selection/input/state 变化而可用？
5. 展示它是否能帮助用户理解下一步？

规则：

- action 不相关时，隐藏。
- 用户不应该知道能力存在时，隐藏。
- 当前角色在当前上下文中永久无权限时，通常隐藏。
- 如果用户可以申请权限，或需要了解所需权限，可以 disabled + reason。
- 如果只是因为状态暂时不可用，disabled + reason。
- 如果因为校验不可用，保持可见，并通过 disabled reason 或 inline errors 解释。

### Hidden 与 disabled

| 状态 | 使用场景 |
|---|---|
| hidden | 不相关、不允许知道、当前角色永远不可用 |
| disabled | 可见但暂时不可用，或用于解释/教育 |
| readonly | 值可见但不可编辑 |
| pending | action 已被接收，等待结果 |
| unavailable state | 功能被 setup/dependency 阻塞 |

规则：

- Hidden 会从布局中移除 action。
- Disabled 保留布局，并解释为什么不可用。
- Readonly 用于数据展示/可编辑性，不表示 action 执行。
- Pending 不等于 disabled；pending 表示 action 正在执行。
- setup/dependency 不可用通常用 StateView、banner 或 disabled reason 解释。

示例：

```text
Viewer role can never delete project -> hide Delete or show disabled only if policy wants education
No row selected -> Batch delete disabled: "Select at least one item"
Required fields invalid -> Save disabled or enabled with validation on submit, based on form policy
Integration not connected -> Sync disabled: "Connect GitHub first"
```

### Permission-disabled

规则：

- 权限导致 disabled 时，在安全前提下说明需要的 role/permission。
- 解释应具体，但不能泄露敏感策略细节。
- 紧凑操作用 tooltip，大型 action group 可用 helper text。
- Icon-only disabled action 必须有 tooltip。
- Menu item 因权限 disabled 时，如果有教育意义，可以保持可见。
- 如果存在申请权限流程，提供 `Request access`、`Contact admin` 或 `Ask owner` 路径。
- 除非存在申请权限流程，否则不要把 permission-disabled action 作为主要恢复路径。

文案示例：

```text
Only workspace owners can delete this project.
You need billing admin permission to configure invoices.
Ask an admin to enable this integration.
```

避免：

```text
Forbidden.
RBAC_POLICY_DENIED_DELETE_PROJECT.
You cannot do this.
```

### State-disabled

规则：

- 状态导致 disabled 时，说明缺少的状态或前置条件。
- 当用户改变 selection/input/status 后 action 可能可用时，使用 disabled。
- 表单字段可修复时，使用 inline errors。
- 整个区域被 setup 阻塞时，使用 StateView/config empty。
- 如果 row status 阻止 action，在 action 附近或 tooltip 中说明原因。
- 多个前置条件缺失时，优先展示最可行动的原因。

示例：

```text
Batch export disabled -> Select at least one item
Save disabled -> Fix required fields before saving
Retry disabled -> Task is already running
Sync disabled -> Connect GitHub first
```

### Menu 和 icon button 中的 disabled

规则：

- Disabled icon button 仍必须在 hover/focus 时展示 tooltip。
- Disabled menu item 尽量在 hover/focus 时展示 reason。
- 如果 menu 系统无法展示 disabled reason，权限导致的 disabled action 优先隐藏，并在其他可见位置提供引导。
- Disabled danger action 只有在 reason 清晰时才保留 danger 语义。
- Disabled item 不能看起来和 enabled item 一样。

### Disabled 与可访问性

规则：

- Disabled reason 必须能被键盘和屏幕阅读器用户访问。
- 不能只依赖颜色表达 disabled。
- Disabled text/icon 仍需有足够对比度。
- 如果原生 disabled 会阻止 tooltip/focus，使用可访问 wrapper/pattern。
- 键盘用户不能被 disabled actions 卡住。

### Disabled 与表单

规则：

- 必填字段错误可以选择“禁用 submit 直到有效”，也可以“允许 submit 后展示校验”，但同一表单上下文策略要统一。
- 长表单通常允许 submit 后展示校验。
- 小表单可以在明显无效时禁用 submit。
- Submit disabled 原因不明显时，必须说明需要修复什么。
- Submit pending 是 loading，不是普通 disabled。
- Readonly form fields 应保持可读，必要时可复制。

### Disabled 与批量选择

规则：

- 没有 eligible selected items 时，batch action disabled。
- 如果部分 selected items 不符合条件，展示 selected/eligible counts 或说明部分可用性。
- Disabled rows 不应纳入 batch payload。
- 如果所有 selected items 对某 action 都不可用，禁用 batch action 并说明原因。
- 批量部分可用性应在确认前明确。

示例：

```text
Delete disabled -> "Only owners can delete this project"
Batch delete disabled -> "Select at least one item"
Save disabled -> "Fix required fields before saving"
Batch delete 5 selected, 2 eligible -> confirmation should name eligible count
```

---

## 7. 危险操作

规则：

- 危险操作包括 delete、revoke、reset、disconnect、disable critical service、不可逆修改。
- Danger color 应用于文字/icon/action affordance。
- 必要时，危险菜单项需要视觉分隔。
- 危险操作通常需要确认。
- 确认必须说明目标对象和操作。
- 批量危险确认必须包含 selected count。
- 破坏性操作 pending 必须明确防止重复执行。
- Action rules 定义什么时候需要确认；Dialog rules 定义确认弹窗的样式和文案。
- 破坏性/高风险二次确认无论从哪里触发，都使用 ConfirmDialog。

### 危险操作等级

| 等级 | 含义 | 示例 | 是否确认 |
|---|---|---|---|
| 低风险可撤销 | 容易撤销或影响很小 | 移除筛选、清空本地草稿 | 通常不需要 |
| 有风险可恢复 | 影响共享状态但可恢复 | 禁用非关键配置、移出分组 | 视情况 |
| 破坏性 | 删除/移除/撤销真实数据或访问权限 | 删除用户、撤销 token、断开集成 | 需要 |
| 不可逆/关键 | 不可恢复或影响服务可用性 | 重置 secret、清空生产数据、终止任务 | 需要，更强文案 |
| 批量破坏性 | 对 selected items 执行破坏性操作 | 删除 12 个用户、撤销选中的 keys | 需要，包含数量 |

规则：

- 破坏性、不可逆、关键、批量破坏性操作必须确认。
- 有风险可恢复操作在影响不明显时需要确认。
- 不要对所有低风险操作都加确认；过多确认会降低用户信任。
- 如果 undo 可靠，低风险可撤销操作可以用 toast + Undo 替代确认。
- 如果 undo 不可靠，使用确认。

### 确认内容要求

确认必须包含：

- title 说明动作和目标类型。
- body 说明具体对象/作用范围。
- action 成功后的后果。
- 不可撤回说明或恢复路径。
- 取消操作。
- danger confirm 操作。

规则：

- 不要使用 `Are you sure?`、`Confirm delete?`、`OK` 这类泛化文案。
- 不要只写 `确认删除吗？`。
- 应写成 `确认删除 {对象类型} "{对象名}" 吗？` 或等价表达。
- 批量操作必须包含 selected count 和目标类型。
- 权限/access 类操作需要说明影响的是谁的权限，或哪个 token/key。
- 确认按钮文案短且动作明确：`Delete`、`Delete 12 items`、`Revoke access`、`Reset key`。
- 极高风险操作如果要求用户输入对象名，输入值必须与目标精确匹配。

推荐：

```text
删除项目 "Production API"？
这会永久删除该项目及其环境配置。此操作不可撤回。
确认：删除项目
```

不推荐：

```text
确认
确定吗？
确认：确定
```

### 危险操作位置

规则：

- Row destructive actions 通常放在 row overflow，除非非常高频且暴露是安全的。
- Batch destructive actions 在 selection 存在后放在 selection toolbar。
- Page-level destructive actions 通常放在 overflow 或 danger zone，不要和 primary create/save 并列。
- 破坏性确认弹窗中，确认操作可以是 primary danger。
- 普通 edit/create form 中，不要把 destructive action 作为默认高亮操作。

### 危险操作 pending 与失败

规则：

- 破坏性操作 pending 时，按 Dialog rules 禁用确认和冲突的取消/关闭行为。
- 不允许重复执行。
- 成功后关闭确认弹窗，并刷新/移除受影响数据。
- 失败后保持上下文可见，并明确说明操作没有完成。
- 如果使用 optimistic destructive UI，必须保证 rollback；否则不要乐观移除。

---

## 8. Icon Actions

规则：

- 使用语义化图标。
- 同一上下文中，不要用同一个图标表示不同操作。
- Icon-only action 必须有 tooltip。
- Table row 最多暴露 3 个常用 icon actions。
- 超出操作进入 More/overflow menu。
- Icon button hit area 稳定且可访问。
- Tooltip 文案使用操作动词：`Edit`、`Delete`、`View logs`。

---

## 9. Menu / Overflow Actions

规则：

- 低频或额外 row actions 进入 overflow。
- Menu 宽度保持统一。
- Menu item 尽量使用 icon + label。
- Icon 与 label 间距为 8px。
- Dangerous menu item 的 icon 和 text 使用 danger color。
- Menu action 排序：常用安全操作在前，危险操作最后。
- 不要把唯一主路径藏在 overflow 中。

---

## 10. Batch Actions

规则：

- Batch actions 依赖 selected items。
- Selection count 必须可见。
- 批量危险操作需要确认。
- 确认中说明 action 和 selected count。
- Batch action 必须处理部分成功/失败。
- 批量 mutation 成功后，清理无效 selection，并刷新受影响数据。
- Disabled selected rows 不应被纳入批量操作。

---

## 11. Feedback

规则：

- Mutation 成功通常展示 toast。
- 单个 action 失败展示 toast 或局部 inline error。
- Form submit 失败展示 inline/form-level error。
- Page/list load 失败使用 StateView。
- Refresh 失败保留旧数据，并展示 toast/local error。
- 不要只用 toast 展示字段校验错误。

---

## 12. AI 审查清单

接受 AI 生成的 action code 前，检查：

- 是否先确定 action 语义，再选择视觉 variant。
- 每个 action 是否有清晰 intent 和 label。
- Action 优先级是否清晰，且每个区域只有一个 primary。
- 暴露 action 前是否考虑了风险、频率和权限。
- 危险操作是否没有在非危险确认场景中成为 primary。
- 低频操作是否进入 overflow，而不是和 primary 竞争。
- hidden 与 disabled 是否被有意选择。
- 路由变化的 navigation actions 是否使用 link/navigation 语义。
- 即时二元状态切换是否使用 Switch。
- Action scope 是否匹配摆放位置。
- Action scope 是否基于受影响目标决定，而不是哪里有空间。
- Page actions 是否不依赖 row selection。
- List actions 是否放在 FilterBar/list toolbar 附近，并在移动端保持可达。
- Batch actions 是否只在 selection 或 selection mode 后出现在 selection toolbar。
- Row actions 是否放在 table action column/card item area，并且不触发 row click。
- Dialog submit/confirm actions 是否位于 dialog footer。
- Form submit actions 是否位于 form/dialog footer，长页面表单必要时使用 sticky footer。
- Field actions 是否靠近字段，并且不会意外提交整个表单。
- StateView actions 是否直接恢复或推进当前 StateView 状态。
- Pending 是否防止重复执行。
- Pending scope 是否限制在最小安全范围：button、row、batch、form、dialog、field、navigation 或 refresh。
- Mutation actions 是否没有只依赖 debounce 防重复。
- Double click、Enter key、重复选择 menu item 是否不能产生重复 mutation。
- Form submit pending 是否禁用 submit-like actions，并在失败后保留 dirty input。
- Row pending 是否基于 row id/rowKey，且不会触发整个 table loading。
- Batch pending 是否保持 selection count 可见，并处理部分成功/失败。
- Dialog pending 是否明确 close 行为，并在失败后保留输入。
- Field pending 是否靠近字段，并取消过期异步请求。
- Refresh pending 是否尽量保留旧数据可见。
- Optimistic update 是否有清晰 rollback 或 failed-state 路径。
- 长任务是否使用 progress/task state，而不是无限 spinner。
- Loading labels 和 button 尺寸在 pending 期间是否稳定。
- Disabled actions 是否解释原因或被隐藏。
- hidden、disabled、readonly、pending、unavailable states 是否没有混淆。
- 是否没有把 disabled 当成唯一权限保护；后端/API 仍有权限校验。
- Permission-disabled actions 是否没有泄露敏感能力或内部策略码。
- Permission-disabled actions 是否只在安全时说明所需 role/permission。
- State-disabled actions 是否说明缺少的前置条件或下一步修复方式。
- 可见的 disabled icon buttons/menu items 是否在 hover/focus 时暴露 reason。
- Disabled reason 是否对键盘和屏幕阅读器用户可访问。
- 同一表单上下文中的 disabled submit 策略是否一致。
- Batch disabled state 是否正确处理 eligible/ineligible selected item counts。
- Permission rules 是否被遵守。
- Dangerous actions 是否有视觉标记和确认。
- 是否先识别危险操作等级，再决定确认方式。
- 破坏性/不可逆/批量破坏性操作是否必须确认。
- 危险确认是否说明目标对象/范围、动作、后果、不可撤回/恢复路径。
- 危险确认是否没有使用 `确定吗？`、`确认` 这类泛化文案。
- 批量危险确认是否包含 selected count 和目标类型。
- 极高风险操作是否在合适时要求精确输入目标名称等更强确认。
- 破坏性 pending 是否防止重复执行，并且有 rollback 或非乐观策略。
- Icon-only actions 是否有 tooltip。
- Row actions 是否最多暴露 3 个 icons，超出进入 overflow。
- Overflow menu 是否使用 icon + label，并标记危险操作。
- Batch actions 是否依赖 selection，并处理部分失败。
- Feedback 是否匹配 action 结果和作用范围。
