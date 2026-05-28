# Wizard / Stepper AI 执行规则

> 用于 AI 生成 2B 向导/步骤器交互的压缩版规则。
> 详细解释参考 `wizard-stepper-rules.zh.md`。

---

## 1. 什么时候使用

使用 Wizard/Stepper：

- 任务真实有顺序。
- 后续步骤依赖前面输入。
- 每一步有有意义的校验或决策。
- 进度很重要。
- 最终操作会创建/修改/导入/部署/连接重要资源。

不要使用：

- 字段独立且适合放在一个表单。
- tabs/accordion/detail edit page 更自然。
- 拆分只是为了减少高度，但增加切换成本。
- 用户需要自由比较多个 sections。

---

## 2. Step 契约

每个 step 必须定义：

- 稳定 `id`
- 具体 `title`
- optional description
- content
- validation owner
- next availability
- back behavior
- side effects/request behavior

规则：

- Step title 描述用户决策。
- 默认舒适范围是 2-5 步。
- 超过 7 个可见步骤通常需要分组或 full setup page。
- 不要为了一个普通字段单独创建 step，除非它会改变后续流程。

---

## 3. 导航

选择一种模式：

- linear locked
- linear with completed jump
- free navigation
- route-backed steps

规则：

- `Next` 校验当前 step。
- `Back` 保留输入。
- 只有安全时，completed steps 才能回跳。
- Future locked steps 保持锁定，除非 workflow 允许。
- 前置变化导致后续数据失效时，明确标记 stale 或显式 reset。
- 不要静默丢弃后续 step data。
- 最后一步 action label 描述最终操作：Create、Import、Publish、Save。

---

## 4. 校验与提交

规则：

- Next 只校验当前 step fields。
- Final submit 校验所有 required data。
- 跨步骤错误尽量映射到受影响 field/step。
- Server errors 尽量映射回 step/field。
- Submit 失败保留所有输入。
- Async validation 展示 pending，并防止重复 Next/Submit。
- Review step 在最终提交前重新校验。

---

## 5. 保存与 Pending

规则：

- Step navigation 不能重置 fields。
- Dirty data 保留，除非用户明确 cancel/reset。
- 长流程/关键流程需要 draft saving 或 autosave。
- 需要刷新/分享恢复时，用 route/query + server/local draft。
- Final submit pending 禁用 submit，防止重复请求。
- 非最终 field validation 不应阻塞 Back，除非离开会破坏状态。

---

## 6. Step States

支持：

- upcoming
- current
- completed
- stale
- error
- locked
- pending
- disabled

规则：

- Completed 表示本地有效，不代表已提交服务端。
- Error 优先级高于 completed。
- Stale 在最终提交前必须重新检查。
- Locked/disabled step 可交互时需要 reason。
- 不只依赖颜色表达状态。

---

## 7. Review 与确认

使用 review step：

- 最终动作难撤回。
- 决策跨多个 steps。
- import/deploy/billing/permission 影响需要确认。

规则：

- Review 只汇总对决策关键的信息。
- 提供 edit actions 回到具体 steps。
- 危险/高风险最终 action 使用 ConfirmDialog。
- Confirm text 写清 target、action、consequence。

---

## 8. 承载与响应式

规则：

- Dialog wizard：2-3 个短步骤。
- Drawer wizard：中等流程，同时保留上下文。
- Full page wizard：长、可分享、可恢复、重 review 流程。
- 移动端 stepper 折叠为 step count + 当前 title。
- 移动端复杂 step content 使用 full page，不塞进拥挤 dialog。

---

## 9. AI 检查清单

- Wizard 是否比 single form/tabs/detail edit 更合理。
- Step order 是否匹配真实依赖。
- 是否选择了一种 navigation mode。
- Next 是否校验当前 step。
- Final submit 是否校验所有 steps。
- Back 是否保留输入。
- 前置 step 变化是否处理后续失效。
- Step states 是否包含 error/stale/pending/locked。
- 长流程是否有 draft/recovery。
- 危险 final action 是否使用 ConfirmDialog。
