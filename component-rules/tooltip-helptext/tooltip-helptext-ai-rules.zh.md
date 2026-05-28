# Tooltip / HelpText AI 执行规则

> 用于 AI 生成 2B Tooltip 和辅助说明行为的压缩版规则。
> 详细解释参考 `tooltip-helptext-rules.zh.md`。

---

## 1. 组件边界

Tooltip 用于：

- icon-only action label
- hover/focus explanation
- disabled reason
- 截断只读文本完整值
- 短到中等长度只读技术解释

HelpText 用于持久的 field/section guidance。

长、结构化、可交互或 workflow-like 解释使用 Popover/Drawer/Dialog/docs。

规则：

- Tooltip 不能包含 interactive controls。
- 移动端关键信息不能 tooltip-only。
- 不设置硬字符上限；用 width/height/placement 控制可读性。

---

## 2. Tooltip 规则

规则：

- Icon-only actions 必须有 tooltip 或 accessible label。
- Tooltip 在 hover 和 keyboard focus 时出现。
- 文案具体、可读。
- Placement 避免遮挡 target/primary action。
- 长 tooltip content 有边界。
- Tooltip 不是 blocking errors 的唯一反馈。
- Tooltip 可预测关闭。

---

## 3. HelpText 与 Disabled Reasons

规则：

- HelpText 靠近相关 field/section。
- HelpText 不替代 label。
- Error text 覆盖或靠近 HelpText，不能冲突。
- Disabled reason 在安全时解释 permission、status、dependency、quota、pending 或 missing setup。
- 避免 internal policy codes。
- 移动端 disabled reason 必须 tap-accessible 或 inline。

---

## 4. 可访问性

规则：

- 需要时 tooltip trigger 可键盘 focus。
- Tooltip content 尽量作为 accessible description 关联。
- HelpText 尽量和 field 语义关联。
- Tooltip 不 trap focus。
- 需要 focusable content 时使用 Popover/Dialog，不用 Tooltip。

---

## 5. AI 检查清单

- Icon-only actions 是否有 tooltip/label。
- 关键信息是否不是 tooltip-only。
- Tooltip 是否没有 interactive controls。
- HelpText 是否靠近相关 field/section。
- Disabled reason 是否可访问且具体。
- 长内容是否 bounded/readable。
- 移动端是否有非 hover 访问方式。
