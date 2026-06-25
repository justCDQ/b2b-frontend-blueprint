# 新增资源模块

Resource Module 是给生成项目新增业务页面的推荐方式。

一个资源模块描述一个可管理的业务对象，例如用户、活动、商品、订单、优惠券、配置项等。

## 文件位置

简单项目可以放在：

```text
packages/data/src/
```

复杂项目可以放到：

```text
apps/web/src/features/{resource}/
```

无论放在哪里，都应该保持同一套契约。

## 最小结构

一个资源模块应该导出：

```js
export const productResource = createResourceModule({
  key: "products",
  label: "商品管理",
  navLabel: "商品",
  resource: "product",
  description: "管理商品上下架、状态和基础信息。",
  filters: [],
  columns: [],
  form: productFormSchema,
  actions: [],
  api: productApi,
  importContract: productImportContract
});
```

## 第一步：定义表单 Schema

```js
import { createFormSchema } from "../../form-schema/src/index.js";

export const productFormSchema = createFormSchema([
  { name: "name", label: "商品名称", type: "input", required: true, maxLength: 80 },
  { name: "status", label: "状态", type: "select", required: true, options: ["draft", "online", "offline"] },
  { name: "price", label: "价格", type: "number", required: true }
]);
```

schema 用于：

- 初始表单值。
- 必填校验。
- 简单规则校验。
- 后续表单渲染。

## 第二步：定义 API 契约

```js
export const productApi = {
  query: (query) => client.get("/products", { query }),
  create: (input) => client.post("/products", input),
  update: (id, patch) => client.patch(`/products/${id}`, patch),
  delete: (id) => client.delete(`/products/${id}`)
};
```

CRUD controller 会读取这种形态。

## 第三步：定义筛选项和表格列

```js
filters: [
  { name: "keyword", label: "关键词", type: "search" },
  { name: "status", label: "状态", type: "select", options: ["draft", "online", "offline"] }
],
columns: [
  { key: "name", label: "商品名称" },
  { key: "status", label: "状态" },
  { key: "price", label: "价格" },
  { key: "updatedAt", label: "更新时间" }
]
```

表格列应该稳定、可预期。如果一条数据包含太多信息，应使用详情页或弹窗承载，而不是把所有字段塞进表格。

## 第四步：定义操作

```js
actions: [
  { key: "edit", label: "编辑", scope: "row" },
  { key: "delete", label: "删除", scope: "row", danger: true }
]
```

规则：

- 危险操作必须使用 ConfirmDialog。
- pending 操作必须防止重复点击。
- 权限失败优先展示 disabled 状态和原因。

## 第五步：启用模块

在 `blueprint.config.js` 中加入模块 key：

```js
export default {
  enabledModules: ["products"]
};
```

也可以通过 scaffold 生成：

```bash
node scripts/create-blueprint.mjs my-console --modules products
```

当前本地 scaffold 只校验内置模块 key。如果要产品化新模块，需要把新 key 加到 `scripts/create-blueprint.mjs`。

## 第六步：接入 Module Registry

注册模块：

```js
const moduleRegistry = createModuleRegistry([
  productResource
]);
```

页面壳可以根据 `enabledModules` 渲染导航和页面。

## 检查清单

一个资源模块准备好之前，需要确认：

- 已定义 filters。
- 已定义 table columns。
- form schema 能校验必填字段。
- CRUD API 遵循标准形态。
- 删除使用 ConfirmDialog。
- 覆盖 loading、empty、error、disabled、permission 状态。
- API 错误遵循统一错误协议。
