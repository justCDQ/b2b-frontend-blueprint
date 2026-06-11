# 模板架构蓝图

这份文档定义未来 B2B frontend blueprint 从“规则仓库”走向“可运行模板”和“CLI 可安装模板”时的工程结构。

它不直接实现代码，而是先确定代码应该如何分层、如何命名、哪些能力应该放在哪一层，以及当前页面 demo 如何映射成未来的 demo app。

## 架构目标

模板最终需要同时服务三类使用方式：

1. **规则使用**：AI 或开发者读取 rules，生成符合 2B 交互习惯的代码。
2. **模板使用**：开发者 clone 仓库或安装模板，快速得到一个可运行的控制台项目。
3. **模块安装**：通过 CLI 按需安装 shell、rbac、table、form、import workflow、demo module 等模块。

核心目标：

- 组件可复用。
- 样式可换肤。
- 行为可组合。
- 权限、i18n、主题、数据请求有明确边界。
- demo 页面能真实展示规则如何落地。
- CLI 能按模块安装，而不是复制一个不可拆的大项目。

## 推荐仓库结构

未来代码阶段推荐使用轻量 monorepo，但核心不绑定 React、Vue、Svelte 等框架。

```text
.
├── apps/
│   └── demo-vanilla/
├── packages/
│   ├── headless/
│   ├── theme/
│   ├── dom/
│   ├── recipes/
│   ├── adapters/
│   │   ├── react/
│   │   ├── vue/
│   │   └── svelte/
│   ├── ui/
│   ├── icons/
│   ├── rbac/
│   ├── i18n/
│   ├── data/
│   ├── console-shell/
│   ├── rules/
│   └── cli/
├── examples/
│   ├── pages/
│   └── prompts/
├── component-rules/
├── system-rules/
├── docs/
└── ROADMAP.md
```

说明：

- `apps/demo-vanilla` 是第一版零依赖参考控制台。
- `packages/headless` 是不绑定样式的交互逻辑。
- `packages/theme` 管理 tokens、主题和密度。
- `packages/dom` 提供原生 DOM 行为控制器。
- `packages/recipes` 描述组件结构、slots、states 和 class 契约。
- `packages/adapters` 后续放 React、Vue、Svelte 等框架适配器。
- `packages/ui` 后续可以提供更完整的框架无关 UI 资产或 adapter 共享层。
- `packages/rbac` 提供权限模型和权限工具。
- `packages/data` 提供请求、mock、数据契约示例。
- `packages/console-shell` 提供控制台壳、布局、导航。
- `packages/rules` 打包 AI rules 和文档入口。
- `packages/cli` 负责按模块安装代码和规则。

## 分层原则

推荐心智模型：

```text
theme tokens
→ headless behavior
→ DOM controller / adapter
→ component recipe
→ semantic component
→ domain component
→ feature module
→ demo app
```

各层职责：

| 层级 | 职责 | 示例 |
|---|---|---|
| theme tokens | 框架无关样式变量 | color、spacing、radius、density |
| headless behavior | 状态、键盘、选择、校验、请求协调等行为逻辑 | `createDisclosure`、`createSelectionController` |
| DOM controller / adapter | 将 headless 行为接入 DOM 或框架 | `attachDisclosure`、React adapter |
| component recipe | 组件结构、slots、states 和 class 契约 | `pageShell`、`stateView` |
| semantic component | 2B 语义组件 | `DataTable`、`FilterBar`、`ConfirmDialog`、`StateView` |
| domain component | 业务域映射 | `UserStatusBadge`、`ProjectMembersTable` |
| feature module | 页面级功能模块 | `users`、`imports`、`projects` |
| demo app | 展示完整控制台体验 | `apps/demo` |

规则：

- 核心层不依赖 React、Vue、Svelte。
- 低层组件不包含业务域逻辑。
- 业务权限不写死在 primitive 中。
- API 请求不放进 UI primitive。
- 主题不放进 headless hooks。
- 页面负责数据流和业务编排。
- 可复用组件通过 slots、recipes、data attributes、adapter props 暴露扩展点。

## 框架无关优先

核心包默认框架无关。

规则：

- `theme` 只输出 CSS variables 和 token metadata。
- `headless` 只输出纯 JavaScript/TypeScript 行为逻辑。
- `dom` 只处理原生 DOM 绑定，不包含业务页面。
- `recipes` 只描述组件结构和状态契约。
- `react`、`vue`、`svelte` 都是 adapter，不是核心。
- demo 第一版使用 `apps/demo-vanilla` 验证核心能力。
- 只有当核心契约稳定后，才开始写框架 adapter。

## apps/demo-vanilla

`apps/demo-vanilla` 是第一个可运行产品面。

职责：

- 展示模板的真实使用方式。
- 组合框架无关 `packages/*` 能力。
- 实现页面 demo blueprints。
- 提供 mock API 和权限切换。
- 提供 light/dark theme 切换。
- 提供 i18n 示例。
- 不依赖 React/Vue/Svelte。

推荐结构：

```text
apps/demo-vanilla/
├── src/
│   ├── main.js
│   └── styles.css
└── index.html
```

规则：

