# StateView / Empty / Loading / Error 状态组件系统规范

> 用于创建、修改或审查 2B 产品中的状态承载组件。
> StateView 用于页面、区块、列表、弹窗或数据区域无法展示正常内容的场景。

---

## 1. 核心目的

StateView 用统一方式承载非正常数据状态。

常见状态：

- loading
- refreshing
- empty
- filter-empty
- search-empty
- error
- forbidden
- not-found
- offline

规则：

- 当前区域无法渲染正常内容时，使用 StateView。
- 单个操作 pending 时，使用按钮 loading。
- 字段级或表单级校验错误，使用 inline error。
- Toast 用于短暂反馈，不能作为唯一恢复路径。

---

## 2. 作用范围

根据失败/加载边界选择 StateView 范围。

| 范围 | 使用场景 |
|---|---|
| 页面级 | 整个页面无法展示有用内容 |
| 区块级 | 某个模块/区块无法展示有用内容 |
| 列表级 | table/card list 无数据或请求失败 |
| 弹窗级 | 弹窗 body 无法展示正常内容 |
| 字段级 | select/options/异步字段无法加载选项 |

规则：

- 页面级 StateView 不应该隐藏全局导航。
- 列表级 StateView 在有价值时保留 FilterBar 和 table header。
- 弹窗级 StateView 位于 dialog body 内，并保留 dialog header。
- 字段级 loading/error 应靠近字段，不升级为页面级状态。
- 不要把局部小问题放大成整页状态。

---

## 3. Loading 策略

Loading 必须区分首次加载和刷新。

| Loading 类型 | 使用场景 | UI 行为 |
|---|---|---|
| first loading | 还没有可用数据 | skeleton 或居中 loading |
| refreshing | 已有旧数据 | 保留旧数据，展示轻量刷新状态 |
| local loading | 区块/弹窗/列表加载 | 局部 skeleton/spinner |
| button pending | 单个操作执行中 | 按钮 loading/disabled |
| field loading | options/异步校验加载 | 字段级 spinner/pending |
| blocking loading | 当前区域不能安全交互 | overlay 或禁用区域 |

规则：

- 首次页面加载，如果布局可预测，优先使用 skeleton。
- 只有布局未知或内容很少时，才使用居中 spinner。
- 刷新时尽量保留旧数据。
- 除非旧数据已经失效，刷新中不要清空 table/list。
- 刷新中不要禁用无关控件。
- pending 按钮必须防止重复提交/点击。
- 很快完成的请求应避免 loading 闪烁。
- 不要为了同一个小操作同时展示整区 loading 和按钮 loading。

### 首次加载

没有任何可用内容时，使用首次加载状态。

规则：

- table、卡片列表、详情页、弹窗内容、表单区块在布局已知时使用 skeleton。
- 布局未知、短暂工具页或很小模块使用居中 spinner。
- 页面 chrome 尽量保持可见：导航、页面标题、稳定布局不要消失。
- 首次请求完成前，不要展示 empty。
- 请求真正失败前，不要展示 error。
- route params 或权限仍在解析时，使用首次 loading，不要提前显示 forbidden/not-found。

示例：

```text
首次 table 请求 -> table skeleton
首次详情请求 -> detail skeleton
首次弹窗内容请求 -> dialog body skeleton
未知异步工具结果 -> 居中 spinner
```

### 刷新中

已有旧数据，同时新请求正在进行时，使用 refreshing。

规则：

- 默认保留旧数据可见。
- 在触发控件或列表头部附近展示轻量刷新反馈。
- Refresh 按钮展示 pending，并防止重复点击。
- Pagination、sorting、filters 在请求契约可承受时保持可用。
- Row selection 只有在刷新后 selected row keys 仍存在时才保留。
- 如果刷新结果会使当前 rows 失效，请求成功后一次性替换 rows。
- 刷新失败时，保留旧数据，并使用 toast 或局部 inline error。
- 刷新中不要把旧数据替换成 skeleton。

示例：

```text
手动刷新 table -> 保留 rows + refresh button loading
筛选变化 -> 请求新结果；如果旧 rows 已不匹配查询，则 table body loading/skeleton
后台轮询 -> 保留 rows + 可选轻量 "Updated" toast
```

### Skeleton 与 spinner

按布局是否可预测选择。

| UI | 使用场景 |
|---|---|
| Skeleton | 最终布局已知，内容有结构 |
| Spinner | 布局未知、操作很短、区域很小 |
| Progress | upload/import/export 有可度量进度 |
| Overlay loading | 当前可见区域不能继续交互 |

规则：

