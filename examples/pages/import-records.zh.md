# 导入任务页面 Demo

## 页面目标

导入任务页面用于展示 2B 控制台中的异步任务型页面。

它和普通 CRUD 列表不同，核心不是直接编辑某条数据，而是围绕一个长流程任务进行：

- 上传文件。
- 字段映射。
- 数据校验。
- 确认导入。
- 查看任务进度。
- 处理失败结果。
- 追踪操作记录。

该页面的目标是沉淀“上传/导入/异步处理/失败恢复”这一类高频 2B 场景的页面组合方式。

## 使用场景

运营人员或管理员批量导入客户数据、用户数据、商品数据或配置数据。

常见任务包括：

- 下载导入模板。
- 上传导入文件。
- 预览文件内容。
- 映射字段。
- 校验数据。
- 确认导入。
- 查看导入任务进度。
- 下载失败明细。
- 重新导入失败数据。
- 取消未完成任务。
- 查看导入操作日志。

## 相关规则

生成或审查该页面时，需要参考：

- [AI 规则总入口](../../component-rules/_ai-bundles/all-ai-rules.zh.md)
- [Import Workflow AI Bundle](../../component-rules/_ai-bundles/import-workflow-ai-bundle.md)
- [上传导入 AI 规则](../../component-rules/upload-import-workflow/upload-import-workflow-ai-rules.zh.md)
- [Wizard / Stepper AI 规则](../../component-rules/wizard-stepper/wizard-stepper-ai-rules.zh.md)
- [表格 AI 规则](../../component-rules/table/table-ai-rules.zh.md)
- [StateView AI 规则](../../component-rules/state-view/state-view-ai-rules.zh.md)
- [Toast AI 规则](../../component-rules/feedback-toast/feedback-toast-ai-rules.zh.md)
- [Timeline / Activity Log AI 规则](../../component-rules/timeline-activity-log/timeline-activity-log-ai-rules.zh.md)
- [弹窗 AI 规则](../../component-rules/dialog/dialog-ai-rules.zh.md)
- [操作系统 AI 规则](../../component-rules/action-system/action-system-ai-rules.zh.md)

## 页面边界

导入任务页面由两个部分组成：

1. **导入入口与导入流程**：用于创建新的导入任务。
2. **导入任务列表**：用于查看历史任务、当前任务进度和失败处理。

不要把完整导入流程压缩成一个简单上传按钮。只要存在字段映射、数据校验、失败明细或异步处理，就应该设计成完整流程。

## 用户角色

Demo 中使用以下角色：

| 角色 | 说明 |
|---|---|
| `owner` | 拥有全部导入、取消、下载和查看权限。 |
| `admin` | 可以导入、取消自己创建的任务、下载错误文件、查看全部任务。 |
| `operator` | 可以导入和查看自己创建的任务。 |
| `viewer` | 只能查看任务列表，不能创建导入任务。 |

## 权限矩阵

| 操作 | owner | admin | operator | viewer |
|---|---:|---:|---:|---:|
| 查看任务列表 | 是 | 是 | 是 | 是 |
| 下载模板 | 是 | 是 | 是 | 否 |
| 创建导入任务 | 是 | 是 | 是 | 否 |
| 取消任务 | 是 | 有限制 | 有限制 | 否 |
| 下载失败明细 | 是 | 是 | 仅自己的任务 | 否 |
| 重新导入失败数据 | 是 | 是 | 仅自己的任务 | 否 |
| 查看操作日志 | 是 | 是 | 仅自己的任务 | 是 |

规则：

- 无权限操作保持禁用态，并说明原因。
- 取消任务只对 `pending`、`validating`、`importing` 状态有效。
- 已完成、已失败、已取消的任务不能再次取消。
- 下载失败明细只有在 `failedCount > 0` 时可用。
- 重新导入失败数据只有在存在失败明细且用户有导入权限时可用。

## 页面结构

页面结构如下：

```text
PageShell
└── PageHeader
    ├── 标题：导入任务
    ├── 描述：上传文件、校验数据，并追踪批量导入进度
    └── 操作
        ├── 刷新
        ├── 下载模板
        └── 新建导入

Content
├── State Summary
├── FilterBar
└── Task Table
    ├── 任务信息
    ├── 导入对象
    ├── 状态
    ├── 进度
    ├── 成功/失败数量
    ├── 创建人
    ├── 创建时间
    └── 操作
```

说明：

- 页面主体是任务列表。
- 新建导入通过 Wizard / Stepper 承载。
- 任务详情可以使用 Drawer 或详情页承载。
- 失败原因、校验结果、操作日志可以在详情区域中展示。

## PageHeader

