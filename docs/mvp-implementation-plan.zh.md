# MVP 实施计划

这份文档定义 B2B Frontend Blueprint 的第一版代码 MVP。

目标不是一次性完成完整模板，而是在一天内做出一个可以运行、可以展示、可以继续扩展的最小闭环。

## MVP 目标

第一版代码 MVP 聚焦：

```text
可运行 demo app
+ User Management 页面
+ 最小组件系统
+ mock 数据
+ 权限切换
+ light/dark theme
+ 基础状态覆盖
```

MVP 需要证明：

- rules 可以指导真实代码实现。
- 组件边界可以落地。
- 2B 控制台页面不是营销页。
- 权限、状态、请求、响应式不是后补项。
- 后续 Import Records 和 Project Settings Detail 可以在同一架构上继续扩展。

## MVP 非目标

第一版不做：

- 完整 CLI。
- 完整 RBAC 后台。
- 完整 Auth 登录注册。
- 完整 i18n 系统。
- 完整 Import Records 流程。
- 完整 Project Settings Detail 页面。
- 完整 E2E 测试矩阵。
- 生产级组件库发布。
- 真实后端接入。

这些能力可以在 MVP 验证后继续推进。

## 推荐技术栈

第一版建议选择足够轻、足够标准的技术栈。

| 能力 | 建议 |
|---|---|
| Framework | React + TypeScript |
| Build | Vite |
| Package manager | pnpm workspace |
| Styling | CSS variables + CSS modules 或 vanilla CSS |
| Icons | lucide-react |
| Routing | react-router |
| Forms | react-hook-form 或通用 form controller 思路 |
| Mock API | 本地 fixtures + async mock functions |
| Tests | Vitest + Playwright 后续补 |

说明：

- 第一版不必强依赖大型 UI 库。
- 如果使用 headless library，只作为 primitive 行为参考，不让 demo 变成某个库的样式复制。
- 样式优先用 tokens 和 CSS variables，方便后续换肤。

## MVP 仓库结构

第一版代码建议先初始化这些目录：

```text
apps/
└── demo/
    ├── src/
    │   ├── app/
    │   ├── modules/
    │   │   └── users/
    │   ├── mocks/
    │   └── main.tsx
    └── package.json

packages/
├── ui/
│   └── src/
├── headless/
│   └── src/
├── theme/
│   └── src/
└── data/
    └── src/
```

暂缓：

```text
packages/cli
packages/rbac
packages/i18n
packages/rules
packages/console-shell
```

原因：

- MVP 可以先在 `apps/demo` 内实现轻量 permission 和 shell。
- 等 User Management 跑通后，再把稳定能力抽到独立 package。

## 第一批 packages 职责

### packages/theme

先实现：

- CSS variables。
- light theme。
- dark theme。
- spacing、radius、border、color、typography 基础 tokens。

不做：

- 复杂品牌主题编辑器。
- 多套完整企业主题。
- 高级 motion token。

### packages/headless

先实现：

- `useDisclosure`
- `useTableSelection`
- `usePendingAction`
- `useRequestRace`
- `useUrlQueryState` 简化版

不做：

- 完整状态机库。
- 所有组件的 headless controller。

### packages/ui

先实现：

- `Button`
- `IconButton`
- `Tooltip`
- `DropdownMenu`
- `Dialog`
- `ConfirmDialog`
- `StateView`
- `StatusBadge`
- `PageShell`
- `PageHeader`
- `FilterBar`
- `DataTable`
- `Pagination`
- `BatchActionBar`

不做：

- CardList。
- Drawer。
- Wizard。
- Upload。
- Timeline。
- 完整 Form library。

### packages/data

先实现：

- mock delay。
- mock error。
- users fixtures。
- list query function。
- mutation functions。
- request identity helper。

不做：

- 完整 query client。
- 真实 HTTP client。
- OpenAPI 生成。

## 第一个 Demo：User Management

MVP 只实现 User Management。

参考文档：

```text
examples/pages/user-management.zh.md
examples/pages/user-management.md
```

实现目标：

- PageHeader。
- FilterBar。
- Table。
- BatchActionBar。
- Create/Edit Dialog。
- Delete ConfirmDialog。
- Reset Password ConfirmDialog。
- StatusBadge。
- Permission disabled。
- Loading / Empty / Error / Pending 状态。
- 简单 URL query 恢复。
- light/dark theme。

暂不实现：

- 真实详情页。
- 完整成员权限系统。
- 后端 API。
- 复杂表单联动。
- 虚拟滚动。

## User Management 数据范围

mock 用户字段：

