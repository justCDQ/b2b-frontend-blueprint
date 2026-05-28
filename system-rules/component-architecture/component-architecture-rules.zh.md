# Component Architecture 组件架构规则

> 用于 2B 控制台模板中构建可复用、可定制、可维护的组件。
> 目标是拆开交互逻辑、视觉样式、数据契约和业务集成。

---

## 1. 核心原则

2B 组件必须支持定制，而不是每次重写业务逻辑。

规则：

- 高频复用组件应拆分行为和表现。
- 优先使用 design tokens，不硬编码样式。
- 优先 composition，而不是超长 props。
- Base components 不包含业务特定逻辑。
- Permission、i18n、loading、disabled、error states 必须显式。
- 组件应能脱离具体产品页面进行测试。
- 组件应在支持浏览器范围内优雅降级。

推荐心智模型：

```text
headless behavior -> styled primitive -> domain wrapper -> feature usage
```

---

## 2. 组件分层

使用分层组件。

| 层级 | 用途 | 示例 |
|---|---|---|
| Primitive | 低层可访问 UI building block。 | Button、Input、Dialog、Tooltip |
| Headless hook / controller | 状态、键盘、校验、选择、交互逻辑。 | useTableSelection、useDialogState |
| Styled component | 使用 tokens 的产品视觉实现。 | AppButton、AppTable、AppDialog |
| Domain component | 业务语义和数据映射。 | UserStatusBadge、ProjectTable |
| Feature component | 页面级组合。 | UsersPage、ImportCustomersWizard |

规则：

- Primitive components 不知道业务域。
- Headless logic 不依赖 CSS classes。
- Styled components 使用 tokens 和 variants。
- Domain components 可以把 API data 映射到 generic components。
- Feature components 组合 domain components，并拥有页面级 data flow。

---

## 3. Headless 与 Styled 分离

以下情况使用 headless 分离：

- 交互逻辑复杂。
- 视觉样式需要替换。
- 组件会跨产品/主题复用。
- 可访问性行为不简单。
- 状态管理需要独立测试。

示例：

```text
useDisclosure -> Dialog/Drawer open state
useTableSelection -> selected rows and disabled selection
usePagination -> page/pageSize/nextToken
useFilterState -> filter/query/url sync
```

规则：

- Headless APIs 暴露 state 和 event handlers。
- Styled components 消费 headless state 并渲染 UI。
- 不要把 theme tokens 放进 headless hooks。
- 不要把 API requests 放进低层 primitives。
- 需要时保留 custom rendering escape hatch。

---

## 4. Composition Patterns

复杂组件优先使用 composition。

子结构重要时使用 compound components：

```tsx
<Dialog>
  <Dialog.Header />
  <Dialog.Body />
  <Dialog.Footer />
</Dialog>
```

消费者需要替换局部时使用 slots：

```tsx
<DataTable
  toolbarSlot={<UserTableToolbar />}
  emptySlot={<UserEmptyState />}
/>
```

数据相关自定义 UI 使用 render callbacks：

```tsx
<DataTable
  columns={columns}
  renderRowActions={(row) => <UserRowActions user={row} />}
/>
```

规则：

- 避免 boolean prop explosion。
- 优先 named slots，而不是大量一次性 props。
- 数据相关 UI 使用 render callbacks。
- 结构化 overlays/forms/navigation 使用 compound components。
- 常见使用路径必须保持简单。

---

## 5. Props 与 API 设计

组件 API 应明确且稳定。

规则：

- Props 描述意图，不描述视觉 hack。
- 设计系统变体使用 `variant`、`size`、`tone`、`state`、`density`。
- 行为相关状态使用 `disabledReason`、`pending`、`permission`、`danger`、`required`。
- 除非是低层 primitive，否则不要把原始 CSS 值作为主要 API。
- 可复用 stateful components 优先支持 controlled API。
- Uncontrolled mode 只在能简化简单使用时支持。
- Event names 描述用户意图：`onSubmit`、`onOpenChange`、`onSelectionChange`。

避免：

```tsx
<Button isBlueBigRounded />
<Table showThing disableOtherThing weirdMode />
```

推荐：

```tsx
<Button variant="primary" size="md" />
<DataTable density="compact" selection={selection} />
```

