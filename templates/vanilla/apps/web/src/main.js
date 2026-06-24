import {
  createListQueryController,
  createPendingAction,
  createRequestRaceGuard,
  createSelectionController
} from "../../../packages/headless/src/index.js";
import {
  createUserRecord,
  deleteUserRecord,
  getUserRoleOptions,
  getUserStatusOptions,
  queryUsers,
  resetUserPassword,
  updateUserRecord
} from "../../../packages/data/src/index.js";
import { attachThemeController } from "../../../packages/dom/src/index.js";
import { createI18n } from "../../../packages/i18n/src/index.js";
import { createRuntimeConfig } from "../../../packages/runtime-config/src/index.js";
import blueprintConfig from "../../../blueprint.config.js";

const root = document.documentElement;
const config = createRuntimeConfig(blueprintConfig);
const i18n = createI18n({
  locale: config.defaultLocale
});
const appName = config.appName;
const brand = document.querySelector(".brand");
const pageEyebrow = document.querySelector("#page-eyebrow");
const pageTitle = document.querySelector("#page-title");
const pageDescription = document.querySelector("#page-description");
const pageLinks = document.querySelectorAll("[data-page-link]");
const pagePanels = document.querySelectorAll("[data-page-panel]");
const themeToggle = document.querySelector("#theme-toggle");
const refreshButton = document.querySelector("#refresh-button");
const createUserButton = document.querySelector("#create-user-button");
const roleSwitch = document.querySelector("#role-switch");
const roleSwitchField = roleSwitch.closest(".field");
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
const batchExport = document.querySelector("#batch-export");
const batchDisable = document.querySelector("#batch-disable");
const batchDelete = document.querySelector("#batch-delete");
const clearSelection = document.querySelector("#clear-selection");
const userDialog = document.querySelector("#user-dialog");
const userForm = document.querySelector("#user-form");
const userDialogTitle = document.querySelector("#user-dialog-title");
const userDialogClose = document.querySelector("#user-dialog-close");
const userFormCancel = document.querySelector("#user-form-cancel");
const userFormSubmit = document.querySelector("#user-form-submit");
const userFormError = document.querySelector("#user-form-error");
const userIdField = document.querySelector("#user-id-field");
const userNameField = document.querySelector("#user-name-field");
const userEmailField = document.querySelector("#user-email-field");
const userRoleField = document.querySelector("#user-role-field");
const userStatusField = document.querySelector("#user-status-field");
const detailDialog = document.querySelector("#detail-dialog");
const detailTitle = document.querySelector("#detail-title");
const detailClose = document.querySelector("#detail-close");
const detailContent = document.querySelector("#detail-content");
const confirmDialog = document.querySelector("#confirm-dialog");
const confirmForm = document.querySelector("#confirm-form");
const confirmEyebrow = document.querySelector("#confirm-eyebrow");
const confirmTitle = document.querySelector("#confirm-title");
const confirmDescription = document.querySelector("#confirm-description");
const confirmSubject = document.querySelector("#confirm-subject");
const confirmClose = document.querySelector("#confirm-close");
const confirmCancel = document.querySelector("#confirm-cancel");
const confirmSubmit = document.querySelector("#confirm-submit");
const confirmError = document.querySelector("#confirm-error");
const importStepper = document.querySelector("#import-stepper");
const importWorkflowContent = document.querySelector("#import-workflow-content");
const importTasksBody = document.querySelector("#import-tasks-body");
const projectName = document.querySelector("#project-name");
const projectSummary = document.querySelector("#project-summary");
const projectEditToggle = document.querySelector("#project-edit-toggle");
const projectSettingsForm = document.querySelector("#project-settings-form");
const projectNameField = document.querySelector("#project-name-field");
const projectRegionField = document.querySelector("#project-region-field");
const projectDescriptionField = document.querySelector("#project-description-field");
const projectCancelEdit = document.querySelector("#project-cancel-edit");
const projectSave = document.querySelector("#project-save");
const projectInviteMember = document.querySelector("#project-invite-member");
const projectMembersBody = document.querySelector("#project-members-body");
const projectSecuritySettings = document.querySelector("#project-security-settings");
const archiveProject = document.querySelector("#archive-project");
const projectActivity = document.querySelector("#project-activity");

let currentRole = "owner";
let currentRows = [];
let keywordTimer;
let formMode = "create";
let confirmState = null;
let currentPage = "users";
let projectEditMode = false;
let importStep = "upload";
let importProgress = "idle";
const pendingStatusUserIds = new Set();
const projectSaveAction = createPendingAction();

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
const saveUserAction = createPendingAction();
const confirmAction = createPendingAction();

const pageMeta = {
  users: {
    eyebrow: i18n.t("page.users.eyebrow"),
    title: i18n.t("page.users.title"),
    description: i18n.t("page.users.description")
  },
  imports: {
    eyebrow: i18n.t("page.imports.eyebrow"),
    title: i18n.t("page.imports.title"),
    description: i18n.t("page.imports.description")
  },
  projects: {
    eyebrow: i18n.t("page.projects.eyebrow"),
    title: i18n.t("page.projects.title"),
    description: i18n.t("page.projects.description")
  }
};

const project = {
  name: "Blueprint Console",
  region: "us-east",
  description: "Production workspace for B2B admin workflows.",
  owner: "小明",
  archived: false,
  updatedAt: "2026-06-20T10:30:00.000Z"
};