- Table skeleton 应保留 header，并近似最终 row height。
- Card skeleton 应保留 card grid 和 card aspect ratio。
- Form skeleton 应保留 label/field 节奏。
- Dialog skeleton 位于 body，header 保持可见。
- 对可预测页面，不要用 spinner 长时间占位。
- 后端能提供进度时，Progress 应展示百分比或步骤。

### 闪烁控制

Loading 不应该因为快速请求而闪一下。

规则：

- 非关键 loading 可以延迟展示，避免极快请求闪烁。
- loading 一旦可见，应保持足够短的最小时长，避免视觉抖动。
- Button pending 可以立即出现，因为它确认点击已被接收。
- 危险或昂贵操作不要延迟 loading，因为用户需要明确反馈。
- 如果不展示 loading 会让用户误以为界面卡住，也不要延迟。

推荐时机：

```text
请求 150-300ms 后仍未完成，再展示 skeleton/spinner。
loading 一旦出现，至少保持约 300ms。
button loading 立即展示。
```

### Loading 期间的交互

Loading 只阻塞不安全的交互。

规则：

- 禁用触发 mutation 的具体操作。
- 禁用会重复或破坏同一份数据的冲突操作。
- 安全时，保留无关导航和筛选可用。
- submit pending 时禁用 submit 和冲突的 close/discard 操作。
- 列表刷新中，不要禁用 row detail navigation，除非 row data 不稳定。
- 只有部分交互会制造不一致状态时，才允许 blocking overlay。

示例：

```text
保存表单 -> 禁用 Save，禁用冲突提交动作，Cancel 策略明确
删除行 -> 禁用该行操作，而不是整个 table
刷新 table -> 禁用 Refresh，当前 rows 仍可读
上传文件 -> 展示进度，直到上传结果明确前禁用 submit
```

### List 与 table loading

规则：

- 首次加载：展示 table/list skeleton。
- 刷新：保留旧 rows，展示刷新指示。
- 筛选/搜索变化：如果旧 rows 已不匹配查询，在 body 中展示 table-level loading 或 skeleton。
- 分页变化：展示 table-level loading，同时保留 header 和 pagination 位置。
- 排序变化：除非是立即完成的前端排序，否则展示 table-level loading。
- 虚拟列表 loading 应保留 scroll container height。
- 无限滚动使用底部 loading，不要替换整份列表。

### Dialog loading

规则：

- Dialog header 必须保持可见。
- 弹窗初始内容加载展示在 dialog body。
- 必要数据未就绪前，footer 可以隐藏或禁用。
- 如果 loading 只影响一个字段/区块，使用局部 loading，不要让整个 dialog body loading。
- loading 期间关闭策略要明确：只读加载可允许关闭；高风险提交中确认或禁用关闭。

### Field loading

规则：

- 远程 Select/Combobox loading 展示在 dropdown 内或字段 suffix。
- 异步校验 loading 展示在字段附近。
- 依赖字段 loading 只禁用该字段。
- 父字段变化时，应取消过期的子字段 options 请求。
- Field loading 不应该阻塞整个表单，除非表单无法安全提交。

示例：

```text
打开用户列表且还没有数据 -> table skeleton
已有 rows 后点击刷新 -> 保留 rows + 小型刷新提示
点击删除行 -> 删除按钮 loading + 行操作禁用
远程 Select 加载 options -> select 内 spinner
```

Skeleton 规则：

- 页面、table、卡片列表、弹窗内容在结构可预测时使用 skeleton。
- Skeleton 应大致匹配最终布局。
- 不要使用会导致布局跳动的装饰性 skeleton。
- Table skeleton 尽量保留 columns/header。
- Skeleton 数量应匹配可视区域密度，而不是 total 数据量。
- 移动端 skeleton 使用移动端布局，不要使用桌面 table skeleton。

---

## 4. Empty 策略

Empty 必须解释为什么没有内容。

| Empty 类型 | 含义 | 主操作 |
|---|---|---|
| initial empty | 从未创建过数据 | Create / Import / Connect |
| filter-empty | 有数据，但当前筛选无命中 | Clear filters |
| search-empty | 搜索关键词无命中 | Clear search |
| config-empty | 需要先完成配置 | Configure |
| integration-empty | 缺少外部连接 | Connect integration |
| permission-empty | 权限导致不可见 | Contact admin / 无操作 |
| local empty | 当前区块没有关联数据 | 可选 create/add |
| archived/deleted empty | 关联资源已被移除 | Go back / Refresh |
| async-pending empty | 数据会在同步/导入后出现 | Refresh / View task |

规则：

