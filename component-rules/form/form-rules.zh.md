# 表单组件系统规范

> 用于创建、修改或审查 2B 产品中的表单。
> 表单用于收集、编辑、校验和提交结构化业务数据。

---

## 1. 表单类型

按任务范围选择表单类型。

| 类型 | 使用场景 |
|---|---|
| 行内表单 | 区块内小范围编辑 |
| 弹窗表单 | 聚焦的创建、编辑、配置任务 |
| 页面表单 | 长流程、可分享状态、复杂复核 |
| 向导表单 | 线性多步骤流程 |
| 可编辑 table | 低风险、快速、结构化行内编辑 |

规则：

- 简单聚焦任务使用弹窗表单。
- 长流程或需要分享/刷新恢复的流程使用页面表单。
- 多步骤线性任务使用向导表单。
- 不要把大型流程塞进小弹窗。
- 不要用可编辑 table 承载高风险或复杂校验。

---

## 2. 表单出现位置

表单出现在不同位置时，反馈和提交策略不同。

### 筛选栏表单

用于 table/list 的筛选区域。

行为：

- 大多数控件需要接近实时反馈。
- 单选框、chips、单选 Select 选中后立即触发请求。
- 输入框使用 debounce，输入结束后触发请求。
- 多选框选择多个后，点击确定/应用再触发请求。
- 日期范围通常在范围完整并确认后触发请求。
- 筛选变化重置 page，并清空 selection。
- 查询状态由 URL 驱动。

示例：

```text
点击状态 chip -> 立即请求
搜索输入 -> debounce 300-500ms -> 请求
多选 group -> 选择多个 -> 点击应用 -> 请求
日期范围 -> 选择完整范围 -> 点击应用 -> 请求
```

禁止：

- 普通筛选还要求全局保存按钮。
- 输入框每个字符都立即请求且没有 debounce。
- 多选/日期范围还没完成就提交不完整状态。

### Table 行内表单

用于 table 行内的低风险即时编辑。

示例：

- Switch 启用/禁用。
- 修改名称。
- 修改短描述。
- 修改简单优先级/排序值。

行为：

- Switch 通常立即触发。
- 文本输入通常先进入编辑态。
- 文本编辑通过小确认按钮、blur+确认、或 Enter 提交，具体由产品统一。
- pending 状态是行级的。
- 失败时回滚或保持编辑态。
- 不能触发行点击。

规则：

- 只用于低风险字段。
- 复杂校验或高风险修改必须使用弹窗/页面表单。
- row pending 基于 rowKey。

### 弹窗表单

用于创建/编辑单个对象。

行为：

- 不做实时提交。
- 用户先填写完整表单。
- 保存前进行必填项校验。
- 点击 Save 统一提交整个表单。
- 成功后关闭弹窗并刷新相关数据。
- 失败后保持弹窗打开并保留输入。

规则：

- 提交按钮放在 Footer。
- 提交 loading 防止重复提交。
- 字段错误显示在字段附近。

### 详情页编辑表单

当字段太多，不适合弹窗时，在详情页进入编辑模式。

行为：

- 用户从详情页点击编辑进入编辑模式。
- 交互类似弹窗表单：编辑多个字段，然后统一点击保存。
- 保存前进行必填项校验。
- 成功后退出编辑模式或回到详情。
- 失败后保持编辑模式并保留输入。

使用页面编辑：

- 字段很多。
- 区块很多。
- 保存前需要复核。
- 状态需要分享/刷新恢复。
- 包含子表格或复杂关联数据。

---

## 3. 布局

默认布局：

- Label 在字段上方。
- Help text 放在 label 下方或字段下方。
- Error text 靠近字段。
- 必填标记靠近 label。

规则：

- 移动端表单使用单列。
- 桌面端只有短且互相独立的字段才适合双列。
- 相关字段应该分组。
- 危险设置应该单独分隔。
- 不要把大量无关字段堆成一个长区块。

推荐结构：

```text
区块标题
区块说明

Label
Input
Help/Error
```

双列适合：

- first name / last name
- start time / end time
- min / max

双列不适合：

- 长文本。
- Textarea。
- 复杂 Select。
- 有依赖关系的字段。

---

## 4. 字段语义

每个字段都需要清晰的语义约定。

字段定义应包含：

