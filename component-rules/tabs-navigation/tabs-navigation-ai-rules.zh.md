# Tabs / Navigation AI 执行规则

> 用于 AI 生成 2B Tabs、SegmentedControl、Route Navigation 的压缩版规则。
> 详细解释参考 `tabs-navigation-rules.zh.md`。

---

## 1. 核心区别

按改变的对象选择：

| 组件 | 改变对象 | 状态 |
|---|---|---|
| Tabs | 同页 content panel | local/query |
| SegmentedControl | filter/mode value | query/form state |
| Route Navigation | page/route | path |

规则：

- 改变 panel content，用 Tabs。
- 改变 data condition 或 view mode，用 SegmentedControl。
- 改变 URL path/page，用 Route Navigation。
- Tabs 和 SegmentedControl 不共用语义实现。
- 可以共用视觉 style primitive。

---

## 2. Tabs

Tabs 用于同页 panels。

规则：

- 每个 tab 都有对应 panel。
- Tab labels 简短。
- 临时 tabs 使用 local state。
- 选中 tab 需要分享/恢复时使用 query params。
- 不要把 tabs 当 route links。
- 不要用 tabs 表示 All/Active/Disabled 这类 filters。

---

## 3. SegmentedControl

SegmentedControl 用于紧凑单选 mode/filter values。

示例：

- All / Active / Disabled
- Day / Week / Month
- Table / Card

规则：

- 语义上是 form/radio-like control。
- 改变 query/filter/mode，经常触发请求。
- 选项数量通常 2-6。
- 改变值通常 reset page 并 clear selection。
- 不用于 route navigation 或 content panels。

---

## 4. Route Navigation

Route Navigation 用于切换 pages/modules。

规则：

- Items 是真实 links。
- Active state 从当前 path 推导。
- New route 需要 navigation entry。
- 不创建 dead routes。
- 除 redirects 外，不要把同一 component 重复挂多个路径。
- Path 用于 route-level navigation。

---

## 5. 层级与变体

规则：

- Tab levels 最多 2 层：L1 + L2。
- 避免 L3 tabs。
- L1 和 L2 视觉上可区分。
- Page-level content tabs 可用 pill style。
- Nested/dialog tabs 使用 underline style。
- 移动端 route nav 可用横向滚动 pills。

---

## 6. URL 持久化

规则：

- Path：route/module/page。
- Query：同页 selected tab、filter、mode。
- Local state：临时不可分享 panel。
- Invalid tab/query param fallback 到默认值。
- 切换 L1 route/tab 时，清理无效 sub-tab params。
- 不用 hash 存 tab state。

---

## 7. AI 检查清单

- 组件语义是否匹配：panel、filter/mode 或 route。
- Tabs 是否有 panels。
- SegmentedControl 是否没有被当作 Tabs 或 Route Nav。
- Route Nav 是否使用真实 links。
- Active state 是否从 route/query/local state 正确推导。
- URL persistence 是否匹配重要性。
- Tab levels 是否不超过 2。
- 移动端 overflow 是否处理。
