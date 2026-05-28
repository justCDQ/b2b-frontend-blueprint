# 弹窗组件系统规范

> 用于创建、修改或审查 2B 产品中的弹窗。
> 弹窗用于聚焦任务：查看详情、编辑数据、确认风险，或完成一个短流程。

---

## 1. 平台行为

弹窗在桌面 Web 和移动端必须有不同表现。

### 桌面 Web

桌面端弹窗使用居中 Modal。

尺寸按内容复杂度选择：

| 尺寸 | 使用场景 |
|---|---|
| xs | ConfirmDialog、极短提示、alert |
| s | 短表单、1-2 个字段 |
| m | 常规表单、3-6 个字段 |
| l | 复杂表单、多区块、预览/详情 |
| full | 大型编辑器、大型详情、多区块流程 |

规则：

- 弹窗宽高最大不超过视口的 80%。
- `full` 表示有边界的大弹窗，不是浏览器全屏。
- 禁止每个页面手写随机宽度。
- 使用统一的 size prop 或尺寸 token。
- 使用 `xs/s/m/l/full` 作为标准 dialog 尺寸体系。
- 如果内容不能合理撑满 70vw drawer，选择合适的 dialog size。
- ConfirmDialog 是特殊 dialog 类型，通常使用 `xs` 或 `s`。

### 移动端

移动端只支持两类弹窗：

- 极小的居中弹窗，用于非常短的确认或提示。
- 从底部上拉的 bottom sheet 弹窗。

规则：

- 表单、详情、流程类弹窗使用 bottom sheet。
- 极短确认才可以使用小型居中弹窗。
- 移动端弹窗高度不能超过安全视口。
- bottom sheet 内部使用 sticky header 和 sticky footer。

禁止：

```text
移动端复杂表单使用桌面式居中弹窗。
普通表单在桌面端使用浏览器全屏接管。
```

---

## 2. 基础结构

每个弹窗都必须有 Header。

标准结构：

```text
Dialog
  Header
    left: Title
    right: Close button
  Body
    content
  Footer optional
    actions
```

规则：

- Header 必须存在。
- Title 必须存在。
- 关闭按钮在 Header 右侧。
- Footer 可选。
- Footer 用于承载操作按钮。
- 桌面端 Footer 操作按钮右对齐。
- 越靠右的按钮优先级越高。

示例：

```text
[编辑用户                              X]

表单内容...

                         取消   保存
```

按钮优先级：

```text
左侧 -> 次要
右侧 -> 重要
```

推荐：

```text
取消   保存
取消   删除
上一步   下一步
```

不推荐：

```text
保存   取消
删除   取消
```

---

## 3. Header

Header 规则：

- 始终可见。
- 左侧显示标题。
- 右侧显示关闭按钮。
- 必要时可以在标题下方显示短描述。
- 关闭按钮必须有可访问名称。
- 移动端关闭按钮触控区域必须足够大。

Title 规则：

- 标题要说明当前任务或对象。
- 有明确标题时，不要使用“信息”“详情”“操作”这类模糊标题。

推荐：

```text
编辑 Token
删除用户
订单详情
配置渠道
```

不推荐：

```text
弹窗
详情
操作
```

---

## 4. Body

Body 承载任务内容。

规则：

- 内容很长时，只允许 Body 滚动。
- Header 保持 sticky。
- Footer 存在时保持 sticky。
- 除非强需求，不要在 Body 内创建嵌套滚动容器。
- 隐藏视觉滚动条，但保留滚动能力。
- 内容不能被 sticky header/footer 遮挡。

长内容布局：

```text
sticky Header
scrollable Body
sticky Footer
```

禁止：

```text
整个弹窗滚动，Header 消失。
用户编辑长表单时 Footer 被滚走。
Body 内出现多个嵌套滚动区域。
弹窗内部出现明显粗滚动条。
```

---

## 5. Footer

Footer 可选。

以下场景使用 Footer：

- 弹窗有提交/取消操作。
- 弹窗是危险确认。
- 弹窗是向导流程。
- 弹窗会修改数据。

以下场景可以不使用 Footer：

- 只读详情。
- 内容内部已有清晰的局部操作。
- 简单预览，只需要关闭。

规则：

