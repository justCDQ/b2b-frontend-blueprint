# Action System AI 执行规则

> 用于 AI 生成 2B 按钮/操作交互的压缩版规则。
> 详细解释参考 `action-system-rules.zh.md`。

---

## 1. 核心规则

每个 action 必须只有一个清晰意图：

- create
- update
- delete
- submit
- navigate
- refresh
- filter
- export/import
- enable/disable
- batch operation
- open detail/dialog/drawer/menu

如果 action 同时修改数据并跳转，先按 mutation 处理。成功后再导航。

---

## 2. 优先级

规则：

- 每个可见作用域最多只有一个 primary action。
- Primary action 必须代表当前作用域内的主要用户目标。
- Secondary actions 支持主任务。
- 低频操作放入 overflow/menu。
- 危险操作不要作为 primary，除非整个界面就是为这个危险任务服务。
- 导航操作使用 link/navigation 语义，不使用 mutation button 语义。

优先级顺序：

```text
primary goal -> frequent safe action -> secondary action -> overflow -> dangerous action
```

---

## 3. 作用域

根据 action 影响范围摆放：

| 作用域 | 摆放位置 |
|---|---|
| page/resource | page header |
| list/query | FilterBar 或 list toolbar |
| selected rows/items | batch toolbar |
| row/item | row action column 或 card action area |
| dialog | dialog footer |
| form | form footer/action area |
| field | field suffix/inline control |
| StateView | StateView action area |

规则：

- 不要混用 page actions 和 row actions。
- 不要把 resource-specific actions 放进 global shell。
- Row actions 只影响当前行。
- Batch actions 需要先选择 items。
- Dialog actions 放在 footer，除非是局部 inline action。

---

## 4. Pending 与防重复

规则：

- submit/create/update/delete/import/export 操作必须立即展示 pending。
- pending 中禁止重复触发。
- Pending scope 使用最小安全范围：button、row、batch toolbar、form、dialog、field、navigation、refresh。
- Form submit pending 禁用 submit，防止重复提交。
- Row mutation pending 在安全时只阻塞当前行操作。
- Batch pending 阻塞 batch action 和受影响 selection。
- Refresh pending 尽量保留旧数据。
- Navigation pending 防止重复 route push。
- 乐观更新失败必须 rollback 或标记失败。

不要：

- 在状态不会不一致时禁用无关安全导航。
- Refresh pending 时清空仍可用旧数据。
- 允许双击造成重复 mutation。

---

## 5. Disabled 与权限

规则：

- 只有用户不应该知道功能存在时才隐藏 action。
- 用户能看见但不能使用时，使用 disabled。
- Disabled 原因不明显时必须说明原因。
- Permission-disabled action 在安全时说明所需权限或角色。
- State-disabled action 说明所需状态。
- Disabled icon action 仍需要 tooltip/reason。
- Disabled menu item 在能解释不可用选项时保持可见。

不要：

- 把 disabled primary action 作为唯一恢复路径。
- 混乱使用 permission hidden 和 disabled。
- 移动端只依赖 tooltip 解释原因。

---

## 6. 危险操作

危险操作包括破坏性、不可逆、高影响范围或大范围操作。

规则：

- 破坏性/高风险确认使用 ConfirmDialog。
- 确认文案必须写清楚目标对象/范围、动作和后果。
- 不使用 `Are you sure?` 或 `确认删除吗？` 这类泛泛文案。
- 危险操作通常放在 overflow、danger zone 或分隔后的 menu group。
- Menu 中危险项的 icon 和 label 都使用 danger 样式。
- 危险操作 pending 中禁止重复触发。
- 失败时保留上下文，并说明是否已有部分变更。

好的确认文案：

```text
删除项目 "Acme Sync"？
这会移除它的配置，且无法撤回。
```

---

## 7. Icon、Menu 与 Batch Actions

Icon actions：

- 使用语义化 icon。
- 同一作用域内不要用同一 icon 表示不同含义。
- 提供 tooltip/accessible label。
- Row icon actions 最多外露 3 个，其余放入 More menu。

Menu actions：

- 相关 items 分组。
- 危险 items 放最后或单独分组。
- 系统一致时，menu item 使用 icon + label。
- 外部跳转尽量展示 external-link affordance。

Batch actions：

- 只有存在 selection 后才出现。
- 展示 selected count。
- 说明 action 影响当前页、已选 items，还是全部匹配结果。
- 危险 batch actions 必须使用 ConfirmDialog。

---

## 8. 反馈

规则：

- 成功 mutation 通常使用 toast 或局部成功状态。
- Blocking errors 使用 inline/StateView，不只用 toast。
- 页面内容仍可用时，单个 action 失败可以用 toast。
- Form submit errors 尽量映射到字段。
- Refresh 失败保留旧数据，并展示轻量 error/toast。

---

## 9. AI 检查清单

- Action intent 是否清晰。
- 每个 scope 是否最多一个 primary action。
- Action placement 是否匹配影响范围。
- Navigation 是否使用 link/router 语义。
- Pending 是否防止重复触发。
- Disabled action 是否在需要时说明原因。
- Permission 行为是否一致。
- Dangerous action 是否使用包含具体对象/动作/后果的 ConfirmDialog。
- Row actions 是否数量受限并使用 overflow。
- Batch action 是否展示数量和作用范围。
- Feedback 是否匹配严重程度和作用域。
