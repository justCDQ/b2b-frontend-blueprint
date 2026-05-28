# StatusBadge / Tag 状态标签组件规范

> 用于创建、修改或审查 2B 产品中的状态标签。
> StatusBadge 用于表达状态，必须可读、一致，并且适配主题。

---

## 1. 组件用途

StatusBadge / Tag 常出现在：

- table 单元格
- 详情 metadata
- 卡片
- 筛选摘要
- 弹窗内容
- timeline / audit 记录

适合表达：

- 状态
- 类型
- 分类
- 风险等级
- 处理中状态
- 结果状态

不要把它当成装饰元素使用。

---

## 2. 颜色语义

状态颜色必须有稳定语义。

推荐语义映射：

| 语义 | 含义 | 常见颜色 |
|---|---|---|
| success | 完成、启用、健康 | 绿色 |
| error | 失败、阻塞、危险 | 红色 |
| warning | 风险、需要注意 | 黄色/橙色 |
| info | 中性信息、处理中 | 蓝色 |
| muted | 禁用、归档、未知 | 灰色 |
| draft | 草稿、未发布 | 灰色/中性色 |
| processing | 运行中、等待中、同步中 | 蓝色或强调色 |

规则：

- 红色代表 error / destructive。
- 黄色/橙色代表 warning / attention。
- 绿色代表 success / healthy。
- 灰色代表 disabled / archived / neutral。
- 不要每个页面随意造颜色。
- 产品主题色不能覆盖状态语义。

主题规则：

- 颜色必须同时适配 light mode 和 dark mode。
- 背景和文字对比度必须可读。
- 优先使用语义 token。
- 避免过度饱和的背景色。
- Badge 的 border/background/text 要作为一组设计。

---

## 3. Icon 使用

在 B 端系统里，StatusBadge 通常不需要 icon。

规则：

- 默认不使用 icon。
- 只有 icon 能增加理解时才使用。
- 不添加装饰性 icon。
- error/warning 不自动要求 icon。
- 如果使用 icon，尺寸要小并且对齐。

推荐：

```text
失败
处理中
启用
```

通常不需要：

```text
✓ 启用
⚠ 警告
```

---

## 4. 文案长度

Badge 文案必须短。

规则：

- 推荐长度：中文 1-12 个字符，英文 1-16 个字符。
- 长文案需要截断。
- 默认不换行。
- 截断时使用 tooltip。
- 只有布局明确需要多行标签时才允许换行。

默认行为：

```text
white-space: nowrap
overflow: hidden
text-overflow: ellipsis
```

推荐：

```text
启用
失败
处理中
已禁用
```

不推荐：

```text
由于远程服务超时导致请求失败
```

长原因应放到 tooltip 或错误详情弹窗。

---

## 5. Tooltip

以下场景使用 tooltip：

- badge 文案被截断。
- 状态需要短说明。
- 禁用/归档原因很短。
- 需要补充时间或来源上下文。

规则：

- Tooltip 只放短说明。
- 不要把长错误堆栈或大段 JSON 放进 tooltip。
- 关键错误详情不能只依赖 tooltip。
- 移动端不能只依赖 hover tooltip。

---

## 6. 可点击 Badge

大多数 Badge 是只读的。

以下场景可以点击：

- 打开错误原因。
- 打开 warning 详情。
- 按 tag/status 筛选。
- 打开关联详情。

规则：

- 可点击 badge 必须看起来可交互。
- 使用 pointer cursor。
- 提供可访问名称。
- 点击行为必须可预期。
- 不要因为 badge 有颜色就让它可点击。

Error badge：

- error 状态经常需要可点击。
- 点击后打开承载错误原因/详情的 dialog。
- Dialog 标题说明错误上下文。
- Dialog 内容可以包括 message、reason、code、source、timestamp、raw detail。

示例：

```text
Badge: 失败
Click -> 错误详情弹窗
```

弹窗内容：

```text
标题：错误详情
Message：Provider request timed out.
Code：PROVIDER_TIMEOUT
Time：2026-05-11 10:31
```

---

## 7. Tag 变体

按语义角色选择变体。

| 变体 | 使用场景 |
|---|---|
| status | 生命周期/结果状态 |
| type | 对象类型/分类 |
| filter | 已选筛选摘要 |
| removable | 用户可以移除 |
| clickable | 打开详情或应用筛选 |

规则：

- StatusBadge 默认不可移除。
- removable tag 需要明确关闭/移除控件。
- filter tag 可以 removable。
- type tag 默认使用中性色，除非类型本身带风险语义。

---

## 8. 布局

规则：

- 默认不换行。
- 多个 tag 使用小间距。
- table 单元格中的 tag 不应意外撑高行高。
- 卡片/详情页中，只有设计明确时才允许换行。
- 避免同时出现太多彩色 tag。

Table 规则：

- 多个 tag 出现在 table 单元格时，重要的放前面。
- tag 过多时考虑 `+N` overflow。

---

## 9. AI 审查清单

接受 StatusBadge/Tag 代码前，检查：

- 颜色是否使用稳定语义。
- 颜色是否适配 light / dark mode。
- 品牌主色是否没有覆盖 error/success/warning 语义。
- icon 是否没有被滥用。
- 文案是否短，默认不换行。
- 长文案是否有 tooltip 或详情入口。
- 可点击 badge 是否有明显交互感。
- error badge 需要错误原因时，是否打开详情弹窗。
- tooltip 是否没有承载大量错误内容。
- table 中的 badge 是否不会意外撑高行高。