const projectMembers = [
  {
    id: "member-001",
    name: "小明",
    email: "xiaoming@example.com",
    role: "owner",
    status: "active",
    lastActiveAt: "2026-06-10T09:12:00.000Z",
    removable: false,
    disabledReason: "不能移除项目 Owner。"
  },
  {
    id: "member-002",
    name: "小明 2",
    email: "xiaoming2@example.com",
    role: "admin",
    status: "active",
    lastActiveAt: "2026-06-09T16:30:00.000Z",
    removable: true
  },
  {
    id: "member-003",
    name: "小明 3",
    email: "xiaoming3@example.com",
    role: "operator",
    status: "invited",
    removable: true
  }
];

const projectSecurity = {
  enforceMfa: true,
  restrictExports: false,
  apiSecretAccess: false
};

const projectActivities = [
  {
    title: "Project settings updated",
    actor: "小明",
    detail: "Changed region policy and project description.",
    createdAt: "2026-06-20T10:30:00.000Z"
  },
  {
    title: "Member role changed",
    actor: "小明",
    detail: "Updated 小明 2 from operator to admin.",
    createdAt: "2026-06-18T14:10:00.000Z"
  },
  {
    title: "Security review completed",
    actor: "小明",
    detail: "MFA enforcement checked for active members.",
    createdAt: "2026-06-17T09:45:00.000Z"
  }
];

const importTasks = [
  {
    fileName: "customers-june.csv",
    status: "completed",
    total: 1280,
    failed: 0,
    owner: "小明",
    createdAt: "2026-06-21T09:00:00.000Z"
  },
  {
    fileName: "accounts-partial.csv",
    status: "failed",
    total: 420,
    failed: 18,
    owner: "小明",
    createdAt: "2026-06-19T15:40:00.000Z"
  }
];

const importSteps = [
  { key: "upload", label: "Upload" },
  { key: "mapping", label: "Map fields" },
  { key: "validation", label: "Validate" },
  { key: "result", label: "Import" }
];

const importValidationRows = [
  { row: 12, field: "email", issue: "Email is missing a domain." },
  { row: 27, field: "owner", issue: "Owner does not exist." },
  { row: 88, field: "status", issue: "Status must be active or disabled." }
];

attachThemeController({
  root,
  trigger: themeToggle,
  defaultTheme: config.defaultTheme,
  density: config.density,
  labels: {
    light: i18n.t("app.theme.switchToLight"),
    dark: i18n.t("app.theme.switchToDark")
  }
});

document.title = appName;
brand.textContent = appName;
applyStaticText();
seedSelect(roleFilter, getUserRoleOptions(), "All roles");
seedSelect(statusFilter, getUserStatusOptions(), "All statuses");
seedSelect(userRoleField, getUserRoleOptions(), "Select role");
seedSelect(userStatusField, getUserStatusOptions(), "Select status");
bindEvents();
renderPageActions();
renderCurrentPage();
loadUsers();

function bindEvents() {
  window.addEventListener("hashchange", renderCurrentPage);

  refreshButton.addEventListener("click", () => loadUsers());

  createUserButton.addEventListener("click", () => {
    if (!canManageUsers()) return;
    openUserDialog("create");
  });

  roleSwitch.addEventListener("change", () => {
    currentRole = roleSwitch.value;
    selection.clear();
    renderPageActions();
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

  batchExport.addEventListener("click", exportSelectedUsers);

  batchDisable.addEventListener("click", () => {
    const rows = getSelectedRows();
    const eligibleRows = rows.filter((user) => user.permissions.canDisable);

    if (eligibleRows.length === 0) return;
    openConfirmDialog(createBatchDisableConfirm(rows, eligibleRows));
  });

  batchDelete.addEventListener("click", () => {
    const rows = getSelectedRows();
    const eligibleRows = rows.filter((user) => user.permissions.canDelete);

    if (eligibleRows.length === 0) return;
    openConfirmDialog(createBatchDeleteConfirm(rows, eligibleRows));
  });

  userDialogClose.addEventListener("click", closeUserDialog);
  userFormCancel.addEventListener("click", closeUserDialog);

  userDialog.addEventListener("click", (event) => {
    if (event.target === userDialog && !saveUserAction.getState().pending) {
      closeUserDialog();
    }
  });

  userForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveUser();
  });

  detailClose.addEventListener("click", closeDetailDialog);

  detailDialog.addEventListener("click", (event) => {
    if (event.target === detailDialog) {
      closeDetailDialog();
    }
  });

  confirmClose.addEventListener("click", closeConfirmDialog);
  confirmCancel.addEventListener("click", closeConfirmDialog);

  confirmDialog.addEventListener("click", (event) => {
    if (event.target === confirmDialog && !confirmAction.getState().pending) {
      closeConfirmDialog();
    }
  });

  confirmForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runConfirmedAction();
  });

  document.addEventListener("click", closeOpenMenus);

  importWorkflowContent.addEventListener("click", handleImportWorkflowAction);

  projectEditToggle.addEventListener("click", () => setProjectEditMode(true));
  projectCancelEdit.addEventListener("click", () => {
    renderProjectSettings();
    setProjectEditMode(false);
  });
  projectSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveProjectSettings();
  });
  projectInviteMember.addEventListener("click", inviteProjectMember);
  projectMembersBody.addEventListener("click", handleProjectMemberAction);
  projectSecuritySettings.addEventListener("click", handleProjectSecurityAction);
  archiveProject.addEventListener("click", () => openConfirmDialog(createArchiveProjectConfirm()));
}

