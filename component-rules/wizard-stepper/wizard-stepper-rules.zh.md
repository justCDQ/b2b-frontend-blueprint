# Wizard / Stepper 向导步骤组件规范

> 用于 2B 产品中的引导式多步骤流程。
> Wizard 是流程模式，Stepper 是展示流程进度和步骤状态的视觉/导航组件。

---

## 1. 组件边界

当任务存在真实顺序、依赖或风险时，使用 Wizard / Stepper：

- 后续输入依赖前面的输入。
- 任务太复杂，不适合放在一个表单中，但仍然属于同一个流程。
- 每一步都有明确的校验或用户决策。
- 用户需要知道当前进度，才能放心完成最终提交。
- 最终操作会创建、修改、导入、部署、连接重要资源。

常见 2B 场景：

- 创建 project / workspace / application。
- 连接 integration 或 data source。
- 导入数据，并进行字段映射和校验。
- 配置 billing、权限、部署或自动化任务。
- 引导式 onboarding 或系统 setup。
- 多步骤审批、发布流程。

不要使用 Wizard / Stepper：

- 所有字段互相独立，并且能清晰地放在一个表单中。
- 拆分步骤只是为了减少页面高度，但增加了切换成本。
- 用户需要同时对比多个区块。
- 页面主要是只读详情。
- 使用 Tabs、Accordion 或详情页编辑模式更自然。

与其他组件的边界：

| 模式 | 使用场景 |
|---|---|
| Single Form | 字段较少、彼此独立，并且可以一次性保存。 |
| Dialog Form | 任务短、聚焦，不需要离开当前上下文。 |
| Detail Edit Page | 表单很大、需要分享/刷新恢复、需要丰富的辅助数据。 |
| Tabs | 多个区块是平级关系，可以任意顺序访问。 |
| Wizard / Stepper | 步骤存在顺序关系，进度会影响完成结果。 |

---

## 2. 步骤设计

每个 step 必须定义：

- `id`：稳定 key，不能使用展示文案。
- `title`：短且具体。
- `description`：可选，只在能帮助用户理解当前任务时使用。
- `content`：字段、选项、预览、上传、映射或确认内容。
- `validation`：当前步骤负责的字段和规则。
- `nextAvailability`：什么条件下允许继续下一步。
- `backBehavior`：是否允许返回，以及返回后如何保留状态。
- `sideEffects`：当前步骤是否会触发请求、上传、预览、校验或保存草稿。

Step title 应该描述真实决策，不要只描述流程序号：

- 推荐：`选择数据源`、`映射字段`、`确认变更`、`配置权限`。
- 避免：`Step 1`、`基础信息`、`更多设置`、`完成`。

Step 数量规则：

- 默认舒适范围是 2-5 步。
- 6-7 步只适合复杂 setup / import 流程。
- 超过 7 个可见步骤时，通常应该改成分组阶段或完整 setup 页面。
- 不要为了一个普通字段单独创建一步，除非这个字段会改变整个后续流程。

推荐布局：

```text
Header: 流程标题 + 简短说明
Stepper: 步骤标签 + 步骤状态
Body: 当前步骤内容
Footer: Back / Cancel / Next / Submit
```

布局规则：

- Header 在各步骤中保持稳定。
- Footer 操作区在各步骤中保持一致。
- 桌面端主按钮放在最右侧。
- 不隐藏关键进度。
- 不把无关的全局页面操作放进 Wizard footer。
- 如果某一步中包含 table/list，它的局部操作应放在 step body 内部。

---

## 3. 导航模式

每个 Wizard 只能选择一种主要导航模式。不要在没有明确理由时混用策略。

| 模式 | 使用场景 | 行为 |
|---|---|---|
| Linear locked | 存在严格依赖。 | 用户只能通过 Back / Next 移动，未来步骤锁定。 |
| Linear with completed jump | 大多数 setup 流程。 | 用户可以跳回已完成步骤，未来步骤仍锁定。 |
| Free navigation | 各步骤相对独立。 | 用户可以自由切换步骤，最终提交时统一校验。 |
| Route-backed steps | 长流程、可恢复流程或可分享流程。 | 当前步骤通过 URL path/query 表达。 |

导航规则：

