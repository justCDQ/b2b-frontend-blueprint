export function createAuthContext({
  currentUser,
  permissions = [],
  roles = [],
  permissionReasons = {}
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
    const key = `${resource}:${action}`;
    const wildcard = `${resource}:*`;
    return permissionReasons[key] || permissionReasons[wildcard] || permissionReasons.default || "当前角色没有执行该操作的权限。";
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

export const demoAuthProfiles = {
  owner: {
    currentUser: {
      id: "user-001",
      name: "小明",
      email: "xiaoming@example.com",
      roles: ["owner"]
    },
    permissions: ["*"]
  },
  admin: {
    currentUser: {
      id: "admin-001",
      name: "小明 2",
      email: "xiaoming2@example.com",
      roles: ["admin"]
    },
    permissions: [
      "activity:*",
      "import:*",
      "users:*",
      "projects:*"
    ]
  },
  operator: {
    currentUser: {
      id: "operator-001",
      name: "小明 3",
      email: "xiaoming3@example.com",
      roles: ["operator"]
    },
    permissions: [
      "activity:read",
      "activity:update",
      "import:*",
      "users:read",
      "users:export",
      "projects:read"
    ]
  },
  viewer: {
    currentUser: {
      id: "viewer-001",
      name: "小明 4",
      email: "xiaoming4@example.com",
      roles: ["viewer"]
    },
    permissions: [
      "users:read",
      "projects:read"
    ]
  }
};

export const defaultOperatorAuth = createAuthContext(demoAuthProfiles.operator);

export function createDemoAuthContext(role = "owner") {
  return createAuthContext(demoAuthProfiles[role] || demoAuthProfiles.owner);
}

export function createAuthSession({
  profiles = demoAuthProfiles,
  defaultRole = "owner",
  storage,
  tokenKey = "accessToken"
} = {}) {
  const safeStorage = storage || createMemoryAuthStore();
  let role = safeStorage.get("role") || defaultRole;
  let authenticated = safeStorage.get("authenticated") !== "false";
  let accessToken = safeStorage.get(tokenKey) || "";

  function signIn(nextRole = defaultRole, session = {}) {
    role = profiles[nextRole] ? nextRole : defaultRole;
    authenticated = true;
    accessToken = session.accessToken || accessToken;
    safeStorage.set("role", role);
    safeStorage.set("authenticated", "true");
    if (accessToken) safeStorage.set(tokenKey, accessToken);
    return getState();
  }

  function signOut() {
    authenticated = false;
    accessToken = "";
    safeStorage.set("authenticated", "false");
    safeStorage.remove(tokenKey);
    return getState();
  }

  function switchRole(nextRole) {
    if (!profiles[nextRole]) return getState();
    role = nextRole;
    safeStorage.set("role", role);
    return getState();
  }

  function getState() {
    const profile = profiles[role] || profiles[defaultRole];

    return {
      authenticated,
      role,
      accessToken,
      profile,
      currentUser: authenticated ? profile?.currentUser : null,
      auth: authenticated ? createAuthContext(profile) : createAuthContext()
    };
  }

  return {
    getState,
    getToken() {
      return getState().accessToken;
    },
    signIn,
    signOut,
    switchRole
  };
}

export function createMemoryAuthStore(initial = {}) {
  const values = new Map(Object.entries(initial));

  return {
    get(key) {
      return values.get(key);
    },
    set(key, value) {
      values.set(key, value);
    },
    remove(key) {
      values.delete(key);
    }
  };
}

export function createLocalStorageAuthStore({
  keyPrefix = "b2b-blueprint-auth",
  storage = globalThis.localStorage
} = {}) {
  return {
    get(key) {
      try {
        return storage?.getItem(`${keyPrefix}:${key}`) || "";
      } catch {
        return "";
      }
    },
    set(key, value) {
      try {
        storage?.setItem(`${keyPrefix}:${key}`, value);
      } catch {
        // Ignore storage errors so auth can still work in private browsing or tests.
      }
    },
    remove(key) {
      try {
        storage?.removeItem(`${keyPrefix}:${key}`);
      } catch {
        // Ignore storage errors so auth can still work in private browsing or tests.
      }
    }
  };
}

export function filterModulesByPermission(modules, auth) {
  return modules.filter((module) => {
    if (!module.requiredPermission) return true;
    return auth.can(module.requiredPermission.action, module.requiredPermission.resource);
  });
}

export function createRequiredPermission(resource, action = "read") {
  return {
    resource,
    action
  };
}

export function normalizeBackendUser(payload = {}) {
  const source = payload.user || payload.currentUser || payload;
  const roles = normalizeStringArray(source.roles || source.role ? source.roles || [source.role] : []);
  const permissions = normalizeStringArray(payload.permissions || source.permissions || []);

  return {
    currentUser: {
      id: source.id || source.userId || "",
      name: source.name || source.displayName || source.username || "",
      email: source.email || "",
      roles
    },
    permissions,
    permissionReasons: payload.permissionReasons || {}
  };
}

export function createRouteGuard({ auth, fallbackPath = "#login" } = {}) {
  return {
    canAccess(route) {
      if (!route?.requiredPermission) return true;
      return auth?.can?.(route.requiredPermission.action, route.requiredPermission.resource) || false;
    },
    resolve(route) {
      if (this.canAccess(route)) {
        return {
          allowed: true,
          route
        };
      }

      return {
        allowed: false,
        fallbackPath,
        reason: auth?.reason?.(route.requiredPermission.action, route.requiredPermission.resource) || "当前角色没有访问该页面的权限。"
      };
    }
  };
}

export function createForbiddenState({
  title = "无权限访问",
  description = "当前角色没有访问该内容的权限。",
  actionLabel = "返回",
  actionHref = "#"
} = {}) {
  return {
    type: "forbidden",
    title,
    description,
    actionLabel,
    actionHref
  };
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string" && item.trim());
}

export const defaultAdminAuth = createAuthContext({
  currentUser: {
    id: "admin-001",
    name: "小明",
    roles: ["admin"]
  },
  permissions: [
    "activity:*",
    "import:*",
    "users:*",
    "projects:*"
  ]
});
