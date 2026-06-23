import assert from "node:assert/strict";
import {
  createFilterState,
  createListQueryController,
  createPaginationController,
  createPendingAction,
  createRequestRaceGuard,
  createSelectionController
} from "../packages/headless/src/index.js";

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

console.log("Headless smoke tests passed.");
