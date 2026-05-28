# Feedback / Toast AI 执行规则

> 用于 AI 生成 2B Toast 和反馈行为的压缩版规则。
> 详细解释参考 `feedback-toast-rules.zh.md`。

---

## 1. Toast 边界

Toast 是临时反馈，不是内容替代。

Toast 用于：

- 成功反馈。
- 非阻塞 action 失败。
- 旧数据仍可用时的 refresh failure。
- 后台任务开始/失败。
- copy/export/import started。
- 内容仍可用时的 offline/reconnected。

不能只用 toast 表达：

- 首次加载失败。
- page/list/dialog 没有可用内容。
- form/field validation errors。
- 缺少必要 setup。
- 页面级 forbidden/not-found。
- 破坏性确认。

---

## 2. 严重程度

按用户影响选择 severity：

- success：操作完成。
- info：中性后台更新。
- warning：操作完成但有注意事项，或需要关注。
- error：非阻塞失败。

规则：

- Blocking errors 使用 StateView/inline error，不只用 toast。
- Validation errors 靠近字段展示。
- Permission/setup problems 使用 page/section state 或 disabled reason。
- 重复相同 toasts 需要 deduplicate。

---

## 3. 位置

规则：

- 桌面 toast 通常在 bottom-right 或 top-right。
- 长任务/后台状态在系统约定支持时可使用 bottom-left/status area。
- Center toast 只用于少量高关注临时信息；常规 success 不居中。
- 移动端 toast 靠近底部，但不能遮挡 primary actions。
- 移动端避免堆叠大量 toasts。

---

## 4. 持续时间

规则：

- Success/info：短时间。
- Warning/error：更长时间。
- 带 action 的 toast：留足阅读和点击时间。
- 关键非阻塞问题可保持到手动关闭。
- 不要在用户读懂前自动消失。

---

## 5. Actions

规则：

- Toast 最多一个轻量 action。
- Toast action 必须安全且直接相关。
- Retry 只用于安全/幂等操作。
- 破坏性 actions 不能直接从 toast 执行。
- 使用具体 action labels。

---

## 6. 文案

规则：

- 文案短且具体。
- 说明发生了什么或什么失败。
- 有用时包含 object name。
- 除非用户能处理，否则不要暴露原始技术错误。
- 后台任务需要说明任务继续中或去哪里查看状态。

---

## 7. AI 检查清单

- Toast 是否没有替代必要 inline/StateView feedback。
- Severity 是否匹配影响。
- Placement 是否不遮挡 primary actions。
- Duration 是否匹配 severity/action。
- Duplicate toasts 是否去重。
- Toast action 是否安全、单一且相关。
- 移动端是否不遮挡关键控件。
