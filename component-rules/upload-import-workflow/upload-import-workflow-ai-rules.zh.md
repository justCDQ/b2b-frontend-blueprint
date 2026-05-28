# Upload / Import Workflow AI 执行规则

> 用于 AI 生成 2B 上传和导入流程的压缩版规则。
> 详细解释参考 `upload-import-workflow-rules.zh.md`。

---

## 1. Upload vs Import

Upload 用于简单文件传输：attachment、avatar、logo、document。

Import Workflow 用于会 create/update records 的结构化数据导入。

规则：

- Upload 关注文件传输。
- Import 关注 template、validation、mapping、confirmation、result。
- 不要把结构化 CSV/XLSX import 当简单 upload。
- 不要用泛泛 toast 隐藏 validation 或 partial failure。

---

## 2. Upload 规则

Upload UI 必须展示：

- accepted file types
- max file size
- single/multiple policy
- file list 或 current file
- 非短暂上传的 progress
- 多文件时 per-file status
- remove/replace/retry behavior

规则：

- 尽量上传前校验 type/size。
- Pending 时防止 duplicate submit。
- Failed upload 保留 file context。
- Retry 尽量针对 failed file。
- Drag-and-drop 需要键盘可访问替代。

---

## 3. Import Flow

结构化 import 应包含：

```text
Download template
Upload file
Parse and validate
Map fields / preview
Confirm scope
Run import
Result summary
Failed-row report
```

规则：

- 提供 template download。
- 校验 file type、size、row count、required columns、data format。
- 最终 import 前展示 validation errors。
- 明显字段 auto-map；模糊 mapping 需要确认。
- 最终确认命名 create/update scope 和 affected count。
- 长 import 变成 background task。

---

## 4. Partial Failure 与 Results

规则：

- Partial success 不是 generic failure。
- 展示 imported count 和 failed count。
- 有用时提供 failed-row report。
- Failed report 尽量包含 row number、field、reason、suggested fix。
- 除非明确 all-or-nothing transaction，否则保留 successful rows。
- Import 前明确 all-or-nothing policy。
- Success 展示 result summary，不只用 toast。

---

## 5. State、Permission、Responsive

规则：

- Upload pending 展示 progress。
- Parse/validate pending 展示 step loading。
- Import pending 防止 duplicate submit。
- Failure 保留 uploaded context 和 recovery path。
- Import action 遵守 create/update permissions。
- Preview/report 不泄漏不可访问数据。
- 移动端 upload 不能只依赖拖拽。
- Mapping/preview 移动端可变 cards 或 full page。

---

## 6. AI 检查清单

- Upload/import distinction 是否清楚。
- Constraints 是否可见。
- Structured import 是否有 template、validation、mapping、confirmation、result。
- Long import 是否变成 background task。
- Partial failure 是否处理。
- Failed-row report 是否在有用时可用。
- Duplicate submit 是否被防止。
- Permission/sensitive data rules 是否处理。
- Mobile flow 是否可用。