- demo app 可以包含业务示例，但不要把可复用能力写死在 demo 中。
- demo module 可以依赖 `packages/theme`、`packages/headless`、`packages/dom`、`packages/recipes`、`packages/data`。
- demo app 中的 mock 数据应覆盖权限、状态、错误、empty、pending。
- demo app 不应该成为唯一实现来源，可复用能力应沉淀回 packages。

## packages/headless

`packages/headless` 放不绑定样式的交互逻辑。

候选能力：

```text
useDisclosure
useControllableState
useTableSelection
usePagination
useFilterState
useUrlQueryState
usePendingAction
useRequestRace
useWizard
useDirtyState
```

规则：

- 不依赖具体 CSS。
- 不依赖具体组件库样式。
- 不硬编码业务文案。
- 不直接发起业务 API 请求。
- 可以处理通用状态机、键盘交互、选择、分页、竞态。
- 应该容易单元测试。

## packages/ui

`packages/ui` 提供可复用的 2B UI 组件。

推荐结构：

```text
packages/ui/
├── src/
│   ├── primitives/
│   ├── components/
│   ├── patterns/
│   └── index.ts
└── package.json
```

### primitives

基础组件：

```text
Button
IconButton
Input
Textarea
Select
Checkbox
Radio
Switch
Dialog
Drawer
Tooltip
DropdownMenu
Tabs
SegmentedControl
```

规则：

- primitives 不理解业务域。
- primitives 使用 tokens 和 variants。
- primitives 负责基础可访问性。
- primitives 不发起业务请求。

### components

2B 语义组件：

```text
PageHeader
PageShell
FilterBar
DataTable
CardList
StateView
StatusBadge
ConfirmDialog
Pagination
FormSection
ActionBar
BatchActionBar
```

规则：

- components 可以表达 2B 交互语义。
- components 不绑定具体业务数据结构。
- components 支持 disabled reason、pending、permission-derived state。
- components 需要支持 light/dark theme 和响应式。

### patterns

组合模式：

```text
ListPageLayout
DetailPageLayout
ImportWizard
SettingsSection
ActivityLog
```

规则：

- patterns 可以封装常见页面片段。
- patterns 仍然不能写死业务域。
- 复杂数据映射留给 feature module。

## packages/theme

`packages/theme` 管理设计 tokens、主题和密度。

候选内容：

```text
tokens/
themes/
css-vars/
density/
motion/
```

Token 分组：

- color
- typography
- spacing
- radius
- border
- shadow
- z-index
- motion
- density

规则：

- 使用 semantic tokens，不直接使用裸色值。
- 支持 light 和 dark。
- 支持品牌换肤。
- 支持密度调整。
- 布局 tokens 和颜色 tokens 分离。
- 组件 variant 映射到 tokens。

## packages/rbac

`packages/rbac` 提供权限模型、权限检查和权限 UI 辅助。

候选内容：

```text
createAbility
can
PermissionProvider
usePermission
PermissionGate
getDisabledReason
```

规则：

- 权限判断在 domain 或 feature 层完成。
- UI 组件接收 `disabled`、`disabledReason`、`hidden` 等结果。
- Base component 不读取用户角色。
- 权限需要同时支持：
  - role-based
  - permission string
  - resource-level permission
  - state-based permission
- demo app 需要提供角色切换，用于验证 disabled 和 hidden 策略。

## packages/i18n

`packages/i18n` 提供国际化入口。

候选内容：

```text
I18nProvider
useTranslation
messages/
formatDate
formatNumber
```

规则：

- 组件不硬编码产品文案。
- empty、error、tooltip、aria label、validation message 都需要可注入。
- UI 需要容忍翻译后更长的文案。
- demo app 至少提供中文和英文文案示例。

## packages/data

`packages/data` 提供请求、mock 和数据契约示例。

候选内容：

```text
httpClient
requestRace
queryClient
mockServer
fixtures
contracts
```

规则：

- 数据请求不放在低层 UI 组件中。
- 页面或 feature module 负责调用 API。
- 请求竞态需要作为通用能力沉淀。
- mock 数据要覆盖不同状态：
  - loading
  - empty
  - error
  - success
  - partial success
  - permission denied
  - disabled state
- 数据契约应该和页面 demo 中的类型保持一致。

## packages/console-shell

`packages/console-shell` 提供控制台级布局和导航。

候选组件：

```text
ConsoleShell
SidebarNav
Topbar
Breadcrumb
RouteTabs
PageContainer
ContentLayout
```

规则：

- shell 管理导航、页面容器、响应式侧边栏。
- shell 不包含具体业务模块。
- 路由配置由 app 注入。
- 导航项支持权限过滤和 disabled reason。
- 移动端导航需要有明确降级策略。

## packages/rules

`packages/rules` 用于打包规则文件，方便 CLI 或 AI 工具读取。

候选内容：

```text
rules/
bundles/
prompts/
manifest.json
```

规则：

- 不复制散落规则，应从 `component-rules`、`system-rules`、`examples/prompts` 生成或同步。
- 提供 manifest 描述规则包版本、入口和适用场景。
- 支持按 bundle 输出：
  - core foundation
  - list CRUD
  - form overlay
  - navigation layout
  - data feedback
  - import workflow