- 不要对所有空状态都使用同一句“暂无数据”。
- 初始空状态可以解释用户下一步应该创建什么。
- 筛选空状态必须在筛选激活时提供 Clear filters。
- 搜索空状态在有帮助时应展示或提及搜索关键词。
- 配置/集成空状态在用户有权限时，应引导到 setup。
- 权限空状态不能暗示数据不存在。
- Empty 状态不能移除恢复所需的控件。
- Empty 状态应保留有用上下文，例如 active filters、tab、search keyword 或 parent resource。
- Loading 成功完成前，不要展示 Empty。
- Empty 不能掩盖错误。请求失败是 error，不是 empty。
- Empty 不能掩盖权限问题。Forbidden 不是 empty。
- Empty 文案应该事实、平静、具体。

### Empty 判断顺序

按以下顺序判断 Empty 原因：

1. 如果请求失败，展示 error。
2. 如果用户无权访问页面/资源，展示 forbidden。
3. 如果缺少必要配置，展示 config/integration empty。
4. 如果存在搜索关键词且无结果，展示 search-empty。
5. 如果存在筛选条件且无结果，展示 filter-empty。
6. 如果父资源存在，但当前区块没有关联数据，展示 local empty。
7. 如果整个产品/模块还没有任何记录，展示 initial empty。

规则：

- 在排除 filters/search/setup/permission 前，不要把状态归为 initial empty。

### 初始空状态

模块还没有任何记录时使用。

规则：

- 解释缺少的具体对象。
- 只有用户有权限时，才提供 create/import/connect 操作。
- 如果用户没有 create 权限，展示中性说明，或在系统支持时提供联系管理员路径。
- 没有筛选激活时，不展示 Clear filters。
- 不要暗示失败；初始空状态是正常状态。

推荐：

```text
No projects yet.
Create a project to start grouping environments and deployments.
Primary action: Create project
```

不推荐：

```text
No data.
```

### 筛选空状态

筛选条件激活且结果为空时使用。

规则：

- 保留 FilterBar 可见。
- 保留 active filter chips 可见。
- 主操作应是 Clear filters 或 Reset filters。
- 除非创建确实是最好的恢复路径，否则不要把 Create 作为主操作。
- 如果只是部分筛选过于严格，允许清除单个 chip。
- 筛选变化时，pagination 重置到第一页。
- 筛选变化时，selection 清空。

示例：

```text
No records match the current filters.
Primary action: Clear filters
Secondary action: Refresh
```

### 搜索空状态

关键词搜索无结果时使用。

规则：

- 安全且有帮助时，展示搜索关键词。
- 主操作应是 Clear search。
- 如果其他筛选也激活，保持筛选可见。
- 搜索和筛选同时激活时，使用组合文案和 Clear filters/search 操作。
- debounce/request 未完成时，不展示 search-empty。

示例：

```text
No results for "invoice webhook".
Primary action: Clear search
```

### 配置空状态

数据必须依赖某个配置才能产生时使用。

规则：

- 解释缺少的配置，而不只是说缺少数据。
- 用户有权限时，主操作应跳转到配置。
- 用户没有配置权限时，说明谁可以配置或如何寻求帮助。
- 必要配置缺失前，不要展示下游对象的 Create。
- 文案聚焦被阻塞的能力。

示例：

```text
Billing is not configured.
Configure billing before creating invoices.
Primary action: Configure billing
```

### 集成空状态

数据依赖外部连接或同步时使用。

规则：

- 说明缺少或断开的具体 integration。
- 有权限时，主操作应是 Connect integration。
- 如果已连接但同步未完成，展示 async-pending empty。
- 如果 integration 失败，展示 error，不展示 empty。
- 导入/同步类空状态在有帮助时提供任务状态或 refresh。

示例：

```text
GitHub is not connected.
Connect GitHub to sync repositories.
Primary action: Connect GitHub
```

### 权限空状态

只有在区域可见、但数据因权限被隐藏时使用。

规则：

- 不要说数据不存在。
- 不要展示用户不能执行的 create/configure 操作。
- 只有产品支持申请/联系流程时，才展示 Contact admin。
- 操作级权限问题，优先使用 disabled action + tooltip，不使用 StateView。
- 页面级无访问权限，使用 forbidden StateView，而不是 permission-empty。

示例：

```text
You do not have access to view these records.
Secondary action: Contact admin
```

### 局部空状态

父资源存在，但某个子区块没有关联项目时使用。

规则：

- 保留父级上下文可见。
- Empty 状态保持紧凑。
- 操作是可选的。
- 不要为小 tab/section 使用大型页面级 empty。
- 如果子项目对流程重要，有权限时提供 Add/Create。

示例：

```text
User detail -> Audit Logs tab empty -> "No audit logs yet."
Project detail -> Members section empty -> "No members added." + Add member
```

### 异步等待空状态

