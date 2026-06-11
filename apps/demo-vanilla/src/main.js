import { createListQueryController, createRequestRaceGuard, createSelectionController } from "../../../packages/headless/src/index.js";
import {
  getUserRoleOptions,
  getUserStatusOptions,
  queryUsers
} from "../../../packages/data/src/index.js";
import { attachThemeToggle } from "../../../packages/dom/src/index.js";

const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const refreshButton = document.querySelector("#refresh-button");
const roleSwitch = document.querySelector("#role-switch");
const keywordInput = document.querySelector("#keyword-input");
const roleFilter = document.querySelector("#role-filter");
const statusFilter = document.querySelector("#status-filter");
const resetFilters = document.querySelector("#reset-filters");
const usersBody = document.querySelector("#users-body");
const tableStatus = document.querySelector("#table-status");
const pagination = document.querySelector("#pagination");
const selectAll = document.querySelector("#select-all");
const batchBar = document.querySelector("#batch-bar");
const selectionSummary = document.querySelector("#selection-summary");
const clearSelection = document.querySelector("#clear-selection");

let currentRole = "owner";
let currentRows = [];
let keywordTimer;

const query = createListQueryController({
  pageNum: 1,
  pageSize: 20,
  total: 0
});
const race = createRequestRaceGuard();
const selection = createSelectionController({
  getKey: (row) => row.id,
  isDisabled: (row) => !row.permissions.canSelect
});

attachThemeToggle({
  root,
  trigger: themeToggle
});

seedSelect(roleFilter, getUserRoleOptions(), "All roles");
seedSelect(statusFilter, getUserStatusOptions(), "All statuses");
bindEvents();
loadUsers();

function bindEvents() {
  refreshButton.addEventListener("click", () => loadUsers());

  roleSwitch.addEventListener("change", () => {
    currentRole = roleSwitch.value;
    selection.clear();
    loadUsers();
  });

  keywordInput.addEventListener("input", () => {
    clearTimeout(keywordTimer);
    keywordTimer = setTimeout(() => {
      query.filters.setFilter("keyword", keywordInput.value.trim());
      selection.clear();
      loadUsers();
    }, 250);
  });

  roleFilter.addEventListener("change", () => {
    query.filters.setFilter("role", roleFilter.value);
    selection.clear();
    loadUsers();
  });

  statusFilter.addEventListener("change", () => {
    query.filters.setFilter("status", statusFilter.value);
    selection.clear();
    loadUsers();
  });

  resetFilters.addEventListener("click", () => {
    keywordInput.value = "";
    roleFilter.value = "";
    statusFilter.value = "";
    query.filters.reset();
    selection.clear();
    loadUsers();
  });

  selectAll.addEventListener("change", () => {
    selection.toggleAll(currentRows);
    renderSelection();
    renderRows();
  });

  clearSelection.addEventListener("click", () => {
    selection.clear();
    renderSelection();
    renderRows();
  });
}

async function loadUsers() {
  const requestId = race.next();
  setLoading(true);
  renderStatus("Loading users...", "muted");

  try {
    const response = await queryUsers(query.toQueryObject(), {
      currentRole
    });

    if (!race.shouldCommit(requestId)) return;

    currentRows = response.list;
    query.pagination.setTotal(response.total);
    selection.reconcile(currentRows);
    renderRows();
    renderPagination(response);
    renderSelection();

    if (response.total === 0) {
      renderStatus(hasActiveFilters() ? "No users match the current filters." : "No users yet.", "empty");
    } else {
      hideStatus();
    }
  } catch (error) {
    if (!race.shouldCommit(requestId)) return;
    currentRows = [];
    renderRows();
    renderPagination({ pageNum: 1, pageSize: 20, total: 0 });
    renderSelection();
    renderStatus(error.message || "Failed to load users.", "error");
  } finally {
    if (race.shouldCommit(requestId)) {
      setLoading(false);
    }
  }
}

