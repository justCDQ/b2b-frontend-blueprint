# AI 规则总入口

这个文件是 2B 控制台生成和审查的 AI 规则总入口。

不要在每个任务中无脑加载所有模块。先阅读这个入口，再根据具体页面选择场景 bundle 和组件 rules。

## 基础指令

生成 2B 控制台 UI，不要生成营销页。

优先级：

- 信息密度高，但仍然可读。
- 操作层级清晰。
- 导航可预测。
- loading、empty、error、disabled、permission 状态完整。
- 数据流稳定。
- 响应式变化不丢失业务状态。
- 组件边界可复用。

避免：

- 装饰性 hero 区域。
- 用过大的卡片承载运营工作流。
- 按钮位置和作用域不清。
- 阻塞错误只用 toast 表达。
- 危险操作没有确认。
- UI 状态只有视觉表现，没有数据契约。

## 加载顺序

### 1. 始终加载基础规则

加载：

- [Core Foundation AI Bundle](./core-foundation-ai-bundle.md)
- [Action System AI Rules](../action-system/action-system-ai-rules.md)
- [Responsive Layout AI Rules](../responsive-layout/responsive-layout-ai-rules.md)
- [StateView AI Rules](../state-view/state-view-ai-rules.md)
- [Feedback / Toast AI Rules](../feedback-toast/feedback-toast-ai-rules.md)
- [Tooltip / HelpText AI Rules](../tooltip-helptext/tooltip-helptext-ai-rules.md)

### 2. 选择一个主场景

CRUD 列表：

- [List CRUD AI Bundle](./list-crud-ai-bundle.md)

弹窗、抽屉、详情页中的表单：

- [Form Overlay AI Bundle](./form-overlay-ai-bundle.md)

导航和布局：

- [Navigation Layout AI Bundle](./navigation-layout-ai-bundle.md)

数据反馈：

- [Data Feedback AI Bundle](./data-feedback-ai-bundle.md)

上传或导入：

- [Import Workflow AI Bundle](./import-workflow-ai-bundle.md)

### 3. 按需追加具体模块

当某个界面是任务核心时，追加对应模块：

- [Table AI Rules](../table/table-ai-rules.md)
- [FilterBar AI Rules](../filter-bar/filter-bar-ai-rules.md)
- [Form AI Rules](../form/form-ai-rules.md)
- [Dialog AI Rules](../dialog/dialog-ai-rules.md)
- [Drawer / Side Panel AI Rules](../drawer-side-panel/drawer-side-panel-ai-rules.md)
- [Dropdown / Menu / Popover AI Rules](../dropdown-menu-popover/dropdown-menu-popover-ai-rules.md)
- [Card List AI Rules](../card-list/card-list-ai-rules.md)
- [Detail Page AI Rules](../detail-page/detail-page-ai-rules.md)
- [Tabs / Navigation AI Rules](../tabs-navigation/tabs-navigation-ai-rules.md)
- [StatusBadge / Tag AI Rules](../status-badge/status-badge-ai-rules.md)
- [Upload / Import Workflow AI Rules](../upload-import-workflow/upload-import-workflow-ai-rules.md)
- [Wizard / Stepper AI Rules](../wizard-stepper/wizard-stepper-ai-rules.md)
- [Timeline / Activity / Audit Log AI Rules](../timeline-activity-log/timeline-activity-log-ai-rules.md)

## 全局 AI 约束

### 布局

- 控制台页面使用 PageShell 和 PageHeader。
- 操作型页面保持紧凑和可扫描。
- 不要为控制台工作流使用营销页 hero 布局。
- 除非是重复卡片项，否则不要把页面区块做成装饰性卡片。
- 尽可能使用响应式约束，而不是硬编码宽度。

### 操作

- 每个操作都必须有清晰作用域：页面、区块、批量、行、表单或字段内联。
- 主操作数量要克制，并且视觉上明确。
- 危险操作必须使用 ConfirmDialog。
- mutation 操作必须进入 pending 状态并防止重复点击。
- 因权限或状态不可用的操作必须暴露原因。

### 数据

- loading、empty、error、success 状态必须作用在受影响的区域。
- 搜索、筛选、分页、排序、刷新和 mutation 流程必须处理请求竞态。
- 刷新应保留有效查询状态，除非规则明确要求重置。
- 当筛选、分页或数据身份变化时，需要清空或协调选中状态。

### 表单

- 筛选表单可以根据字段类型触发实时查询。
- 新增和编辑表单必须在提交前校验。
- 大表单应该使用 submit 行为，而不是只依赖字段独立校验。
- disabled 字段不能看起来像可编辑字段。
- 内联编辑只用于低风险、简单值。

### 浮层

- 有边界的任务使用 Dialog。
- 破坏性或不可逆确认使用 ConfirmDialog。
- 需要保留来源页面上下文的二级工作使用 Drawer / Side Panel。
- 大量内容、复杂操作或需要路由恢复的工作流使用 Detail Page。

### 反馈

- Toast 用于短暂的操作反馈。
- Inline Error 用于字段或局部纠错。
- StateView 用于页面、区块、表格、卡片列表或面板状态。
- 阻塞错误不能只用 toast 表达。

## 常用生成 Prompt

```text
生成一个 2B 控制台界面。

遵循：
- component-rules/_ai-bundles/all-ai-rules.zh.md
- component-rules/_ai-bundles/{scenario-bundle}.md
- component-rules/{specific-module}/{specific-module}-ai-rules.zh.md

要求：
- 使用紧凑的控制台布局。
- 包含 loading、empty、error、disabled、permission 和 pending 状态。
- 操作作用域必须清晰。
- 危险操作使用 ConfirmDialog。
- 防止 mutation 操作重复触发。
- 在合适场景中保留查询和导航状态。
- 不要生成营销落地页。
```

## 常用审查 Prompt

```text
请根据 2B AI rules 审查当前实现。

检查：
- 组件边界是否正确
- 操作层级和摆放是否合理
- disabled 和 permission 行为是否清晰
- loading、empty、error、pending、success 状态是否完整
- 请求竞态是否处理
- 响应式行为是否稳定
- 危险操作是否有确认
- 是否符合 table、form、dialog、drawer、navigation 等规则

请返回具体问题和修复建议。
```