数据可能在导入、同步或后台处理后出现时使用。

规则：

- 说明数据仍在等待中，而不是不存在。
- 有帮助时提供 Refresh 或 View task。
- import/sync job 仍在运行时，不展示 initial empty。
- async job 失败时，展示 error 或 failed task state。

示例：

```text
Repository sync is still running.
Refresh later or view sync task for progress.
```

### Empty 文案

规则：

- Title 说明当前空状态。
- Description 解释原因或下一步。
- 已知具体原因时，避免使用 “No data” 这类模糊文案。
- 不要责备用户。
- 不要暴露敏感权限或资源存在性细节。
- 使用产品对象名，不使用泛泛的词。

推荐模式：

```text
Title: No {object} yet
Description: {Next step or cause}
Action: {Recovery action}
```

### Empty 位置

规则：

- Table empty 出现在 table body 中，通常保留 header。
- Filter/search empty 保留 FilterBar 和 active chips。
- Card list empty 出现在 list/grid 区域。
- Dialog empty 出现在 dialog body，并保留 header。
- 小区块 empty 应紧凑，避免大插画。
- 移动端 empty 使用更短文案和纵向 actions。

示例：

```text
还没有项目 -> Create project
当前筛选无结果 -> Clear filters
未连接 GitHub 集成 -> Connect GitHub
因为权限看不到记录 -> Contact admin
```

---

## 5. Error 策略

Error 状态取决于旧数据是否仍然可用。

| Error 类型 | 使用 StateView | 使用 toast | 恢复方式 |
|---|---|---|---|
| 首次加载失败 | 是 | 可选 | Retry |
| 刷新失败且旧数据仍在 | 否 | 是 | 保留旧数据 |
| 列表请求失败且无数据 | 是 | 可选 | Retry |
| 区块失败 | 局部 StateView | 可选 | Retry |
| 弹窗内容失败 | 弹窗 StateView | 可选 | Retry / Close |
| 表单提交失败 | 否 | 有时 | inline/form-level error |
| 字段 options 失败 | 不用页面 StateView | 可选 | 字段级 retry |
| 权限错误 | StateView 或 disabled tooltip | 可选 | Contact admin |
| not found | StateView | 可选 | Go back |
| 后台任务失败 | 否，除非是任务页 | 是 | View task / Retry task |
| 乐观更新失败 | 通常否 | toast + rollback/inline | 回滚或恢复编辑 |

规则：

- 首次加载失败必须展示带 Retry 的 StateView。
- 刷新失败应保留旧数据，并展示 toast 或局部刷新错误。
- 表单校验错误必须 inline 展示，不能只用 toast。
- 服务端字段错误应尽量映射到字段。
- 未知提交失败可使用 form-level error 和/或 toast，但必须保留输入。
- 列表错误且没有可用数据时，使用列表级 StateView。
- 弹窗加载错误需要保留 header，并在 body 或 footer 展示 Retry/Close。
- 不要为了展示错误状态而清空仍有价值的旧数据。
- Error 状态应尽量保留用户输入和当前上下文。
- Error 文案应说明什么失败了，以及用户下一步能做什么。
- 不要把后端 stack trace 或内部错误码作为主要文案展示。
- 技术细节只在对支持有帮助时，放到次级可展开区域或可复制详情里。
- Retry 必须重新执行失败请求，不要除非必要就刷新整个应用。
- Error UI 必须限制在失败区域内。

### Error 判断顺序

按以下顺序决定错误展示方式：

1. 如果正常内容无法渲染且没有可用旧数据，展示 StateView。
2. 如果旧数据仍可用，保留内容，并展示 toast 或局部 inline error。
3. 如果用户能修复具体字段，展示字段级 inline error。
4. 如果提交因通用业务/服务端错误失败，在提交区域附近展示 form-level error。
5. 如果单个操作失败，展示 toast，并恢复/保留相关局部状态。
6. 如果后台任务失败，只有用户能查看任务时才展示带 View task 的 toast。

规则：

- 当前区域不可用的错误，绝不能优先选择 toast。

### 页面和列表错误

规则：

- 页面首次加载失败使用页面级 StateView + Retry。
- 列表首次加载失败使用列表级 StateView + Retry。
- 有价值时，table/list header、FilterBar、页面标题应保留。
- 刷新失败保留旧 rows/cards，并展示 toast 或局部刷新消息。
- 筛选/搜索请求失败不能展示为空状态。
- 分页失败时，如果当前页数据仍可用，应保留当前页数据。
- Retry 应保留同一组 query/filter/page 参数。

示例：

```text
打开 users 页面 -> 请求失败 -> page/list StateView + Retry
已有用户 rows 时刷新 -> 保留 rows + toast "Refresh failed"
切换分页失败 -> 尽量保留当前 rows + 局部分页错误
```

