# Status Badge / Tag AI 执行规则

> 用于 AI 生成 2B 状态标签和 Tag 行为的压缩版规则。
> 详细解释参考 `status-badge-rules.zh.md`。

---

## 1. 用途

StatusBadge/Tag 用于展示紧凑的分类状态或标签。

使用于：

- success/warning/error/info/neutral 状态。
- lifecycle state。
- permission/sync/import/deployment state。
- compact tags/labels。

不要用于：

- 长解释。
- primary actions。
- 需要 Select/Checkbox 的复杂筛选。
- 替代完整 error details。

---

## 2. 颜色语义

规则：

- Red/danger = error/destructive/failed。
- Yellow/orange = warning/attention/partial。
- Green = success/active/healthy。
- Blue = info/in progress。
- Gray/neutral = inactive/default/unknown。
- 颜色必须同时适配 light 和 dark mode。
- Status 不能只依赖颜色。
- 颜色选择不能和 theme primary color 语义冲突。

---

## 3. 文案

规则：

- 文案应短。
- 默认不换行。
- 长文本截断，并提供 tooltip/popover。
- 避免在 badge 中使用完整句子。
- 同一状态使用一致词表。
- 不要直接展示后端 raw enum，除非它就是用户可理解文案。

---

## 4. Icon

规则：

- 2B status badges 通常不需要 icons。
- 只有能增强识别或严重程度时才使用 icon。
- Icon 不能替代 text。
- Icon 和 text color 与语义状态保持一致。

---

## 5. 可点击 Tags

规则：

- Tag 只有在有明确 action 时才可点击。
- 可点击 error/status 可打开 dialog/drawer/popover 展示原因/详情。
- Clickable tag 必须有 hover/focus state。
- 不可点击 status 不要看起来可交互。
- Error reason dialog 有信息时应说明发生了什么和下一步怎么处理。

---

## 6. 摆放与响应式

规则：

- Title 附近的 badge 表示 resource status。
- Table/card cell 中的 badges 保持紧凑。
- 多个 tags 只有在明确允许时才换行。
- 移动端不能只依赖 hover tooltip；需要 tap-accessible details。

---

## 7. AI 检查清单

- StatusBadge/Tag 是否用于紧凑分类状态。
- Color semantics 是否匹配 status。
- Light/dark mode contrast 是否安全。
- 文案是否短、一致且不是 raw enum。
- 长文本是否有 tooltip/popover。
- Clickable tag 是否有明确 action 和状态。
- Error clickable tag 是否在有用时打开原因/详情。
- 移动端是否有非 hover 的详情访问方式。
