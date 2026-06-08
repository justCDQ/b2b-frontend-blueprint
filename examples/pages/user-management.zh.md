# 用户管理页面 Demo

## 页面目标

用户管理是 2B 控制台模板中的第一个标准 CRUD 页面。

它用于展示一个典型企业级列表页如何组合以下模块：

- PageHeader
- FilterBar
- Table
- 行操作
- 批量操作
- 表单弹窗
- ConfirmDialog
- 权限禁用
- loading、empty、error、pending、success 状态

这个页面应该是一个真实的运营控制台页面，而不是营销页，也不是单纯的组件展示页。

## 使用场景

管理员通过该页面管理组织中的用户。

常见任务包括：

- 搜索用户。
- 按角色、状态、团队、创建时间筛选用户。
- 查看用户详情。
- 创建用户。
- 编辑用户资料和角色。
- 启用或禁用用户。
- 重置用户密码。
- 删除用户。
- 选择多个用户并执行批量操作。
- 导出选中用户或当前筛选结果。

## 相关规则

生成或审查该页面时，需要参考：

- [AI 规则总入口](../../component-rules/_ai-bundles/all-ai-rules.zh.md)
- [List CRUD AI Bundle](../../component-rules/_ai-bundles/list-crud-ai-bundle.md)
- [列表页 AI 规则](../../component-rules/list-page/list-page-ai-rules.zh.md)
- [筛选栏 AI 规则](../../component-rules/filter-bar/filter-bar-ai-rules.zh.md)
- [表格 AI 规则](../../component-rules/table/table-ai-rules.zh.md)
- [操作系统 AI 规则](../../component-rules/action-system/action-system-ai-rules.zh.md)
- [表单 AI 规则](../../component-rules/form/form-ai-rules.zh.md)
- [弹窗 AI 规则](../../component-rules/dialog/dialog-ai-rules.zh.md)
- [状态标签 AI 规则](../../component-rules/status-badge/status-badge-ai-rules.zh.md)
- [StateView AI 规则](../../component-rules/state-view/state-view-ai-rules.zh.md)
- [Toast AI 规则](../../component-rules/feedback-toast/feedback-toast-ai-rules.zh.md)

## 用户角色

Demo 中使用以下角色：

| 角色 | 说明 |
|---|---|
| `owner` | 拥有用户管理的全部权限。 |
| `admin` | 可以创建、编辑、启用、禁用、重置密码和导出用户，但不能删除 owner。 |
| `operator` | 可以查看和导出用户，不能创建、编辑、禁用、重置密码或删除。 |
| `viewer` | 只能查看用户。 |

## 权限矩阵

| 操作 | owner | admin | operator | viewer |
|---|---:|---:|---:|---:|
| 查看列表 | 是 | 是 | 是 | 是 |
| 查看详情 | 是 | 是 | 是 | 是 |
| 创建用户 | 是 | 是 | 否 | 否 |
| 编辑用户 | 是 | 是 | 否 | 否 |
| 启用用户 | 是 | 是 | 否 | 否 |
| 禁用用户 | 是 | 是 | 否 | 否 |
| 重置密码 | 是 | 是 | 否 | 否 |
| 导出用户 | 是 | 是 | 是 | 否 |
| 删除用户 | 是 | 有限制 | 否 | 否 |

规则：

- 重要操作即使没有权限，也应该保留禁用态，让用户知道该能力存在。
- 权限导致的禁用操作必须通过 tooltip 或说明文本解释原因。
- 如果某个操作对当前角色完全无意义，且展示只会制造噪音，可以隐藏。
- `admin` 不能删除 `owner` 用户。
- 当前登录用户不能在列表中禁用或删除自己的账号。

## 页面结构

页面结构如下：

