# 项目设置详情页 Demo

## 页面目标

项目设置详情页用于展示 2B 控制台中的“资源详情 + 配置管理”页面。

它和列表页、导入任务页不同，核心是围绕一个具体资源进行长期查看和管理：

- 查看资源基础信息。
- 修改资源配置。
- 管理成员和权限。
- 查看安全设置。
- 查看关联数据。
- 查看 Activity Log / Audit Log。
- 执行启用、禁用、归档、删除等资源级操作。

该页面用于沉淀 Detail Page、Tabs、表单编辑模式、Drawer、ConfirmDialog、Audit Log 之间的组合方式。

## 使用场景

管理员进入某个项目或工作空间详情页，对其进行配置和维护。

常见任务包括：

- 查看项目状态和基础信息。
- 修改项目名称、描述、负责人。
- 配置通知、访问策略、数据保留周期。
- 管理项目成员。
- 查看集成配置。
- 查看项目活动记录。
- 查看审计日志。
- 禁用、归档或删除项目。

## 相关规则

生成或审查该页面时，需要参考：

- [AI 规则总入口](../../component-rules/_ai-bundles/all-ai-rules.zh.md)
- [Navigation Layout AI Bundle](../../component-rules/_ai-bundles/navigation-layout-ai-bundle.md)
- [Form Overlay AI Bundle](../../component-rules/_ai-bundles/form-overlay-ai-bundle.md)
- [详情页 AI 规则](../../component-rules/detail-page/detail-page-ai-rules.zh.md)
- [Tabs / Navigation AI 规则](../../component-rules/tabs-navigation/tabs-navigation-ai-rules.zh.md)
- [表单 AI 规则](../../component-rules/form/form-ai-rules.zh.md)
- [抽屉 AI 规则](../../component-rules/drawer-side-panel/drawer-side-panel-ai-rules.zh.md)
- [弹窗 AI 规则](../../component-rules/dialog/dialog-ai-rules.zh.md)
- [操作系统 AI 规则](../../component-rules/action-system/action-system-ai-rules.zh.md)
- [Timeline / Activity Log AI 规则](../../component-rules/timeline-activity-log/timeline-activity-log-ai-rules.zh.md)
- [状态标签 AI 规则](../../component-rules/status-badge/status-badge-ai-rules.zh.md)

## 页面边界

使用 Detail Page，而不是 Dialog 或 Drawer，因为：

- 页面有独立 URL，需要刷新、分享、收藏。
- 内容包含多个分区和大量配置。
- 用户会在该资源上执行多个操作。
- 存在成员、权限、日志等关联数据。
- 页面会成为一个主要工作面。

不应该使用 Dialog：

- 内容太多。
- 存在多个 section。
- 需要保留路由状态。
- 用户可能长时间停留。

可以使用 Drawer 的地方：

- 在详情页内查看某个成员详情。
- 在详情页内快速编辑某个局部配置。
- 在不离开当前详情页的情况下查看二级资源。

## 用户角色

Demo 中使用以下角色：

| 角色 | 说明 |
|---|---|
| `owner` | 拥有项目全部管理权限。 |
| `admin` | 可以编辑配置、管理成员、查看日志，但不能删除 owner 管理的项目。 |
| `operator` | 可以查看项目、编辑部分非敏感配置。 |
| `viewer` | 只能查看项目基础信息和可见日志。 |

## 权限矩阵

| 操作 | owner | admin | operator | viewer |
|---|---:|---:|---:|---:|
| 查看详情 | 是 | 是 | 是 | 是 |
| 编辑基础信息 | 是 | 是 | 部分 | 否 |
| 编辑安全配置 | 是 | 是 | 否 | 否 |
| 管理成员 | 是 | 是 | 否 | 否 |
| 查看 Activity Log | 是 | 是 | 是 | 是 |
| 查看 Audit Log | 是 | 是 | 否 | 否 |
| 禁用项目 | 是 | 是 | 否 | 否 |
| 归档项目 | 是 | 是 | 否 | 否 |
| 删除项目 | 是 | 有限制 | 否 | 否 |

规则：

- 权限不足的字段使用 disabled 或 readonly，并说明原因。
- 权限不足的操作按钮保持禁用态，并通过 tooltip 或说明文本解释原因。
- 敏感配置不要因为无权限而消失，除非展示本身也存在安全风险。
- 危险操作必须使用 ConfirmDialog。

## 页面结构

页面结构如下：

