# Component Architecture AI 执行规则

> 用于 AI 生成 2B 组件架构的压缩版规则。
> 详细解释参考 `component-architecture-rules.zh.md`。

---

## 1. 核心规则

把组件做成可复用架构，而不是一次性页面 UI。

必须拆分：

- behavior
- presentation
- data mapping
- business integration

推荐模型：

```text
headless behavior -> styled primitive -> domain wrapper -> feature usage
```

---

## 2. 分层规则

规则：

- Primitive components 不包含业务域逻辑。
- Headless hooks/controllers 拥有交互状态和 handlers。
- Styled components 消费 tokens 和 variants。
- Domain components 把 API data 映射到 generic component props。
- Feature components 拥有页面级 data flow 和 composition。

不要把 API requests、role logic 或 backend response parsing 放进低层 primitives。

---

## 3. Composition 规则

使用：

- compound components 承载结构化组件
- slots 承载可替换区域
- render callbacks 承载数据相关 UI
- controlled APIs 承载可复用 stateful components

避免：

- boolean prop explosion
- 把 raw CSS props 作为主要 API
- generic components 中出现业务特定 props
- 重复桌面/移动业务逻辑

---

## 4. State 与 API 规则

规则：

- Component API 描述意图，不描述视觉 hack。
- 视觉变体使用 `variant`、`size`、`tone`、`state`、`density`。
- 行为使用 `pending`、`disabledReason`、`danger`、`required`、`readonly`。
- Loading/pending 必须定义 blocked scope。
- Disabled state 在有用时支持 reason。
- Selection 使用 stable keys。
- Responsive transformation 保留 state。

---

## 5. Styling 与 Theming

规则：

- 使用 semantic design tokens。
- 支持 light/dark mode。
- 通过 tokens 支持 theme/brand override。
- Color/layout/motion/density tokens 分离。
- Feature components 避免一次性 hardcoded style values。
- Component variants 映射到 tokens。

---

## 6. Permission、i18n、Accessibility

规则：

- Permission decisions 来自 caller/domain layer。
- Components 接收 permission-derived state，不接收 raw role logic。
- Product copy 可注入。
- Labels、aria labels、errors、empty text、tooltips 支持 i18n。
- Primitives 内置 accessibility 和 keyboard behavior。
- ARIA semantics 匹配真实行为。
- Icon-only actions 有 accessible labels/tooltips。
- Components 不只依赖颜色。

---

## 7. 兼容与测试

规则：

- 现代 CSS/JS 特性需要 fallback 或明确支持边界。
- 优先 feature detection，而不是 user-agent checks。
- 支持浏览器中核心任务保持可用。
- 测 behavior，不测实现细节。
- Interactive primitives 测 keyboard/focus。
- 测 disabled/pending/error states。
- 关键组件测 responsive transformation。

---

## 8. AI 检查清单

- Behavior、style、data mapping、business integration 是否分离。
- Generic component 是否没有 business API logic。
- Props 是否避免 boolean explosion。
- Tokens 是否替代 hardcoded styling。
- Permission 和 i18n 是否可注入。
- State contract 是否显式。
- Accessibility 是否内置。
- Browser fallback 是否考虑。
- Component 是否能脱离单个页面测试。
