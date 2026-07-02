import assert from "node:assert/strict";
import {
  createFilterState,
  createListQueryController,
  createPaginationController,
  createPendingAction,
  createRequestRaceGuard,
  createSelectionController
} from "../packages/headless/src/index.js";
import {
  createAuthSession,
  createForbiddenState,
  createMemoryAuthStore,
  createRequiredPermission,
  createRouteGuard,
  filterModulesByPermission,
  normalizeBackendUser
} from "../packages/auth/src/index.js";
import {
  createResourceModuleFromParts,
  createResourceModuleParts
} from "../packages/resource/src/index.js";

const rows = [
  { id: "1", locked: false },
  { id: "2", locked: true },
  { id: "3", locked: false }
];

const selection = createSelectionController({
  getKey: (row) => row.id,
  isDisabled: (row) => row.locked
});

selection.toggle(rows[0]);
selection.toggle(rows[1]);
assert.deepEqual(selection.getSelectedKeys(), ["1"]);
selection.toggleAll(rows);
assert.equal(selection.getState(rows).allSelected, true);
assert.deepEqual(selection.getSelectedKeys().sort(), ["1", "3"]);
selection.reconcile(rows.slice(0, 1));
assert.deepEqual(selection.getSelectedKeys(), ["1"]);

const pagination = createPaginationController({ pageNum: 10, pageSize: 20, total: 42 });
assert.equal(pagination.getState().pageNum, 3);
pagination.setPageSize(50);
assert.equal(pagination.getState().pageNum, 1);
assert.equal(pagination.getState().pageCount, 1);

const filters = createFilterState({ defaults: { status: "active" } });
assert.equal(filters.getState().hasActiveFilters, false);
filters.setFilter("keyword", "小明");
assert.equal(filters.getState().hasActiveFilters, true);
assert.equal(filters.toSearchParams().get("keyword"), "小明");
filters.reset();
assert.deepEqual(filters.getState().filters, { status: "active" });

const race = createRequestRaceGuard();
const first = race.next();
const second = race.next();
assert.equal(race.shouldCommit(first), false);
assert.equal(race.shouldCommit(second), true);

const pendingAction = createPendingAction();
const result = await pendingAction.run(async () => "done");
assert.deepEqual(result, { skipped: false, value: "done" });
assert.equal(pendingAction.getState().pending, false);

const query = createListQueryController({
  initialFilters: { role: "admin" },
  pageNum: 2,
  pageSize: 20,
  total: 100
});
query.filters.setFilter("status", "active");
assert.equal(query.getState().pagination.pageNum, 1);
assert.deepEqual(query.toQueryObject(), {
  role: "admin",
  status: "active",
  pageNum: 1,
  pageSize: 20
});

const authSession = createAuthSession({
  storage: createMemoryAuthStore({
    role: "viewer",
    authenticated: "true"
  })
});
assert.equal(authSession.getState().role, "viewer");
assert.equal(authSession.getState().auth.can("read", "users"), true);
assert.equal(authSession.getState().auth.can("create", "users"), false);

const visibleModules = filterModulesByPermission([
  { key: "users", requiredPermission: createRequiredPermission("users", "read") },
  { key: "imports", requiredPermission: createRequiredPermission("import", "read") }
], authSession.getState().auth);
assert.deepEqual(visibleModules.map((module) => module.key), ["users"]);

authSession.switchRole("owner");
assert.equal(authSession.getState().auth.can("delete", "projects"), true);
authSession.signOut();
assert.equal(authSession.getState().authenticated, false);
authSession.signIn("operator");
assert.equal(authSession.getState().role, "operator");
authSession.signIn("admin", { accessToken: "token-001" });
assert.equal(authSession.getToken(), "token-001");

const backendProfile = normalizeBackendUser({
  user: {
    userId: "backend-user-001",
    displayName: "小明",
    role: "admin",
    email: "xiaoming@example.com"
  },
  permissions: ["orders:read", "orders:update"]
});
assert.deepEqual(backendProfile.currentUser.roles, ["admin"]);
assert.equal(backendProfile.permissions.includes("orders:update"), true);

const routeGuard = createRouteGuard({
  auth: authSession.getState().auth
});
assert.equal(routeGuard.resolve({ requiredPermission: createRequiredPermission("users", "read") }).allowed, true);
assert.equal(routeGuard.resolve({ requiredPermission: createRequiredPermission("billing", "read") }).allowed, false);
assert.equal(createForbiddenState().type, "forbidden");

const orderParts = createResourceModuleParts({
  key: "orders",
  label: "Orders",
  resource: "orders",
  schema: {
    filters: [{ name: "keyword", label: "Keyword", type: "search" }],
    columns: [{ key: "name", label: "Name" }],
    form: { fields: [] }
  },
  api: {
    query: async () => ({ list: [], total: 0 }),
    create: async (input) => input,
    update: async (_id, patch) => patch,
    delete: async (id) => ({ id })
  }
});
const orderModule = createResourceModuleFromParts(orderParts);
assert.equal(orderModule.requiredPermission.resource, "orders");
assert.equal(orderModule.filters[0].name, "keyword");

console.log("Headless smoke tests passed.");
