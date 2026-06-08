# Card List 组件系统规范

> 用于 2B 产品中的卡片式列表。
> Card list 用于浏览和识别对象，不用于密集字段对比。

---

## 1. Card List vs Table vs MobileDataCard

使用 card list：

- 视觉识别、摘要或状态比横向字段对比更重要。
- item 内容差异较大。
- 用户浏览 integrations、templates、resources、dashboards、projects。
- 更适合无限滚动或响应式 grid。
- item 识别比精确字段对比更重要。
- 每个 item 适合展示 icon、logo、thumbnail、description、tags 或 summary metrics。

使用 table：

- 用户需要跨多行对比字段。
- 排序、选择、批量操作是核心。
- 数据有稳定 columns。
- 用户需要密集扫描或精确数值。
- row-level operations 次于数据对比。

使用 MobileDataCard：

- desktop experience 是 table。
- mobile 无法舒适展示所有 table columns。
- card 是 table rows 的响应式呈现。
- 数据字段仍遵循 table column 语义。

不要混淆：

| Pattern | 主要任务 | 数据模型 | 布局 |
|---|---|---|---|
| Table | 对比结构化字段 | 稳定 columns | rows/columns |
| MobileDataCard | table row 的移动端呈现 | 与 table columns 相同 | stacked fields |
| Card List | 浏览/识别/选择对象 | item summary and identity | responsive cards |

规则：

- 如果 desktop 是 table，mobile 变成 cards，这是 `MobileDataCard`，不是 Card List。
- 如果 card 内容只是 table fields 纵向堆叠，它大概率是 MobileDataCard。
- 如果 cards 需要视觉身份、丰富摘要或产品式浏览，使用 Card List。
- 如果用户需要 total count、page jump、跨行对比，优先 Table。
- 如果用户需要无限浏览 integrations/templates/resources，优先 Card List。
- Card List 仍然可以支持 filters、search、status 和 actions。
- Card List 不应该把大量 column-like fields 塞进卡片，伪装成 table。
- 不要只是为了页面看起来更轻，就用 Card List 替代 Table。

示例：

```text
Integrations marketplace -> Card List
Prompt templates -> Card List
Projects with logo/status/summary -> Card List
Users with role/email/last login comparison -> Table
Audit logs -> Table
Mobile users table -> MobileDataCard
```

### 判断问题

大多数回答 yes 时，选择 Card List：

- 每个 item 是否有可识别身份？
- 用户是否需要先浏览再决定？
- 摘要/描述是否重要？
- icons/logos/thumbnails/tags 是否有帮助？
- 严格跨行对比是否是次要任务？

大多数回答 yes 时，选择 Table：

- 用户是否需要跨行对比值？
- 是否有很多稳定字段？
- 排序和分页是否核心？
- 批量操作是否频繁？
- 密度是否比预览更重要？

选择 MobileDataCard：

- desktop pattern 是 table。
- mobile 仍需保留相同数据。
- mobile card 只是布局适配，不是新的浏览模式。

### 筛选与分页边界

规则：

- Card List 可以使用 FilterBar，但筛选应服务浏览，不应强行制造 table-like density。
- Card List 常见 infinite scroll 或 load more。
- 业务需要页码或 total count 时，可以使用传统分页。
- 如果用户需要精确 total 和 page jump，Table 可能更合适。
- Card List page size 应尽量保证 cards 至少铺满一屏。

---

## 2. Card 结构

推荐结构：

```text
Header: title + status/action
Body: summary, metadata, tags
Footer: primary/secondary item actions
```

规则：

- Title 必须可见且易识别。
- Status badge 靠近 title。
- Metadata 紧凑且一致。
- 不要把太多无关字段塞进一张卡片。
- Card radius 遵循产品系统，2B 中保持克制。
- 2B cards 应紧凑，并以内容为主。
- 除非卡片确实是视觉优先，否则避免营销式大留白、超大缩略图或装饰面板。
- 卡片内部模块间距应紧凑但可读。
- Card 内 pending/loading indicator 应紧凑，不能压过内容本身。

