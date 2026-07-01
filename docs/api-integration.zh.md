# API 接入契约

这份文档定义生成项目如何接入真实后端接口。

## 运行时配置

在 `blueprint.config.js` 中配置后端地址：

```js
export default {
  apiBaseUrl: "https://api.example.com"
};
```

也可以通过 scaffold 写入：

```bash
node scripts/create-blueprint.mjs ops-console --api-base-url https://api.example.com
```

## 请求层

浏览器侧请求统一从 `packages/request` 进入：

```js
import { createHttpClient } from "../packages/request/src/index.js";
import config from "../blueprint.config.js";

export const client = createHttpClient({
  baseUrl: config.apiBaseUrl,
  getToken: () => localStorage.getItem("access_token")
});
```

## Resource API 形态

资源页预期接收这样的 API 对象：

```js
export const activityApi = {
  query: (query) => client.get("/activities", { query }),
  create: (input) => client.post("/activities", input),
  update: (id, patch) => client.patch(`/activities/${id}`, patch),
  delete: (id) => client.delete(`/activities/${id}`)
};
```

这个对象应该作为资源模块或 CRUD controller 的唯一接口依赖。这样业务页面才容易测试，也容易替换后端实现。

标准 CRUD 接口可以直接用 `createResourceApi` 生成：

```js
import { adaptPageResponse, createResourceApi } from "../packages/request/src/index.js";

export const activityApi = createResourceApi({
  client,
  endpoint: "/activities",
  adaptList: (response) => adaptPageResponse(response, {
    listKey: "data.items",
    totalKey: "data.total",
    pageNumKey: "data.pageNum",
    pageSizeKey: "data.pageSize"
  })
});
```

它会生成：

```js
{
  query(query),
  create(input),
  update(id, patch),
  delete(id),
  get(id)
}
```

## 替换 Mock API

demo 资源可以先使用本地 mock 函数：

```js
export const activityResource = createResourceModule({
  api: {
    query: queryActivities,
    create: createActivityRecord,
    update: updateActivityRecord,
    delete: deleteActivityRecord
  }
});
```

接入真实后端时，只替换 `api` 对象：

```js
const activityApi = {
  query: (query) => client.get("/activities", { query }),
  create: (input) => client.post("/activities", input),
  update: (id, patch) => client.patch(`/activities/${id}`, patch),
  delete: (id) => client.delete(`/activities/${id}`)
};
```

除非业务模型发生变化，否则 filters、columns、form schema、actions、import contract 应该保持稳定。

## 查询参数

`createHttpClient` 支持 query 对象：

```js
client.get("/activities", {
  query: {
    keyword: "summer",
    status: "online",
    pageNum: 1,
    pageSize: 20
  }
});
```

会转换为：

```text
/activities?keyword=summer&status=online&pageNum=1&pageSize=20
```

列表接口建议返回：

```json
{
  "list": [],
  "pageNum": 1,
  "pageSize": 20,
  "total": 0
}
```

如果后端字段名不同，应在 API 层完成适配，再传给 CRUD controller。

常见嵌套后端响应：

```json
{
  "data": {
    "items": [],
    "pagination": {
      "current": 1,
      "size": 20,
      "totalItems": 0
    }
  }
}
```

适配方式：

```js
adaptPageResponse(response, {
  listKey: "data.items",
  pageNumKey: "data.pagination.current",
  pageSizeKey: "data.pagination.size",
  totalKey: "data.pagination.totalItems"
});
```

## 错误协议

后端错误建议统一返回：

```json
{
  "code": "ACTIVITY_NOT_FOUND",
  "message": "活动不存在。",
  "details": {}
}
```

前端处理策略：

- 表单字段错误可以通过 `details.fields` 映射到字段。
- 列表请求错误应该停留在表格或局部区域。
- 危险操作错误应该停留在 ConfirmDialog。
- 权限错误优先前置为禁用态；如果由服务端返回，则展示服务端 message。

推荐字段错误格式：

```json
{
  "code": "VALIDATION_FAILED",
  "message": "校验失败。",
  "details": {
    "fields": {
      "title": "标题不能为空。"
    }
  }
}
```

推荐权限错误 code：

```text
FORBIDDEN
PERMISSION_DENIED
TOKEN_EXPIRED
```

## 超时与鉴权

- 默认请求超时时间是 `15000ms`。
- token 注入放在 `getToken` 中。
- 资源模块不要直接读取 token。
- 资源模块接收 API 对象，不自己创建全局 client。
- 使用 `onUnauthorized` 处理 `401` 清理登录态和跳转登录。
- 使用 `onForbidden` 做全局权限埋点即可；页面级 `403` 仍应该渲染局部无权限状态。

```js
export const client = createHttpClient({
  baseUrl: config.apiBaseUrl,
  getToken: () => localStorage.getItem("access_token"),
  onUnauthorized: () => {
    localStorage.removeItem("access_token");
    window.location.hash = "#login";
  }
});
```

## 接入检查清单

接入真实后端前，确认：

- 已配置 `apiBaseUrl`。
- `getToken` 能读取鉴权 token。
- 列表接口返回 `list`、`pageNum`、`pageSize`、`total`，或者已完成适配。
- 错误响应包含 `code` 和 `message`。
- 字段错误尽可能使用 `details.fields`。
- 权限错误要么在 auth skeleton 中前置处理，要么由后端返回。
- mutation API 已通过页面或 controller 防止重复点击。
