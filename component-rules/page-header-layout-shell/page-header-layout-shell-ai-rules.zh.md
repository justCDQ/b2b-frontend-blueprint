# Page Header / Layout Shell AI 执行规则

> 用于 AI 生成 2B 页面 shell 和 header 行为的压缩版规则。
> 详细解释参考 `page-header-layout-shell-rules.zh.md`。

---

## 1. 作用域

Shell 负责：

- global navigation
- workspace/account context
- user/help/notification entry
- content frame

Page Header 负责：

- page title
- status/metadata
- breadcrumb/back
- page-level actions

规则：

- 不要把 row/list/field actions 放进 shell。
- 不要把 row actions 放进 page header。
- Routed pages 必须有 page title。
- 相关时，当前 route 和 workspace scope 必须可见。

---

## 2. Shell 规则

规则：

- 认证后页面 navigation 保持稳定。
- Active route 可见。
- Workspace/account/tenant 会改变数据范围时，switcher 可见。
- 页面 loading/error/forbidden 时尽量保留 shell。
- 移动端 shell 可预测折叠，并保持 active route 可达。
- Global shell actions 不和 page actions 竞争。

---

## 3. Page Header

推荐：

```text
Breadcrumb / Back
Title + status badge + key metadata
Optional description
Actions
```

规则：

- Title 命名当前 resource/module/workflow。
- Status badge 在影响决策时靠近 title。
- Description 不重复 title。
- Header 最多一个 primary action。
- 低频 actions 放入 overflow。
- Refresh/filter/list actions 通常属于 FilterBar/list toolbar。

---

## 4. Breadcrumb 与 Back

规则：

- Breadcrumb 反映真实 hierarchy。
- 除当前页外，breadcrumb items 都是 links。
- 已知时，Back 使用 canonical destination。
- List -> detail back 尽量恢复 query/page/scroll。
- Back 遵守 dirty state protection。
- 不展示多个互相竞争的 back actions。

---

## 5. Width、State、Responsive

规则：

- Dense tables 可使用完整内容宽度。
- Forms 使用可读 constrained width。
- Detail pages 使用中/宽 constrained width。
- Page StateView 出现在 content area，不覆盖 shell。
- Header actions 先折叠，再牺牲 title 可读性。
- 窄屏中 page title 和 primary action 保持可达。
- Breadcrumb 可折叠为 parent/back + current title。

---

## 6. 可访问性

规则：

- Shell nav 使用 navigation landmarks。
- Active route 暴露 `aria-current` 或等价语义。
- Page title 是 main heading。
- Breadcrumb 使用 breadcrumb semantics。
- Route change 后 focus 移动到 main title/content。

---

## 7. AI 检查清单

- Shell/global/page/local action scopes 是否没有混用。
- Page title 是否存在。
- Active route 和 scope 是否可见。
- Header action priority 是否清楚。
- Breadcrumb/back 是否 canonical。
- Content width 是否匹配页面类型。
- Loading/error states 是否保持 shell 稳定。
- 响应式 header 是否保留 title 和 primary action。