function applyStaticText() {
  root.lang = i18n.locale;
  document.querySelector('[data-page-link="users"]').textContent = i18n.t("app.nav.users");
  document.querySelector('[data-page-link="imports"]').textContent = i18n.t("app.nav.imports");
  document.querySelector('[data-page-link="projects"]').textContent = i18n.t("app.nav.projects");
  roleSwitchField.querySelector("span").textContent = i18n.t("app.role.label");
  refreshButton.textContent = i18n.t("app.actions.refresh");
  createUserButton.textContent = i18n.t("app.actions.createUser");
  resetFilters.textContent = i18n.t("app.actions.reset");
  batchExport.textContent = i18n.t("app.actions.export");
  batchDisable.textContent = i18n.t("app.actions.disable");
  batchDelete.textContent = i18n.t("app.actions.delete");
  clearSelection.textContent = i18n.t("app.actions.clearSelection");
}

function renderCurrentPage() {
  const requestedPage = window.location.hash.replace("#", "") || "users";
  currentPage = pageMeta[requestedPage] ? requestedPage : "users";
  const meta = pageMeta[currentPage];

  pageEyebrow.textContent = meta.eyebrow;
  pageTitle.textContent = meta.title;
  pageDescription.textContent = meta.description;

  for (const link of pageLinks) {
    link.classList.toggle("nav__item--active", link.dataset.pageLink === currentPage);
  }

  for (const panel of pagePanels) {
    panel.hidden = panel.dataset.pagePanel !== currentPage;
  }

  const isUsersPage = currentPage === "users";
  roleSwitchField.hidden = !isUsersPage;
  createUserButton.hidden = !isUsersPage;
  refreshButton.hidden = !isUsersPage;

  if (currentPage === "imports") {
    renderImportWorkflow();
    renderImportTasks();
  }

  if (currentPage === "projects") {
    renderProjectSettings();
    renderProjectMembers();
    renderProjectSecurity();
    renderProjectActivity();
  }
}

async function loadUsers() {
  const requestId = race.next();
  setLoading(true);
  renderLoadingRows();
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
      const message = hasActiveFilters() ? "No users match the current filters." : "No users yet.";
      renderEmptyRows(message);
      renderStatus(message, "empty");
    } else {
      hideStatus();
    }
  } catch (error) {
    if (!race.shouldCommit(requestId)) return;
    currentRows = [];
    renderErrorRows();
    renderPagination({ pageNum: 1, pageSize: 20, total: 0 });
    renderSelection();
    renderErrorStatus(error.message || "Failed to load users.");
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
        <tr class="data-row" data-view-user-row="${escapeAttribute(user.id)}" title="Click row to view detail">
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
          <td>${renderStatusCell(user)}</td>
          <td>${escapeHtml(user.team?.name || "-")}</td>
          <td>${user.mfaEnabled ? "Enabled" : "Disabled"}</td>
          <td>${formatDate(user.lastActiveAt)}</td>
          <td>${formatDate(user.createdAt)}</td>
          <td class="operation-cell">
            ${renderViewAction(user)}
            ${renderEditAction(user)}
            ${renderMoreActions(user)}
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

  for (const row of usersBody.querySelectorAll("[data-view-user-row]")) {
    row.addEventListener("click", (event) => {
      if (event.target.closest("button, input, a, summary, details, select")) return;
      const user = currentRows.find((item) => item.id === row.dataset.viewUserRow);
      if (!user) return;
      openDetailDialog(user);
    });
  }

  for (const button of usersBody.querySelectorAll("[data-view-user]")) {
    button.addEventListener("click", () => {
      const row = currentRows.find((user) => user.id === button.dataset.viewUser);
      if (!row) return;
      openDetailDialog(row);
    });
  }

  for (const button of usersBody.querySelectorAll("[data-edit-user]")) {
    button.addEventListener("click", () => {
      const row = currentRows.find((user) => user.id === button.dataset.editUser);
      if (!row || !row.permissions.canEdit) return;
      openUserDialog("edit", row);
    });
  }

  for (const button of usersBody.querySelectorAll("[data-toggle-status-user]")) {
    button.addEventListener("click", () => {
      const row = currentRows.find((user) => user.id === button.dataset.toggleStatusUser);
      if (!row) return;
      toggleUserStatus(row);
    });
  }

  for (const button of usersBody.querySelectorAll("[data-reset-user]")) {
    button.addEventListener("click", () => {
      const row = currentRows.find((user) => user.id === button.dataset.resetUser);
      if (!row || !row.permissions.canResetPassword) return;
      openConfirmDialog(createResetConfirm(row));
    });
  }

  for (const button of usersBody.querySelectorAll("[data-delete-user]")) {
    button.addEventListener("click", () => {
      const row = currentRows.find((user) => user.id === button.dataset.deleteUser);
      if (!row || !row.permissions.canDelete) return;
      openConfirmDialog(createDeleteConfirm(row));
    });
  }
}

function renderLoadingRows() {
  usersBody.innerHTML = Array.from({ length: 5 }, () => `
    <tr class="skeleton-row">
      <td><span class="skeleton-box skeleton-box--sm"></span></td>
      <td><span class="skeleton-box skeleton-box--lg"></span></td>
      <td><span class="skeleton-box"></span></td>
      <td><span class="skeleton-box"></span></td>
      <td><span class="skeleton-box"></span></td>
      <td><span class="skeleton-box skeleton-box--sm"></span></td>
      <td><span class="skeleton-box"></span></td>
      <td><span class="skeleton-box"></span></td>
      <td><span class="skeleton-box"></span></td>
    </tr>
  `).join("");
}