- 点击 `Next` 前必须校验当前 step。
- 点击 `Back` 必须保留已填写输入。
- 只有在不会破坏后续依赖数据时，才允许跳回 completed steps。
- 如果修改前置步骤会导致后续步骤失效，必须明确将后续步骤标记为 stale，或者显式重置。
- 不要在前置依赖变化后静默丢弃后续步骤数据。
- Future locked steps 只有在能帮助用户理解进度时才展示。
- Locked steps 在 hover/focus/click 时应提供原因。

按钮规则：

- 第一步：显示 `Cancel` 或符合上下文的次级操作，不显示 disabled `Back`。
- 中间步骤：显示 `Back` 和 `Next`。
- 最后一步：显示 `Back` 和 `Submit` / `Create` / `Import` / `Publish`。
- 最后一步按钮文案必须描述最终动作。
- 会创建或修改数据的操作不要使用泛泛的 `Done`。

---

## 4. 校验与约束

校验遵循归属原则：

- 点击 `Next` 时，只校验当前步骤负责的字段。
- 最终提交时，校验所有步骤中的必填项和规则。
- 跨步骤约束尽量显示在受影响字段附近。
- 如果跨步骤错误无法映射到单个字段，应显示在对应 step body 中，并将该 step 标记为 error。
- 服务端校验错误应尽可能映射回对应 step 和 field。

校验时机：

- 必填项：在 Next / Submit 时校验。
- 简单格式规则：在 blur 或 Next 时校验。
- 成本较高的异步校验：在 blur、防抖后或 Next 时校验，并显示 pending。
- 上传/导入校验：在文件解析或服务端检查后校验。
- Review step：最终提交前重新校验所有步骤。

错误处理：

- Next 失败时，用户停留在当前 step。
- Submit 失败时，保留所有输入，并高亮受影响 steps。
- 如果服务端返回的是之前步骤中的错误，应跳转到第一个 error step，或提供带跳转能力的错误摘要。
- 不要因为某一步失败而清空其他步骤中已经有效的数据。

---

## 5. 数据保存与恢复

步骤内状态必须在步骤切换中保留。

规则：

- 来回切换步骤不能重置字段。
- Dirty data 必须保留，除非用户明确取消或重置。
- 文件上传、解析预览、字段映射结果需要展示稳定的 pending/error/success 状态。
- 如果流程耗时较长，应提供草稿保存或自动保存。
- 如果刷新/分享恢复很重要，应把当前 step 写入 route/query，并从服务端或本地草稿恢复表单状态。

草稿策略：

| 策略 | 使用场景 |
|---|---|
| Local in-memory | 短流程、低风险、不需要刷新恢复。 |
| Local storage/session draft | 中等流程，刷新恢复有帮助。 |
| Server draft | 长流程、业务关键、多人协作或需要稍后继续。 |

取消规则：

- 没有 dirty data 时，Cancel 可以直接关闭或离开。
- 有 dirty data 时，离开前必须二次确认。
- 如果存在 server draft，需要明确提供：丢弃草稿、保留草稿、继续编辑。

---

## 6. 异步与 Pending

Wizard step 中经常包含异步行为：拉取选项、唯一性校验、文件解析、预览结果、保存草稿、最终提交。

规则：

- Step-level pending 只阻塞受影响的 step action。
- Field-level pending 只阻塞相关字段，必要时阻塞 Next。
- Final submit pending 必须禁用 submit，防止重复请求。
- 非最终提交的字段校验期间，Back 通常仍应可用，除非离开会破坏状态。
- Final submit 期间，应避免允许用户导航造成重复或不一致操作。
- 最终 create/import/deploy 等操作应尽量具备幂等或请求去重能力。

防重复规则：

- validation pending 时，`Next` 不能被连续触发。
- submission pending 时，`Submit` 不能被连续触发。
- 如果某一步启动了长任务，应展示任务状态，不要假装已经立即完成。

---

## 7. 步骤状态

支持的状态：

- `upcoming`：可见但尚未到达。
- `current`：当前激活步骤。
- `completed`：用户已完成当前步骤的必要输入。
- `stale`：曾经完成，但因为前置依赖变化需要重新检查。
- `error`：包含校验错误或服务端错误。
- `locked`：当前还不能进入。
- `pending`：异步校验、保存或提交中。
- `disabled`：由于权限或流程状态不可访问。