```text
PageShell
└── PageHeader
    ├── 标题：用户
    ├── 描述：管理组织成员、角色和访问状态
    └── 操作
        ├── 刷新
        ├── 导出
        └── 新建用户

Content
├── FilterBar
├── BatchActionBar
└── Table
    ├── 多选列
    ├── 数据列
    └── 操作列
```

不要在整个表格区域外再套一层装饰性卡片。列表区域应该紧凑、清晰、可扫描。

## PageHeader

标题：

```text
用户
```

描述：

```text
管理组织成员、角色和访问状态
```

操作：

| 操作 | 类型 | 作用域 | 规则 |
|---|---|---|---|
| 刷新 | 图标按钮 | 页面 | 必须存在。页面正在刷新时进入 pending。 |
| 导出 | 次级按钮 | 当前筛选结果 | 无导出权限时禁用。 |
| 新建用户 | 主按钮 | 页面 | 打开新建用户弹窗。无新建权限时禁用。 |

刷新规则：

- 刷新保留当前筛选、排序、分页和 URL query。
- 除非返回的数据身份发生变化，否则刷新不应直接清空已选行。
- 刷新按钮进入 pending 状态，防止重复点击。

## FilterBar

默认露出的高频筛选项：

| 筛选项 | 类型 | 行为 |
|---|---|---|
| 关键词 | 搜索输入框 | 防抖请求。搜索姓名、邮箱、手机号。 |
| 角色 | select | 选择后立即请求。 |
| 状态 | select | 选择后立即请求。 |
| 创建时间 | 日期范围 | 完成范围选择后请求。 |

默认收起的高级筛选项：

| 筛选项 | 类型 | 行为 |
|---|---|---|
| 团队 | select 或 tree select | 选择后请求。 |
| 最近活跃时间 | 日期范围 | 完成范围选择后请求。 |
| 是否开启 MFA | segmented control 或 radio | 选择后请求。 |
| 邀请来源 | select | 选择后请求。 |

FilterBar 操作规则：

- 刷新按钮必须存在。
- 当筛选条件与默认值不一致时，显示重置。
- 存在高级筛选项时，显示展开/收起入口。
- 批量操作不放在 FilterBar 中，而是放在 BatchActionBar 中。
- 关键词输入使用 debounce。
- select 和状态类筛选选择后立即请求。
- 多选筛选在用户点击确认后请求。
- 修改筛选条件后，`pageNum` 重置为 `1`。
- 修改筛选条件后，需要清空或协调已选行。
- 查询状态必须能从 URL 恢复。

## Table 列设计

该页面默认使用 table，而不是卡片列表。

列设计：

| 列 | 内容 | 说明 |
|---|---|---|
| 多选 | checkbox | 不可选择的行禁用 checkbox。 |
| 用户 | 头像、姓名、邮箱 | 姓名为主信息，邮箱为次信息。 |
| 角色 | Tag | 角色文案默认不换行。 |
| 状态 | StatusBadge | Active、Invited、Disabled、Locked。 |
| 团队 | 文本或链接 | 为空时显示统一占位符。 |
| MFA | StatusBadge 或文本 | Enabled、Disabled。 |
| 最近活跃 | 日期时间 | 相对时间或绝对时间需要统一。 |
| 创建时间 | 日期时间 | 可排序。 |
| 操作 | 图标按钮 + More 菜单 | 横向滚动时操作列建议 sticky right。 |

表格规则：

- 表头、内容字体、间距、边框、hover 状态遵循 table rules。
- 行高保持紧凑，但不能影响阅读。
- badge、链接、次级文本等富内容需要保持对齐。
- 长文本需要截断，并在需要时通过 tooltip 展示完整内容。
- 空值使用统一占位符。
- 只有当行点击可以进入详情时，hover 才应该明显表达可点击。

## 行点击与详情

只有当该行有有意义的详情内容时，点击行才进入详情。

该 demo 中：

- MVP 阶段可以先用 Drawer 展示用户详情。
- 后续完整 demo app 如果包含审计日志、登录会话、权限配置、安全设置等复杂内容，则应该升级为带路由的详情页。