function renderEmptyRows(message) {
  usersBody.innerHTML = `
    <tr>
      <td class="state-cell" colspan="9">
        <strong>${escapeHtml(message)}</strong>
        <span>${hasActiveFilters() ? "Try clearing filters or changing the keyword." : "Create the first user to get started."}</span>
      </td>
    </tr>
  `;
}

function renderErrorRows() {
  usersBody.innerHTML = `
    <tr>
      <td class="state-cell state-cell--error" colspan="9">
        <strong>Unable to load users.</strong>
        <span>The table keeps the error local so the rest of the page remains usable.</span>
      </td>
    </tr>
  `;
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
  const selectedRows = getSelectedRows();
  const disableCount = selectedRows.filter((user) => user.permissions.canDisable).length;
  const deleteCount = selectedRows.filter((user) => user.permissions.canDelete).length;

  batchBar.hidden = state.selectedCount === 0;
  selectionSummary.textContent = `${state.selectedCount} selected`;
  batchExport.disabled = state.selectedCount === 0;
  batchDisable.disabled = disableCount === 0;
  batchDelete.disabled = deleteCount === 0;
  batchExport.title = state.selectedCount > 0 ? `Export ${state.selectedCount} selected users` : "Select users to export.";
  batchDisable.title = disableCount > 0 ? `Disable ${disableCount} selected users` : "No selected users can be disabled.";
  batchDelete.title = deleteCount > 0 ? `Delete ${deleteCount} selected users` : "No selected users can be deleted.";
  selectAll.checked = state.allSelected;
  selectAll.indeterminate = state.indeterminate;
  selectAll.disabled = state.selectableCount === 0;
}

function renderStatus(message, tone) {
  tableStatus.hidden = false;
  tableStatus.className = `table-status table-status--${tone}`;
  tableStatus.textContent = message;
}

function renderErrorStatus(message) {
  tableStatus.hidden = false;
  tableStatus.className = "table-status table-status--error table-status--actionable";
  tableStatus.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button class="button button--secondary" id="retry-load-users" type="button">Retry</button>
  `;
  tableStatus.querySelector("#retry-load-users").addEventListener("click", () => loadUsers());
}

function hideStatus() {
  tableStatus.hidden = true;
  tableStatus.textContent = "";
}

function setLoading(loading) {
  refreshButton.disabled = loading;
  refreshButton.textContent = loading ? i18n.t("app.actions.refreshing") : i18n.t("app.actions.refresh");
}

function renderPageActions() {
  const canCreate = canManageUsers();
  createUserButton.disabled = !canCreate;
  createUserButton.title = canCreate ? "Create User" : "当前角色没有新建用户权限。";
}

function renderStatusBadge(status) {
  const tone = {
    active: "success",
    invited: "warning",
    disabled: "neutral",
    locked: "danger",
    completed: "success",
    validating: "warning",
    partial: "warning",
    failed: "danger"
  }[status] || "neutral";

  return `<span class="status status--${tone}">${escapeHtml(status)}</span>`;
}

function renderStatusCell(user) {
  const canToggle = user.permissions.canDisable || user.permissions.canEnable;
  const isPending = pendingStatusUserIds.has(user.id);
  const nextStatus = user.status === "active" ? "disabled" : "active";
  const reason = getStatusToggleReason(user);
  const label = isPending ? "Updating" : user.status === "active" ? "Disable user" : "Enable user";

  return `
    <div class="status-cell">
      ${renderStatusBadge(user.status)}
      <button
        class="switch-action ${user.status === "active" ? "switch-action--on" : ""}"
        type="button"
        data-toggle-status-user="${escapeAttribute(user.id)}"
        aria-label="${escapeAttribute(label)}"
        title="${escapeAttribute(canToggle ? `Set status to ${nextStatus}` : reason)}"
        ${canToggle && !isPending ? "" : "disabled"}
      >
        <span></span>
      </button>
    </div>
  `;
}

function renderViewAction(user) {
  return `
    <button
      class="icon-action"
      type="button"
      data-view-user="${escapeAttribute(user.id)}"
      title="View detail"
    >
      View
    </button>
  `;
}

function renderEditAction(user) {
  return `
    <button
      class="icon-action"
      type="button"
      data-edit-user="${escapeAttribute(user.id)}"
      title="${escapeAttribute(user.permissions.canEdit ? "Edit" : user.disabledReasons.edit)}"
      ${user.permissions.canEdit ? "" : "disabled"}
    >
      Edit
    </button>
  `;
}

function renderMoreActions(user) {
  return `
    <details class="action-menu" data-menu>
      <summary class="icon-action" title="More actions">More</summary>
      <div class="action-menu__content" role="menu">
        ${renderMenuButton({
          label: "Reset password",
          icon: "R",
          enabled: user.permissions.canResetPassword,
          reason: user.disabledReasons.resetPassword,
          dataName: "reset-user",
          dataValue: user.id
        })}
        ${renderMenuButton({
          label: "Delete user",
          icon: "D",
          enabled: user.permissions.canDelete,
          reason: user.disabledReasons.delete,
          dataName: "delete-user",
          dataValue: user.id,
          danger: true
        })}
      </div>
    </details>
  `;
}

function renderMenuButton({ label, icon, enabled, reason = "", dataName, dataValue, danger = false }) {
  return `
    <button
      class="menu-item ${danger ? "menu-item--danger" : ""}"
      type="button"
      role="menuitem"
      data-${dataName}="${escapeAttribute(dataValue)}"
      title="${escapeAttribute(enabled ? label : reason)}"
      ${enabled ? "" : "disabled"}
    >
      <span class="menu-item__icon" aria-hidden="true">${escapeHtml(icon)}</span>
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}

