export const dictionaries = {
  zh: {
    "app.nav.users": "用户管理",
    "app.nav.imports": "导入记录",
    "app.nav.projects": "项目设置",
    "app.role.label": "角色",
    "app.actions.refresh": "刷新",
    "app.actions.refreshing": "刷新中...",
    "app.actions.createUser": "新建用户",
    "app.actions.reset": "重置",
    "app.actions.export": "导出",
    "app.actions.disable": "禁用",
    "app.actions.delete": "删除",
    "app.actions.clearSelection": "清空选择",
    "app.theme.switchToLight": "切换到浅色",
    "app.theme.switchToDark": "切换到深色",
    "page.users.eyebrow": "框架无关 demo",
    "page.users.title": "用户",
    "page.users.description": "管理组织成员、角色和访问状态。",
    "page.imports.eyebrow": "上传流程 demo",
    "page.imports.title": "导入记录",
    "page.imports.description": "校验上传记录，查看失败原因，并追踪异步导入任务。",
    "page.projects.eyebrow": "详情页 demo",
    "page.projects.title": "项目设置",
    "page.projects.description": "编辑项目配置，查看关联数据和审计历史。"
  },
  en: {
    "app.nav.users": "User Management",
    "app.nav.imports": "Import Records",
    "app.nav.projects": "Project Settings",
    "app.role.label": "Role",
    "app.actions.refresh": "Refresh",
    "app.actions.refreshing": "Refreshing...",
    "app.actions.createUser": "Create User",
    "app.actions.reset": "Reset",
    "app.actions.export": "Export",
    "app.actions.disable": "Disable",
    "app.actions.delete": "Delete",
    "app.actions.clearSelection": "Clear selection",
    "app.theme.switchToLight": "Switch to light",
    "app.theme.switchToDark": "Switch to dark",
    "page.users.eyebrow": "Framework-agnostic demo",
    "page.users.title": "Users",
    "page.users.description": "Manage organization members, roles, and access status.",
    "page.imports.eyebrow": "Upload workflow demo",
    "page.imports.title": "Import Records",
    "page.imports.description": "Validate uploaded records, review failures, and track async import tasks.",
    "page.projects.eyebrow": "Detail page demo",
    "page.projects.title": "Project Settings",
    "page.projects.description": "Edit project configuration, review related data, and scan audit history."
  }
};

export function createI18n({
  locale = "zh",
  fallbackLocale = "en",
  messages = dictionaries
} = {}) {
  const activeLocale = messages[locale] ? locale : fallbackLocale;
  const fallbackMessages = messages[fallbackLocale] || {};
  const activeMessages = messages[activeLocale] || fallbackMessages;

  function t(key, params = {}) {
    const template = activeMessages[key] || fallbackMessages[key] || key;
    return interpolate(template, params);
  }

  function formatDate(value, options = {}) {
    if (!value) return "-";

    return new Intl.DateTimeFormat(activeLocale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      ...options
    }).format(new Date(value));
  }

  return {
    locale: activeLocale,
    t,
    formatDate
  };
}

function interpolate(template, params) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] ?? "";
  });
}