```ts
type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "operator" | "viewer";
  status: "active" | "invited" | "disabled" | "locked";
  team?: {
    id: string;
    name: string;
  };
  mfaEnabled: boolean;
  lastActiveAt?: string;
  createdAt: string;
  permissions: {
    canEdit: boolean;
    canEnable: boolean;
    canDisable: boolean;
    canResetPassword: boolean;
    canDelete: boolean;
    canSelect: boolean;
  };
  disabledReasons?: Record<string, string>;
};
```

mock 状态至少包含：

- 正常数据。
- 空数据。
- 搜索无结果。
- 请求错误。
- 当前用户不能删除自己。
- viewer 角色没有操作权限。
- operator 只能导出或查看。
- locked 用户展示 error status。

## 权限策略

MVP 不做完整 RBAC package。

先在 demo 中实现：

```text
currentRole: owner | admin | operator | viewer
```

页面提供角色切换，用于验证不同权限状态。

规则：

- 权限判断可以在 `users/permissions.ts` 中实现。
- UI 接收 `disabled`、`disabledReason`。
- 不在 Button 内判断用户角色。
- 危险操作无权限时禁用并解释原因。
- 当前用户不能删除或禁用自己。

## 状态覆盖要求

MVP 页面必须覆盖以下状态。

### Loading

- 首次加载 table loading。
- refresh button pending。
- dialog submit pending。
- row action pending。
- batch action pending。

### Empty

- 暂无用户。
- 当前筛选无结果。

### Error

- 列表请求失败。
- 保存失败。
- 删除失败。

### Disabled

- 无权限操作禁用。
- 不可选择行 checkbox 禁用。
- pending 操作禁用。

### Success

- 创建成功。
- 编辑成功。
- 删除成功。
- 重置密码成功。

## 响应式范围

MVP 响应式只覆盖基础可用性。

桌面端：

- 完整 table。
- FilterBar 默认折叠高级筛选。
- 操作列可见。

平板端：

- table 允许横向滚动。
- PageHeader 低优先级操作可收起。

移动端：

- 可以保留横向滚动 table，或切换简化列表。
- 主操作可触达。
- Dialog 可使用接近 full 的宽度。
- 视口变化不重置筛选和选中状态。

## 一天内执行计划

### 0. 准备

确认：

- 当前文档已提交。
- Node / pnpm 可用。
- 仓库干净。

### 1. 初始化工程

完成：

- 创建 pnpm workspace。
- 创建 `apps/demo`。
- 创建 `packages/ui`、`packages/theme`、`packages/headless`、`packages/data`。
- 配置 TypeScript。
- 配置 Vite。
- 配置基础 scripts：
  - `dev`
  - `build`
  - `typecheck`

### 2. 实现主题和基础布局

完成：

- theme tokens。
- light/dark 切换。
- PageShell。
- PageHeader。
- 基础控制台布局。

### 3. 实现基础组件

完成：

- Button / IconButton。
- Tooltip。
- DropdownMenu。
- Dialog。
- ConfirmDialog。
- StateView。
- StatusBadge。

### 4. 实现列表组件

完成：

- FilterBar。
- DataTable。
- Pagination。
- BatchActionBar。
- table selection。

### 5. 实现 User Management

完成：

- users fixtures。
- mock API。
- list query。
- create/edit/delete/reset password。
- role switch。
- permissions。
- loading/empty/error/disabled/pending。

### 6. 验证

完成：

- `pnpm build`。
- `pnpm typecheck`。
- 本地打开 demo。
- 手动检查四个角色。
- 手动检查 light/dark。
- 手动检查 loading/empty/error。

## MVP 验收标准

MVP 完成需要满足：

- 项目可以安装依赖并启动。
- demo app 可以打开。
- User Management 页面可用。
- 表格可以筛选、分页、选择。
- 可以打开 create/edit dialog。
- 危险操作使用 ConfirmDialog。
- 不同角色能看到不同权限状态。
- disabled 操作能解释原因。
- loading、empty、error、pending 状态可触发。
- light/dark theme 可以切换。
- 响应式下页面不崩。
- build 和 typecheck 通过。

## 第一版之后的下一步

MVP 完成后，优先顺序：

1. 补 Drawer。
2. 补 Project Settings Detail。
3. 补 Wizard / Upload。
4. 补 Import Records。
5. 抽离完整 `packages/rbac`。
6. 抽离完整 `packages/i18n`。
7. 补 Playwright E2E。
8. 开始 CLI 设计。

## 风险与控制

| 风险 | 控制方式 |
|---|---|
| 一次实现太多组件 | MVP 只实现 User Management 必需组件。 |
| 组件过早抽象 | 先实现可运行页面，再沉淀稳定 API。 |
| 样式变成一次性页面 CSS | 所有颜色、间距、圆角使用 tokens。 |
| 权限写死在按钮里 | 权限判断放在 feature/domain 层。 |
| 状态遗漏 | 按状态覆盖要求逐项验收。 |
| 响应式失控 | MVP 只保证基础可用，不追求复杂移动端体验。 |