function openUserDialog(mode, user) {
  formMode = mode;
  userForm.reset();
  userFormError.hidden = true;
  userFormError.textContent = "";
  userDialogTitle.textContent = mode === "create" ? "Create user" : `Edit ${user.name}`;
  userIdField.value = user?.id || "";
  userNameField.value = user?.name || "";
  userEmailField.value = user?.email || "";
  userRoleField.value = user?.role || "viewer";
  userStatusField.value = user?.status || "invited";
  setFormPending(false);

  if (typeof userDialog.showModal === "function") {
    userDialog.showModal();
  } else {
    userDialog.setAttribute("open", "");
  }

  userNameField.focus();
}

function closeUserDialog() {
  if (saveUserAction.getState().pending) return;
  userDialog.close();
}

async function saveUser() {
  if (!userForm.reportValidity()) return;

  const payload = {
    name: userNameField.value.trim(),
    email: userEmailField.value.trim(),
    role: userRoleField.value,
    status: userStatusField.value
  };

  setFormPending(true);
  userFormError.hidden = true;

  try {
    const result = await saveUserAction.run(async () => {
      if (formMode === "edit") {
        return updateUserRecord(userIdField.value, payload, { currentRole });
      }

      return createUserRecord(payload, { currentRole });
    });

    if (result.skipped) return;

    closeUserDialog();
    selection.clear();

    if (formMode === "create") {
      query.pagination.reset();
    }

    await loadUsers();
    renderStatus(formMode === "create" ? "User created." : "User updated.", "success");
  } catch (error) {
    showFormError(error.message);
  } finally {
    setFormPending(false);
  }
}

function setFormPending(pending) {
  userFormSubmit.disabled = pending;
  userFormCancel.disabled = pending;
  userDialogClose.disabled = pending;
  userFormSubmit.textContent = pending ? "Saving..." : "Save";
}

function showFormError(message) {
  userFormError.hidden = false;
  userFormError.textContent = message || "Failed to save user.";
}

function canManageUsers() {
  return currentRole === "owner" || currentRole === "admin";
}

function openDetailDialog(user) {
  detailTitle.textContent = user.name;
  detailContent.innerHTML = `
    ${renderDetailItem("Name", user.name)}
    ${renderDetailItem("Email", user.email)}
    ${renderDetailItem("Role", user.role)}
    ${renderDetailItem("Status", user.status)}
    ${renderDetailItem("Team", user.team?.name || "-")}
    ${renderDetailItem("MFA", user.mfaEnabled ? "Enabled" : "Disabled")}
    ${renderDetailItem("Last active", formatDate(user.lastActiveAt))}
    ${renderDetailItem("Created", formatDate(user.createdAt))}
    ${renderDetailItem("Updated", formatDate(user.updatedAt))}
  `;

  if (typeof detailDialog.showModal === "function") {
    detailDialog.showModal();
  } else {
    detailDialog.setAttribute("open", "");
  }
}

function closeDetailDialog() {
  detailDialog.close();
}

function renderDetailItem(label, value) {
  return `
    <div class="detail-item">
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `;
}

async function toggleUserStatus(user) {
  const nextStatus = user.status === "active" ? "disabled" : "active";

  if (pendingStatusUserIds.has(user.id)) return;
  if (user.status === "active" && !user.permissions.canDisable) return;
  if (user.status === "disabled" && !user.permissions.canEnable) return;

  pendingStatusUserIds.add(user.id);
  renderRows();

  try {
    await updateUserRecord(user.id, { status: nextStatus }, { currentRole });
    pendingStatusUserIds.delete(user.id);
    await loadUsers();
    renderStatus(`${user.name} is now ${nextStatus}.`, "success");
  } catch (error) {
    pendingStatusUserIds.delete(user.id);
    renderStatus(error.message || "Failed to update user status.", "error");
    renderRows();
  }
}

function getStatusToggleReason(user) {
  if (user.status === "active") return user.disabledReasons.disable || "This user cannot be disabled.";
  if (user.status === "disabled") return user.disabledReasons.enable || "This user cannot be enabled.";
  return "Only active and disabled users can use quick status switch.";
}

function closeOpenMenus(event) {
  if (event.target.closest?.("[data-menu]")) return;
  closeAllMenus();
}

function closeAllMenus() {
  for (const menu of document.querySelectorAll("[data-menu][open]")) {
    menu.removeAttribute("open");
  }
}

function createResetConfirm(user) {
  return {
    tone: "default",
    eyebrow: "Password reset",
    title: `Reset password for ${user.name}?`,
    description: "This will generate a temporary password for the selected user. The user should update it after the next sign-in.",
    subject: `${user.name} · ${user.email}`,
    submitLabel: "Reset password",
    action: async () => {
      const result = await resetUserPassword(user.id, { currentRole });
      return `Temporary password: ${result.temporaryPassword}`;
    }
  };
}

function createDeleteConfirm(user) {
  return {
    tone: "danger",
    eyebrow: "Dangerous action",
    title: `Delete ${user.name}?`,
    description: "This user will be removed from the organization. This action cannot be undone.",
    subject: `${user.name} · ${user.email}`,
    submitLabel: "Delete user",
    action: async () => {
      await deleteUserRecord(user.id, { currentRole });
      return "User deleted.";
    }
  };
}