- name/key
- label
- type
- required/optional
- default value
- validation rules
- help text
- disabled logic
- parse/serialize logic

规则：

- Label 必须具体。
- Placeholder 不能替代 label。
- 必填字段必须明确。
- 可选字段不能看起来像必填。
- 数字字段必须显示单位。
- 空值语义必须明确。

不推荐：

```text
Label: Value
Placeholder: Enter here
```

推荐：

```text
Label: 月度配额
Suffix: requests
Help: 留空时使用团队默认值。
```

---

## 5. 字段组件类型与状态

常见字段组件：

- Input
- Textarea
- Select
- Radio
- SegmentedControl
- Checkbox
- Switch
- DatePicker / DateRangePicker
- NumberInput
- Password / SecretInput
- FileUpload
- Combobox / Autocomplete
- TreeSelect
- TagInput
- CodeEditor / JSONEditor

每个字段组件都需要支持这些状态：

- 普通态。
- focus。
- error。
- disabled。
- 必要时支持 loading/pending。

### Input

用于短文本、数字类值、ID、名称、邮箱、URL。

规则：

- 必须有 label，placeholder 只是提示。
- prefix/suffix 只在有语义时使用，例如单位、搜索、URL、警告。
- 移动端字号避免触发浏览器自动缩放。
- error 状态显示错误边框和错误文案。
- disabled 状态禁止编辑，原因不明显时需要解释。
- 数字输入必须显示单位或格式预期。

### Textarea

用于长文本。

示例：

- 描述。
- 备注。
- Prompt。
- 错误原因。
- 自定义消息。

规则：

- 需要最小高度。
- 长内容不要使用过小 textarea。
- 有长度限制时显示字符计数。
- error 和 disabled 行为与普通字段一致。
- 特别长的内容或代码类内容，考虑 editor 或 full 弹窗。

### Select

用于从已知选项中选择。

规则：

- 单选 Select 在 FilterBar 中可以选中即触发。
- 在提交型表单中，Select 变化只更新表单状态，保存时统一提交。
- 长选项列表需要搜索。
- 多选 Select 需要显示已选数量或已选标签。
- FilterBar 中的多选通常点击确认/应用后再触发请求。
- disabled option 尽量说明原因。

### Radio

用于少量互斥选项。

规则：

- 通常 2-5 个选项。
- 所有选项应该可见。
- 适合需要对比选项的场景。
- 适合选项需要解释、help text 或二级描述的场景。
- 使用 RadioGroup 语义：同一个 group name、一个 selected value、组内支持键盘导航。
- RadioGroup 必须有可见 label；每个 option 必须有清晰文案。
- option value 应该是稳定业务值，不要使用展示文案作为值。
- 必填 RadioGroup 必须校验是否已选择。
- 可选 RadioGroup 必须明确是否允许空值，以及如何清空。
- disabled option 仍然需要可读，原因不明显时需要说明。
- 如果当前选中的 option 被 disabled，仍然要清楚展示当前值。
- 提交型表单中，Radio 选择只更新表单状态，直到 Save 时统一提交。
- 在 FilterBar 中，radio/chips 选中可以立即触发请求。
- Radio 选项不要换成难以阅读的多行块，除非设计本身包含说明文案。
- 长列表不要使用 Radio。

以下情况使用 Radio，而不是 SegmentedControl：

- 选项需要描述或 help text。
- 决策更重要，需要慢一点比较。
- 选项文案较长。
- 选择出现在较长的提交型表单中。
- 需要展示单个选项的 disabled 原因或校验信息。

示例：

```text
Billing cycle
( ) Monthly - easier to cancel
( ) Annual - lower yearly price
```

### SegmentedControl

用于紧凑的单选表单值。它看起来像 Tabs，但行为上更接近 RadioGroup。

规则：

- 语义上更接近 RadioGroup，而不是 Tabs。
- 用于短文案的互斥值。
- 适合高频切换、简单筛选、展示模式、时间粒度或数据范围。
- 通常 2-5 个选项；没有强理由不要超过 6 个。
- 选项文案必须短且易扫读。
- 像其他表单控件一样支持 `value`、`onValueChange`、`name`、`required`、`disabled`、`error`。
- 可以和 Tabs 共用 pill/segmented 视觉样式，但不能使用 Tabs 实现或 ARIA tab 语义。
- 在 FilterBar 中，切换值可以立即触发查询。
- 在提交型表单中，切换值只更新表单状态，直到 Save 时统一提交。
- 如果影响列表数据，应写入 query params，并在变化时重置 page/selection。
- disabled option 原因不明显时需要说明。