点击以下元素时，不得触发行详情：

- 多选 checkbox。
- 行操作按钮。
- More 菜单。
- 单元格中的链接。
- switch 或内联编辑控件。

## 行操作

最多暴露三个常用操作按钮：

| 操作 | 位置 | 行为 |
|---|---|---|
| 编辑 | 可见图标按钮 | 打开编辑用户弹窗。 |
| 重置密码 | 可见图标按钮 | 打开重置密码 ConfirmDialog。 |
| More | 可见图标按钮 | 打开下拉菜单。 |

低频操作放进 More：

- 查看详情。
- 启用。
- 禁用。
- 删除。
- 复制用户 ID。

操作规则：

- 每个图标按钮都必须有 tooltip。
- 图标语义必须清晰，且不要和已有操作产生歧义。
- 下拉菜单项由图标和文字组成，间距为 8px。
- 危险操作的图标和文字都使用 danger 颜色。
- 因权限或状态不可用的菜单项保持可见禁用态。
- 禁用菜单项需要通过 tooltip 或菜单说明解释原因。
- 行级 mutation 操作进入行级 pending 状态。
- pending 状态必须防止重复点击。

## BatchActionBar

当至少选中一行时，显示 BatchActionBar。

内容：

```text
已选 {n} 项
启用
禁用
导出
删除
清空选择
```

规则：

- 批量操作只作用于选中的 row id。
- 批量操作必须校验选中行是否都可执行。
- 如果部分行不可执行，可以禁用该操作并解释原因，也可以在确认时列出将被跳过的行。
- 批量危险操作必须使用 ConfirmDialog。
- 批量 pending 状态会禁用相关操作并防止重复点击。
- 批量成功后，需要协调表格数据和已选行。
- 批量失败时，展示局部错误，并尽可能保留可恢复的选择状态。

## 弹窗

### 新建用户弹窗

使用 Dialog。

推荐尺寸：

- 基础账号创建使用 `m`。
- 如果包含角色、团队、邀请、高级安全选项，使用 `l`。

字段：

| 字段 | 类型 | 规则 |
|---|---|---|
| 姓名 | input | 必填。 |
| 邮箱 | input | 必填，校验邮箱格式。 |
| 手机号 | input | 选填，填写时校验格式。 |
| 角色 | select | 必填。 |
| 团队 | select 或 tree select | 根据产品设置决定是否必填。 |
| 发送邀请邮件 | switch | 默认开启。 |
| 备注 | textarea | 选填，有最大长度。 |

提交规则：

- 提交前校验。
- 提交按钮进入 pending 状态。
- 防止重复提交。
- 成功后关闭弹窗，刷新列表，并展示成功 toast。
- 校验错误展示在字段附近。
- 服务端错误展示为表单级错误，并保留已填写内容。

### 编辑用户弹窗

使用 Dialog。

规则：

- 编辑前加载当前用户数据。
- 数据加载时，在弹窗内容区域展示 loading。
- 如果表单内容滚动，header 和 footer 保持可见。
- 当前操作者无权限修改角色时，角色字段禁用并说明原因。
- 只有存在未保存修改时，关闭前才需要确认。

### 重置密码 ConfirmDialog

使用 ConfirmDialog。

标题示例：

```text
重置密码？
```

描述示例：

```text
确认重置“小明”的密码吗？该用户需要使用新的临时密码重新登录。
```

规则：

- 必须写清楚目标用户。
- 必须说明操作后果。
- 确认按钮进入 pending 状态。
- 只有在产品支持安全展示临时密码时，成功后才展示新临时密码。

### 删除用户 ConfirmDialog

无论从行操作还是批量操作触发删除，都使用 ConfirmDialog。

标题示例：

```text
删除用户？
```

单个删除描述：

```text
确认删除“小明”吗？删除后不可撤回。
```

批量删除描述：

