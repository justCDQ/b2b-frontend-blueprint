import {
  createListQueryController,
  createPendingAction,
  createRequestRaceGuard,
  createSelectionController
} from "../../../packages/headless/src/index.js";
import {
  activityResource,
  createUserRecord,
  deleteUserRecord,
  getUserRoleOptions,
  getUserStatusOptions,
  queryUsers,
  resetUserPassword,
  updateUserRecord
} from "../../../packages/data/src/index.js";
import { defaultOperatorAuth } from "../../../packages/auth/src/index.js";
import { attachThemeController } from "../../../packages/dom/src/index.js";
import { readFormValues } from "../../../packages/form-schema/src/index.js";
import { createI18n } from "../../../packages/i18n/src/index.js";
import { createCrudController, createModuleRegistry } from "../../../packages/resource/src/index.js";
import { createRuntimeConfig } from "../../../packages/runtime-config/src/index.js";
import blueprintConfig from "../../../blueprint.config.js";

const root = document.documentElement;
const config = createRuntimeConfig(blueprintConfig);
const i18n = createI18n({
  locale: config.defaultLocale
});
const appName = config.appName;
const brand = document.querySelector(".brand");
const nav = document.querySelector(".nav");
const content = document.querySelector(".content");
const pageEyebrow = document.querySelector("#page-eyebrow");
const pageTitle = document.querySelector("#page-title");
const pageDescription = document.querySelector("#page-description");
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
let resourceController = null;
let resourceEditRecord = null;
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

const staticPageMeta = {
  users: {
    key: "users",
    navLabel: i18n.t("app.nav.users"),
    eyebrow: i18n.t("page.users.eyebrow"),
    title: i18n.t("page.users.title"),
    description: i18n.t("page.users.description")
  },
  imports: {
    key: "imports",
    navLabel: i18n.t("app.nav.imports"),
    eyebrow: i18n.t("page.imports.eyebrow"),
    title: i18n.t("page.imports.title"),
    description: i18n.t("page.imports.description")
  },
  projects: {
    key: "projects",
    navLabel: i18n.t("app.nav.projects"),
    eyebrow: i18n.t("page.projects.eyebrow"),
    title: i18n.t("page.projects.title"),
    description: i18n.t("page.projects.description")
  }
};

const moduleRegistry = createModuleRegistry([
  staticPageMeta.users,
  staticPageMeta.imports,
  staticPageMeta.projects,
  activityResource
]);
const enabledModules = moduleRegistry.enabled(config.enabledModules);
const pageMeta = Object.fromEntries(enabledModules.map((module) => [
  module.key,
  {
    eyebrow: module.resource ? "Resource module" : module.eyebrow,
    title: module.label || module.title,
    description: module.description,
    module
  }
]));

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
initializeModules();
applyStaticText();
seedSelect(roleFilter, getUserRoleOptions(), "All roles");
seedSelect(statusFilter, getUserStatusOptions(), "All statuses");
seedSelect(userRoleField, getUserRoleOptions(), "Select role");
seedSelect(userStatusField, getUserStatusOptions(), "Select status");
bindEvents();
renderPageActions();
renderCurrentPage();
loadUsers();