```text
PageShell
└── DetailPage
    ├── Breadcrumb / Back
    ├── PageHeader
    │   ├── 标题：项目名称
    │   ├── 状态：Active / Disabled / Archived
    │   ├── 元信息：项目 ID、负责人、创建时间
    │   └── 操作：刷新、编辑、更多
    ├── Summary
    └── Tabs / Route Navigation
        ├── Overview
        ├── Settings
        ├── Members
        ├── Security
        └── Activity
```

规则：

- 资源 identity 必须在首屏可见。
- 状态标签靠近标题。
- 页面级操作放在 PageHeader。
- 分区内容放在 Tabs 或 Route Navigation 中。
- 不要把详情页做成一堆无关卡片。
- 尽量使用清晰 section，而不是多层 card 嵌套。

## 路由与状态

推荐路由：

```text
/projects/:projectId
/projects/:projectId/settings
/projects/:projectId/members
/projects/:projectId/security
/projects/:projectId/activity
```

规则：

- `projectId` 属于 path。
- 当前 tab 可以使用 path segment，也可以使用 query，但复杂详情页推荐 route segment。
- 刷新后保持当前 tab。
- 返回上一级列表时，尽量恢复列表筛选、分页和滚动位置。
- 无效 tab fallback 到 Overview。
- 资源不存在时展示 Not Found StateView。
- 无权限访问时展示 Forbidden StateView，不要伪装成资源不存在。

## PageHeader

标题：

```text
项目名称
```

状态：

| 状态 | 语义 | 行为 |
|---|---|---|
| Active | success | 默认不可点击。 |
| Disabled | warning | 可点击查看禁用原因。 |
| Archived | neutral | 可点击查看归档信息。 |
| Error | error | 可点击查看错误详情。 |

元信息：

- 项目 ID。
- 负责人。
- 创建时间。
- 最近更新时间。

操作：

| 操作 | 类型 | 作用域 | 规则 |
|---|---|---|---|
| 刷新 | 图标按钮 | 页面 | 保留当前 tab 和局部状态。 |
| 编辑 | 主按钮 | 当前详情 | 进入编辑模式或打开编辑 Drawer。 |
| More | 图标按钮 | 页面 | 展示禁用、归档、删除、复制 ID 等操作。 |

规则：

- PageHeader 操作影响整个项目资源。
- Section 操作只影响当前 section。
- 不要把资源级危险操作放到普通 section 内。
- 删除、归档、禁用属于危险或高风险操作，需要二次确认。

## Summary

Summary 展示进入详细分区前最重要的信息。

内容：

- 当前状态。
- 负责人。
- 成员数量。
- 最近活动时间。
- 关键配置状态。
- 最近一次同步状态。

规则：

- Summary 必须紧凑。
- Summary 只展示关键事实，不替代详细 section。
- Summary 中的异常状态可以点击跳转到对应 tab。
- Summary 区域加载失败不应导致整个详情页不可用。

## Tabs / Route Navigation

推荐分区：

| 分区 | 内容 | 规则 |
|---|---|---|
| Overview | 基础信息、关键指标、最近活动 | 默认入口。 |
| Settings | 通用配置、通知配置、数据保留策略 | 支持查看态 / 编辑态。 |
| Members | 成员列表、角色、邀请、移除 | 使用 related table。 |
| Security | 访问策略、MFA、API token、敏感配置 | 权限要求更高。 |
| Activity | Activity Log / Audit Log | 使用日志规则。 |

规则：

- 如果 tab 需要可分享和刷新恢复，使用 Route Navigation。
- 如果只是同页轻量面板，可以使用 Tabs。
- 页面级 L1 分区使用 `pill` 或 route nav 样式。
- 不要创建过多 tiny tabs。
- 不要使用 Tabs 表达筛选条件。

## Overview

Overview 用于快速理解项目当前状态。

内容：

- 基础信息。
- 当前状态。
- 负责人。
- 成员数量。
- 最近活动。
- 最近错误或异常。
- 关键配置摘要。

规则：

- Overview 以只读展示为主。
- 只保留高频入口操作。
- 复杂编辑跳转到 Settings 或打开对应 Drawer。
- 异常状态需要提供可达的处理入口。

## Settings

Settings 用于管理项目配置。

字段：

| 字段 | 类型 | 规则 |
|---|---|---|
| 项目名称 | input | 必填。 |
| 项目描述 | textarea | 选填，有最大长度。 |
| 负责人 | select | 必填，有权限限制。 |
| 通知开关 | switch | 可即时修改或随表单保存，二选一保持一致。 |
| 数据保留周期 | select | 敏感配置，需要权限。 |
| 默认可见性 | radio 或 segmented control | 影响访问策略。 |