function createBatchDisableConfirm(rows, eligibleRows) {
  const skippedCount = rows.length - eligibleRows.length;

  return {
    tone: "default",
    eyebrow: "Batch action",
    title: `Disable ${eligibleRows.length} selected users?`,
    description: skippedCount > 0
      ? `${eligibleRows.length} selected users can be disabled. ${skippedCount} selected users will be skipped because their current state cannot be disabled.`
      : "The selected users will lose access until they are enabled again.",
    subject: formatBatchSubject(eligibleRows),
    submitLabel: "Disable users",
    action: async () => {
      for (const user of eligibleRows) {
        await updateUserRecord(user.id, { status: "disabled" }, { currentRole });
      }

      return `${eligibleRows.length} users disabled.`;
    }
  };
}

function createBatchDeleteConfirm(rows, eligibleRows) {
  const skippedCount = rows.length - eligibleRows.length;

  return {
    tone: "danger",
    eyebrow: "Dangerous batch action",
    title: `Delete ${eligibleRows.length} selected users?`,
    description: skippedCount > 0
      ? `${eligibleRows.length} selected users can be deleted. ${skippedCount} selected users will be skipped. Deleted users cannot be restored.`
      : "The selected users will be removed from the organization. This action cannot be undone.",
    subject: formatBatchSubject(eligibleRows),
    submitLabel: "Delete users",
    action: async () => {
      for (const user of eligibleRows) {
        await deleteUserRecord(user.id, { currentRole });
      }

      return `${eligibleRows.length} users deleted.`;
    }
  };
}

function createRemoveProjectMemberConfirm(member) {
  return {
    tone: "danger",
    eyebrow: "Dangerous action",
    title: `Remove ${member.name} from project?`,
    description: "This member will lose project access immediately. The user account itself will not be deleted.",
    subject: `${member.name} · ${member.email}`,
    submitLabel: "Remove member",
    action: async () => {
      await delay(180);
      const index = projectMembers.findIndex((item) => item.id === member.id);

      if (index >= 0) {
        projectMembers.splice(index, 1);
      }

      projectActivities.unshift({
        title: "Member removed",
        actor: "小明",
        detail: `Removed ${member.name} from ${project.name}.`,
        createdAt: new Date().toISOString()
      });
      renderProjectMembers();
      renderProjectActivity();
      return "Member removed.";
    }
  };
}

function createArchiveProjectConfirm() {
  return {
    tone: "danger",
    eyebrow: "Dangerous action",
    title: `Archive ${project.name}?`,
    description: "The project will become read-only. Active imports and member changes should be completed before archiving.",
    subject: `${project.name} · ${project.region}`,
    submitLabel: "Archive project",
    action: async () => {
      await delay(220);
      project.archived = true;
      project.updatedAt = new Date().toISOString();
      projectActivities.unshift({
        title: "Project archived",
        actor: "小明",
        detail: `${project.name} was archived and is now read-only.`,
        createdAt: project.updatedAt
      });
      renderProjectSettings();
      renderProjectActivity();
      return "Project archived.";
    }
  };
}

function openConfirmDialog(config) {
  closeAllMenus();
  confirmState = config;
  confirmEyebrow.textContent = config.eyebrow;
  confirmTitle.textContent = config.title;
  confirmDescription.textContent = config.description;
  confirmSubject.textContent = config.subject;
  confirmSubmit.textContent = config.submitLabel;
  confirmSubmit.classList.toggle("button--danger", config.tone === "danger");
  confirmError.hidden = true;
  confirmError.textContent = "";
  setConfirmPending(false);

  if (typeof confirmDialog.showModal === "function") {
    confirmDialog.showModal();
  } else {
    confirmDialog.setAttribute("open", "");
  }

  confirmSubmit.focus();
}

function closeConfirmDialog({ force = false } = {}) {
  if (!force && confirmAction.getState().pending) return;
  confirmDialog.close();
  confirmState = null;
}

async function runConfirmedAction() {
  if (!confirmState) return;

  setConfirmPending(true);
  confirmError.hidden = true;

  try {
    const result = await confirmAction.run(confirmState.action);

    if (result.skipped) return;

    const message = result.value || "Action completed.";
    selection.clear();
    closeConfirmDialog({ force: true });
    await loadUsers();
    renderStatus(message, "success");
  } catch (error) {
    confirmError.hidden = false;
    confirmError.textContent = error.message || "Failed to complete action.";
  } finally {
    setConfirmPending(false);
  }
}

function setConfirmPending(pending) {
  confirmSubmit.disabled = pending;
  confirmCancel.disabled = pending;
  confirmClose.disabled = pending;
  confirmSubmit.textContent = pending ? "Working..." : confirmState?.submitLabel || "Confirm";
}

function exportSelectedUsers() {
  const rows = getSelectedRows();

  if (rows.length === 0) return;

  const csv = toCsv(rows, ["id", "name", "email", "role", "status", "team"]);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  renderStatus(`${rows.length} users exported.`, "success");
}

function getSelectedRows() {
  const selectedKeys = new Set(selection.getSelectedKeys());
  return currentRows.filter((user) => selectedKeys.has(user.id));
}

function formatBatchSubject(rows) {
  const names = rows.slice(0, 3).map((user) => user.name).join(", ");
  const suffix = rows.length > 3 ? ` and ${rows.length - 3} more` : "";
  return `${names}${suffix}`;
}

function toCsv(rows, fields) {
  const header = fields.join(",");
  const body = rows.map((row) =>
    fields
      .map((field) => {
        const value = field === "team" ? row.team?.name || "" : row[field] || "";
        return `"${String(value).replaceAll('"', '""')}"`;
      })
      .join(",")
  );

  return [header, ...body].join("\n");
}