- Body 滚动时 Footer 保持 sticky。
- 桌面端 Footer 操作按钮右对齐。
- 移动端按钮可以纵向堆叠或全宽显示。
- 主操作按钮必须有明确的主视觉。
- 危险操作使用 destructive 样式。
- loading 状态禁用冲突操作。

---

## 6. 滚动

弹窗使用有边界的布局。

规则：

- 桌面端最大宽度不超过 `80vw`。
- 桌面端最大高度不超过 `80vh`。
- 移动端最大高度必须安全适配视口。
- Header 和 Footer 不滚走。
- Body 滚动。
- 视觉上隐藏滚动条。

实现概念：

```text
DialogContent: max-w <= 80vw, max-h <= 80vh, display flex column
Header: sticky top
Body: flex-1 overflow-y-auto scrollbar-none
Footer: sticky bottom
```

禁止：

```text
不考虑 Header/Footer 高度，直接给 Body 固定高度。
多个子节点都加 overflow-y-auto。
Footer 遮挡 Body 最后一段内容。
```

---

## 7. Full 弹窗布局

`full` 弹窗不是浏览器全屏。

它是视口内有边界的大型工作区。

适用场景：

- 大型详情查看。
- 多区块表单。
- Tabs + 表单。
- 文件上传。
- Token / 配置编辑。
- 长 JSON / Prompt / 日志查看。
- 左右分栏编辑器。
- 需要固定高度工作区的内容。

结构：

```text
ResponsiveDialogContent size="full"
  Header sticky
    Title / Description
    Close button

  Body scrollable
    Main content
    Forms / Tabs / Editor / Table / Preview

  Footer sticky optional
    Secondary action
    Primary action
```

必要布局：

```text
DialogContent: flex flex-col overflow-hidden, max <= 80vw/80vh
Header: shrink-0 sticky top-0 z-10
Body: flex-1 overflow-y-auto scrollbar-none
Footer: shrink-0 sticky bottom-0 z-10
```

示例：

```jsx
<ResponsiveDialogContent size="full" className="flex flex-col overflow-hidden">
  <ResponsiveDialogHeader className="shrink-0 sticky top-0 z-10">
    <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
    <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
  </ResponsiveDialogHeader>

  <div className="flex-1 overflow-y-auto scrollbar-none px-4 sm:px-6">
    {children}
  </div>

  <ResponsiveDialogFooter className="shrink-0 sticky bottom-0 z-10">
    <Button variant="outline">取消</Button>
    <Button>保存</Button>
  </ResponsiveDialogFooter>
</ResponsiveDialogContent>
```

规则：

- 桌面端外层不超过 `80vw` / `80vh`。
- Header 始终可见。
- Footer 存在时始终可见。
- 只有 Body 滚动。
- Body 底部需要保留足够 padding，避免被 Footer 遮挡。
- 视觉上隐藏滚动条，但保留滚动能力。
- 不要在 Body 内创建多个大型滚动容器。
- Tabs 可以放在 Header 下方，也可以放在 Body 顶部。
- Tabs 是否 sticky 必须明确决定，不要让它变成偶然行为。
- 只有当用户需要临时大型工作区、但不需要路由页时，才使用 full 弹窗。

禁止：

```text
2 个字段的表单使用 full 弹窗。
full 弹窗填满浏览器且没有视口边距。
整个 full 弹窗滚动，Header 消失。
Footer 遮挡最后几个表单字段。
多个 Body 子区块独立滚动。
```

---

## 8. 尺寸选择

按任务复杂度选择弹窗尺寸。

| 内容 | 尺寸 |
|---|---|
| 纯确认 / alert | xs |
| ConfirmDialog | xs 或 s |
| 1-2 个字段 | s |
| 3-6 个字段 | m |
| 7+ 个字段 | l |
| Tabs / 多区块 | l |
| 向导流程 | l 或 full |
| 大型只读详情 | l 或 full |
| 编辑器 / 上传 / 大型数据 | full |

规则：

- 表单略宽松比拥挤更好。
- 简单表单不要使用 full。
- 复杂表单不要强塞进 xs/s。
- 弹窗尺寸由内容决定，不由触发入口决定。
- 如果内容超出 `l`，根据是否需要分享/长期工作选择 `full` 或 route page。
- 如果内容放在 `l/full` 或 70vw drawer 中显得空，选择更小 dialog size。
- 不要手写一次性宽度；使用共享 size tokens。