function initializeModules() {
  nav.innerHTML = enabledModules
    .map((module, index) => `
      <a
        class="nav__item ${index === 0 ? "nav__item--active" : ""}"
        href="#${escapeAttribute(module.key)}"
        data-page-link="${escapeAttribute(module.key)}"
      >${escapeHtml(module.navLabel || module.label || module.title)}</a>
    `)
    .join("");

  if (config.enabledModules.includes("activities") && !document.querySelector('[data-page-panel="activities"]')) {
    content.insertAdjacentHTML("beforeend", createResourcePageShell(activityResource));
    resourceController = createCrudController({
      resource: activityResource,
      api: activityResource.api,
      auth: defaultOperatorAuth
    });
  }
}

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
  content.addEventListener("click", handleResourceClick);
  content.addEventListener("change", handleResourceFilterChange);
  content.addEventListener("submit", handleResourceSubmit);

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
  setText('[data-page-link="users"]', i18n.t("app.nav.users"));
  setText('[data-page-link="imports"]', i18n.t("app.nav.imports"));
  setText('[data-page-link="projects"]', i18n.t("app.nav.projects"));
  roleSwitchField.querySelector("span").textContent = i18n.t("app.role.label");
  refreshButton.textContent = i18n.t("app.actions.refresh");
  createUserButton.textContent = i18n.t("app.actions.createUser");
  resetFilters.textContent = i18n.t("app.actions.reset");
  batchExport.textContent = i18n.t("app.actions.export");
  batchDisable.textContent = i18n.t("app.actions.disable");
  batchDelete.textContent = i18n.t("app.actions.delete");
  clearSelection.textContent = i18n.t("app.actions.clearSelection");
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function renderCurrentPage() {
  const requestedPage = window.location.hash.replace("#", "") || "users";
  const fallbackPage = enabledModules[0]?.key || "users";
  currentPage = pageMeta[requestedPage] ? requestedPage : fallbackPage;
  const meta = pageMeta[currentPage];

  pageEyebrow.textContent = meta.eyebrow;
  pageTitle.textContent = meta.title;
  pageDescription.textContent = meta.description;

  for (const link of document.querySelectorAll("[data-page-link]")) {
    link.classList.toggle("nav__item--active", link.dataset.pageLink === currentPage);
  }

  for (const panel of document.querySelectorAll("[data-page-panel]")) {
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

  if (currentPage === "activities") {
    renderResourcePage();
  }
}

function createResourcePageShell(resource) {
  return `
    <div class="page-panel" id="${escapeAttribute(resource.key)}-page" data-page-panel="${escapeAttribute(resource.key)}" hidden>
      <section class="filter-bar" data-resource-filters="${escapeAttribute(resource.key)}">
        ${resource.filters.map(renderResourceFilter).join("")}
        <div class="filter-bar__actions">
          <button class="button button--secondary" data-resource-reset type="button">重置</button>
          <button class="button button--secondary" data-resource-refresh type="button">刷新</button>
          <button class="button button--primary" data-resource-create type="button">新建</button>
        </div>
      </section>

      <section class="table-shell" aria-live="polite">
        <div class="table-status" data-resource-status hidden></div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                ${resource.columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}
                <th class="operation-cell">操作</th>
              </tr>
            </thead>
            <tbody data-resource-body></tbody>
          </table>
        </div>
        <div class="pagination" data-resource-pagination></div>
      </section>

      <section class="detail-shell" data-resource-form-shell hidden>
        <div class="section-header">
          <div>
            <p class="eyebrow">Resource form</p>
            <h2 data-resource-form-title>新建${escapeHtml(resource.label)}</h2>
            <p>表单由资源 schema 渲染，保存前会执行通用校验。</p>
          </div>
        </div>
        <form class="settings-grid" data-resource-form>
          ${resource.form.fields.map(renderResourceFormField).join("")}
          <div class="form-error field--wide" data-resource-form-error hidden></div>
          <div class="form-actions field--wide">
            <button class="button button--secondary" data-resource-cancel type="button">取消</button>
            <button class="button button--primary" type="submit">保存</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderResourceFilter(field) {
  if (field.type === "select") {
    return `
      <label class="field">
        <span>${escapeHtml(field.label)}</span>
        <select data-resource-filter="${escapeAttribute(field.name)}">
          <option value="">全部</option>
          ${(field.options || []).map((option) => `<option value="${escapeAttribute(option)}">${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  return `
    <label class="field">
      <span>${escapeHtml(field.label)}</span>
      <input data-resource-filter="${escapeAttribute(field.name)}" type="search" placeholder="请输入${escapeAttribute(field.label)}" />
    </label>
  `;
}

function renderResourceFormField(field) {
  if (field.type === "select") {
    return `
      <label class="field">
        <span>${escapeHtml(field.label)}${field.required ? " *" : ""}</span>
        <select name="${escapeAttribute(field.name)}">
          <option value="">请选择</option>
          ${(field.options || []).map((option) => `<option value="${escapeAttribute(option)}">${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  const inputType = field.type === "datetime" ? "datetime-local" : field.type || "text";
  return `
    <label class="field">
      <span>${escapeHtml(field.label)}${field.required ? " *" : ""}</span>
      <input name="${escapeAttribute(field.name)}" type="${escapeAttribute(inputType)}" />
    </label>
  `;
}

async function renderResourcePage() {
  if (!resourceController) return;
  const panel = document.querySelector('[data-page-panel="activities"]');
  const body = panel.querySelector("[data-resource-body]");
  const status = panel.querySelector("[data-resource-status]");

  body.innerHTML = renderResourceLoadingRows(activityResource);
  status.hidden = false;
  status.className = "table-status table-status--muted";
  status.textContent = "正在加载数据...";

  const state = await resourceController.load();

  if (state.error) {
    status.className = "table-status table-status--error";
    status.textContent = state.error.message || "加载失败。";
    body.innerHTML = renderResourceStateRow(activityResource, "加载失败，请稍后重试。");
    renderResourcePagination(state);
    return;
  }

  if (state.rows.length === 0) {
    status.className = "table-status table-status--empty";
    status.textContent = "暂无数据。";
    body.innerHTML = renderResourceStateRow(activityResource, "暂无数据，请新建或调整筛选条件。");
  } else {
    status.hidden = true;
    body.innerHTML = state.rows.map((record) => renderResourceRow(activityResource, record)).join("");
  }

  renderResourcePagination(state);
}

function renderResourceLoadingRows(resource) {
  return Array.from({ length: 3 }, () => `
    <tr class="skeleton-row">
      ${resource.columns.map(() => '<td><span class="skeleton-box"></span></td>').join("")}
      <td><span class="skeleton-box"></span></td>
    </tr>
  `).join("");
}

function renderResourceStateRow(resource, message) {
  return `
    <tr>
      <td class="state-cell" colspan="${resource.columns.length + 1}">
        <strong>${escapeHtml(message)}</strong>
      </td>
    </tr>
  `;
}

function renderResourceRow(resource, record) {
  return `
    <tr>
      ${resource.columns.map((column) => `<td>${escapeHtml(formatResourceValue(record[column.key], column))}</td>`).join("")}
      <td class="operation-cell">
        <button class="icon-action" data-resource-edit="${escapeAttribute(record.id)}" type="button">编辑</button>
        <button class="icon-action" data-resource-delete="${escapeAttribute(record.id)}" type="button">删除</button>
      </td>
    </tr>
  `;
}

function renderResourcePagination(state) {
  const panel = document.querySelector('[data-page-panel="activities"]');
  const paginationEl = panel.querySelector("[data-resource-pagination]");
  const paginationState = state.query.pagination;

  paginationEl.innerHTML = `
    <span>第 ${paginationState.pageNum} / ${paginationState.pageCount} 页</span>
    <span>${paginationState.total} 条</span>
    <button class="button button--secondary" data-resource-prev type="button" ${paginationState.pageNum <= 1 ? "disabled" : ""}>上一页</button>
    <button class="button button--secondary" data-resource-next type="button" ${paginationState.pageNum >= paginationState.pageCount ? "disabled" : ""}>下一页</button>
  `;
}

function formatResourceValue(value, column) {
  if (!value) return "-";
  if (column.key.endsWith("At")) return formatDate(value);
  return value;
}

function handleResourceClick(event) {
  if (currentPage !== "activities" || !resourceController) return;
  const target = event.target.closest("button");
  if (!target) return;

  if (target.matches("[data-resource-refresh]")) {
    renderResourcePage();
  }

  if (target.matches("[data-resource-reset]")) {
    resetResourceFilters();
  }

  if (target.matches("[data-resource-create]")) {
    openResourceForm();
  }

  if (target.matches("[data-resource-cancel]")) {
    closeResourceForm();
  }

  if (target.matches("[data-resource-prev]")) {
    resourceController.query.pagination.setPage(resourceController.getState().query.pagination.pageNum - 1);
    renderResourcePage();
  }

  if (target.matches("[data-resource-next]")) {
    resourceController.query.pagination.setPage(resourceController.getState().query.pagination.pageNum + 1);
    renderResourcePage();
  }

  if (target.dataset.resourceEdit) {
    const record = getResourceRecord(target.dataset.resourceEdit);
    if (record) openResourceForm(record);
  }

  if (target.dataset.resourceDelete) {
    const record = getResourceRecord(target.dataset.resourceDelete);
    if (record) openConfirmDialog(createResourceDeleteConfirm(record));
  }
}

function handleResourceFilterChange(event) {
  if (currentPage !== "activities" || !resourceController) return;
  const field = event.target.closest("[data-resource-filter]");
  if (!field) return;

  resourceController.query.filters.setFilter(field.dataset.resourceFilter, field.value);
  renderResourcePage();
}

function handleResourceSubmit(event) {
  if (currentPage !== "activities" || !event.target.matches("[data-resource-form]")) return;
  event.preventDefault();
  saveResourceForm(event.target);
}

function resetResourceFilters() {
  const panel = document.querySelector('[data-page-panel="activities"]');
  for (const field of panel.querySelectorAll("[data-resource-filter]")) {
    field.value = "";
  }

  resourceController.query.filters.reset();
  renderResourcePage();
}

function openResourceForm(record = null) {
  resourceEditRecord = record;
  const panel = document.querySelector('[data-page-panel="activities"]');
  const shell = panel.querySelector("[data-resource-form-shell]");
  const form = panel.querySelector("[data-resource-form]");
  const title = panel.querySelector("[data-resource-form-title]");
  const values = activityResource.form.getInitialValues(record || {});

  title.textContent = record ? `编辑${activityResource.label}` : `新建${activityResource.label}`;
  shell.hidden = false;
  panel.querySelector("[data-resource-form-error]").hidden = true;

  for (const field of activityResource.form.fields) {
    const input = form.elements[field.name];
    if (!input) continue;
    input.value = toInputValue(values[field.name], field);
  }

  form.querySelector("input, select, textarea")?.focus();
}

function closeResourceForm() {
  const panel = document.querySelector('[data-page-panel="activities"]');
  panel.querySelector("[data-resource-form-shell]").hidden = true;
  resourceEditRecord = null;
}

async function saveResourceForm(form) {
  const values = readFormValues(form, activityResource.form.fields);
  const validation = activityResource.form.validate(values);
  const error = form.querySelector("[data-resource-form-error]");

  if (!validation.valid) {
    error.hidden = false;
    error.textContent = Object.values(validation.errors)[0];
    return;
  }

  error.hidden = true;
  await resourceController.save({
    ...resourceEditRecord,
    ...normalizeResourceFormValues(values)
  });
  closeResourceForm();
  await renderResourcePage();
}

function createResourceDeleteConfirm(record) {
  return {
    tone: "danger",
    eyebrow: "Dangerous action",
    title: `删除 ${record.title}?`,
    description: "该记录删除后不可恢复，请确认当前操作对象无误。",
    subject: `${record.title} · ${record.channel}`,
    submitLabel: "删除",
    action: async () => {
      await resourceController.delete(record);
      await renderResourcePage();
      return "记录已删除。";
    }
  };
}

function getResourceRecord(id) {
  return resourceController.getState().rows.find((record) => record.id === id);
}

function normalizeResourceFormValues(values) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => {
    if (key.endsWith("At") && value) {
      return [key, new Date(value).toISOString()];
    }
    return [key, value];
  }));
}

function toInputValue(value, field) {
  if (!value) return "";
  if (field.type === "datetime") return String(value).slice(0, 16);
  return value;
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
