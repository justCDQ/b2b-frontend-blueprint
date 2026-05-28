# Dialog AI 执行规则

> 用于 AI 生成 2B 弹窗交互的压缩版规则。
> 详细解释参考 `dialog-rules.zh.md`。

---

## 1. 什么时候使用

Dialog 用于不需要可分享 route 的短暂聚焦任务。

使用 Dialog：

- 短 create/edit form。
- 快速 detail。
- confirmation。
- 小型聚焦流程。

不要使用 Dialog：

- 深层导航。
- 大型多区块工作区。
- 可分享/可刷新 detail。
- related tables/logs/activity。
- 应该用 route page 承载的长复杂工作。

---

## 2. 平台行为

桌面端：

- 小/中型聚焦任务使用居中 dialog。
- 尺寸：`xs`、`s`、`m`、`l`、`full`。
- 标准/full dialog 最大宽高不超过 viewport 的 80%。

移动端：

- 只有极小 alert/confirmation 使用小 dialog。
- 表单/复杂内容使用 bottom sheet 或 full-screen sheet。
- 不要把桌面端大型居中 dialog 强塞到移动端。

---

## 3. 必需结构

每个 dialog 必须有：

```text
Header: title + close button
Body: content
Footer: actions，可选
```

规则：

- Header 永远必需。
- Close button 在 header 右侧。
- Footer 可选。
- 桌面端 footer actions 右对齐。
- 越重要的 action 越靠右。
- Dialog title 必须描述任务或对象。

---

## 4. 滚动

规则：

- Header 保持可见。
- Footer 存在时保持可见。
- 内容很长时 body 滚动。
- 尽量不出现可见滚动条，但不能隐藏滚动感知。
- 不要让 page body 和 dialog body 抢滚动。
- 长内容不能把 actions 顶出屏幕。

---

## 5. 尺寸选择

按内容选择尺寸：

| 尺寸 | 使用场景 |
|---|---|
| xs | ConfirmDialog、极短 alert、短 prompt |
| s | 1-2 个字段或短内容 |
| m | 3-6 个字段或标准编辑 |
| l | 复杂表单/详情，含 sections |
| full | 临时大型工作区，但不需要 shareable route |

规则：

- 内容超过 `l` 时，选择 `full` 或 route page。
- 需要分享、收藏、深层操作时，使用 route page。
- 内容撑不起大 dialog 时，使用更小尺寸。

---

## 6. ConfirmDialog

任何来源触发的破坏性/高风险确认都使用 ConfirmDialog。

规则：

- ConfirmDialog 通常是 `xs` 或 `s`。
- 内容是 title、description、可选短详情、actions。
- 不要在 ConfirmDialog 中放 forms、tables、tabs 或长流程。
- 确认文案必须写清楚目标、动作和后果。
- 危险主操作使用 danger 样式。
- Cancel 必须可用。

不要写：

```text
Are you sure?
确认删除吗？
```

应该写：

```text
删除 workspace "Acme"？
这会移除所有 workspace 设置，且无法撤回。
```

---

## 7. Form Dialog

规则：

- 短 create/edit 使用 dialog form。
- Save 前执行必填/规则校验。
- Save pending 禁用 submit，防止重复提交。
- Save 失败保留输入。
- Dirty close 需要二次确认。
- 服务端字段错误尽量映射到字段。
- 大型/多区块表单改用 drawer 或 route page。

---

## 8. Dialog Actions

规则：

- Footer 通常包含 Cancel + primary action。
- Primary label 使用具体动词：`Save`、`Create`、`Import`、`Delete`。
- 数据 mutation 不使用含糊的 `OK`。
- 破坏性 action 使用 danger 样式；高风险时使用 ConfirmDialog。
- Secondary actions 放在 primary 左侧。

---

## 9. AI 检查清单

- Dialog 是否比 drawer/route page 更合适。
- Header 是否包含 title 和 close button。
- 尺寸是否匹配内容复杂度。
- Body 是否滚动且 header/footer 稳定。
- 移动端是否使用小 dialog 或 sheet。
- Footer action 顺序是否正确。
- 破坏性/高风险确认是否使用 ConfirmDialog。
- 确认文案是否包含目标/动作/后果。
- Form save 是否处理校验、pending、dirty close 和失败。