function renderImportTasks() {
  importTasksBody.innerHTML = importTasks
    .map((task) => `
      <tr>
        <td><strong>${escapeHtml(task.fileName)}</strong></td>
        <td>${renderStatusBadge(task.status)}</td>
        <td>${task.total}</td>
        <td>${task.failed}</td>
        <td>${escapeHtml(task.owner)}</td>
        <td>${formatDate(task.createdAt)}</td>
      </tr>
    `)
    .join("");
}

function renderImportWorkflow() {
  const activeIndex = importSteps.findIndex((step) => step.key === importStep);

  importStepper.innerHTML = importSteps
    .map((step, index) => `
      <span class="stepper__item ${index === activeIndex ? "stepper__item--active" : ""} ${index < activeIndex ? "stepper__item--done" : ""}">
        ${escapeHtml(step.label)}
      </span>
    `)
    .join("");

  const content = {
    upload: renderImportUploadStep,
    mapping: renderImportMappingStep,
    validation: renderImportValidationStep,
    result: renderImportResultStep
  }[importStep];

  importWorkflowContent.innerHTML = content();
}

function renderImportUploadStep() {
  return `
    <div class="upload-zone">
      <strong>Upload customer records</strong>
      <span>CSV or XLSX, up to 10 MB. The demo keeps upload logic local and shows the expected workflow states.</span>
      <button class="button button--primary" data-import-action="upload" type="button" ${importProgress === "uploading" ? "disabled" : ""}>
        ${importProgress === "uploading" ? "Uploading..." : "Use demo file"}
      </button>
    </div>
  `;
}

function renderImportMappingStep() {
  return `
    <div class="workflow-card">
      <div>
        <strong>Map incoming fields</strong>
        <p>Confirm how uploaded columns map to system fields before validation.</p>
      </div>
      <div class="mapping-grid">
        ${renderMappingRow("Full Name", "name")}
        ${renderMappingRow("Email Address", "email")}
        ${renderMappingRow("Account Owner", "owner")}
        ${renderMappingRow("Lifecycle Status", "status")}
      </div>
      <div class="form-actions">
        <button class="button button--secondary" data-import-action="back-upload" type="button">Back</button>
        <button class="button button--primary" data-import-action="validate" type="button">Validate records</button>
      </div>
    </div>
  `;
}