### 内容优先级

Card 内容必须有优先级，不要渲染所有可用字段。

| 优先级 | 内容 | 规则 |
|---|---|---|
| 必须 | title / identity | 始终可见 |
| 强建议 | status、summary/description | 有意义时可见 |
| 有用 | metadata、owner、time、count、usage | 紧凑且一致 |
| 可选 | thumbnail/icon/logo | 只有帮助识别时使用 |
| 可选 | tags | 限制、截断或折叠 |
| 可选 | actions | item-scoped 且克制 |

规则：

- Title/identity 必须在视觉第一行或第一个区块。
- item state 重要时，Status 靠近 title。
- Summary 解释 item，不重复 title。
- Metadata 只包含帮助浏览或决策的字段。
- 除非 card variant 明确设计为高密度信息卡，否则避免超过 3-5 个 metadata items。
- Tags 不应主导卡片。
- Empty metadata value 使用 `-` 或按产品策略省略。
- 不同 items 的内容顺序保持一致。

### Thumbnail / Icon / Logo

规则：

- 只有能帮助识别时才使用 thumbnail/icon/logo。
- 图片/icon 区域必须有稳定尺寸。
- 图片加载失败必须有 fallback。
- 不要让图片比例意外改变 card height。
- 2B thumbnails 用于识别，不是装饰性 hero image。
- 如果每个 item 都使用相同 generic icon，考虑移除。

### Metadata and metrics

规则：

- Metadata 使用一致的 label/value 或 icon/value 模式。
- 时间值使用一致格式。
- 数字带单位。
- 金额带币种。
- 长值 truncate，并在有帮助时提供 tooltip/copy。
- ID/token 使用 monospace，并在有帮助时提供 copy。
- Metrics 应少而易扫读。

示例：

```text
Owner: 小明
Last sync: 2h ago
Usage: 42 requests
Cost: $128.00
```

### Tags and badges

规则：

- Status 使用 StatusBadge rules。
- Tags 使用 Tag rules，不能无限换行。
- 空间有限时展示前几个 tags，其余折叠为 `+N`。
- Error badge 有价值时可打开 dialog/popover 查看原因。
- 颜色语义必须同时适配 light/dark mode。

---

## 3. 布局

规则：

- 使用 responsive grid。
- Grid/flex layout 应根据可用宽度自适应 card 数量。
- 保持稳定 card width 和视觉节奏。
- Card width 必须有安全最小宽度，不能无限缩小。
- Card height 应尽量在 items 之间保持稳定。
- 优先使用 fixed/min card height + 内部截断，而不是让 cards 高度跳动。
- Grid 使用 `minmax(safeMinWidth, 1fr)` 或等价响应式约束。
- 使用 flex wrapping 时，必须明确 card min width 和 gap。
- 不要为了多塞一列而把 card 挤到不可读宽度。
- 避免动态内容导致 layout shift。
- 长文本 truncate + tooltip/detail。
- Empty cards/skeletons 匹配最终 card 形态。
- Infinite scroll 使用底部 loading。

推荐：

```text
Grid columns: repeat(auto-fit/minmax(safeCardWidth, 1fr))
Safe card width: product-defined, usually not below a readable content width
Card height: stable by variant, content truncates inside
Gap: compact, consistent, not decorative
```

### 紧凑密度

规则：

- 2B card lists 优先信息密度，而不是视觉戏剧性。
- Header/body/footer spacing 应紧凑。
- Metadata rows 使用简洁 label，或在足够清晰时使用 icon。
- Tags 只有在设计明确允许时换行；否则截断或展示数量。
- Thumbnails/icons 用于帮助识别，不应占据卡片大部分空间。
- Loading skeleton 匹配紧凑 card 节奏。
- Pending state 应局部且小，例如 action loading、status pending 或轻量 overlay。
- 除非整张 card 内容不可用，否则不要在每张卡片中央使用大 spinner。

---