标题：

```text
导入任务
```

描述：

```text
上传文件、校验数据，并追踪批量导入进度
```

操作：

| 操作 | 类型 | 作用域 | 规则 |
|---|---|---|---|
| 刷新 | 图标按钮 | 页面 | 必须存在。刷新任务列表和进行中的任务状态。 |
| 下载模板 | 次级按钮 | 页面 | 无下载模板权限时禁用。 |
| 新建导入 | 主按钮 | 页面 | 打开导入流程。无导入权限时禁用。 |

刷新规则：

- 刷新保留当前筛选、分页和排序。
- 刷新不会重置正在打开的任务详情。
- 进行中的任务可以自动轮询，但手动刷新优先级更高。
- 刷新按钮进入 pending 状态，防止重复点击。

## State Summary

页面顶部可以展示简短状态汇总。

内容示例：

```text
今日导入 12 次
进行中 2 个
部分成功 1 个
失败 3 个
```

规则：

- 汇总信息必须紧凑，不做大卡片堆叠。
- 汇总仅用于快速扫描，不替代任务列表。
- 汇总数据加载失败时，不影响任务列表主要功能。
- 汇总区错误可以弱化处理，但不能影响主表格错误状态。

## FilterBar

默认露出的高频筛选项：

| 筛选项 | 类型 | 行为 |
|---|---|---|
| 关键词 | 搜索输入框 | 防抖请求。搜索文件名、任务 ID、创建人。 |
| 导入对象 | select | 选择后立即请求。 |
| 状态 | select | 选择后立即请求。 |
| 创建时间 | 日期范围 | 完成范围选择后请求。 |

默认收起的高级筛选项：

| 筛选项 | 类型 | 行为 |
|---|---|---|
| 创建人 | select | 选择后请求。 |
| 文件类型 | select | 选择后请求。 |
| 是否有失败行 | segmented control 或 radio | 选择后请求。 |
| 任务来源 | select | 选择后请求。 |

FilterBar 规则：

- 刷新按钮必须存在。
- 存在筛选条件时，显示重置。
- 修改筛选条件后，`pageNum` 重置为 `1`。
- 关键词输入使用 debounce。
- 任务状态筛选选择后立即请求。
- 查询状态需要能从 URL 恢复。

## 任务表格

该页面默认使用 table。

列设计：

| 列 | 内容 | 说明 |
|---|---|---|
| 任务 | 文件名、任务 ID | 文件名为主信息，任务 ID 为次信息。 |
| 导入对象 | Tag | 例如客户、用户、商品、配置。 |
| 状态 | StatusBadge | pending、validating、importing、success、partial_success、failed、cancelled。 |
| 进度 | progress 或文本 | 进行中任务展示进度。完成任务展示完成态。 |
| 数量 | 总数、成功、失败 | 失败数量可点击查看详情。 |
| 创建人 | 文本 | 使用“小明”这类通用示例名。 |
| 创建时间 | 日期时间 | 可排序。 |
| 完成时间 | 日期时间 | 未完成时显示占位符。 |
| 操作 | 图标按钮 + More 菜单 | 横向滚动时 sticky right。 |

状态规则：

- `pending`：任务已创建，等待处理。
- `validating`：正在校验文件和数据。
- `importing`：正在导入。
- `success`：全部导入成功。
- `partial_success`：部分成功，存在失败行。
- `failed`：任务失败或全部导入失败。
- `cancelled`：任务被取消。

## 行操作

最多暴露三个常用操作：

| 操作 | 位置 | 行为 |
|---|---|---|
| 查看详情 | 可见图标按钮 | 打开任务详情 Drawer 或详情页。 |
| 下载失败明细 | 可见图标按钮 | 仅存在失败行时可用。 |
| More | 可见图标按钮 | 展示更多操作。 |

More 中包含：

- 重新导入失败数据。
- 取消任务。
- 复制任务 ID。
- 查看操作日志。

规则：

- 每个图标按钮必须有 tooltip。
- 下载失败明细无数据时禁用，并说明原因。
- 取消任务是危险操作，必须使用 ConfirmDialog。
- 重新导入失败数据会启动新的导入流程，并预填失败文件。
- 行级操作 pending 只影响当前行。
- 操作不能触发行点击详情。

## 新建导入流程

使用 Wizard / Stepper。

步骤：

```text
1. 上传文件
2. 字段映射
3. 数据校验
4. 确认导入
5. 查看结果
```

规则：

- 每一步都有明确标题和主操作。
- 已完成步骤可以返回查看和修改，除非后续任务已经开始执行。
- 切换步骤不能丢失已填写数据。
- 关闭流程时，如果存在未提交内容，需要 ConfirmDialog。
- 导入开始后，不能再修改上传文件和字段映射。

