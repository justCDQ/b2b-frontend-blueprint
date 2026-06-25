export function createAuthContext({
  currentUser,
  permissions = [],
  roles = []
} = {}) {
  const permissionSet = new Set(permissions);
  const roleSet = new Set(roles.length > 0 ? roles : currentUser?.roles || []);

  function can(action, resource, record) {
    const key = `${resource}:${action}`;
    const wildcard = `${resource}:*`;
    const allowed = permissionSet.has(key) || permissionSet.has(wildcard) || permissionSet.has("*");

    if (typeof record?.can === "function") {
      return allowed && record.can(action, currentUser);
    }

    return allowed;
  }

  function reason(action, resource, record) {
    if (can(action, resource, record)) return "";
    return "当前角色没有执行该操作的权限。";
  }

  return {
    currentUser,
    roles: roleSet,
    permissions: permissionSet,
    can,
    reason,
    hasRole(role) {
      return roleSet.has(role);
    }
  };
}

export const defaultOperatorAuth = createAuthContext({
  currentUser: {
    id: "operator-001",
    name: "小明",
    roles: ["operator"]
  },
  permissions: [
    "activity:*",
    "import:*",
    "users:*",
    "projects:*"
  ]
});