function renderImportValidationStep() {
  return `
    <div class="workflow-card">
      <div>
        <strong>Validation found 3 issues</strong>
        <p>Errors are isolated before import. Users can download failed rows or continue with valid rows.</p>
      </div>
      <div class="table-scroll">
        <table class="data-table data-table--compact">
          <thead>
            <tr>
              <th>Row</th>
              <th>Field</th>
              <th>Issue</th>
            </tr>
          </thead>
          <tbody>
            ${importValidationRows.map((row) => `
              <tr>
                <td>${row.row}</td>
                <td>${escapeHtml(row.field)}</td>
                <td>${escapeHtml(row.issue)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="form-actions">
        <button class="button button--secondary" data-import-action="download-errors" type="button">Download failed rows</button>
        <button class="button button--primary" data-import-action="run-import" type="button" ${importProgress === "importing" ? "disabled" : ""}>
          ${importProgress === "importing" ? "Importing..." : "Import valid rows"}
        </button>
      </div>
    </div>
  `;
}

function renderImportResultStep() {
  return `
    <div class="workflow-card">
      <div class="result-summary">
        <div>
          <strong>349</strong>
          <span>Imported</span>
        </div>
        <div>
          <strong>7</strong>
          <span>Failed</span>
        </div>
        <div>
          <strong>356</strong>
          <span>Total rows</span>
        </div>
      </div>
      <p class="workflow-note">The completed task was added to the recent import task table with a partial status.</p>
      <div class="form-actions">
        <button class="button button--secondary" data-import-action="restart" type="button">Start another import</button>
      </div>
    </div>
  `;
}

function renderMappingRow(source, target) {
  return `
    <label class="field">
      <span>${escapeHtml(source)}</span>
      <select>
        <option selected>${escapeHtml(target)}</option>
      </select>
    </label>
  `;
}

async function handleImportWorkflowAction(event) {
  const action = event.target.closest("[data-import-action]")?.dataset.importAction;

  if (!action) return;

  if (action === "upload") {
    importProgress = "uploading";
    renderImportWorkflow();
    await delay(260);
    importProgress = "idle";
    importStep = "mapping";
    renderImportWorkflow();
    return;
  }

  if (action === "back-upload") {
    importStep = "upload";
    renderImportWorkflow();
    return;
  }

  if (action === "validate") {
    importStep = "validation";
    renderImportWorkflow();
    return;
  }

  if (action === "download-errors") {
    downloadImportErrors();
    return;
  }

  if (action === "run-import") {
    importProgress = "importing";
    renderImportWorkflow();
    await delay(420);
    importProgress = "idle";
    importStep = "result";
    importTasks.unshift({
      fileName: "new-customers-demo.csv",
      status: "partial",
      total: 356,
      failed: 7,
      owner: "小明",
      createdAt: new Date().toISOString()
    });
    renderImportWorkflow();
    renderImportTasks();
    return;
  }

  if (action === "restart") {
    importStep = "upload";
    renderImportWorkflow();
  }
}

function downloadImportErrors() {
  const csv = toCsv(importValidationRows, ["row", "field", "issue"]);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "import-errors-demo.csv";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderProjectSettings() {
  projectName.textContent = project.name;
  projectSummary.textContent = project.archived ? `${project.description} Archived projects are read-only.` : project.description;
  projectNameField.value = project.name;
  projectRegionField.value = project.region;
  projectDescriptionField.value = project.description;
  archiveProject.disabled = project.archived;
  archiveProject.textContent = project.archived ? "Project archived" : "Archive project";
  setProjectEditMode(projectEditMode);
}

function setProjectEditMode(editing) {
  projectEditMode = editing;
  projectEditToggle.hidden = editing;
  projectCancelEdit.hidden = !editing;
  projectSave.hidden = !editing;
  projectNameField.disabled = !editing;
  projectRegionField.disabled = !editing;
  projectDescriptionField.disabled = !editing;
}

function renderProjectMembers() {
  projectMembersBody.innerHTML = projectMembers
    .map((member) => `
      <tr>
        <td>
          <div class="user-cell">
            <span class="avatar" aria-hidden="true">${escapeHtml(member.name.slice(0, 1))}</span>
            <span>
              <strong>${escapeHtml(member.name)}</strong>
              <small>${escapeHtml(member.email)}</small>
            </span>
          </div>
        </td>
        <td><span class="tag">${escapeHtml(member.role)}</span></td>
        <td>${renderStatusBadge(member.status)}</td>
        <td>${formatDate(member.lastActiveAt)}</td>
        <td class="operation-cell">
          <button
            class="icon-action icon-action--danger"
            data-remove-project-member="${escapeAttribute(member.id)}"
            type="button"
            title="${escapeAttribute(member.removable ? "Remove member" : member.disabledReason)}"
            ${member.removable ? "" : "disabled"}
          >
            Remove
          </button>
        </td>
      </tr>
    `)
    .join("");
}

function renderProjectSecurity() {
  projectSecuritySettings.innerHTML = `
    ${renderSecuritySetting({
      key: "enforceMfa",
      title: "Require MFA",
      description: "Members must complete multi-factor authentication before accessing this project.",
      enabled: projectSecurity.enforceMfa
    })}
    ${renderSecuritySetting({
      key: "restrictExports",
      title: "Restrict exports",
      description: "Only owner and admin roles can export project data.",
      enabled: projectSecurity.restrictExports
    })}
    ${renderSecuritySetting({
      key: "apiSecretAccess",
      title: "Production API secret access",
      description: "Current role cannot enable access to production secrets from this demo.",
      enabled: projectSecurity.apiSecretAccess,
      disabled: true,
      reason: "当前角色没有修改生产密钥权限。"
    })}
  `;
}

function renderSecuritySetting({ key, title, description, enabled, disabled = false, reason = "" }) {
  return `
    <div class="settings-list__item">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description)}</span>
      </div>
      <button
        class="switch-action ${enabled ? "switch-action--on" : ""}"
        data-security-setting="${escapeAttribute(key)}"
        type="button"
        aria-label="${escapeAttribute(title)}"
        title="${escapeAttribute(disabled ? reason : "Toggle setting")}"
        ${disabled ? "disabled" : ""}
      >
        <span></span>
      </button>
    </div>
  `;
}

function inviteProjectMember() {
  const nextMember = {
    id: `member-${String(projectMembers.length + 1).padStart(3, "0")}`,
    name: `小明 ${projectMembers.length + 1}`,
    email: `xiaoming${projectMembers.length + 1}@example.com`,
    role: "viewer",
    status: "invited",
    removable: true
  };

  projectMembers.push(nextMember);
  projectActivities.unshift({
    title: "Member invited",
    actor: "小明",
    detail: `Invited ${nextMember.name} as viewer.`,
    createdAt: new Date().toISOString()
  });
  renderProjectMembers();
  renderProjectActivity();
}

function handleProjectMemberAction(event) {
  const memberId = event.target.closest("[data-remove-project-member]")?.dataset.removeProjectMember;

  if (!memberId) return;

  const member = projectMembers.find((item) => item.id === memberId);

  if (!member?.removable) return;
  openConfirmDialog(createRemoveProjectMemberConfirm(member));
}

function handleProjectSecurityAction(event) {
  const key = event.target.closest("[data-security-setting]")?.dataset.securitySetting;

  if (!key || key === "apiSecretAccess") return;

  projectSecurity[key] = !projectSecurity[key];
  projectActivities.unshift({
    title: "Security setting changed",
    actor: "小明",
    detail: `${key} changed to ${projectSecurity[key] ? "enabled" : "disabled"}.`,
    createdAt: new Date().toISOString()
  });
  renderProjectSecurity();
  renderProjectActivity();
}

async function saveProjectSettings() {
  if (!projectSettingsForm.reportValidity()) return;

  projectSave.disabled = true;
  projectSave.textContent = "Saving...";

  try {
    await projectSaveAction.run(async () => {
      await delay(220);
      project.name = projectNameField.value.trim();
      project.region = projectRegionField.value;
      project.description = projectDescriptionField.value.trim();
      project.updatedAt = new Date().toISOString();
      projectActivities.unshift({
        title: "Project settings updated",
        actor: "小明",
        detail: `Updated project name to ${project.name}.`,
        createdAt: project.updatedAt
      });
    });

    setProjectEditMode(false);
    renderProjectSettings();
    renderProjectActivity();
  } finally {
    projectSave.disabled = false;
    projectSave.textContent = "Save settings";
  }
}

function renderProjectActivity() {
  projectActivity.innerHTML = projectActivities
    .map((item) => `
      <li class="activity-log__item">
        <span class="activity-log__dot" aria-hidden="true"></span>
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.detail)}</p>
          <small>${escapeHtml(item.actor)} · ${formatDate(item.createdAt)}</small>
        </div>
      </li>
    `)
    .join("");
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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
  return i18n.formatDate(value);
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