以下情况使用 SegmentedControl，而不是 Radio：

- 选项短且权重相同。
- 选择代表模式/筛选，而不是需要仔细判断的业务决策。
- 用户会频繁切换。
- 空间有限，例如 FilterBar 或 toolbar。

不要用于：

- 长选项列表。
- 需要丰富描述的选项。
- 需要谨慎阅读的高风险选择。
- 路由导航。
- 有独立布局的内容面板。

示例：

```text
状态：全部 / 启用 / 禁用
视图：表格 / 卡片
范围：日 / 周 / 月
```

### Checkbox

用于独立布尔选择或多选组。

规则：

- 单个 Checkbox 表示独立 yes/no。
- Checkbox group 表示多选。
- FilterBar 中的多选组通常需要点击应用后触发。
- disabled checkbox 原因不明显时需要说明。
- 互斥选项不要使用 Checkbox。

### Switch

用于即时二元状态切换。

规则：

- 用于 on/off、enabled/disabled、allowed/blocked。
- Switch 通常立即触发。
- 高风险 Switch 需要确认。
- pending 状态防止重复切换。
- 失败后回滚并显示错误。
- 在长表单中，除非表示即时设置，否则不要用 Switch 替代 Checkbox。

### DatePicker / DateRangePicker

用于日期、过期时间、创建/更新时间筛选、计划任务时间。

规则：

- 单日期和日期范围的语义必须清晰。
- DateTime 必须明确是否包含时间。
- 后端存 UTC 或用户跨地区时，必须明确时区。
- 开始日期不能晚于结束日期。
- 清空值语义必须明确。
- FilterBar 中日期范围通常在选择完整并确认后触发请求。
- 移动端应使用适合移动端的 picker，必要时使用原生输入。

### NumberInput

用于配额、价格、数量、阈值、权重、优先级。

规则：

- 明确 min、max、step、precision。
- 显示单位或币种。
- 区分空值和 `0`。
- 尽量阻止非法字符输入。
- 展示格式化不能破坏编辑体验。
- 精确业务值优先使用 NumberInput，不要只用 Slider。

示例：

```text
配额：1000 requests
价格：$12.50
权重：0.8
```

### Password / SecretInput

用于密码、API Key、Token、Secret。

规则：

- 适当支持显示/隐藏。
- 默认不要暴露敏感值。
- 已存在的 secret 通常显示为 masked value。
- 重新生成/重置需要确认。
- 复制操作必须明确。
- 不要在日志中记录敏感值。
- 不要把未修改的 masked placeholder 当成真实值提交。

### FileUpload

用于导入、文档上传、头像/Logo 上传、附件。

规则：

- 显示允许的文件类型。
- 显示最大文件大小。
- 明确单文件还是多文件。
- 显示上传进度。
- 失败时尽量支持重试。
- 上传前尽量做预校验。
- 导入流程需要错误明细或失败行报告。
- 结构化导入需要提供模板下载。

### Combobox / Autocomplete

用于可搜索选择。

示例：

- 用户。
- 团队。
- 项目。
- 标签。
- 资源。

规则：

- 远程搜索使用 debounce。
- 显示 loading 状态。
- 显示空结果状态。
- 已选值展示 label，不只展示 id。
- disabled option 尽量说明原因。
- 允许创建新选项时，入口必须明确。
- 避免一次性加载巨大选项列表。

### TreeSelect

用于层级选择。

示例：

- 组织树。
- 文件夹树。
- 分类树。
- 权限范围。

规则：

- 明确单选还是多选。
- 明确父子选择联动规则。
- 需要时支持半选状态。
- 懒加载节点要显示节点级 loading。
- 搜索时要保留层级上下文。
- 已选值展示应可读。

### TagInput

用于标签、关键词、邮箱列表、白名单/黑名单值。

规则：

- 明确分隔符：Enter、逗号、粘贴等。
- 去除首尾空格。
- 去重。
- 校验每个 tag。
- 展示无效 tag 状态。
- 明确最大数量和单个 tag 最大长度。
- 批量粘贴需要有明确处理。

### CodeEditor / JSONEditor

