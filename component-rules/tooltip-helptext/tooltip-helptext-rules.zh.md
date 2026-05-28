# Tooltip / HelpText 提示说明规范

> 用于 2B 产品中的解释、提示、禁用原因、辅助说明和紧凑上下文引导。

---

## 1. 组件边界

按重要性、持久性和是否可交互选择。

| 组件 | 使用场景 |
|---|---|
| Tooltip | hover/focus 解释、icon label、disabled reason、短到中等长度只读解释 |
| HelpText | 持久的字段/区块引导 |
| Inline hint | 小型常驻上下文说明 |
| Popover | 更长、结构化或可交互解释 |
| Alert/Banner | 重要常驻通知 |
| Docs link | 长概念或流程文档 |

规则：

- Tooltip 不用于移动端关键唯一信息。
- Tooltip 不能包含 interactive controls。
- 用户必须看到的表单引导优先使用 HelpText。
- Disabled reason 可使用 tooltip，但必须 accessible 且 bounded。
- 2B 长解释不需要硬字符上限，但需要可读宽高。
- 内容变成多区块、重滚动或可交互时，使用 Popover/Drawer/Dialog/docs。

---

## 2. Tooltip 规则

Tooltip 用于：

- icon-only action label
- 短澄清说明
- disabled reason
- truncated text full value
- 只读技术解释

规则：

- Icon-only actions 必须有 tooltip。
- Hover 和 keyboard focus 都可触发。
- 文案具体、可读。
- Placement 避免遮挡 target 或 primary action。
- 长 tooltip content 有 bounded width 和可读行长。
- Tooltip 不能作为理解 blocking errors 的唯一方式。
- Tooltip 不包含 buttons、links、checkboxes 或 forms。
- Tooltip 在 blur、escape 或 pointer leave 时可预测关闭。

示例：

```text
Edit
Delete
Only owners can delete this project.
Last synced from Salesforce at 14:30.
```

---

## 3. HelpText 规则

HelpText 用于：

- field format
- default behavior
- consequences
- limits
- permission/scope explanation
- complex settings guidance

规则：

- HelpText 放在相关 field/section 附近。
- 不用 HelpText 替代 label。
- 当说明影响正确填写时，HelpText 保持可见。
- Error text 应覆盖或靠近 HelpText，不发生冲突。
- 避免模糊营销文案。
- 格式重要时给示例。

推荐：

```text
Use comma-separated domains, for example: acme.com, example.org.
```

避免：

```text
Configure this for a better experience.
```

---

## 4. Disabled Reasons

规则：

- 解释 disabled 是由 permission、status、dependency、quota、pending 还是 missing setup 导致。
- 可能时说明恢复操作。
- 避免 internal policy codes。
- 必要时隐藏敏感权限细节。
- 移动端提供 tap-accessible reason 或 inline text。
- Disabled primary action 不应是唯一恢复路径。

示例：

```text
Only workspace owners can delete this project.
Enable billing before creating another environment.
Wait until import validation finishes.
```

---

## 5. 截断与长内容

规则：

- Table/card 中截断的只读文本可通过 tooltip 展示完整值。
- 如果完整值是很长的结构化数据，使用 popover/drawer/detail view。
- 不给所有 tooltip content 设置任意最大字符数。
- 通过 max width、line length 和 placement 保证可读性。
- 长 tooltip 不应遮挡它解释的信息。

---

## 6. 移动端与触控

规则：

- Hover-only tooltip 对触控设备不够。
- 关键信息需要 inline text、tap-to-open popover、sheet 或 details view。
- Icon-only actions 仍需要 accessible labels。
- Disabled reasons 应可通过 tap 或 adjacent helper text 访问。
- 避免过小 tooltip triggers。

---

## 7. 可访问性

规则：

- 需要时，tooltip trigger 可被键盘 focus。
- Tooltip content 能被朗读或与 accessible description 关联。
- HelpText 尽量和 field 建立语义关系。
- Tooltip 不 trap focus。
- 需要 focusable content 时，使用 Popover/Dialog。
- Help/error/disabled meaning 不只依赖颜色。

---

## 8. AI 审查清单

- Icon-only actions 是否有 tooltip/accessible label。
- 关键信息是否不是 tooltip-only。
- Tooltip 是否没有 interactive controls。
- HelpText 是否靠近相关 field/section。
- Disabled reason 是否在安全时解释 permission/state/dependency。
- 长解释内容是否 bounded 且可读。
- 移动端是否有非 hover 的重要解释访问方式。
- Error text 和 HelpText 是否不冲突。
