import assert from "node:assert/strict";
import {
  createUserRecord,
  deleteUserRecord,
  queryUsers,
  resetUserPassword,
  updateUserRecord
} from "../packages/data/src/index.js";

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

console.log("Data smoke tests passed.");