---

## 6. State Contract

可复用组件应清晰暴露状态。

常见 states：

- default
- hover/focus
- active/selected
- loading/pending
- disabled
- readonly
- error
- empty
- success/warning/info

规则：

- Loading 和 pending state 必须定义 blocked scope。
- Disabled state 在有用时支持 reason。
- Error state 应明确是 local、field-level、section-level 还是 page-level。
- Selection state 使用 stable keys。
- Components 不应静默重置 controlled state。
- Responsive transformation 必须保留 component state。

---

## 7. Styling 与 Theming

使用 token-driven styling。

规则：

- 使用 semantic tokens，不硬编码 colors。
- 支持 light 和 dark mode。
- 支持通过 tokens 覆盖 brand/theme。
- Layout tokens 和 color tokens 分离。
- Component variants 映射到 tokens。
- Feature components 中避免一次性 CSS 值。
- 避免破坏组件状态的 style overrides。

Token groups：

- color
- typography
- spacing
- radius
- border
- shadow
- z-index
- motion
- density

---

## 8. Permission、i18n 与 Data Boundaries

Permission：

- Base components 可以渲染 disabled/hidden states。
- Permission decisions 来自 caller/domain layer。
- Components 接收 `disabledReason` 或 permission-derived state，不接收 raw role logic。

i18n：

- Base components 不硬编码产品文案。
- Labels、aria labels、empty text、errors、tooltips 必须可注入。
- Components 必须容忍更长的翻译文本。

Data：

- Base components 接收 normalized data contracts。
- Domain components 把 API shape 映射成 component shape。
- Generic components 不知道后端特定 response structure。

---

## 9. 可访问性

规则：

- Accessibility 默认属于 primitives。
- Menu、dialog、tabs、table selection、tooltip 的键盘交互应内置在 primitives。
- ARIA semantics 必须匹配真实行为。
- Icon-only actions 需要 labels/tooltips。
- Overlays 必须有 focus management。
- Error/help text 应和 fields 关联。
- Components 不只依赖颜色。

---

## 10. 浏览器兼容与降级

规则：

- 使用现代 APIs 时，组件应定义 fallback。
- 不要无 fallback 地依赖不支持的 CSS 特性。
- Container queries、popover、dialog、clipboard、drag/drop、sticky、virtual scroll 需要兼容决策。
- 先安全降级交互，再让布局崩坏。
- 优先 feature detection，而不是 user-agent checks。
- 支持浏览器范围内核心任务必须可用。

---

## 11. 测试契约

可复用组件应可测试。

规则：

- 测行为，不测实现细节。
- Interactive primitives 测 keyboard 和 focus behavior。
- 测 disabled/pending/error states。
- 同时存在 controlled/uncontrolled 时都要测。
- Permission-derived disabled/hidden behavior 在 domain/feature layer 测。
- 关键组件测试 responsive transformation。
- E2E 覆盖主要组合流程，而不是每个 primitive state。

---

## 12. 文件夹与命名建议

推荐结构：

```text
src/
  components/
    primitives/
    composed/
    data-display/
    feedback/
    forms/
    overlays/
  hooks/
  design-tokens/
  features/
  routes/
```

组件文件夹示例：

```text
DataTable/
  DataTable.tsx
  DataTable.types.ts
  DataTable.styles.ts
  useDataTableSelection.ts
  DataTable.test.tsx
  index.ts
```

规则：

- 可复用组件使用清晰、无业务域的命名。
- Domain/feature components 才使用业务命名。
- 通过 `index.ts` 导出 public APIs。
- Internal helpers 保持私有。

---

## 13. AI 审查清单

- Component 是否拆分 behavior、style、domain mapping。
- Base component 是否没有 business-specific API logic。
- 是否使用 design tokens 而不是 hardcoded styling。
- Component API 是否避免 boolean prop explosion。
- 是否在合适场景使用 slots/render callbacks/compound components。
- Loading、disabled、pending、error、selected states 是否显式。
- Permission 和 i18n 是否可注入。
- Accessibility behavior 是否内置。
- Browser fallback/degradation 是否考虑。
- Component 是否能脱离具体页面测试。
