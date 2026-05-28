# Tabs / SegmentedControl / Route Navigation 组件系统规范

> 用于创建、修改或审查 2B 产品中的类 Tab 导航。
> 很多控件看起来像 Tab，但语义不同。

---

## 1. 核心区别

根据“切换后改变什么”来选择组件。

| 组件 | 改变什么 | URL 行为 | 用途 |
|---|---|---|---|
| Tabs | 内容面板 | 可选 | 同页内容分区 |
| SegmentedControl | 筛选值/模式 | 通常是 query params | 数据条件或展示模式 |
| Route Navigation | 路由/页面 | path | 模块或页面 |

规则：

- 切换内容面板，用 Tabs。
- 切换数据筛选或展示模式，用 SegmentedControl。
- 切换 URL path / 页面，用 Route Navigation。

---

## 2. Tabs

Tabs 用于同一页面或同一弹窗中的内容面板切换。

示例：

- 用户详情：Overview / Orders / Audit Logs
- 设置页：General / Security / Billing
- 弹窗内容：Basic / Advanced

规则：

- Tabs 切换内容面板。
- Tabs 不表示数据筛选。
- 每个 tab 都应该有对应 panel。
- 不要用 Tabs 做只有链接的跳板页。
- Tab 文案要短。
- 不需要分享/刷新恢复时，可以使用本地 state。
- 需要分享/刷新恢复时，使用 query params。

禁止：

```text
Tabs: 全部 / 启用 / 禁用
```

这种场景使用 SegmentedControl。

---

## 3. SegmentedControl

SegmentedControl 用于少量互斥值。

示例：

- 全部 / 启用 / 禁用
- 日 / 周 / 月
- 表格 / 卡片
- 成功 / 失败 / 等待中

规则：

- 语义上，SegmentedControl 是表单控件，不是 Tab 组件。
- 它是 RadioGroup / 单选控件的紧凑视觉变体。
- 改变数据条件或展示模式。
- 通常会触发请求或重新计算。
- 常出现在 FilterBar 中。
- 选项数量通常 2-6 个。
- 影响列表结果时，状态应由 query 驱动。
- 切换值通常重置 page，并清空 selection。
- 可以和 Tabs 共用 pill/segmented 样式。
- 不能复用 Tabs 行为、Tabs 实现或 ARIA tab 语义。

不要用于：

- 有独立布局的内容面板。
- 路由级导航。
- 长选项列表。

实现规则：

- 可以共用样式 primitive。
- 不能和 Tabs 共用语义组件。
- 即使使用同一套 design tokens，也应该分别导出 `Tabs` 和 `SegmentedControl` 组件。

---

## 4. Route Navigation

Route Navigation 用于切换模块/页面。

示例：

```text
/settings/profile
/settings/security
/settings/billing
```

规则：

- path 会变化。
- 状态由 URL 恢复。
- 使用 link/navigation，不使用本地 state。
- 每个路由 nav 都应有真实路由内容。
- 不要创建没有入口的死路由。
- 同一组件不要挂载到多个路径，旧路径用 redirect。

适用于：

- 设置模块。
- 账单分区。
- 详情页子模块。
- 管理后台模块。

---

## 5. 层级

限制 Tab 层级。

| 层级 | 用途 |
|---|---|
| L1 | 页面级主要分区 |
| L2 | 嵌套区块或弹窗内 tabs |
| L3 | 避免 |

规则：

- 最多 2 层：L1 + L2。
- 不要创建 L3 tabs。
- L1 和 L2 视觉上应该有区别。
- 弹窗内 tabs 属于弹窗作用域，样式应更轻。
- Sidebar L1 + 内容区 L2 是可接受的。

---

## 6. Variant 规则

统一使用 variant。

| 场景 | Variant |
|---|---|
| L1 页面内容 tabs | `pill` |
| L2 嵌套 tabs | `underline` |
| 弹窗内 tabs | `underline` |
| SegmentedControl | 紧凑 segmented 样式 |
| 移动端 route nav | 横向 pills |

规则：

- 页面级内容 tabs 默认使用 `pill`。
- 嵌套或弹窗内 tabs 使用 `underline`。
- 弹窗内 tabs 属于弹窗作用域，不等同于页面 L1 tabs。
- 同一层级不要混用 L1/L2 视觉样式。
- 使用组件 variant，不要手写 active 样式。

---

## 7. Route Nav 形态

按数量和布局选择 route navigation 形态。

| 场景 | 形态 |
|---|---|
| 2-5 个 route item | 水平 pill links |
| 5+ 个含图标 route item | 桌面 sidebar + 移动横向 pills |
| 详情页子模块 | 桌面 sidebar，移动横向 pills |
| 简单顶层分区导航 | 水平 links/pills |

规则：

- 模块较多时，桌面端可用 sidebar。
- 移动端 route nav 应变成横向可滚动 pills。
- Route nav item 应该是真实 link。
- Active route 从当前 path 推导。
- 新增 route 必须有导航入口。
- 禁止没有入口的死路由。

---

## 8. URL 持久化

根据重要性选择持久化方式。

| 场景 | 持久化 |
|---|---|
| 临时本地面板 | local state |
| 同页可分享 tab | query param |
| 路由模块 | path |
| 筛选/模式 | query param |
| 嵌套 sub tab | query param |

规则：