编辑模式：

- 字段少时，可以使用 Dialog 或 Drawer。
- 字段多且跨 section 时，使用页面内编辑模式。
- 当前 demo 推荐 Settings tab 内使用页面内编辑模式。

页面内编辑模式规则：

- 查看态和编辑态需要清晰区分。
- 编辑态必须有 Save 和 Cancel。
- 存在未保存内容时，离开 tab 或返回需要确认。
- 保存 pending 防止重复提交。
- 保存失败保留输入。
- 服务端字段错误尽量映射到具体字段。
- 权限不足字段保持 disabled 或 readonly，并说明原因。

## Members

Members 用于管理项目成员。

结构：

```text
Section Header
├── Search / Role Filter
├── Invite Member
└── Members Table
```

表格列：

- 成员。
- 角色。
- 状态。
- 最近访问。
- 加入时间。
- 操作。

操作：

- 邀请成员。
- 修改角色。
- 移除成员。
- 查看成员详情。

规则：

- Members 是 related table，拥有自己的 loading、empty、error 状态。
- 成员搜索和筛选是 section local state。
- 修改角色可以使用 Dialog 或 inline select，但需要明确保存策略。
- 移除成员是危险操作，必须使用 ConfirmDialog。
- 查看成员详情可以使用 Drawer，保留当前项目详情页上下文。

## Security

Security 用于管理敏感配置。

内容：

- MFA 要求。
- IP allowlist。
- API token。
- Webhook secret。
- 数据访问策略。

规则：

- 敏感字段默认不直接展示完整值。
- 复制 token、重置 secret、删除 token 等操作需要权限控制。
- 重置 secret 属于高风险操作，必须使用 ConfirmDialog。
- 无权限用户看到 readonly 或 permission state。
- 安全配置保存失败必须展示在 section 内，不要只用 toast。

## Activity / Audit Log

Activity 用于展示项目操作记录。

内容：

- 操作人。
- 操作类型。
- 操作对象。
- 操作时间。
- 变更摘要。
- 结果。

示例：

```text
小明 changed the project visibility from Private to Organization.
```

规则：

- Activity Log 按时间倒序。
- Audit Log 比 Activity Log 更严格，应该保留关键字段和结果。
- 日志列表有自己的分页或加载更多。
- 日志加载失败只影响日志 section。
- 敏感日志需要权限控制。

## Drawer 使用

适合使用 Drawer 的场景：

- 查看成员详情。
- 查看 API token 使用记录。
- 查看某条日志详情。
- 编辑单个局部配置。

规则：

- Drawer 默认从右侧打开。
- 默认宽度 70%。
- 如果内容撑不满 70%，优先考虑 Dialog。
- 下一级 Drawer 打开时，当前级可以占满 100%，下一级 70%。
- Drawer 关闭后保持详情页当前 tab。

## ConfirmDialog

### 禁用项目

标题示例：

```text
禁用项目？
```

描述示例：

```text
确认禁用“项目 A”吗？禁用后成员将无法继续访问该项目。
```

### 归档项目

标题示例：

```text
归档项目？
```

描述示例：

```text
确认归档“项目 A”吗？归档后项目将变为只读状态。
```

### 删除项目

标题示例：

```text
删除项目？
```

描述示例：

```text
确认删除“项目 A”吗？删除后项目数据不可恢复。
```

规则：

- ConfirmDialog 必须写清楚操作对象。
- 必须说明操作后果。
- 删除按钮使用 danger 样式。
- 确认按钮进入 pending。
- 删除成功后跳转回项目列表或安全的上级页面。

## 数据契约

### 路由参数

```ts
type ProjectDetailRouteParams = {
  projectId: string;
  section?: "overview" | "settings" | "members" | "security" | "activity";
};
```

### 项目详情

```ts
type ProjectDetail = {
  id: string;
  name: string;
  description?: string;
  status: "active" | "disabled" | "archived" | "error";
  owner: {
    id: string;
    name: string;
  };
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string;
  settings: {
    notificationEnabled: boolean;
    dataRetentionDays: number;
    visibility: "private" | "organization";
  };
  permissions: {
    canEditBasic: boolean;
    canEditSettings: boolean;
    canManageMembers: boolean;
    canViewSecurity: boolean;
    canEditSecurity: boolean;
    canViewAuditLog: boolean;
    canDisable: boolean;
    canArchive: boolean;
    canDelete: boolean;
  };
  disabledReasons?: Partial<Record<
    "editBasic" | "editSettings" | "manageMembers" | "viewSecurity" | "editSecurity" | "viewAuditLog" | "disable" | "archive" | "delete",
    string
  >>;
};
```