### 第一步：上传文件

内容：

- 下载模板入口。
- 文件上传区域。
- 文件格式说明。
- 文件大小限制。
- 最近一次上传结果或错误。

规则：

- 支持拖拽或点击上传。
- 上传中展示 pending。
- 上传失败可以重试。
- 文件类型不符合时，展示本地校验错误。
- 文件过大时，展示本地校验错误。
- 上传成功后展示文件名、大小、行数预估。
- 不要只用 toast 表达上传失败。

### 第二步：字段映射

内容：

- 左侧为系统字段。
- 右侧为文件字段。
- 必填字段必须完成映射。
- 可选字段可以跳过。

规则：

- 必填字段未映射时不能进入下一步。
- 自动匹配字段需要允许用户修改。
- 字段类型不兼容时展示错误。
- 大量字段时，需要支持搜索或分组。
- 移动端如果字段映射过复杂，可以提示使用桌面端完成。

### 第三步：数据校验

内容：

- 校验进度。
- 校验结果汇总。
- 错误行预览。
- 错误文件下载。

规则：

- 校验中展示进度或 loading。
- 校验失败不能只用 toast。
- 阻塞错误使用 StateView 或步骤内错误区域。
- 存在错误行时，允许下载错误明细。
- 如果只有 warning，允许用户确认继续导入。
- 如果存在 blocking error，禁止继续导入。

### 第四步：确认导入

内容：

- 文件名。
- 导入对象。
- 总行数。
- 可导入行数。
- 错误行数。
- warning 数量。
- 字段映射摘要。

规则：

- 开始导入是主操作。
- 存在 warning 时，需要明确提示可能影响。
- 开始导入后按钮进入 pending。
- 防止重复提交。
- 导入开始后生成任务，并进入任务详情或结果步骤。

### 第五步：查看结果

内容：

- 任务状态。
- 导入进度。
- 成功数量。
- 失败数量。
- 错误文件下载。
- 查看任务详情。

规则：

- 结果步骤可以展示进行中状态。
- 长任务可以关闭 wizard，回到任务列表继续追踪。
- 导入成功后展示 success toast。
- 部分成功或失败时，页面中必须展示可操作的恢复路径。

## 任务详情

任务详情可以使用 Drawer 或详情页。

默认策略：

- 内容较少时使用 Drawer。
- 内容包含大量错误行、字段映射、日志和重试操作时使用详情页。

详情内容：

- 任务基本信息。
- 文件信息。
- 导入对象。
- 字段映射。
- 校验结果。
- 导入结果。
- 错误明细。
- Activity Log。

规则：

- Drawer 默认从右侧打开。
- 详情中可以包含 tabs：Overview、Errors、Mapping、Activity。
- 错误明细过多时，使用分页表格。
- Activity Log 按时间倒序展示。

## ConfirmDialog

### 取消任务

标题示例：

```text
取消导入任务？
```

描述示例：

```text
确认取消“小明”创建的客户导入任务吗？已经导入成功的数据不会自动回滚。
```

规则：

- 必须写清楚要取消的任务。
- 必须说明后果。
- 如果已导入数据不会回滚，必须明确说明。
- 确认按钮进入 pending。

### 关闭未完成导入流程

标题示例：

```text
离开导入流程？
```

描述示例：

```text
当前上传和字段映射尚未提交，离开后这些内容不会保存。
```

规则：

- 只有存在未提交内容时才需要确认。
- 如果已经生成任务，不使用该确认，而是回到任务追踪。

## 数据契约

### 查询参数

```ts
type ImportTaskQuery = {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  targetType?: "customer" | "user" | "product" | "config";
  status?: "pending" | "validating" | "importing" | "success" | "partial_success" | "failed" | "cancelled";
  creatorId?: string;
  hasFailedRows?: boolean;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: "createdAt" | "finishedAt";
  sortOrder?: "asc" | "desc";
};
```

### 返回数据

```ts
type ImportTaskListResponse = {
  list: ImportTaskRow[];
  pageNum: number;
  pageSize: number;
  total: number;
};
```

```ts
type ImportTaskRow = {
  id: string;
  fileName: string;
  targetType: "customer" | "user" | "product" | "config";
  status: "pending" | "validating" | "importing" | "success" | "partial_success" | "failed" | "cancelled";
  progress?: number;
  totalCount: number;
  successCount: number;
  failedCount: number;
  warningCount?: number;
  creator: {
    id: string;
    name: string;
  };
  createdAt: string;
  finishedAt?: string;
  permissions: {
    canViewDetail: boolean;
    canCancel: boolean;
    canDownloadErrors: boolean;
    canRetryFailedRows: boolean;
    canViewActivity: boolean;
  };
  disabledReasons?: Partial<Record<
    "cancel" | "downloadErrors" | "retryFailedRows" | "viewActivity",
    string
  >>;
};
```