## packages/cli

`packages/cli` 用于安装模板模块。

未来命令示例：

```text
b2b-blueprint init
b2b-blueprint add console-shell
b2b-blueprint add theme-tokens
b2b-blueprint add rbac
b2b-blueprint add data-table
b2b-blueprint add filter-bar
b2b-blueprint add form-system
b2b-blueprint add import-workflow
b2b-blueprint add demo-users
```

规则：

- CLI 应该支持按模块安装。
- CLI 不应该只复制整个 demo app。
- CLI 需要检测目标项目技术栈和目录。
- CLI 需要避免覆盖用户已有文件。
- CLI 应输出安装了哪些文件、需要用户补充哪些配置。
- CLI 应支持 dry run。

## 页面 Demo 到代码模块的映射

### User Management

文档：

```text
examples/pages/user-management.zh.md
examples/pages/user-management.md
```

代码建议：

```text
apps/demo/src/modules/users/
├── pages/UserManagementPage.tsx
├── components/UserFilterBar.tsx
├── components/UserTable.tsx
├── components/UserFormDialog.tsx
├── components/UserRowActions.tsx
├── api.ts
├── contracts.ts
└── fixtures.ts
```

覆盖能力：

- CRUD list。
- FilterBar。
- DataTable。
- Dialog form。
- ConfirmDialog。
- Batch actions。
- Permission disabled。

### Import Records

文档：

```text
examples/pages/import-records.zh.md
examples/pages/import-records.md
```

代码建议：

```text
apps/demo/src/modules/imports/
├── pages/ImportRecordsPage.tsx
├── components/ImportTaskTable.tsx
├── components/ImportWizard.tsx
├── components/FieldMappingStep.tsx
├── components/ValidationStep.tsx
├── components/ImportTaskDetail.tsx
├── api.ts
├── contracts.ts
└── fixtures.ts
```

覆盖能力：

- Upload workflow。
- Wizard / Stepper。
- Async task polling。
- StateView。
- Activity Log。
- Failure recovery。

### Project Settings Detail

文档：

```text
examples/pages/settings-detail.zh.md
examples/pages/settings-detail.md
```

代码建议：

```text
apps/demo/src/modules/projects/
├── pages/ProjectDetailPage.tsx
├── sections/OverviewSection.tsx
├── sections/SettingsSection.tsx
├── sections/MembersSection.tsx
├── sections/SecuritySection.tsx
├── sections/ActivitySection.tsx
├── components/ProjectHeader.tsx
├── components/ProjectDangerActions.tsx
├── api.ts
├── contracts.ts
└── fixtures.ts
```

覆盖能力：

- Detail Page。
- Route Navigation / Tabs。
- Page edit mode。
- Related table。
- Drawer。
- Audit Log。
- Forbidden / Not Found / Section Error。

## MVP 实现顺序

代码阶段不要一开始实现所有模块。建议按可验证闭环推进。

### Step 1: 工程骨架

实现：

- monorepo 配置。
- `apps/demo`。
- `packages/ui`。
- `packages/theme`。
- `packages/headless`。
- 基础 lint、typecheck、test 脚本。

### Step 2: 基础视觉和布局

实现：

- theme tokens。
- light/dark theme。
- Button / IconButton。
- PageShell。
- PageHeader。
- Tooltip。
- DropdownMenu。
- StateView。
- Toast。

### Step 3: Overlay 和 Action

实现：

- Dialog。
- ConfirmDialog。
- Drawer。
- Action system helpers。
- Pending / duplicate prevention。
- Disabled reason。

### Step 4: 表单和列表

实现：

- Form primitives。
- FilterBar。
- DataTable。
- Pagination。
- BatchActionBar。
- StatusBadge。

### Step 5: 第一个 demo

实现：

- User Management 页面。
- mock API。
- permission fixture。
- loading / empty / error / disabled / pending states。

### Step 6: 复杂流程 demo

实现：

- Import Records 页面。
- ImportWizard。
- task polling。
- failed rows recovery。

### Step 7: 详情配置 demo

实现：

- Project Settings Detail。
- route tabs。
- page edit mode。
- related table。
- Activity / Audit Log。

## 非目标

MVP 阶段不做：

- 完整真实后端。
- 完整生产级 RBAC 后台。
- 完整 CLI registry。
- 所有组件的无限变体。
- 大而全的业务系统。
- 复杂设计器或可视化配置平台。

MVP 应该证明：

- rules 能指导代码生成。
- 组件边界合理。
- 三类典型 2B 页面可以运行。
- 权限、状态、响应式、主题可以被验证。

## 架构验收标准

模板架构满足以下条件时，可以进入代码初始化：

- 仓库目录边界清晰。
- `apps/demo` 和 `packages/*` 职责明确。
- UI、headless、theme、rbac、data、shell 不互相污染。
- 页面 demo 能映射到具体 feature modules。
- MVP 实现顺序可执行。
- 规则文件和代码模板之间有明确对应关系。
- 后续 CLI 可以按模块安装，而不是复制整个项目。