规则：

- 权限和禁用原因需要进入数据契约。
- 不要只在前端硬编码权限。
- section 数据可以按需加载。
- 局部 section 加载失败不应破坏整个详情页。

## 请求与刷新

规则：

- 页面初始加载先请求详情基础数据。
- Members、Security、Activity 可以按 tab 懒加载。
- 切换 tab 时保留已经加载过且仍然有效的数据。
- 手动刷新当前 tab 时，只刷新当前 tab 和必要的 summary。
- 页面级刷新可以刷新所有关键数据，但不能重置当前 tab。
- mutation 成功后，优先 patch 受影响区域，必要时刷新详情。
- 旧请求不能覆盖新的保存结果。

推荐优先级：

1. 保存、删除、归档、禁用等 mutation 结果。
2. 用户手动刷新。
3. 当前 tab 请求。
4. 背景刷新。

## 状态处理

### 初始 loading

- 使用详情页 skeleton。
- 保留 PageShell 和基本结构。
- 如果 title 未知，可以使用占位 skeleton。

### Not Found

资源不存在时：

```text
项目不存在或已被删除
```

规则：

- 提供返回项目列表操作。
- 不要展示空白详情页。

### Forbidden

无访问权限时：

```text
你没有权限查看该项目
```

规则：

- Forbidden 和 Not Found 区分处理。
- 不要暗示用户可以通过刷新解决权限问题。

### Section Error

规则：

- Members 加载失败只影响 Members。
- Security 加载失败只影响 Security。
- Activity 加载失败只影响 Activity。
- 只有基础详情无法加载时，才展示 page-level error。

### Empty

示例：

- Members：暂无成员。
- Activity：暂无活动记录。
- Security token：暂无 token。

规则：

- Empty 状态保持在当前 section 内。
- 有权限时提供下一步操作。

## 响应式策略

桌面端：

- 使用完整 Detail Page。
- 分区导航可以为水平 route nav 或左侧 sidebar。
- 表单可以使用两列布局。
- Related table 使用完整 table。

平板端：

- 分区导航可以横向滚动。
- 表单从两列变为单列或紧凑两列。
- Related table 允许横向滚动。

移动端：

- 分区导航使用横向 pills。
- 表单使用单列。
- Drawer 可变为底部抽屉或全屏页面。
- 危险操作保留在 More 或 Danger Zone 中。
- 响应式变化不能丢失当前 tab、编辑内容或未保存状态。

## 可访问性

规则：

- 当前 tab / route section 需要可识别。
- 表单字段需要 label、错误提示和 disabled 原因。
- 只有图标的操作需要可访问名称。
- ConfirmDialog 需要焦点陷阱。
- 编辑模式中的 Save / Cancel 对键盘用户可达。
- 日志列表需要清晰时间和操作人。

## AI 生成要求

生成该页面时，AI 必须：

- 使用 2B 控制台详情页布局。
- 使用 Detail Page，而不是 Dialog 承载主体内容。
- 包含 PageHeader、Summary、Tabs / Route Navigation。
- 至少包含 Overview、Settings、Members、Security、Activity 五个分区。
- Settings 支持查看态和编辑态。
- Members 使用 related table，并拥有局部状态。
- Security 体现权限和敏感字段处理。
- Activity 使用 Activity Log / Audit Log 模式。
- 资源级危险操作使用 ConfirmDialog。
- 局部详情或二级资源使用 Drawer。
- 包含 loading、empty、error、forbidden、not found、pending、disabled 状态。
- 保存和危险操作必须防重复点击。
- 响应式变化不能丢失当前 tab 和未保存内容。

## 验收标准

该页面满足以下条件时，视为合格：

- 用户能在首屏识别当前项目、状态和关键操作。
- 页面有可恢复、可分享的 URL。
- Overview、Settings、Members、Security、Activity 分区边界清晰。
- Settings 的查看态和编辑态清晰，保存失败不丢失输入。
- Members 作为 related table，有自己的状态和操作。
- Security 中的敏感字段有权限和展示策略。
- Activity / Audit Log 清晰记录操作人、时间、对象和结果。
- Drawer 只用于二级详情或局部任务。
- 删除、归档、禁用等危险操作都有具体 ConfirmDialog。
- Not Found、Forbidden、Section Error 区分处理。
- 页面在桌面端、平板端、移动端都能完成核心查看和配置任务。