规则：

- 任务状态由后端返回，前端不自行猜测最终状态。
- 进行中任务可以通过轮询刷新。
- 行级权限和禁用原因需要在数据契约中体现。
- 下载错误文件需要基于任务 ID 请求，不直接暴露不稳定文件地址。

## 请求竞态与轮询

规则：

- 任务列表请求需要请求身份。
- 只有最新请求可以更新列表。
- 筛选、分页、排序变化需要取消或忽略旧请求。
- 进行中任务可以轮询状态。
- 页面不可见时应降低或暂停轮询。
- 手动刷新优先级高于轮询结果。
- mutation 结果优先级高于旧列表请求。
- 取消任务成功后，需要立即更新该行状态或刷新列表。

推荐优先级：

1. 取消、开始导入、重新导入等 mutation 结果。
2. 用户手动刷新。
3. 当前可见详情任务的轮询结果。
4. 列表中进行中任务的轮询结果。
5. 后台刷新。

## 状态处理

### 初始 loading

- PageHeader 和 FilterBar 保持可见。
- 表格区域展示 skeleton 或 loading rows。
- 汇总区可以独立 loading。

### Empty

暂无任务：

```text
暂无导入任务
```

无筛选结果：

```text
没有符合当前筛选条件的导入任务
```

规则：

- 暂无任务且有权限时，提供新建导入入口。
- 无筛选结果时，提供重置筛选。
- Empty 展示在任务列表区域。

### Error

规则：

- 任务列表获取失败使用表格区域 StateView。
- 上传失败展示在上传步骤内。
- 校验失败展示在校验步骤内。
- 导入失败展示在结果步骤和任务详情中。
- 阻塞错误不能只用 toast。

### Toast

适合使用 toast 的场景：

- 上传成功。
- 导入任务创建成功。
- 取消任务成功。
- 错误文件下载已开始。
- 重新导入任务已创建。

不适合只用 toast 的场景：

- 文件格式错误。
- 数据校验失败。
- 导入任务失败。
- 下载错误文件失败且用户需要重试。

## 响应式策略

桌面端：

- 使用完整任务表格。
- Wizard 可以使用 Dialog 或页面内流程。
- 字段映射使用双列布局。

平板端：

- 表格允许横向滚动。
- 字段映射可以从双列变为上下布局。
- 低优先级页面操作收进 More。

移动端：

- 任务列表可以切换为紧凑列表或卡片列表。
- 上传入口使用底部抽屉或单页流程。
- 字段映射复杂时，提示建议在桌面端完成。
- 切换布局不能丢失上传文件、映射配置、校验结果和任务状态。

## 可访问性

规则：

- 上传区域必须支持键盘触发。
- 文件选择控件需要明确 label。
- 进度信息需要可见，必要时可被读屏读取。
- Wizard 当前步骤需要被明确标识。
- ConfirmDialog 需要焦点陷阱，并在关闭后回到触发元素。
- 错误行下载和重新导入操作需要可被键盘访问。

## AI 生成要求

生成该页面时，AI 必须：

- 使用 2B 控制台布局。
- 区分导入流程和导入任务列表。
- 使用 Wizard / Stepper 承载多步骤导入。
- 使用 table 承载任务列表。
- 包含状态汇总、FilterBar、任务表格、任务详情、Activity Log。
- 包含 upload、validation、mapping、confirm、result 五个阶段。
- 包含 loading、empty、error、pending、disabled、success、partial success、failed 状态。
- 包含任务轮询和请求竞态处理。
- 包含权限禁用和禁用原因。
- 危险操作使用 ConfirmDialog。
- 阻塞错误不能只用 toast。
- 移动端不能因为布局变化丢失流程数据。

## 验收标准

该页面满足以下条件时，视为合格：

- 用户能清楚知道如何开始一次导入。
- 导入流程的每一步都有明确目标和主操作。
- 上传、字段映射、校验、确认、结果之间状态连续。
- 任务列表能追踪历史任务和进行中任务。
- 失败任务提供可恢复路径，例如下载错误文件或重新导入。
- 取消任务有明确二次确认，并说明后果。
- 进行中任务状态不会被旧请求覆盖。
- 权限不足的操作有禁用态和原因说明。
- 阻塞错误在页面内可见，而不是只靠 toast。
- 页面在桌面端、平板端、移动端都能完成核心查看任务。

