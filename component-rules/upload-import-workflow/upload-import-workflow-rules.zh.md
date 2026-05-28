# Upload / Import Workflow 上传导入流程规范

> 用于 2B 产品中的文件上传、结构化导入和批量数据写入。

---

## 1. Upload vs Import

Upload 用于简单文件附件或资产提交。

Import Workflow 用于会创建/更新大量 records 的结构化数据导入。

| 模式 | 使用场景 | 复杂度 |
|---|---|---|
| Upload | attachment、avatar、logo、document | 低 |
| Bulk Upload | 多文件、documents、media | 中 |
| Import Workflow | CSV/XLSX 结构化数据、create/update records | 高 |
| Background Import | 长时间 import job | 高/异步 |

规则：

- Upload 关注文件传输。
- Import 关注校验、映射、预览、确认和结果处理。
- 不要把结构化导入当作简单上传。
- 不要用泛泛 success/error toast 隐藏 validation 和 partial failure。

---

## 2. Upload 组件规则

Upload UI 应展示：

- accepted file types
- max file size
- single vs multiple policy
- current file list
- 非短暂上传的 progress
- 多文件时每个文件的 pending/success/error
- remove/replace/retry 行为

规则：

- 尽量在上传前校验 file type 和 size。
- Upload pending 时防止 duplicate submit。
- 多文件上传展示 per-file status。
- 上传失败应保留 selected file context。
- Retry 尽量只重试失败文件。
- Re-upload policy 必须清楚：replace、append 或 compare。
- Drag-and-drop 必须有键盘可访问替代入口。

---

## 3. 结构化导入流程

推荐流程：

```text
Download template
Upload file
Parse and validate
Map fields / preview
Confirm scope
Run import
Show result summary
Provide failed-row report
```

规则：

- 结构化导入提供 template download。
- 展示 required columns 和 accepted formats。
- 校验 file type、size、row count、required columns 和 data format。
- 最终 import 前必须完成 validation。
- 字段可能变化时，import 前展示 preview/mapping。
- 最终确认必须说明 create/update scope 和 affected record count。
- 长导入应变成 background task，并展示状态。

---

## 4. 校验与映射

Validation 应检测：

- missing required columns
- invalid data types
- duplicate keys
- invalid references
- permission-inaccessible records
- row count limit exceeded
- unsupported file format
- encoding/header issues

Mapping 规则：

- 明显字段可安全 auto-map。
- 模糊 mapping 需要用户确认。
- 未映射 required fields 是 blocking errors。
- Optional fields 可以不映射。
- 重新上传兼容文件时，尽量保留 mapping。
- Import 前 mapping 应可 review。

---

## 5. Import 确认

最终导入前展示：

- file name
- total rows
- valid rows
- invalid rows
- 已知时 create/update/skip counts
- target object/scope
- all-or-nothing vs partial import policy

规则：

- Confirm copy 必须具体。
- 危险或大范围 import 使用 ConfirmDialog 或 review step。
- 如果 import 会更新已有 records，必须明确说明。
- 如果 import 无法撤回，submit 前必须说明。

---

## 6. Partial Failure

Partial success 不是 generic failure。

规则：

- 展示 imported count 和 failed count。
- 提供 failed-row report download 或 detail view。
- 除非事务要求 all-or-nothing，否则保留 successful rows。
- All-or-nothing behavior 必须在 import 前明确。
- Failed-row report 尽量包含 row number、field、reason 和 suggested fix。
- 可行时允许重新导入修正后的失败 rows。

---

## 7. Background Tasks

使用 background task：

- import 可能超过短请求时间。
- 用户可以安全离开页面。
- 处理发生在服务端。
- 结果可能稍后完成。

规则：

- 展示 queued/running/succeeded/failed/canceled states。
- 有价值时提供 task detail 或 activity log。
- Toast 可通知开始/完成，但必须有 result page/summary。
- Refresh 查询 task status，不清空上下文。
- 长任务不应阻塞无关导航，除非业务状态要求。

---

## 8. 状态与反馈

规则：

- 初始 upload area empty state 应可行动。
- Upload pending 展示 progress。
- Parse/validate pending 展示 step-specific loading。
- Import 前展示 validation errors。
- Import pending 防止重复 submit。
- Success 展示 result summary，不只用 toast。
- Failure 保留 uploaded context，并说明恢复方式。
- Refresh failure 保留最后已知 task/result state。

---

## 9. 安全与权限

规则：

- Preview 中不要暴露超出用户权限的敏感数据。
- 即使 UI 误接受，服务端也要拒绝 unsupported file types。
- 根据需要进行服务端扫描/校验。
- Import action 遵守 create/update permissions。
- Template download 只包含可访问 fields。
- Failed-row reports 不应泄漏不可访问数据。

---

## 10. 响应式行为

规则：

- Upload zone 在移动端不能只依赖拖拽。
- Mapping table 可变成 stacked field mapping cards。
- 大型 preview 在移动端应进入 full page 或独立 step。
- Result summary 优先展示 counts，并保持可读。
- 长 failed-row reports 应支持下载，而不是挤在小屏里。

---

## 11. 示例

Simple upload：

```text
Upload logo -> validate PNG/JPG and size -> preview -> save
```

Structured import：

```text
Download customer template -> upload CSV -> validate rows -> map columns -> confirm import 1,240 customers -> show result and failed-row report
```

Background import：

```text
Upload 100k records -> validate sample -> start import job -> view task log -> receive completion toast -> open result summary
```

---

## 12. AI 审查清单

- Upload/import distinction 是否清楚。
- File type/size/count constraints 是否可见。
- Structured import 是否有 template、validation、mapping、confirmation、result。
- Long import 是否变成 background task。
- Partial success/failure 是否处理。
- Failed-row report 是否在有用时存在。
- Duplicate submit 是否被防止。
- Permission 和 sensitive data handling 是否定义。
- 移动端是否不依赖 drag-only interaction。
