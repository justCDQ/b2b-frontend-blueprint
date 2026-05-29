# 快速开始

这个仓库是一个面向 2B 控制台前端的 rules-first blueprint，用来辅助 AI 生成更符合企业级后台产品习惯的前端代码。

它适合用来避免 AI 生成过于 2C、营销页化、组件边界不清、状态缺失、权限缺失的后台界面。

## 适合谁使用

适合以下场景：

- 设计可复用的 2B 前端模板。
- 构建管理后台、SaaS 控制台、内部工具、CRM/ERP、数据运营平台。
- 为 AI 编程工具编写 prompt。
- 审查 AI 生成的界面是否符合企业级交互规范。
- 将组件经验沉淀成可复用的工程规则。

## 先读什么

快速了解仓库：

1. 阅读 [README.md](../README.md)。
2. 阅读 [component-rules/README.md](../component-rules/README.md)。
3. 阅读 [component-rules/_inventory/rules-inventory.zh.md](../component-rules/_inventory/rules-inventory.zh.md)。
4. 根据当前任务阅读对应组件模块。

中文讨论产品和交互时：

1. 优先阅读 `*-rules.zh.md`。
2. 写中文 AI prompt 时使用 `*-ai-rules.zh.md`。
3. 如果规则会影响代码生成，需要同步更新英文 AI rules。

AI 代码生成时：

1. 从 [all-ai-rules.zh.md](../component-rules/_ai-bundles/all-ai-rules.zh.md) 开始。
2. 选择一个匹配场景的 bundle。
3. 只在需要时追加具体组件的 AI rules。
4. 遇到边界判断和产品讨论时，再回到人类可读规则。

## 阅读路径

### 生成列表 CRUD 页面

优先加载：

- [List CRUD AI Bundle](../component-rules/_ai-bundles/list-crud-ai-bundle.md)
- [List Page AI Rules](../component-rules/list-page/list-page-ai-rules.md)
- [FilterBar AI Rules](../component-rules/filter-bar/filter-bar-ai-rules.md)
- [Table AI Rules](../component-rules/table/table-ai-rules.md)
- [Action System AI Rules](../component-rules/action-system/action-system-ai-rules.md)

细化时参考：

- [列表页规则](../component-rules/list-page/list-page-rules.zh.md)
- [筛选栏规则](../component-rules/filter-bar/filter-bar-rules.zh.md)
- [表格规则](../component-rules/table/table-rules.zh.md)

### 生成弹窗或详情页表单

优先加载：

- [Form Overlay AI Bundle](../component-rules/_ai-bundles/form-overlay-ai-bundle.md)
- [Form AI Rules](../component-rules/form/form-ai-rules.md)
- [Dialog AI Rules](../component-rules/dialog/dialog-ai-rules.md)
- [Drawer / Side Panel AI Rules](../component-rules/drawer-side-panel/drawer-side-panel-ai-rules.md)
- [Detail Page AI Rules](../component-rules/detail-page/detail-page-ai-rules.md)

细化时参考：

- [表单规则](../component-rules/form/form-rules.zh.md)
- [弹窗规则](../component-rules/dialog/dialog-rules.zh.md)
- [详情页规则](../component-rules/detail-page/detail-page-rules.zh.md)

### 生成反馈和状态处理

优先加载：

- [Data Feedback AI Bundle](../component-rules/_ai-bundles/data-feedback-ai-bundle.md)
- [StateView AI Rules](../component-rules/state-view/state-view-ai-rules.md)
- [Feedback / Toast AI Rules](../component-rules/feedback-toast/feedback-toast-ai-rules.md)
- [StatusBadge / Tag AI Rules](../component-rules/status-badge/status-badge-ai-rules.md)
- [Timeline / Activity Log AI Rules](../component-rules/timeline-activity-log/timeline-activity-log-ai-rules.md)

### 生成上传或导入流程

优先加载：

- [Import Workflow AI Bundle](../component-rules/_ai-bundles/import-workflow-ai-bundle.md)
- [Upload / Import Workflow AI Rules](../component-rules/upload-import-workflow/upload-import-workflow-ai-rules.md)
- [Wizard / Stepper AI Rules](../component-rules/wizard-stepper/wizard-stepper-ai-rules.md)
- [StateView AI Rules](../component-rules/state-view/state-view-ai-rules.md)
- [Timeline / Activity Log AI Rules](../component-rules/timeline-activity-log/timeline-activity-log-ai-rules.md)

## 如何给 AI 使用

生成代码时可以使用这个结构：

```text
你正在生成一个 2B 控制台页面。

请遵循：
- component-rules/_ai-bundles/core-foundation-ai-bundle.md
- component-rules/_ai-bundles/list-crud-ai-bundle.md
- component-rules/table/table-ai-rules.md
- component-rules/filter-bar/filter-bar-ai-rules.md

任务：
生成一个用户管理列表页，包含搜索、筛选、表格选择、行操作、批量操作、loading、empty、error、disabled 和权限状态。

约束：
- 不要生成营销落地页。
- 使用紧凑但清晰的控制台布局。
- 操作作用域必须清晰。
- 危险操作必须使用 ConfirmDialog。
- mutation 操作必须防止重复点击。
```

审查代码时可以使用这个结构：

```text
请根据已加载的 2B rules 审查这个控制台页面实现。

重点检查：
- 交互边界错误
- 操作摆放不一致
- loading/empty/error/disabled 状态缺失
- 危险操作缺少确认
- 权限行为不清晰
- 响应式变化导致业务状态丢失

请返回带文件引用和具体修复建议的问题清单。
```

## 如何扩展规则

每个组件模块默认包含四个文件：

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```

新增或修改规则时：

1. 先更新人类可读版本。
2. 再更新 AI 版本。
3. 同步更新中文和英文。
4. 如果影响通用生成行为，更新对应 bundle。
5. 新增模块时更新 inventory。

详见 [规则写作指南](./rule-authoring-guide.zh.md)。

## 当前 MVP 边界

当前仓库只包含规则和文档。

暂不包含：

- 可运行的 React 组件。
- CLI 安装器。
- Auth 或 RBAC 实现。
- 测试工程。
- 浏览器兼容配置。
- Demo 应用源码。

这些内容会进入 [ROADMAP.md](../ROADMAP.md) 后续阶段。