用于结构化配置、JSON payload、schema、规则、Prompt/代码类内容。

规则：

- 需要时提供语法高亮。
- JSON 提供格式化操作。
- 提交前校验。
- 尽量显示错误位置。
- 大内容使用 full 弹窗或页面表单。
- 不要用小 textarea 承载复杂 JSON/config。
- 适当保留缩进和用户格式。

### 状态规则

普通态：

- 字段可编辑。
- 可以展示 help text。

Focus：

- focus 样式必须清晰。
- focus 不应该移除错误信息。

Error：

- error 样式清晰可见。
- error 文案靠近字段。
- 尽量说明如何修复。

Disabled：

- 字段不可编辑。
- 原因不明显时需要说明。
- disabled value 仍应可读。

Pending / loading：

- 用于异步校验、行级更新、依赖选项加载。
- 不应阻塞无关字段，除非确实需要。

---

## 6. 校验

校验信息必须靠近字段。

校验类型：

- 必填。
- 格式。
- 范围。
- 长度。
- 字段依赖。
- 异步唯一性。
- 权限/状态约束。

规则：

- 阻止提交的校验使用 inline error。
- 字段错误显示在字段附近。
- 表单级错误显示在提交区域附近或表单顶部。
- Toast 不能替代字段错误。
- 异步校验必须有 pending 状态。
- 不要在用户仍在输入时过度打扰，除非即时反馈有帮助。

校验时机：

| 时机 | 使用场景 |
|---|---|
| blur | 格式/范围校验 |
| change | 轻量即时反馈 |
| submit | 必填/业务校验 |
| debounce async | 唯一性/可用性检查 |

---

## 7. 表单交互与约束

这些规则不绑定具体框架，但提炼了成熟表单库常见模式：字段注册、默认值、表单状态、依赖校验、数组字段、受控组件适配等。

### 字段注册

规则：

- 每个会提交的字段都必须有稳定 name/key。
- 字段名尽量和请求 payload 语义一致。
- 只用于视觉展示的字段不要提交。
- 隐藏的过期子字段不要提交，除非业务明确需要。
- 条件字段卸载时，必须明确是 unregister，还是有意保留值。

示例：

```text
provider = OpenAI -> 提交 apiKey
provider = Azure -> 注销 apiKey，提交 endpoint/deployment
```

### 默认值

规则：

- 每个字段都应有明确默认值。
- 创建表单默认值和编辑表单初始值是两个概念。
- Reset 应恢复初始值，不总是清空。
- 异步加载初始值到达后，应重置表单初始状态。
- 避免字段在 uncontrolled 和 controlled 之间切换。

不推荐：

```text
字段一开始是 undefined，之后变成 string。
```

推荐：

```text
文本字段默认值：''
多选默认值：[]
Switch 默认值：false
```

### 表单状态

这些状态需要分离：

- dirty
- touched
- valid / invalid
- submitting
- submit successful
- field-level error
- form-level error

规则：

- Dirty 决定是否需要丢弃确认。
- Touched 可决定何时展示字段错误。
- Submitting 禁用冲突操作。
- 提交成功清除 dirty。
- 提交失败不能清除 dirty，也不能清空输入。

### 依赖规则

字段之间经常有依赖关系。

规则：

- 父字段变化时，必须重置无效子字段值。
- 依赖校验需要在依赖字段变化时重新执行。
- 异步加载的依赖选项需要 loading 状态。
- disabled 的依赖字段需要说明如何启用。

示例：

```text
startDate 变化 -> 重新校验 endDate
country 变化 -> 重置 city
provider 变化 -> 重置 provider-specific credentials
```

### 校验规则

优先使用声明式规则：

- required
- min / max
- minLength / maxLength
- pattern / format
- custom validate
- dependency validate
- async validate

规则：

- 校验错误归属到用户能修复的字段。
- 跨字段错误显示在相关字段组或提交区域附近。
- 异步校验需要 debounce，并且要防止过期响应覆盖。
- 服务端字段错误尽量映射回字段错误。

### 数组字段

数组字段用于重复字段组。

示例：

- 多个邮箱。
- webhook headers。
- 环境变量。
- 价格梯度。
- 白名单条目。

规则：

- 每个 item 需要稳定 id。
- 添加/删除/排序不能破坏其他 item 的值。
- 数组级错误显示在字段组附近。
- item 级错误显示在对应 item 附近。
- 删除 item 时要清除对应校验错误。
- 明确最小/最大条目数。