### 区块和弹窗错误

规则：

- 区块错误只替换失败区块。
- 页面其他区块保持可用。
- 弹窗内容错误位于 dialog body，并保留 header。
- 弹窗 action submit 失败不应该替换整个 dialog body。
- 弹窗表单提交失败保留输入，并展示字段/form-level error。
- 只读弹窗内容加载失败时，可以展示 Retry 和 Close。

### 表单和字段错误

规则：

- 客户端校验错误使用字段级 inline error。
- 服务端字段校验错误尽量映射回字段。
- 跨字段错误显示在相关字段组或提交区域附近。
- 通用提交失败显示在提交按钮附近的 form-level error。
- Toast 可以补充提交失败，但不能替代 inline/form-level error。
- 提交失败不能清空 dirty input。
- 提交失败后，尽量聚焦第一个 invalid field。

示例：

```text
Name is required -> 字段 inline error
Start date 晚于 end date -> 日期范围附近 group error
服务端返回 email 已存在 -> email field error
未知保存失败 -> form-level error + 可选 toast
```

### 操作和乐观更新错误

规则：

- 单个操作失败通常使用 toast。
- 如果已经执行乐观 UI，失败后需要 rollback 或标记该项失败。
- 行级操作失败不应该替换整个 table。
- 行 mutation 失败可以展示 row-level error、恢复 action button，并展示 toast。
- 危险操作失败时，要明确说明该操作没有完成。
- mutation retry 必须明确；不要在用户无感知的情况下静默重试危险操作。

示例：

```text
Delete row 失败 -> row 保留 + toast "Delete failed"
Toggle switch 失败 -> switch 回滚 + toast 或 row inline error
Rename inline 失败 -> 保持编辑态 + inline error
```

### 权限、Forbidden 和 Not Found 错误

规则：

- 页面级无访问权限使用 forbidden StateView。
- 操作级无权限使用 disabled action + tooltip。
- 资源不存在使用 not-found StateView，适当提供 Go back。
- 不要用 generic empty 表示 forbidden/not-found。
- 如果后端刻意用 not-found 掩盖 forbidden，不要暴露敏感资源存在性。
- 权限文案要平静具体，但不要过度暴露策略内部细节。

### Offline 和网络错误

规则：

- 如果没有内容可加载，展示 error/offline StateView + Retry。
- 如果旧内容存在，保留旧内容，并展示 offline/connection toast 或 banner。
- 重新连接成功可以使用轻量 toast 或静默刷新。
- 网络持续断开时，不要重复刷屏 offline toast。
- 禁用无法离线执行的操作，或说明不可用原因。

---

## 6. Toast 边界

Toast 是短暂反馈，StateView 是内容替代。

Toast 用于：

- 创建/更新/删除成功。
- 刷新失败但旧数据仍然可见。
- 后台同步结果。
- 非阻塞警告。
- copied/export started/import started。
- 内容仍可用时的单行/单操作失败。
- 旧内容仍可用时的刷新失败。
- 页面内容仍可用时的 offline/reconnected 状态。

以下场景不能只用 toast：

- 首次加载失败。
- 页面没有可用内容。
- 字段校验错误。
- 缺少必要配置。
- 没有权限访问当前页面。
- 表单提交校验错误。
- 弹窗内容加载失败。
- 资源页面 not-found。

规则：

- 如果用户需要恢复动作才能看到内容，使用 StateView。
- 如果内容仍然可用且消息是短暂的，使用 toast。
- 如果用户能修复某个字段，使用 inline error。
- 如果错误属于某个具体区域，优先使用局部 inline/StateView，而不是全局 toast。
- Toast 不应该成为关键恢复动作的唯一入口。

### Toast 严重程度

| Toast 类型 | 使用场景 |
|---|---|
| success | create/update/delete/copy/export start 完成 |
| error | 内容仍可用时的非阻塞操作失败 |
| warning | 部分成功、降级状态、非阻塞风险 |
| info | 后台任务开始、同步已排队、连接已恢复 |

规则：

- Success toast 简短确认完成。
- Error toast 说明失败的动作。
- Warning toast 简短说明影响。
- Info toast 不打断当前工作流。
- 避免为同一个重复失败堆叠多个 toast。
- 短时间内重复的相同错误需要去重。

### Toast 操作

规则：

- Toast 最多包含一个轻量操作。
- 有真实目标页时，使用 View task/View details。
- Retry 只用于安全的幂等操作。
- 不要在 toast 中承载复杂表单或确认。
- 不要把 toast action 作为页面级失败的唯一恢复路径。

示例：