## 4. 操作

规则：

- Card primary action 作用于该 item。
- 额外 actions 进入 overflow menu。
- 危险 actions 需要确认。
- Action 位置不能和 card click 冲突。
- 如果整张 card 可点击，action buttons 必须阻止冒泡。
- 不要在一张卡片上暴露太多操作。

### Card click vs actions

规则：

- 只有 primary behavior 清晰时，才允许 whole-card click。
- 如果整张卡片打开详情，title 在可行时也应是 link。
- Card actions 不能触发 card click。
- Checkbox selection 不能触发 card click。
- Overflow menu trigger 不能触发 card click。
- 移动端如果 actions/selection 容易误触，避免整张 card 可点击。
- Clickable card 需要明显 hover/focus feedback。
- Non-clickable card 不能看起来可点击。

### Action placement

规则：

- Primary item action 放在 card footer 或清晰 action area。
- Overflow 根据 card 密度放在 header/right side 或 footer。
- 危险 actions 通常进入 overflow。
- Pending action 是 card-local。
- 不要在 card footer 暴露太多 buttons。

---

## 5. Selection And Batch

规则：

- 只有存在 batch actions 时才使用 checkbox selection。
- Selection affordance 必须可见，不能依赖 hover。
- Batch toolbar 展示 selected count。
- Disabled cards 不能被选择，原因不明显时说明。

---

## 6. Card States

Cards 必须支持常见 item states。

States：

- default
- hover
- focus
- selected
- disabled
- pending
- error
- locked / archived / unavailable
- loading skeleton

规则：

- card 可交互时，hover/focus state 应清晰。
- selected state 必须视觉明确且可访问。
- disabled/unavailable card 仍应可读。
- disabled reason 原因不明显时需要说明。
- pending state 应局部且紧凑。
- error state 有价值时展示 status 和 recovery/details。
- archived/locked card 不应暗示不可用 actions 仍可操作。
- loading skeleton 匹配最终 card size 和 density。

### Loading and skeleton

规则：

- 初始加载使用匹配 card variant 的 skeleton cards。
- Skeleton count 应填满可视 viewport，而不是 total item count。
- Refresh 时尽量保留旧 cards。
- Infinite scroll 使用底部 loading。
- Item-level pending 不替换整张 card skeleton。
- Skeleton height 应匹配稳定 card height。
- 当 card skeleton 更有信息量时，不要用一个巨大 spinner 代替整个 grid。

---

## 7. Mobile

规则：

- 移动端通常使用单列 cards。
- Touch targets 必须可用。
- Overflow actions 合并进 menu。
- Card click 和 actions 必须清晰分离。
- Selection 不能依赖 hover。
- Tags/actions 在移动端可以更积极地折叠。
- Metadata 只保留最重要字段。

---

## 8. AI 审查清单

- Card list 是否是正确模式，而不是 table。
- 是否没有把 MobileDataCard 和真正的 Card List 混淆。
- Card List 是否因为浏览/身份/摘要而被选择，而不是用于密集对比。
- 稳定字段和跨行对比是核心时，是否仍然使用 Table。
- Card title/status/metadata 层级是否清晰。
- Grid 是否 responsive 且稳定。
- Cards 是否有安全最小宽度，且不会无限缩小。
- Card height 是否稳定，或按 variant 有意约束。
- Card spacing/pending/loading 是否符合 2B 的紧凑内容优先原则。
- Card 内容优先级是否清晰，且没有渲染所有字段。
- Thumbnail/icon/logo 是否有稳定尺寸和明确用途。
- Metadata/metrics/tags 是否紧凑且格式一致。
- Tags/badges 是否遵循 StatusBadge/Tag 语义。
- Actions 是否 item-scoped，并且不和 card click 冲突。
- Whole-card click、title link、actions、selection、overflow 是否不冲突。
- Card states 是否处理：selected、disabled、pending、error、unavailable、skeleton。
- Selection/batch 行为是否明确。
- Loading/empty states 是否匹配 card layout。