- 不使用 hash 保存 tab 状态。
- path 用于路由级导航。
- query param 用于同页选中状态。
- local state 只用于不需要分享/恢复的临时状态。
- 切换 L1 route/tab 时，清理无效 sub-tab 参数。
- 无效 tab 参数回退到默认值。
- route tab id 尽量和 route path segment 一致。
- route layout 可以通过 URL 最后一段推导 active tab。

示例：

```text
/users/123?tab=orders
/settings/security
/logs?status=failed
```

---

## 9. 路由规则

规则：

- Route path 使用 kebab-case。
- 一个组件只保留一个规范路径。
- 旧路径使用 replace redirect。
- redirect 路由集中放置，便于维护。
- 新增 route 必须有导航入口。
- Tab route 页面必须渲染真实内容。
- 禁止只包含链接卡片的跳板页。
- 多个模块能进入同一功能时，保留一个规范 route。

推荐：

```text
/settings/api-keys
/billing/invoices
```

不推荐：

```text
/settings/apiKeys
/settings/api_keys
```

---

## 10. 移动端行为

规则：

- Tabs / segmented controls 默认不换行。
- 溢出时横向滚动。
- active item 应自动滚入可视区。
- 触控目标至少 36px，关键导航接近 44px。
- 文案不要太长。
- 移动端避免过多 tabs。
- 路由导航 sticky 可以用于增强定位感。
- 弹窗内 tabs 在弹窗 body 内滚动，不要变成页面级 sticky nav。
- deep link 进入页面时，active item 应自动滚入可视区。
- route/query 变化时，active item 应自动滚入可视区。

选项过多时：

- Route nav：桌面用 sidebar，移动端用横向 pills。
- Filters：低频选项进入 Advanced Filter。
- 内容分区：考虑路由页或 sidebar navigation。

Sticky 规则：

| 场景 | Sticky |
|---|---|
| 移动端 route pills | 允许/推荐 |
| 页面内容 tabs | 通常不 sticky |
| 弹窗内 tabs | 不做页面级 sticky |
| sidebar route nav | 桌面端 sidebar 可保持可见 |

---

## 11. 样式语义

视觉样式要强化语义。

常见样式：

- L1 Tabs：pill 或强 active 背景。
- L2 Tabs：underline 或更轻样式。
- SegmentedControl：紧凑等权选择控件。
- Route Nav：link/nav item，移动端可像 pills。

规则：

- 不要把筛选控件做得和内容 Tabs 完全一样，避免语义混淆。
- Route links 不要伪装成 ARIA tabs，除非行为真的像 tabs。
- SegmentedControl 可以和 Tabs 视觉对齐，但必须保留 form/radiogroup 语义。
- active 状态必须清晰。
- disabled tab/nav item 可见时需要说明原因。

---

## 12. 实现禁止项

禁止：

- 有 Tabs 组件时，不要用原始 button 手写 ARIA tabs。
- 不要用 grid Tabs 做筛选，筛选用 SegmentedControl。
- 不要用 Tabs primitives 或 `role="tab"` 实现 SegmentedControl。
- 不要每个页面手写 active 颜色。
- 不要用 hash 保存 tab 状态。
- 不要把同一组件挂到多个非 redirect 路径。
- 不要创建没有对应 panel/content 的 tabs。
- 不要把 route links 标成 ARIA tabs。
- 移动端 tab 文案默认不要换行。

不推荐：

```jsx
<button role="tab" aria-selected={active}>Overview</button>
```

```jsx
<TabsList className="grid grid-cols-4">
  <TabsTrigger value="all">All</TabsTrigger>
  <TabsTrigger value="active">Active</TabsTrigger>
</TabsList>
```

第二个例子应使用 SegmentedControl。

---

## 13. 可访问性

规则：

- 真正的 Tabs 使用正确 tabs/tabpanel 语义。
- Route Navigation 使用 nav/link 语义。
- SegmentedControl 需要表达 selected 状态。
- SegmentedControl 使用 form/radiogroup 语义，不使用 tabs/tabpanel 语义。
- 键盘用户可以移动和激活项目。
- active 状态不能只依赖颜色。
- disabled item 不能造成 focus trap。

重点：

- 路由链接不要伪装成 ARIA tabs。
- 没有 panel 的 Tabs 不是真 Tabs。

---

## 14. AI 审查清单

接受 tab/navigation 代码前，检查：

- 组件选择是否匹配语义：panel、filter/mode、route。
- 是否没有用 Tabs 做筛选。
- 是否没有用 SegmentedControl 做路由导航。
- SegmentedControl 是否没有使用 Tabs 语义实现。
- Route nav 是否使用 path/link，而不是 local state。
- URL 持久化方式是否合理。
- 是否没有使用 hash。
- 无效 tab 参数是否安全回退。
- route tab id 是否在适用时和 path segment 一致。
- 新 route 是否有导航入口。
- 旧路径 redirect 是否使用 replace。
- 是否避免了 L3 嵌套。
- L1 是否使用 pill，L2/弹窗 tabs 是否使用 underline。
- 移动端溢出是否横向滚动。
- active item 是否在需要时滚入可视区。
- deep link 初始进入时 active tab 是否滚入可视区。
- L1/L2/filter/route 视觉是否能区分。
- 是否使用组件 variant，而不是手写 active 颜色。
- 可访问性语义是否匹配组件类型。
