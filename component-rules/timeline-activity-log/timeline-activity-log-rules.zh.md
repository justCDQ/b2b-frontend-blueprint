# Timeline / Activity Log / Audit Log 时间线日志组件规范

> 用于 2B 产品中的时间顺序记录。
> Timeline 用于解释流程进度，Activity Log 用于解释操作事件，Audit Log 用于保留可信的合规/安全记录。

---

## 1. 组件边界

按照记录的用途选择组件，而不是按照视觉样式选择。

| 组件 | 使用场景 | 核心承诺 |
|---|---|---|
| Timeline | 流程进度、生命周期、审批路径、部署阶段。 | 帮助用户理解某个对象处在流程中的哪个位置。 |
| Activity Log | 围绕某个资源的近期用户/系统活动。 | 帮助用户理解操作层面发生了什么。 |
| Audit Log | 安全、合规、权限、账单、数据访问、破坏性操作。 | 提供精确、不可变、可信的证据。 |
| Task Log | 导入/导出/同步/job 执行输出。 | 帮助用户追踪机器任务进度并诊断失败。 |

规则：

- Timeline 偏叙事和状态。
- Activity Log 偏事件，可以更用户友好。
- Audit Log 偏证据，必须精确、可筛选、防篡改。
- Task Log 可以更技术化，也可以是 streaming。
- 不要用装饰性的 timeline 样式承载 audit data。
- 不要把 Activity Log 当成合规级别的 Audit Log。

使用 Timeline：

- 有少量有意义的 milestone。
- 用户关心进度、当前状态或下一步。
- 事件代表生命周期阶段，而不是每一次细小修改。

使用 Activity Log：

- 用户想查看近期变更或操作。
- 事件对协作和排查问题有帮助。
- 人类可读摘要比原始 payload 更重要。

使用 Audit Log：

- 事件可能用于安全审查、合规、账单争议、访问调查或事故复盘。
- 日志需要强筛选、精确时间、actor 身份、source、target 和不可变详情。

---

## 2. 事件数据契约

每个 event 应定义：

- `id`：稳定唯一的 event id。
- `timestamp`：服务端事件时间。
- `actor`：user、system、API key、integration、service account。
- `actorId`：可用时提供稳定 actor id。
- `action`：清晰动词或事件类型。
- `target`：受影响资源名称和/或 id。
- `targetType`：资源类型。
- `status`：success、failed、pending、warning、info。
- `summary`：短的人类可读事件标题。
- `description`：可选解释句。
- `metadata`：结构化详情。
- `source`：web、api、system、integration、scheduled job、CLI。
- `requestId` / `traceId`：用于支持和排查问题。
- `ip` / `location` / `userAgent`：只在相关且允许时展示。

最低数据要求：

| 组件 | 必需字段 |
|---|---|
| Timeline | id、timestamp、status、summary |
| Activity Log | id、timestamp、actor、action、target、status、summary |
| Audit Log | id、timestamp、actor、actorId/source、action、target、targetType、status、metadata |
| Task Log | id、timestamp、status、summary/message |

规则：

- Timestamp 必须由后端生成或确认。
- Audit Log 不能依赖客户端生成的 timestamp。
- Actor 必须明确：user、system、API key、integration、service account。
- 当日志需要筛选时，action 应使用受控词表。
- 当资源名称可能变化时，target 必须包含稳定 id。
- Status 不能只依赖颜色表达。
- Metadata 应保持结构化，不要只有纯文本。

---

## 3. 展示结构

默认 event 展示：

```text
Status marker / icon
Summary
Actor + action + target
Timestamp
Optional description
Optional metadata/details
```

Timeline 展示：

- 强调 milestone title 和当前状态。
- 清楚展示当前 step。
- 展示 completed、current、failed、upcoming 状态。
- 避免展示过多低价值事件。
- 展示 lifecycle progress 时通常 oldest-first 更好。

Activity Log 展示：

- 强调 `谁对什么做了什么`。
- 默认通常 newest-first。
- Summary 可以比原始 event name 更友好。
- 相关事件可以按时间、actor 或 batch operation 分组。

Audit Log 展示：