### 受控组件适配

部分复杂组件需要在表单状态和 UI 状态之间做适配。

示例：

- Select
- DatePicker
- Combobox
- TreeSelect
- CodeEditor
- FileUpload

规则：

- 适配层定义 value shape。
- 适配层将 UI value 转换成 form value。
- 适配层将 disabled/error 状态传给组件。
- 适配层处理 clear value。
- 除非必要，不要保留第二份不同步的本地状态。

### 错误映射

错误可能来自客户端校验，也可能来自服务端响应。

规则：

- 服务端字段错误映射到字段错误。
- 通用服务端错误映射到 form-level error。
- 未知错误可以用 toast，但不能清空字段输入。
- 提交失败后聚焦第一个错误字段。

---

## 8. 提交

提交必须明确且安全。

规则：

- 提交前必须进行必填项/规则校验。
- 点击提交后按钮立即进入 loading。
- 提交 loading 防止重复提交。
- 提交 loading 禁用冲突操作。
- 成功后关闭弹窗或跳转到目标页面。
- 成功后刷新相关列表/详情数据。
- 失败后保持表单打开，并保留用户输入。
- 成功前不要清空表单。
- 失败时不要关闭弹窗。

提交流程：

```text
编辑字段
点击提交
校验
提交 loading
成功 -> 关闭/跳转 -> 刷新数据
失败 -> 保留输入 -> 显示字段/表单错误
```

提交策略：

| 表单规模 | 策略 |
|---|---|
| 字段很少 | 可以在 handler 中单独校验 |
| 字段很多 | 使用 `<form>` 和 `type="submit"` |
| 弹窗表单 | Footer 的提交按钮应提交 form |
| 页面表单 | 使用 form submit 和稳定 action bar/footer |

规则：

- 大型表单不要在按钮点击里手动串联一堆字段校验。
- 字段多时使用原生 form submit 语义或表单库。
- 提交按钮不在表单 body 内时，也应正确关联 form。
- Enter 键提交行为需要明确。
- 必填和规则校验通过后才能发送请求。

---

## 9. Dirty 状态

Dirty 表示用户修改了数据但尚未保存。

规则：

- 创建/编辑表单需要追踪 dirty 状态。
- 关闭 dirty 表单可能需要二次确认。
- Reset 会丢弃输入时需要确认。
- 提交成功后清除 dirty 状态。
- 页面跳转离开 dirty 表单时，条件允许时应提醒。

关闭行为：

| 状态 | 关闭行为 |
|---|---|
| pristine | 直接关闭 |
| dirty | 确认丢弃 |
| submitting | 阻止关闭或明确确认 |
| submit failed | 可关闭，但弹窗保持打开期间保留输入 |

丢弃确认必须说明未保存修改会丢失。

---

## 10. 默认值与重置

规则：

- 创建表单使用明确默认值。
- 编辑表单使用已加载数据。
- Reset 回到初始值，不总是清空。
- 父字段变化时，依赖子字段要重置。
- 不要直接修改原始加载对象。

示例：

```text
创建用户：role 默认 member
编辑用户：role 默认当前用户已有角色
重置编辑表单：恢复已有角色，不是清空
```

---

## 11. 禁用与权限

字段和操作都可能 disabled。

规则：

- 禁用字段原因不明显时，需要说明原因。
- 权限禁用字段不应提交被修改的值。
- 用户不应该知道的字段用隐藏。
- 用户知道但当前不可用的字段用 disabled。
- Submit disabled 的原因应可解释。

示例：

```text
不能编辑角色：只有 Owner 可以修改角色。
不能修改邮箱：已验证邮箱已锁定。
```

后端仍必须校验权限和状态。

---

## 12. 动态字段

动态字段根据其他值出现。

规则：

- 父字段变化时，无效子字段值必须重置。
- 被隐藏的子字段不应提交旧值，除非业务明确要求。
- 条件字段出现/消失要有清晰过渡。
- 校验 schema 必须匹配当前可见/激活字段。

示例：

```text
Provider = OpenAI -> 显示 API Key 字段
Provider = Azure -> 显示 endpoint + deployment 字段
```

---

## 13. 弹窗表单

弹窗表单规则：

