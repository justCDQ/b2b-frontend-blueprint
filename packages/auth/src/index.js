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
  storage
} = {}) {
  const safeStorage = storage || createMemoryAuthStore();
  let role = safeStorage.get("role") || defaultRole;
  let authenticated = safeStorage.get("authenticated") !== "false";

  function signIn(nextRole = defaultRole) {
    role = profiles[nextRole] ? nextRole : defaultRole;
    authenticated = true;
    safeStorage.set("role", role);
    safeStorage.set("authenticated", "true");
    return getState();
  }

  function signOut() {
    authenticated = false;
    safeStorage.set("authenticated", "false");
    return getState();
  }

  function switchRole(nextRole) {
    if (!profiles[nextRole]) return getState();
    role = nextRole;
    safeStorage.set("role", role);
    return getState();
  }

  function getState() {
    return {
      authenticated,
      role,
      profile: profiles[role] || profiles[defaultRole],
      auth: authenticated ? createAuthContext(profiles[role] || profiles[defaultRole]) : createAuthContext()
    };
  }

  return {
    getState,
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