- 高密度场景下，优先使用紧凑 list/table-like rows，而不是装饰性 timeline。
- 展示精确 timestamp、actor/source、action、target 和 status。
- 文案保持事实化、中性。
- 不要只用装饰性摘要隐藏重要详情。

Task Log 展示：

- 任务运行中时展示 streaming/pending 状态。
- 有价值时展示步骤输出、warning、failure、retry、duration。
- 长日志应该支持折叠、搜索或下载。

---

## 4. 排序、分组与分页

排序规则：

- Activity Log 和 Audit Log 默认 newest-first。
- Timeline 展示进度/生命周期故事时默认 oldest-first。
- Task Log 通常使用 oldest-first 展示执行流程。
- 排序方向必须可见或符合预期。

分组规则：

- 长日志按日期分组。
- 只有 actor 是主要调查维度时，才按 actor 分组。
- 一次 action 产生多个 events 时，可以按 batch/request 分组。
- Audit records 不能因为分组而隐藏单条事件身份。

分页/加载规则：

- 大型 logs 必须使用 pagination、cursor loading 或 infinite loading。
- Audit Log 优先使用明确分页或 cursor-based loading，避免无边界的无限滚动。
- Activity Log 可以使用 `Load more`。
- Task Log 运行中可以 streaming，结束后变成稳定历史记录。
- Newest-first list 的 Load more 通常出现在底部，除非是反向时间流的 chat-style 列表。
- 当事件数量很高且行高足够稳定时，可以使用虚拟滚动。

---

## 5. 筛选与搜索

常见 filters：

- Time range。
- Actor。
- Action type。
- Status。
- Source。
- Target/resource。
- Resource type。
- Request id / trace id。
- IP / API key / integration，按场景决定。

规则：

- Audit Log 必须提供 time range filter。
- 当字段存在时，Audit Log 应提供 actor/action/status/source filters。
- 页面级 logs 在需要恢复/分享时，应把 filters 保存在 URL 中。
- 有价值时，search 应支持 id、actor name、resource name、request id 和精确 event id。
- Filter empty state 必须区分 `没有事件` 和 `当前筛选无结果`。
- Audit Log 的 filters 不应静默默认到很窄的时间范围，除非界面清楚展示。

---

## 6. 详情与元数据

使用 inline detail：

- Event 只有 1-3 个短的额外字段。
- 详情能立刻帮助用户理解 summary。

使用 collapsible detail：

- Metadata 有价值但较长。
- 包含 before/after values、reason、request id 或 error detail。

使用 Drawer/Dialog detail：

- Metadata 很大或结构复杂。
- 用户需要对比 before/after data。
- Event 包含 error stack、request payload summary、permission context 或相关 records。

规则：

- 敏感值必须 masked。
- 对 event id、request id、trace id、resource id、actor id 等常用排查字段提供 copy action。
- Failed events 有错误原因时应暴露。
- 对 before/after changes，展示 field name、previous value 和 new value。
- 对 deleted resources，保留足够身份信息，让用户知道删除了什么。
- 不要在日志中暴露 secrets、tokens、passwords、private keys 或完整 credentials。

---

## 7. 交互规则

允许的交互：

- 展开/收起详情。
- 打开 event detail drawer/dialog。
- 复制 id。
- 按 actor/action/target/status 快速筛选。
- 权限允许时跳转到相关资源。
- 仅在 Task Log 且业务明确支持时，允许 retry task step。

不允许：

- 编辑 audit records。
- 从 UI 删除 audit records。
- 修改原始 event content。
- 通过纯客户端 UI 逻辑隐藏 audit events。

点击行为：

- Timeline milestone 点击可以打开 milestone detail。
- Activity Log row 在存在 metadata 时可以打开详情。
- Audit Log row 应打开只读详情。
- Task Log row 可以展开原始输出或诊断信息。
- 如果 event 关联外部资源或已删除资源，应展示明确的 unavailable/deleted state。

操作摆放：

- Row-level actions 应低干扰，并靠右放置。
- 常见操作：copy、view detail、filter by this value。
- Dangerous actions 不应该出现在 audit log rows 中。
- 如果 Task Log 中存在 retry，必须遵循 Action System 的 pending/disabled 规则。

