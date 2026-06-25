import assert from "node:assert/strict";
import { defaultOperatorAuth } from "../packages/auth/src/index.js";
import {
  activityImportContract,
  activityResource,
  createActivityRecord,
  createUserRecord,
  deleteUserRecord,
  queryActivities,
  queryUsers,
  resetUserPassword,
  updateUserRecord
} from "../packages/data/src/index.js";
import { validateValues } from "../packages/form-schema/src/index.js";
import { createHttpClient, createMockClient } from "../packages/request/src/index.js";
import { createCrudController, createModuleRegistry } from "../packages/resource/src/index.js";

const ownerContext = { currentRole: "owner", delay: 0 };
const viewerContext = { currentRole: "viewer", delay: 0 };

const firstPage = await queryUsers({ pageNum: 1, pageSize: 2 }, ownerContext);
assert.equal(firstPage.pageNum, 1);
assert.equal(firstPage.pageSize, 2);
assert.equal(firstPage.list.length, 2);
assert.ok(firstPage.total >= 5);
assert.equal(firstPage.list[0].permissions.canViewDetail, true);

const filtered = await queryUsers({ keyword: "小明", role: "admin" }, ownerContext);
assert.ok(filtered.list.every((user) => user.role === "admin"));

const viewerList = await queryUsers({ pageNum: 1, pageSize: 20 }, viewerContext);
assert.equal(viewerList.list.some((user) => user.permissions.canDelete), false);

await assert.rejects(
  () => queryUsers({ keyword: "__error" }, ownerContext),
  /Mock list request failed/
);

const created = await createUserRecord(
  {
    name: "小明 99",
    email: "xiaoming99@example.com",
    role: "viewer",
    status: "invited"
  },
  ownerContext
);
assert.equal(created.name, "小明 99");

const updated = await updateUserRecord(created.id, { name: "小明 100" }, ownerContext);
assert.equal(updated.name, "小明 100");

const reset = await resetUserPassword(created.id, ownerContext);
assert.equal(reset.id, created.id);

const deleted = await deleteUserRecord(created.id, ownerContext);
assert.equal(deleted.id, created.id);

await assert.rejects(
  () =>
    createUserRecord(
      {
        name: "No Permission",
        email: "no-permission@example.com"
      },
      viewerContext
    ),
  /Current role cannot mutate users/
);

const activityPage = await queryActivities({ pageNum: 1, pageSize: 2, status: "online" });
assert.equal(activityPage.pageSize, 2);
assert.ok(activityPage.list.every((activity) => activity.status === "online"));

const createdActivity = await createActivityRecord({
  title: "测试活动",
  channel: "App",
  status: "draft",
  startAt: "2026-07-01T00:00:00.000Z",
  endAt: "2026-07-07T23:59:59.000Z"
});
assert.equal(createdActivity.title, "测试活动");

const validation = validateValues(activityResource.form.fields, {
  title: "",
  channel: "App",
  status: "draft",
  startAt: "2026-07-01T00:00:00.000Z",
  endAt: "2026-07-07T23:59:59.000Z"
});
assert.equal(validation.valid, false);
assert.ok(validation.errors.title);

const registry = createModuleRegistry([activityResource]);
assert.equal(registry.get("activities").label, "资源 CRUD");
assert.equal(registry.enabled(["activities"]).length, 1);

const crud = createCrudController({
  resource: activityResource,
  api: activityResource.api,
  auth: defaultOperatorAuth
});
const crudState = await crud.load();
assert.ok(crudState.rows.length > 0);
assert.equal(crudState.error, null);

const mappingError = activityImportContract.validateMapping({
  title: "活动名称"
});
assert.match(mappingError, /缺少必填字段映射/);

const mockClient = createMockClient({
  "GET /activities": () => ({ list: [], total: 0 })
});
const mockResponse = await mockClient.get("/activities");
assert.deepEqual(mockResponse, { list: [], total: 0 });

let requestedUrl = "";
const httpClient = createHttpClient({
  baseUrl: "https://api.example.com",
  fetchImpl: async (url) => {
    requestedUrl = url;
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
      status: 200
    });
  }
});
await httpClient.get("/activities", { query: { keyword: "summer", status: "online" } });
assert.equal(requestedUrl, "https://api.example.com/activities?keyword=summer&status=online");

console.log("Data smoke tests passed.");