```text
确认删除已选中的 8 个用户吗？删除后不可撤回。
```

规则：

- 不要使用 `确认删除？` 这种过于模糊的文案。
- 必须写清楚目标用户或选中数量。
- 必须说明删除后不可撤回。
- 删除按钮使用 danger 样式。
- 确认按钮进入 pending 状态。

## 数据契约

### 查询参数

查询状态需要能从 URL 恢复：

```ts
type UserListQuery = {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  role?: "owner" | "admin" | "operator" | "viewer";
  status?: "active" | "invited" | "disabled" | "locked";
  teamId?: string;
  createdFrom?: string;
  createdTo?: string;
  lastActiveFrom?: string;
  lastActiveTo?: string;
  mfaEnabled?: boolean;
  sortBy?: "createdAt" | "lastActiveAt" | "name";
  sortOrder?: "asc" | "desc";
};
```

### 返回数据

默认使用传统分页：

```ts
type UserListResponse = {
  list: UserRow[];
  pageNum: number;
  pageSize: number;
  total: number;
};
```

用户行数据：

```ts
type UserRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "owner" | "admin" | "operator" | "viewer";
  status: "active" | "invited" | "disabled" | "locked";
  team?: {
    id: string;
    name: string;
  };
  mfaEnabled: boolean;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
  permissions: {
    canViewDetail: boolean;
    canEdit: boolean;
    canEnable: boolean;
    canDisable: boolean;
    canResetPassword: boolean;
    canDelete: boolean;
    canSelect: boolean;
  };
  disabledReasons?: Partial<Record<
    "select" | "edit" | "enable" | "disable" | "resetPassword" | "delete",
    string
  >>;
};
```

规则：

- 行级权限来自后端数据，或者来自稳定的权限契约。
- UI 不能只从视觉状态推断敏感权限。
- 禁用原因需要能被操作控件读取并展示。
- 选择行使用稳定的 `id`，不能使用 row index。

## 分页

默认策略：

- 使用传统分页，参数为 `pageNum`、`pageSize`，返回 `total`。
- 默认 `pageSize` 可以为 `20`。
- 可选 `pageSize` 可以包含 `20`、`50`、`100`。

规则：

- 筛选变化重置到第 1 页。
- 排序变化默认重置到第 1 页，除非产品明确要求保留当前页。
- 刷新时保留当前页，但当前页仍需有效。
- 删除后如果当前页不存在，跳转到最近的有效页。
- 当单页 50 行以上且渲染有压力时，可以使用虚拟滚动。

## 请求竞态与刷新优先级

规则：

- 每个列表请求都需要有请求身份。
- 只有最新请求可以更新表格数据。
- 筛选、搜索、排序、分页变化需要取消或忽略旧请求。
- 手动刷新优先级高于旧的自动请求。
- mutation 成功后，需要刷新受影响数据，或者稳定地 patch 受影响行。
- 旧请求不能覆盖新的 mutation 结果。

推荐优先级：

1. mutation 结果。
2. mutation 后的手动刷新。
3. 用户主动触发的查询变化。
4. 后台刷新。

## 状态处理

### 页面初始 loading

使用表格区域或页面区块 loading。

规则：

- PageHeader 保持可见。
- FilterBar 尽可能保持可见。
- 表格区域展示 skeleton 或 loading rows。

### Empty

不同原因使用不同文案。

暂无数据：

```text
暂无用户
```

无筛选结果：

```text
没有符合当前筛选条件的用户
```

规则：

- 因筛选导致 empty 时，提供重置筛选操作。
- 因暂无数据导致 empty 时，如果有权限，可以提供新建用户操作。
- Empty 状态展示在表格或列表区域，不替换整个页面 shell。

### Error

使用表格区域内的 StateView。

规则：

- 提供重试。
- FilterBar 保持可见。
- 阻塞型获取失败不能只用 toast 表达。
- Toast 可以用于重试成功或 mutation 成功后的短反馈。

