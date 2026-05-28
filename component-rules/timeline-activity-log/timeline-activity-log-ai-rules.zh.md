# Timeline / Activity / Audit Log AI 执行规则

> 用于 AI 生成 2B Timeline、Activity Log、Audit Log、Task Log 交互的压缩版规则。
> 详细解释参考 `timeline-activity-log-rules.zh.md`。

---

## 1. 组件边界

按用途选择：

| 组件 | 用途 |
|---|---|
| Timeline | 进度、生命周期、审批/部署阶段 |
| Activity Log | 近期用户/系统操作事件 |
| Audit Log | 安全/合规/权限/账单证据 |
| Task Log | 导入/导出/同步/job 执行输出 |

规则：

- Timeline 偏叙事/状态。
- Activity Log 偏事件，可更用户友好。
- Audit Log 偏证据，精确、不可变、可筛选。
- Task Log 可技术化、可 streaming。
- 不要把 Audit Log 做成装饰性 timeline。

---

## 2. Event 契约

Event 应包含：

- id
- server timestamp
- actor，可用时 actorId
- action
- target 和 targetType
- status
- summary
- metadata/details
- source
- 有用时 requestId/traceId

规则：

- Audit Log 不能依赖 client timestamp。
- Actor/source 必须明确。
- 名称可能变化时，target 应包含稳定 id。
- 需要筛选时，action 使用受控词表。
- Metadata 保持结构化。
- Status 不只依赖颜色。

---

## 3. 展示

规则：

- Timeline 通常 oldest-first，强调 current milestone。
- Activity Log 通常 newest-first，强调 `谁对什么做了什么`。
- Audit Log 通常 newest-first，高密度、事实化、只读。
- Task Log 通常 oldest-first，并展示 queued/running/retrying/succeeded/failed/canceled。
- 长 metadata 折叠或打开只读 drawer/dialog。
- 敏感值必须 masked。

---

## 4. 筛选与分页

规则：

- Audit Log 必须有 time range filter。
- 字段存在时，Audit Log 应支持 actor/action/status/source filters。
- 有用时，search 支持 ids、actor/resource names、requestId/traceId。
- 大型 logs 使用 pagination、cursor loading、load more 或 virtual scroll。
- Audit Log 优先明确 pagination/cursor，避免无边界 infinite scroll。
- Filter empty 和 no events 必须区分。

---

## 5. 交互

允许：

- 展开/收起 details。
- 打开只读详情。
- 复制 ids。
- 按 actor/action/target/status 快速筛选。
- 权限允许时跳转相关资源。
- 仅在业务支持时 retry task step。

禁止：

- 编辑 audit records。
- 从 UI 删除 audit records。
- 修改原始 event content。
- 用纯客户端逻辑隐藏 audit events。
- 在 audit rows 中放 dangerous actions。

---

## 6. 状态与可靠性

规则：

- 初次加载可用 skeleton rows。
- 增量加载保留已有 events。
- Refresh 失败保留旧 events。
- Permission denied 不能像 empty data。
- Forbidden audit detail 说明访问受限。
- 相关资源 not-found/deleted 时展示清晰 unavailable state。
- Audit records 在产品 UI 中不可变。
- 合规调查需要时提供 export。

---

## 7. AI 检查清单

- 组件选择是否匹配用途。
- Audit Log 是否不是装饰性 timeline。
- Event 是否包含 timestamp、actor、action、target、status 和必要稳定 id。
- Audit timestamp/actor 是否来自后端。
- 排序方向是否有意设计。
- Audit filters 是否包含 time range。
- 敏感数据是否 masked。
- Details 是否只读且可折叠/drawer。
- Empty/error/permission states 是否区分。
- Audit records 是否不能编辑/删除。
