# API Integration Contract

This document defines how generated projects should connect real backend APIs.

## Runtime Config

Set the backend base URL in `blueprint.config.js`:

```js
export default {
  apiBaseUrl: "https://api.example.com"
};
```

The scaffold can write this value:

```bash
node scripts/create-blueprint.mjs ops-console --api-base-url https://api.example.com
```

## Request Layer

Use `packages/request` as the only browser-side HTTP entry:

```js
import { createHttpClient } from "../packages/request/src/index.js";
import config from "../blueprint.config.js";

export const client = createHttpClient({
  baseUrl: config.apiBaseUrl,
  getToken: () => localStorage.getItem("access_token")
});
```

## Resource API Shape

Resource pages expect this shape:

```js
export const activityApi = {
  query: (query) => client.get("/activities", { query }),
  create: (input) => client.post("/activities", input),
  update: (id, patch) => client.patch(`/activities/${id}`, patch),
  delete: (id) => client.delete(`/activities/${id}`)
};
```

Use this object as the only dependency passed into a resource module or CRUD controller. This keeps business pages testable and replaceable.

For standard CRUD endpoints, generate this object with `createResourceApi`:

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

This creates:

```js
{
  query(query),
  create(input),
  update(id, patch),
  delete(id),
  get(id)
}
```

## Replace Mock APIs

The demo resource may start with local mock functions:

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

When connecting a backend, replace only the `api` object:

```js
const activityApi = {
  query: (query) => client.get("/activities", { query }),
  create: (input) => client.post("/activities", input),
  update: (id, patch) => client.patch(`/activities/${id}`, patch),
  delete: (id) => client.delete(`/activities/${id}`)
};
```

Keep filters, columns, form schema, actions, and import contract stable unless the business model changes.

## Query Parameters

`createHttpClient` supports query objects:

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

This becomes:

```text
/activities?keyword=summer&status=online&pageNum=1&pageSize=20
```

List APIs should return:

```json
{
  "list": [],
  "pageNum": 1,
  "pageSize": 20,
  "total": 0
}
```

If your backend uses different keys, adapt the response at the API layer before passing it to the CRUD controller.

Common nested backend response:

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

Adapter:

```js
adaptPageResponse(response, {
  listKey: "data.items",
  pageNumKey: "data.pagination.current",
  pageSizeKey: "data.pagination.size",
  totalKey: "data.pagination.totalItems"
});
```

## Error Protocol

Backend errors should return JSON:

```json
{
  "code": "ACTIVITY_NOT_FOUND",
  "message": "Activity does not exist.",
  "details": {}
}
```

Frontend behavior:

- Form validation errors should map to field errors when `details.fields` exists.
- List request errors stay inside the table or section.
- Dangerous action errors stay inside ConfirmDialog.
- Permission errors should disable actions when possible; otherwise show the server message.

Recommended field error shape:

```json
{
  "code": "VALIDATION_FAILED",
  "message": "Validation failed.",
  "details": {
    "fields": {
      "title": "Title is required."
    }
  }
}
```

Recommended permission error codes:

```text
FORBIDDEN
PERMISSION_DENIED
TOKEN_EXPIRED
```

## Timeout And Auth

- Default request timeout is `15000ms`.
- Token injection belongs in `getToken`.
- Do not read tokens directly inside resource modules.
- Resource modules should receive an API object, not create global clients themselves.
- Use `onUnauthorized` for `401` cleanup and login redirect.
- Use `onForbidden` for global permission telemetry only; page-level `403` should still render local forbidden states.

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

## Integration Checklist

Before connecting a real backend to a page:

- `apiBaseUrl` is configured.
- Auth token can be read by `getToken`.
- List API returns `list`, `pageNum`, `pageSize`, and `total`, or is adapted.
- Error responses include `code` and `message`.
- Field errors use `details.fields` when possible.
- Permission errors are either handled in auth skeleton or returned by the backend.
- Mutation APIs are protected from duplicate clicks by the page/controller.