### Pending

使用最小有意义作用域：

- 刷新 pending：刷新按钮。
- 行级 mutation pending：目标行操作。
- 批量 mutation pending：BatchActionBar。
- 弹窗提交 pending：提交按钮和表单 busy 状态。

### Disabled

禁用场景：

- 某行不能被选择。
- 操作因权限不可用。
- 操作因当前用户状态不可用。
- 操作正在 pending。
- 操作会影响当前登录用户，存在安全风险。

规则：

- 权限导致的禁用必须说明原因。
- pending 操作需要展示 loading 或稳定的 pending 状态。
- disabled 控件样式需要和 table 与 action system 保持一致。

## StatusBadge 与 Tag

状态：

| 状态 | 语义 | 点击行为 |
|---|---|---|
| Active | success | 默认不可点击。 |
| Invited | neutral 或 warning | 可按需查看邀请状态详情。 |
| Disabled | neutral 或 warning | 可按需查看禁用原因。 |
| Locked | error | 当存在锁定原因时可点击查看详情。 |

规则：

- 状态文案应该短，默认不换行。
- 状态文案或原因过长时使用 tooltip。
- error 状态如果原因重要，可以点击打开弹窗查看详情。
- Badge 颜色需要同时适配浅色和深色模式。

## 响应式策略

桌面端：

- 使用完整 table。
- 横向滚动时，操作列保持可见或 sticky。
- 筛选项较多时，FilterBar 默认折叠。

平板端：

- 如果核心列仍然可读，继续使用 table。
- 允许 table 横向滚动。
- 可见筛选项减少到关键词、状态、角色。
- 低优先级页面操作可以收进 More 菜单。

移动端：

- 当 table 不可用时，可以切换为简化列表或卡片列表。
- 切换布局时保留查询状态。
- 新建和编辑如果不适合普通弹窗，使用底部抽屉。
- 主操作需要保持可触达。
- 不要因为视口变化而重置筛选、分页或选中状态。

## 可访问性

规则：

- 只有图标的操作必须有可访问名称。
- tooltip 不能作为唯一可访问标签。
- 行选择 checkbox 需要有和当前行相关的 label。
- ConfirmDialog 需要焦点陷阱，关闭后焦点回到触发元素。
- 禁用原因需要对键盘用户可达。
- 表头需要暴露排序状态。
- 批量选择数量需要可见，必要时可被读屏读取。

## AI 生成要求

生成该页面时，AI 必须：

- 使用 2B 控制台布局。
- 使用 table 作为主要列表形态。
- 包含 PageHeader、FilterBar、BatchActionBar、Table、Dialog、ConfirmDialog、StateView、Toast、StatusBadge、Tooltip。
- 包含可从 URL 恢复的查询状态。
- 包含请求竞态处理。
- 包含行级权限和禁用原因。
- 包含 loading、empty、error、pending、disabled、selected 状态。
- 包含危险操作二次确认。
- 防止 mutation 操作重复触发。
- 不要生成营销页 hero 布局。
- 不要用 toast 作为阻塞错误的唯一表达。
- 不要把权限行为藏在实现细节中。

## 验收标准

该页面满足以下条件时，视为合格：

- 用户能通过 PageHeader 理解页面用途。
- 高频筛选项默认可见，高级筛选项默认折叠。
- 表格列紧凑、对齐、可读。
- 行操作最多暴露三个可见操作按钮。
- More 菜单承载溢出操作，并包含图标和文字。
- 危险操作使用 ConfirmDialog，并写清楚目标和后果。
- 批量操作只在选中行后出现。
- 选中状态在筛选、分页、刷新、mutation 后表现正确。
- 禁用操作解释权限或状态原因。
- loading、empty、error、pending、success 状态完整且作用域正确。
- URL query 可以恢复列表状态。
- 页面在桌面端、平板端、移动端都可用。