---

## 8. 可靠性与可信度

Audit Log 可靠性规则：

- Audit records 在产品 UI 中不可变。
- Events 应由服务端创建。
- Timestamp 应使用服务端时间，必要时包含 timezone context。
- Actor identity 应稳定，即使 display name 变化也能追溯。
- Resource identity 应稳定，即使 resource name 变化也能追溯。
- Redaction 必须保留足够调查上下文。
- 当合规/调查工作流需要时，应提供 export。

Activity Log 可靠性规则：

- Activity summary 可以更友好，但不能和源数据矛盾。
- 如果事件存在最终一致性，必要时展示 refresh 或 last updated state。
- Refresh 失败时，保留旧 logs，并展示非破坏性错误反馈。

Task Log 可靠性规则：

- Running state 必须区分 queued、running、retrying、succeeded、failed、canceled。
- 如果 streaming 断开，应展示 reconnect/retry 状态。
- 后端状态确认前，不要把 task 标记为 successful。

---

## 9. Empty、Loading、Error 与 Permission

Loading：

- 初次加载可以使用 skeleton rows 或紧凑 loading。
- 增量加载不能清空已加载 events。
- Refresh pending 时尽量保留旧数据。

Empty：

- Empty timeline 说明暂无 milestone started 或暂无 history。
- Empty activity log 说明暂无 activity。
- Empty audit log 应事实化表达，未知时不要暗示是权限问题。
- Filter empty 提供 `Clear filters`。

Error：

- 初次加载失败使用 StateView 并提供 retry。
- Refresh 失败保留旧 events，并用 toast 或 inline warning 提示。
- Failed event 和 log loading failed 是两个不同概念。

Permission：

- Permission denied 不能表现得像 empty data。
- Audit Log 权限错误应以高层级说明访问受限。
- 敏感 metadata 可以局部 masked，但 event row 仍然可见。

---

## 10. 移动端

规则：

- 使用紧凑 stacked rows。
- Timestamp 和 actor 保持可见。
- Metadata/detail 放入 expandable section 或 drawer。
- 避免在小弹窗中承载密集 audit investigation workflow。
- Filters 可折叠进 filter drawer/sheet。
- 长技术 Task Log output 应换行或打开 full-screen detail。

---

## 11. 可访问性

规则：

- Timeline 顺序必须能被程序化理解。
- Status markers 必须有文本替代。
- 展开/收起控件必须支持键盘访问。
- Row actions 必须有 label/tooltip。
- Timestamp 应能被辅助技术读懂，不能只有相对时间。
- 不要只依赖颜色表示 success/failure/warning。

---

## 12. 示例

Timeline：

```text
Created -> Configured -> Waiting for approval -> Approved -> Published
```

Activity Log：

```text
小明 changed the workspace name from "Data Ops" to "Data Platform".
System synced 1,240 records from Salesforce.
API key "prod-sync" failed to update customer #CUS-1024.
```

Audit Log：

```text
2026-05-22 14:35:12 UTC
actor: rebecca@example.com / user_123
action: role.updated
target: workspace_456
source: web
status: success
metadata: role changed from Viewer to Admin
```

Task Log：

```text
14:30:01 Queued import job
14:30:08 Parsed file: 4,200 rows
14:30:14 Warning: 12 rows missing optional phone number
14:30:20 Failed: 3 required fields missing
```

---

## 13. AI 审查清单

- 组件类型是否匹配 timeline/activity/audit/task 的真实目的。
- Audit Log 是否没有被实现成装饰性 timeline。
- Event contract 是否包含 timestamp、actor、action、target、status，以及必要的稳定 id。
- Audit timestamp 和 actor 是否来自可信后端数据。
- 排序方向是否有意设计，并且可见或可预测。
- 大型 logs 是否有 pagination/loading strategy。
- Audit Log 是否有 time range 和有用 filters。
- Details 是否可折叠或打开只读详情。
- 敏感数据是否 masked。
- Empty、filter empty、error、permission states 是否清楚区分。
- Refresh 失败时是否尽量保留旧 events。
- Audit records 是否不能从 UI 编辑或删除。