```text
Refresh failed，旧 rows 仍可见 -> error toast: Retry
Import started -> info toast: View task
Copy succeeded -> success toast，无 action
Delete failed -> error toast，row 仍可见
```

### Toast 位置与持续时间

规则：

- 桌面端默认右下角，除非产品布局占用了这个区域。
- 只有右下角和持久面板冲突时，才使用左下角。
- 全局连接/会话状态可以少量使用顶部居中。
- 移动端 toast 靠近底部，但不能遮挡主要操作。
- Success/info toast 可以更短。
- Error/warning toast 应停留更久。
- 持续存在的关键问题应升级为 banner/StateView，而不是长时间 toast。

推荐持续时间：

```text
Success/info: 2-4s
Warning/error: 4-6s
Actionable toast: 6-8s 或按产品策略停留到用户关闭
```

---

## 7. 操作按钮策略

StateView 操作必须匹配恢复路径。

常见操作：

- Retry
- Refresh
- Clear filters
- Clear search
- Create
- Import
- Configure
- Connect integration
- Go back
- Contact admin
- View docs
- View task
- View details

规则：

- 最多展示两个可见操作。
- 主操作是最直接的恢复路径。
- 次操作可选，重要性更低。
- 不展示用户不能执行的操作。
- disabled action 必须解释原因；如果没有价值，直接隐藏。
- 除非状态本身和危险恢复流程有关，否则 StateView 不放危险操作。
- 页面级 StateView 可以包含 `Go back`。
- 列表 filter-empty 优先展示 `Clear filters`。
- 初始 empty 只有用户有 create 权限时，才优先展示 `Create`。
- 权限状态只有在系统支持时，才展示 `Contact admin`。
- 不展示无法真正解决或推进当前状态的主操作。
- 不使用 `OK`、`Submit` 这类泛化操作文案。
- 操作文案应使用动词，必要时说明目标对象。
- 操作应尽量保留当前上下文：query、filters、parent id、dialog state。
- 如果操作打开路由，使用真实 navigation/link 行为。
- 如果操作重试数据请求，必须用相同参数重试失败请求。
- 如果没有有价值的操作，可以不展示 action。

### 按状态选择操作优先级

| State | 主操作 | 次操作 |
|---|---|---|
| first load error | Retry | Go back / View details |
| list load error | Retry | Refresh |
| refresh error with old data | StateView 中无 | toast Retry，如果安全 |
| initial empty | Create / Import | View docs |
| filter-empty | Clear filters | Refresh |
| search-empty | Clear search | Clear filters |
| config-empty | Configure | View docs |
| integration-empty | Connect integration | View docs |
| async-pending empty | View task / Refresh | View details |
| permission-empty | Contact admin | View docs |
| forbidden page | Go back | Contact admin |
| not-found detail | Go back to list | Refresh |
| offline with no data | Retry | 无 |
| local section empty | Add/Create，可选 | 无 |

规则：

- 表格是默认策略；只有存在更清晰恢复路径时，产品上下文才可以覆盖。
- `Retry` 只作为失败请求的主操作。
- `Refresh` 只在状态可能因外部变化而改变时作为主操作。
- 查询条件导致无结果时，`Clear filters/search` 是主操作。
- `Create` 只用于真正的初始空状态，并且用户必须有创建权限。
- 数据必须先 setup 才能存在时，`Configure`/`Connect` 是主操作。
- 没有直接恢复路径的 not-found/forbidden，`Go back` 是主操作。
- 数据缺失原因是异步处理时，`View task` 是主操作。

### 权限规则

规则：

- 权限决定 action 是展示、隐藏还是禁用。
- 当前角色永远不能执行的 action，隐藏。
- 只有用户可能因状态变化变得可执行时，才 disabled，并说明原因。
- 没有权限时，不展示 `Create`、`Import`、`Configure`、`Connect`。
- `Contact admin` 只有在产品存在真实管理员/联系/申请权限流程时才展示。
- 如果存在申请权限流程，文案要具体：`Request access`、`Contact admin`、`Ask owner`。
- 不要把 disabled primary action 当作主要恢复路径。

示例：

```text
Initial empty + canCreate -> Create project
Initial empty + cannotCreate + hasAdminFlow -> Contact admin
Initial empty + cannotCreate + noAdminFlow -> no action
Config empty + cannotConfigure -> View docs or no action
```

### Retry 与 Refresh 操作

规则：

- `Retry` 重新执行产生 StateView 的失败请求。
- `Retry` 应保留当前 route、query、filters、pagination 和 parent resource。
- `Retry` 应在 action 自身展示 loading/pending。
- `Retry` 应用于幂等或安全的读请求。
- Mutation retry 必须明确，且只在安全时展示。
- `Refresh` 用于当前状态可能因外部变化而改变的场景。
- 不要用 `Refresh` 恢复校验错误。