推荐尺寸体系：

```text
xs: 紧凑确认 / alert
s: 短表单
m: 标准表单
l: 复杂表单/详情
full: 有边界的工作区弹窗，最大 80vw/80vh
```

---

## 9. Confirm Dialog

危险或高风险操作使用确认弹窗。

ConfirmDialog 是用于短确认内容的特殊 dialog 类型。

示例：

- 删除。
- 禁用。
- 移除成员。
- 重置 key / token。
- 取消订阅。
- 清空数据。
- 撤销访问。
- 终止任务。

规则：

- 破坏性/高风险二次确认无论从哪里触发，都使用 ConfirmDialog：page、table row、card、menu、drawer、dialog 或 form。
- ConfirmDialog 只包含 title、description/body 和操作按钮。
- ConfirmDialog 不包含 forms、tables、tabs 或长流程。
- ConfirmDialog 通常使用 `xs` 或 `s`。
- 危险操作使用 destructive 样式。
- 危险确认弹窗需要有区别于普通弹窗的危险样式。
- 危险样式可以包括 danger icon、danger title/accent、danger confirm button。
- Danger styling 要克制，不要把整个弹窗做成大面积红色面板。
- 确认文案必须说明具体对象或作用范围。
- 确认文案必须说明具体动作。
- 确认文案必须说明后果。
- 确认文案必须说明是否不可撤回，或说明恢复路径。
- 确认按钮文案必须是具体动作。
- loading 状态禁用确认和取消。
- 成功后关闭弹窗。
- 失败后保持弹窗打开，并显示错误。
- 禁止使用浏览器原生 `confirm()`。

必需结构：

```text
ConfirmDialog
  Title: {动作} {对象类型}
  Description:
    命名对象/范围的主确认句。
    后果说明。
    不可撤回/恢复路径说明。
  Actions:
    取消
    Danger confirm action
```

文案规则：

- 不要只写 `确认删除吗？`。
- 危险操作不要使用 `确认` 这类模糊标题。
- 标题优先使用 `删除 {对象类型}`。
- Body 应写成 `确认删除 {对象类型} "{对象名}" 吗？` 或等价表达。
- 对象名未知时，使用稳定 identifier、数量或范围。
- 批量确认 body 必须包含 selected count 和对象类型。
- 确认按钮使用短动作文案，必要时带数量。
- 避免 `确定`、`确认`、`提交` 这类泛化确认按钮。

推荐：

```text
标题：删除 Token
描述：确认删除 Token "prod-api-key"？使用该 Token 的请求将立即失败，此操作不可恢复。
取消：取消
确认：删除
```

不推荐：

```text
标题：确认
描述：确定吗？
确认：确定
```

批量确认：

```text
标题：删除选中的 Token
描述：确认删除当前选中的 12 个 Token？这些 Token 将立即停止工作，此操作不可恢复。
确认：删除 12 项
```

极高风险确认：

```text
标题：清空生产数据
描述：确认清空项目 "Production API" 的全部生产事件吗？现有分析和审计导出将不再包含这些数据。此操作不可恢复。
必填输入：Production API
确认：清空数据
```

---

## 10. Form Dialog

表单弹窗用于聚焦的创建、编辑、配置任务。

规则：

- 表单弹窗必须有 Header。
- 表单弹窗通常有 Footer。
- 提交按钮放在 Footer。
- 取消/关闭是次要操作。
- 提交 loading 防止重复提交。
- 提交 loading 禁用冲突操作。
- 校验错误显示在对应字段附近。
- 提交成功后关闭弹窗，并刷新相关数据。
- 提交失败后保持弹窗打开，并保留用户输入。
- 提交成功前不要清空表单。

Footer 示例：

```text
取消   保存
取消   创建
上一步   下一步
取消   上传
```

Dirty 状态：

- 表单有未保存修改时，关闭可能需要确认。
- Dirty close 确认需要说明修改会丢失。
- 表单提交中，不允许意外关闭，除非业务明确支持。

关闭行为：

