# Form AI 执行规则

> 用于 AI 生成 2B 表单交互的压缩版规则。
> 详细解释参考 `form-rules.zh.md`。

---

## 1. 表单上下文

按使用上下文决定行为：

| 上下文 | 行为 |
|---|---|
| FilterBar form | 实时或 debounce 后改变 query |
| Table inline form | 小范围、低风险即时修改 |
| Dialog form | 新增/编辑，校验后一次性提交 |
| Detail page form | 大型编辑模式，校验后一次性提交 |
| Wizard form | 每步拥有校验，最终统一校验 |

规则：

- Filter fields 可以立即触发请求或 debounce 后触发。
- Dialog/detail/wizard forms 需要用户明确 Save/Submit。
- Table inline edits 必须低风险、易恢复。
- 大型或多区块表单使用页面编辑模式，不塞进拥挤 dialog。

---

## 2. 字段组件

使用语义化字段：

- Input：短文本。
- Textarea：长文本。
- Select：有限选项。
- Combobox/Autocomplete：远程搜索或大量选项。
- Radio：少量可见单选。
- SegmentedControl：紧凑单选 mode/filter value，不是 route/tab。
- Checkbox：boolean 或多选列表。
- Switch：即时开/关状态。
- DatePicker/DateRangePicker：日期/时间范围。
- NumberInput：数字值，必要时有 min/max/step。
- Password/SecretInput：敏感值遮罩。
- FileUpload：文件输入和校验。
- TreeSelect：层级选项。
- TagInput：多个自由/已有标签。
- Code/JSON editor：结构化技术输入。

---

## 3. 字段状态

每个字段必须支持：

- default
- focus
- filled
- error
- disabled
- 必要时 readonly
- 异步时 loading/pending

规则：

- Error text 放在字段附近。
- Disabled 原因不明显时需要说明。
- Required 状态视觉和语义都清楚。
- Focus state 必须可见。
- 不要把 placeholder 当作唯一 label。
- 移动端 input 字号避免触发浏览器自动缩放。

---

## 4. 校验

规则：

- Required fields 在 submit 前校验。
- 简单格式规则在 blur 或 submit 时校验。
- FilterBar input debounce 后请求。
- 高成本异步校验在 debounce/blur/submit 后执行，并展示 pending。
- Multi-select popover 通常在用户确认后 apply。
- 服务端字段错误尽量映射回字段。
- 跨字段错误显示在受影响字段附近或 form-level error。
- 不要因为另一个字段失败而清空有效输入。

字段很多时：

- 使用原生 form submit 语义或 form controller。
- Submit button 应使用 `type="submit"` 或等价语义。

---

## 5. 依赖与动态字段

规则：

- Parent value 变化后，dependent fields 需要 reset 或标记 stale。
- 不要在 parent 变化后静默保留无效 child values。
- 只有字段不相关时才隐藏 dynamic fields。
- 只有流程需要恢复时才保留隐藏字段值。
- Field arrays 必须支持 add/remove/reorder，并使用 stable keys。
- Conditional required rules 必须明确。

---

## 6. 提交

规则：

- Submit 前校验必填和规则。
- Submit pending 禁用 submit，防止重复提交。
- Cancel 通常保持可用，除非离开会破坏状态。
- Submit 成功后才清除 dirty state，并关闭/导航。
- Submit 失败保留所有输入。
- Server errors 映射为字段错误或 form-level message。
- 破坏性/高风险 submit 使用 ConfirmDialog。

不要：

- 保存成功前导航离开。
- 提交失败时 reset form。
- 对 mutation 使用含糊的 `OK`。

---

## 7. Dirty State 与 Reset

规则：

- Dirty form 离开/关闭前需要确认。
- Reset 应明确恢复 initial/default values。
- 异步加载的 default values 不能覆盖用户已编辑内容。
- Dirty form 切换 route 时尽量提醒。
- 长表单或关键表单需要 draft/autosave。

---

## 8. Disabled 与权限

规则：

- 权限导致字段 disabled 时，安全情况下说明原因。
- 值需要可见但不可编辑时，优先使用 readonly。
- 只有用户不应知道字段存在时才隐藏字段。
- Submit action 根据权限隐藏或 disabled。
- Disabled form controls 仍需可访问。

---

## 9. 响应式

规则：

- 多列表单在窄屏变单列。
- 字段顺序跟随任务流程，不跟随桌面视觉位置。
- Helper/error text 保持靠近字段。
- Dialog form 移动端可变 sheet。
- 长表单在移动端应使用页面编辑模式，避免拥挤 dialog。

---

## 10. AI 检查清单

- Form context 是否决定实时反馈或显式提交。
- Fields 是否使用语义化组件。
- Labels 是否不是 placeholder-only。
- Required/error/disabled/focus states 是否存在。
- Validation timing 是否匹配字段成本和上下文。
- Server errors 是否尽量映射到字段。
- Dependencies 是否明确处理 stale/reset。
- Submit 是否有 pending 和防重复。
- Failed submit 是否保留输入。
- Dirty close/route leave 是否被保护。
- 响应式布局是否保持字段顺序和错误可用。