示例：

```text
List load failed -> Retry same list query
Sync still running -> Refresh
Form validation failed -> no Retry; fix fields
```

### Clear filters 与 search 操作

规则：

- `Clear filters` 清除导致 filter-empty 的所有 active filters。
- `Clear search` 只清除关键词。
- 搜索和筛选都激活时，选择能移除最小有效阻塞的操作。
- 保持用户在同一个 page/list route。
- Pagination 重置到第一页。
- 查询条件变化时清空 selection。
- 保留无关的 view mode 或 route tab，除非它已经无效。

示例：

```text
status=failed -> Clear filters
keyword="invoice" -> Clear search
keyword + status filter -> Clear search or Clear filters, based on product default
```

### Create、Import、Configure、Connect

规则：

- `Create` 打开缺失对象的标准创建流程。
- `Import` 只有在批量导入是预期起点时才作为主操作。
- `Configure` 打开必要 setup 页面，不打开泛化 settings 页面。
- `Connect integration` 打开 integration connection flow。
- 这些操作完成后，应在合适时返回或刷新原上下文。
- 必要 setup 缺失时，不展示下游 create 操作。
- 如果操作打开弹窗，遵循 Dialog rules。
- 如果 setup 很长或需要分享/恢复，使用路由页面。

示例：

```text
No projects yet -> Create project
No users yet in enterprise import flow -> Import users
Billing not configured -> Configure billing
GitHub not connected -> Connect GitHub
```

### Go back 与导航操作

规则：

- `Go back` 适用于 not-found、forbidden、资源已删除或过期 deep link。
- 目标明确时，使用更具体文案：`Go back to users`、`Back to projects`。
- 已知规范列表页时，不要只依赖浏览器 history back。
- 导航操作不能在没有确认的情况下丢弃未保存输入。
- 页面级 StateView 可以展示导航操作；区块级 StateView 通常不展示。

### View details、docs 与 task 操作

规则：

- `View details` 用于技术/支持详情、导入失败行、任务错误报告。
- `View docs` 是次操作，只有文档能帮助用户恢复时才展示。
- `View task` 打开任务/导入/同步进度页或抽屉。
- 有直接产品操作时，不要把 docs 作为主恢复路径。
- 如果 `View details` 只暴露内部原始错误，不要展示。

### 操作数量与布局

规则：

- 0 个操作：适用于只读局部 empty 或没有流程的权限状态。
- 1 个操作：大多数 StateView 的默认选择。
- 2 个操作：允许，但必须有一个清晰主操作和一个有价值次操作。
- 超过 2 个操作：额外内容放到 secondary help、docs，或确实必要时放入 menu。
- 主操作使用 primary button。
- 次操作根据视觉权重使用 secondary/ghost/link。
- 不要使用两个 primary buttons。

按钮顺序：

- 桌面端：次操作在左，主操作在右。
- 移动端：宽度不足时纵向排列，主操作优先或视觉更强。
- 居中 StateView 中，actions 放在 description 下方成组展示。
- Dialog StateView 中，如果是弹窗级操作，actions 可以放在 footer。
- Table/list body StateView 中，actions 留在 empty/error body 内，除非它们是全局列表操作。

示例：

```text
首次加载失败：Retry
筛选无结果：Clear filters
初始空且有权限：Create project
初始空但无权限：无主操作或 Contact admin
详情页 not found：Go back to list
同步等待中：View task + Refresh
缺少配置：Configure billing + View docs
```

---

## 8. 内容结构

StateView 使用统一结构。

```text
Icon / Illustration
Title
Description
Actions
Secondary help
```

规则：

- Icon 可选，但建议用于快速识别。
- 2B 产品通常使用简单 icon，不使用大型装饰插画。
- Title 短且具体。
- Description 解释原因或下一步。
- Description 不要责备用户。
- Actions 使用具体动词。
- Secondary help 可在有帮助时链接文档或管理员联系入口。

长度：

- Title：一个短句或短语。
- Description：通常 1-2 行。
- Actions：0-2 个可见操作。

---

## 9. 位置与布局

位置取决于作用范围。

| 范围 | 位置 |
|---|---|
| 页面级 | 内容区居中或略偏上 |
| list/table | list body 中间；有价值时保留 header/filter |
| card list | grid 区域中间 |
| dialog | dialog body 中间；header 保持可见 |
| field/options | dropdown 内或字段下方 |
| sidebar/小面板 | 紧凑 inline state |

规则：

