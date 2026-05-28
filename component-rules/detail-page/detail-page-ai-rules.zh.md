# Detail Page AI 执行规则

> 用于 AI 生成 2B 详情页的压缩版规则。
> 详细解释参考 `detail-page-rules.zh.md`。

---

## 1. 什么时候使用

使用 Detail Page：

- 需要可分享/可刷新的 URL。
- 需要 deep review。
- 有 related tables/logs/activity。
- 有多个 resource actions。
- 有 edit mode 或复杂 sections。
- permission、audit、billing 或 operational context 重要。

短而聚焦的临时内容用 Dialog。

需要保留 list/page context 的中等详情/编辑用 Drawer。

不要把 Drawer 当隐藏 route page。不要为了避免路由把大型详情放进 Dialog。

---

## 2. 入口与 URL

规则：

- 存在 detail route 时，identity field 链接到详情路由。
- 从 list 打开详情时保留 query/filter/sort/page state。
- 返回 list 时尽量恢复 query/page/scroll。
- Detail identity 属于 route path。
- 需要恢复的 detail tab/section state 使用 route segment 或 query。
- Invalid tab/query 安全 fallback。
- Deleted/not-found resource 展示明确状态和 canonical back。

---

## 3. 结构

Detail page 应包含：

```text
Breadcrumb / Back
Page Header: title + status + metadata + actions
Summary / key facts
Tabs / sections
Related tables / logs / activity
```

规则：

- Title/identity 在首屏可见。
- 相关时，status badge 靠近 title。
- Page actions 影响 resource。
- Summary 展示决策关键事实。
- Related data 留在 sections/tabs 中。
- 避免无关 card 堆叠和 nested cards。

---

## 4. Actions 与 Edit

规则：

- Page actions 影响 resource。
- Section actions 只影响 section。
- Related row actions 只影响 related rows。
- Dangerous resource actions 放入 overflow/danger zone/ConfirmDialog。
- Edit pattern 匹配复杂度：1-2 fields 用 Dialog，中等上下文编辑用 Drawer，多字段/多区块用 page edit mode。
- Dirty edit 需要 leave confirmation。
- Save pending 防止重复提交。
- Save failure 保留输入。

---

## 5. State 与响应式

规则：

- 初始加载在 layout 已知时使用 detail skeleton。
- Refresh 尽量保留旧 detail。
- Not found 使用 StateView + canonical back。
- Forbidden 使用 permission StateView，不是 empty state。
- Related section failure 保持局部。
- 移动端保留 title/status/actions。
- Related tables 可变成 MobileDataCard。
- 移动端重型 workflow 使用 route page，不塞进拥挤 overlay。

---

## 6. AI 检查清单

- Detail Page 是否比 Dialog/Drawer 更合理。
- 入口是否保留 list context。
- URL 是否表达 identity 和 recoverable state。
- Header 是否包含 title/status/actions。
- Summary、sections、related data 是否分离。
- Action scopes 是否没有混用。
- Edit mode 是否处理 dirty/save/pending/failure。
- Not-found/forbidden/deleted states 是否明确。
- 响应式布局是否保留主要上下文。