- Header 必须存在。
- 通常需要 Footer。
- 提交按钮放在 Footer。
- 成功后关闭弹窗并刷新数据。
- 失败后保持弹窗打开。
- 长表单只滚动 Body，Header/Footer sticky。
- Dirty close 可能需要确认。

尺寸：

- 1-2 字段：small。
- 3-6 字段：medium。
- 7+ 字段或多区块：large。
- 向导/编辑器/大型内容：full。

---

## 14. 页面表单

使用页面表单：

- 流程很长。
- URL/分享/刷新需要保留状态。
- 用户提交前需要复核。
- 表单有很多区块。
- 表单包含子表格或复杂预览。

规则：

- 页面表单需要清晰标题。
- 主提交操作必须稳定且容易找到。
- 长表单使用区块。
- 很长的表单可以使用 sticky action bar。
- Dirty 状态下离开页面应尽量提醒。

---

## 15. 向导表单

向导用于线性多步骤流程。

规则：

- 显示当前步骤。
- 显示已完成/未完成状态。
- Footer 使用 Back / Next。
- 最后一步使用提交操作。
- 下一步前校验当前步骤。
- 保留前面步骤的值。
- 不要用 Tabs 承载必须按顺序完成的步骤。

---

## 16. 可访问性

规则：

- Label 与 input 关联。
- Error text 与字段关联。
- Required 状态可被识别。
- 键盘用户可以访问所有字段和操作。
- Disabled 原因可访问。
- 提交失败后聚焦第一个错误字段。
- 错误不能只依赖颜色。

---

## 17. AI 审查清单

接受 AI 生成的表单代码前，检查：

- 表单类型是否匹配任务范围。
- 表单出现位置是否明确：筛选栏、table 行内、弹窗、详情页。
- 筛选栏表单是否使用实时/debounce 反馈，而不是全局保存。
- Table 行内表单是否低风险，并使用行级 pending。
- 弹窗/详情页编辑表单是否统一保存，并在提交前校验必填项。
- Label 是否明确。
- Placeholder 是否没有替代 label。
- 必填/可选是否清晰。
- 单位和空值语义是否明确。
- 常见字段状态是否处理：普通态、focus、error、disabled。
- Input/Textarea/Select/Radio/SegmentedControl/Checkbox/Switch 使用是否符合字段语义。
- Radio 是否用于可见、可比较的选项，并处理必填/可选/disabled option 规则。
- SegmentedControl 是否只用于紧凑的单选模式/筛选值，而不是内容 Tabs 或路由。
- Switch 是否只用于即时二元状态切换。
- DatePicker/DateRangePicker 是否明确时间、时区、清空值和范围校验。
- NumberInput 是否明确 min/max/step/precision，并区分空值和 0。
- SecretInput 是否避免暴露敏感值，且不会把 masked placeholder 当真实值提交。
- FileUpload 是否明确文件类型、大小、进度、重试和导入错误明细。
- Combobox/Autocomplete 是否处理 debounce、loading、空结果和已选 label 展示。
- TreeSelect 是否明确父子联动、半选状态和必要的懒加载。
- TagInput 是否处理分隔符、去重、校验、最大数量和无效 tag 状态。
- CodeEditor/JSONEditor 是否提交前校验，大内容是否使用 full 弹窗或页面。
- 提交字段是否有稳定 name，并且 payload 语义清晰。
- 默认值是否明确，reset 行为是否正确。
- 条件字段是否有意 unregister 或重置过期值。
- dirty/touched/submitting/form-level error 状态是否分离。
- 依赖字段在父字段变化后是否重置并重新校验。
- 数组字段是否使用稳定 item id，并清理已删除 item 的错误。
- 受控复杂组件是否有清晰 value adapter，且没有不同步的第二份状态。
- 服务端字段错误是否尽量映射回字段错误。
- 校验是否 inline 且字段级。
- 提交前是否进行必填项/规则校验。
- 字段多的表单是否使用 form submit 语义，而不是零散按钮校验。
- 提交 loading 是否防重复提交。
- 失败是否保留输入。
- Dirty close 行为是否明确。
- Reset 是否恢复正确初始值。
- Disabled 字段/操作是否说明原因。
- 动态字段是否重置过期子字段值。
- 长弹窗表单是否 sticky header/footer。
- 大型/可分享流程是否使用页面表单。
- 可访问性基础是否满足。