function renderRows() {
  if (currentRows.length === 0) {
    usersBody.innerHTML = "";
    return;
  }

  usersBody.innerHTML = currentRows
    .map((user) => {
      const checked = selection.isSelected(user) ? "checked" : "";
      const disabled = selection.isDisabled(user) ? "disabled" : "";
      const disabledReason = user.disabledReasons.select || "";

      return `
        <tr>
          <td class="selection-cell">
            <input
              type="checkbox"
              data-select-user="${escapeAttribute(user.id)}"
              aria-label="Select ${escapeAttribute(user.name)}"
              title="${escapeAttribute(disabledReason)}"
              ${checked}
              ${disabled}
            />
          </td>
          <td>
            <div class="user-cell">
              <span class="avatar" aria-hidden="true">${escapeHtml(user.name.slice(0, 1))}</span>
              <span>
                <strong>${escapeHtml(user.name)}</strong>
                <small>${escapeHtml(user.email)}</small>
              </span>
            </div>
          </td>
          <td><span class="tag">${escapeHtml(user.role)}</span></td>
          <td>${renderStatusBadge(user.status)}</td>
          <td>${escapeHtml(user.team?.name || "-")}</td>
          <td>${user.mfaEnabled ? "Enabled" : "Disabled"}</td>
          <td>${formatDate(user.lastActiveAt)}</td>
          <td>${formatDate(user.createdAt)}</td>
          <td class="operation-cell">
            ${renderAction("Edit", user.permissions.canEdit, user.disabledReasons.edit)}
            ${renderAction("Reset", user.permissions.canResetPassword, user.disabledReasons.resetPassword)}
            ${renderAction("More", true, "")}
          </td>
        </tr>
      `;
    })
    .join("");

  for (const input of usersBody.querySelectorAll("[data-select-user]")) {
    input.addEventListener("change", () => {
      const row = currentRows.find((user) => user.id === input.dataset.selectUser);
      if (!row) return;
      selection.toggle(row);
      renderSelection();
      renderRows();
    });
  }
}

function renderPagination(response) {
  const state = query.pagination.getState();
  pagination.innerHTML = `
    <span>Page ${state.pageNum} of ${state.pageCount}</span>
    <span>${response.total} total</span>
    <button class="button button--secondary" id="prev-page" type="button" ${state.pageNum <= 1 ? "disabled" : ""}>Previous</button>
    <button class="button button--secondary" id="next-page" type="button" ${state.pageNum >= state.pageCount ? "disabled" : ""}>Next</button>
  `;

  pagination.querySelector("#prev-page")?.addEventListener("click", () => {
    query.pagination.setPage(state.pageNum - 1);
    selection.clear();
    loadUsers();
  });

  pagination.querySelector("#next-page")?.addEventListener("click", () => {
    query.pagination.setPage(state.pageNum + 1);
    selection.clear();
    loadUsers();
  });
}

function renderSelection() {
  const state = selection.getState(currentRows);
  batchBar.hidden = state.selectedCount === 0;
  selectionSummary.textContent = `${state.selectedCount} selected`;
  selectAll.checked = state.allSelected;
  selectAll.indeterminate = state.indeterminate;
  selectAll.disabled = state.selectableCount === 0;
}

function renderStatus(message, tone) {
  tableStatus.hidden = false;
  tableStatus.className = `table-status table-status--${tone}`;
  tableStatus.textContent = message;
}

function hideStatus() {
  tableStatus.hidden = true;
  tableStatus.textContent = "";
}

function setLoading(loading) {
  refreshButton.disabled = loading;
  refreshButton.textContent = loading ? "Refreshing..." : "Refresh";
}

function renderStatusBadge(status) {
  const tone = {
    active: "success",
    invited: "warning",
    disabled: "neutral",
    locked: "danger"
  }[status] || "neutral";

  return `<span class="status status--${tone}">${escapeHtml(status)}</span>`;
}

function renderAction(label, enabled, reason = "") {
  return `
    <button
      class="icon-action"
      type="button"
      title="${escapeAttribute(enabled ? label : reason)}"
      ${enabled ? "" : "disabled"}
    >
      ${escapeHtml(label)}
    </button>
  `;
}

function seedSelect(select, options, placeholder) {
  select.innerHTML = `<option value="">${escapeHtml(placeholder)}</option>${options
    .map((option) => `<option value="${escapeAttribute(option.value)}">${escapeHtml(option.label)}</option>`)
    .join("")}`;
}

function hasActiveFilters() {
  return query.getState().hasActiveFilters;
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