| 状态 | X / 取消 / 遮罩 / ESC |
|---|---|
| pristine | 允许关闭 |
| dirty | 关闭前确认 |
| submitting | 阻止关闭或要求明确确认 |
| submit failed | 允许关闭，但弹窗保持打开期间要保留输入 |

校验：

- 阻止提交的校验使用 inline error。
- Toast 只用于表单级或跨字段错误。
- 字段错误不能只用通用 toast 替代。

推荐流程：

```text
用户编辑字段
点击保存
保存按钮 loading
成功 -> 关闭弹窗 -> 刷新列表
失败 -> 保持弹窗打开 -> 保留输入 -> 显示字段/表单错误
```

不推荐：

```text
失败 -> 关闭弹窗
失败 -> 清空表单
连续点击保存发送重复请求
```

---

## 11. Dialog vs Route Page

不要把所有页面都塞进弹窗。

使用弹窗：

- 任务短且聚焦。
- 用户完成后应回到当前列表上下文。
- 内容是补充详情。
- 表单范围有限。
- 状态不需要可分享 URL。

使用路由页：

- 详情本身是工作区。
- 内容有多个主要区块。
- 用户可能长时间停留。
- 用户需要分享 URL。
- 浏览器刷新、前进、后退需要保留状态。
- 页面包含子表格、审计日志、图表或复杂操作。
- 流程太大，不适合临时 Modal。

使用 full 弹窗：

- 用户需要临时的大型工作区。
- 任务仍属于当前上下文。
- 使用路由页对当前流程来说过重。

规则：

- full 弹窗不能变成隐藏的路由页。
- 如果用户需要复制详情链接，用路由页。
- 如果详情中包含多个独立操作，用路由页。
- 如果弹窗内部需要深层导航，用路由页。

决策表：

| 需求 | 使用 |
|---|---|
| 快速确认 | confirm dialog |
| 小型创建/编辑 | form dialog |
| 快速只读详情 | detail dialog |
| 临时大型工作区 | full dialog |
| 可分享详情工作区 | route page |

---

## 12. AI 审查清单

接受 AI 生成的弹窗代码前，检查：

- 移动端和桌面端行为是否不同。
- 桌面端弹窗是否限制在 `80vw` / `80vh` 内。
- 移动端复杂弹窗是否使用 bottom sheet。
- Header 是否始终存在。
- Header 是否左侧标题、右侧关闭按钮。
- Footer 可选，但有操作时是否正确使用。
- Footer 按钮顺序是否从次要到重要。
- 长内容是否只在 Body 滚动。
- Header 和 Footer 是否在内容滚动时 sticky。
- 视觉滚动条是否隐藏。
- 是否避免了不必要的嵌套滚动容器。
- 弹窗尺寸是否匹配内容复杂度。
- 弹窗是否使用标准 `xs/s/m/l/full` 尺寸体系。
- 小确认是否使用 ConfirmDialog，通常为 `xs` 或 `s`。
- 不能撑满 70vw drawer 的内容是否改用 Dialog。
- full 弹窗是否是有边界的工作区，而不是浏览器全屏。
- full 弹窗是否使用 `flex flex-col overflow-hidden`。
- full 弹窗是否只有 Body 滚动。
- full 弹窗 Footer 是否不遮挡 Body 内容。
- full 弹窗内 Tabs 是否明确 sticky / 非 sticky。
- 危险操作是否使用确认弹窗，并说明对象、动作、后果。
- 危险确认弹窗是否使用克制但明确的 danger 样式。
- ConfirmDialog 是否只包含 title、description/body 和 actions。
- 危险确认标题是否说明动作和目标类型。
- 危险确认 body 是否说明具体对象/范围和后果。
- 危险确认文案是否说明不可撤回或恢复路径。
- 危险确认是否没有使用 `确认`、`确定吗？`、`确定` 这类泛化文案。
- 批量危险确认是否包含 selected count 和目标类型。
- 极高风险确认是否在合适时要求精确输入目标名称。
- Confirm loading 是否禁用确认和取消。
- 表单提交 loading 是否防止重复提交。
- 表单提交失败是否保留输入并保持弹窗打开。
- Dirty form 关闭行为是否明确。
- Dialog vs Route Page 的选择是否合理。