- 页面 StateView 不应覆盖全局导航。
- Table empty 通常保留 table header。
- Filter empty 应保留 FilterBar 和 active filter chips。
- Dialog StateView 不应移除必须存在的 dialog header。
- 密集型 2B 页面避免过大的 empty 插画。
- 移动端 StateView 使用更短文案和纵向 actions。

---

## 10. 禁止项

不要：

- 对所有原因使用同一个 generic empty。
- 刷新失败但旧数据仍有效时清空旧数据。
- 对字段级失败展示整页错误。
- 只用 toast 展示校验错误。
- 隐藏用户恢复所需的控件。
- 向无权限用户展示 create/configure 操作。
- 在密集控制台页面使用大型营销风空状态插画。
- 展示会导致布局跳动的 loading 状态。

---

## 11. 数据契约

StateView 应由明确的数据状态驱动。

推荐状态：

```ts
type DataStatus =
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'success'
  | 'empty'
  | 'filter-empty'
  | 'search-empty'
  | 'error'
  | 'forbidden'
  | 'not-found'
  | 'offline';
```

规则：

- `loading` 表示还没有可用数据。
- `refreshing` 表示旧数据存在且继续展示。
- `empty` 表示请求成功但没有数据。
- `filter-empty` 表示筛选/搜索导致无结果。
- `error` 应包含是否可重试和错误信息。
- `forbidden` 不能和 empty 混淆。
- `not-found` 用于资源不存在或已删除。
- Retry handler 应显式传入。

示例：

```ts
type StateViewModel = {
  status: DataStatus;
  title?: string;
  description?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  retry?: () => void;
};
```

---

## 12. AI 审查清单

接受 AI 生成的状态代码前，检查：

- StateView 是否只在正常内容无法渲染时使用。
- Loading 是否区分首次加载和刷新。
- Refresh 是否尽量保留旧数据。
- Refresh 失败时，是否没有把仍可用的旧数据替换成 error/empty。
- Button pending 是否防止重复操作。
- Loading 是否只阻塞不安全或冲突的交互。
- 快速请求是否避免 loading 闪烁。
- Skeleton 是否匹配最终布局且不造成布局跳动。
- Table/card/form/dialog skeleton 是否匹配各自最终布局。
- 无限滚动是否使用底部 loading，而不是替换整份列表。
- Empty 原因是否具体：初始、筛选、搜索、配置、集成、权限、局部、异步等待。
- Empty 判断顺序是否没有把 error/forbidden/setup/filter/search 误判成 initial empty。
- 筛选/搜索空状态是否提供恢复动作。
- 筛选/搜索空状态是否保留 FilterBar、active chips 和 query 上下文。
- 初始空状态是否只在用户有权限时展示 create/import/connect。
- 配置/集成空状态是否说明缺少的 setup，并且不过早展示下游 create 操作。
- 权限空状态是否没有暗示数据不存在。
- 局部空状态是否保持紧凑，并保留父级上下文。
- Error 状态是否在可用时保留旧数据。
- Error UI 是否限制在失败区域：页面、列表、区块、弹窗、表单、字段或操作。
- 首次加载/列表加载失败是否使用 StateView，而不是只用 toast。
- 刷新/分页/操作失败时，是否尽量保留可用旧内容。
- 首次加载失败是否有 Retry。
- 表单校验错误是否 inline 展示，而不是只用 toast。
- 服务端字段错误是否尽量映射回字段。
- 表单级提交错误是否保留 dirty input，并显示在提交区域附近。
- 操作/乐观更新失败是否 rollback 或恢复局部状态。
- Toast 是否只用于短暂反馈。
- 重复的相同错误 toast 是否去重。
- Toast action 是否轻量，并且不是页面级失败的唯一恢复路径。
- Toast 位置/持续时间是否符合严重程度，且不遮挡移动端主操作。
- Actions 是否限制在 0-2 个，并符合用户权限。
- 主操作是否能直接解决或推进当前状态。
- StateView 是否没有展示用户不能执行的操作。
- Retry 是否用相同 route/query/filter/page 上下文重试失败请求。
- Clear filters/search 是否正确重置 query state，并在需要时清空 selection/page。
- Create/import/configure/connect 是否只出现在正确的 empty/setup 状态中。
- Go back 是否在可用时使用规范目标页，而不是只依赖浏览器 history。
- View docs/details/task 是否作为次操作，除非它们就是最清晰的恢复路径。
- 是否没有在一个 StateView 中使用两个 primary buttons。
- 页面/列表/弹窗/字段作用范围是否没有混用。
- Table empty 是否在有价值时保留 header/filter。
- 权限和 not-found 状态是否没有被误标成 generic empty。
- 移动端是否使用更短文案，并在需要时纵向排列操作。