规则：

- Completed 只代表当前步骤本地有效，不一定代表已经提交到服务端。
- Error 状态优先级高于 completed 状态。
- Pending 状态必须防止重复 Next/Submit。
- Locked/disabled step 如果可交互，需要提供原因。
- Stale step 在最终提交前必须重新检查。
- Stepper 不要只依赖颜色表达状态，需要文本、图标或可访问状态辅助。

---

## 8. Review 与确认

以下情况使用 review step：

- 流程跨越多个重要决策。
- 最终动作难以撤回。
- 用户需要确认自动生成的映射、权限、账单、部署或导入结果。
- 最终提交会影响大量记录或外部系统。

Review step 规则：

- 只汇总对决策重要的信息。
- 按 step 或业务域分组展示摘要。
- 提供 edit action，允许跳回对应 step。
- 从 review 返回前面步骤编辑后，适合时应回到 review。
- 最终提交前展示 warning、影响范围、记录数量和不可逆后果。

危险/高风险最终操作：

- 遵循 `action-system-rules` 和 `dialog-rules`。
- 破坏性/高风险确认使用 ConfirmDialog。
- 确认文案必须写清楚目标对象/范围、动作和后果。
- 不要使用 `Are you sure?` 或类似泛泛文案。

---

## 9. 路由与承载位置

根据流程大小选择承载方式：

| 承载方式 | 使用场景 |
|---|---|
| Dialog wizard | 2-3 个短步骤，小表单，低上下文依赖。 |
| Drawer wizard | 用户需要保留列表/详情上下文，同时完成中等复杂流程。 |
| Full page wizard | 长流程、业务关键、需要分享/恢复、需要仔细 review。 |

规则：

- 长导入、长 setup 流程通常应该使用 full page。
- Dialog wizard 不能超过 dialog 的复杂度边界。
- Drawer wizard 不能变成拥挤的 full-page 替代品。
- Route-backed wizard 应保留当前 step 和关键业务标识。
- Browser Back 行为必须明确：回到上一步、回到前一页，还是离开流程。

---

## 10. 移动端

规则：

- 空间不足时，将完整 stepper 折叠为 `第 2 / 5 步` + 当前 step title。
- 避免长 step label 造成横向溢出。
- Footer actions 必须保持可达。
- 长内容在 body 中滚动；如果在 dialog/drawer 中，header/footer 保持稳定。
- 小屏幕 footer 中尽量每行只有一个主操作。
- 如果 step content 包含复杂 table/list 操作，应考虑使用 full page，而不是移动端弹窗。

---

## 11. 可访问性

规则：

- Stepper 必须向辅助技术暴露当前步骤和步骤状态。
- 当 step label 可交互时，键盘用户必须能访问。
- Locked/disabled steps 应被声明为不可用。
- Next/Submit 失败后的错误摘要应可被 focus。
- 步骤切换或校验失败后，焦点应移动到新 step title 或第一个错误字段。
- 不要只依赖颜色表达 completed/error/locked 状态。

---

## 12. 示例

创建 integration：

```text
1. 选择 provider
2. 连接账号
3. 配置同步规则
4. 确认并启用
```

导入数据：

```text
1. 上传文件
2. 映射字段
3. 校验记录
4. 确认影响范围
5. 执行导入
```

配置权限：

```text
1. 选择用户
2. 分配角色
3. 配置范围
4. 确认变更
```

避免：

```text
1. 名称
2. 描述
3. 保存
```

这种通常应该使用单个表单。

---

## 13. AI 审查清单

- Wizard 是否比单表单、Tabs、Dialog Form 或详情页编辑更合理。
- Step 顺序是否匹配真实依赖。
- Step 数量是否合理。
- Step title 是否描述了用户决策。
- 是否选择并坚持了一种导航模式。
- Next 是否只校验当前 step。
- Final submit 是否校验所有必填数据。
- Back 是否保留数据。
- 前置步骤变化后，是否明确处理后续步骤失效。
- Completed/error/stale/locked/pending 状态是否可见。
- Submit 失败是否保留所有输入，并将错误映射回步骤。
- 长流程或重要流程是否有草稿/恢复策略。
- 危险最终操作是否使用 ConfirmDialog。
- 移动端 stepper 是否紧凑可用。
