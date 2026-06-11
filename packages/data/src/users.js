export const userRoles = ["owner", "admin", "operator", "viewer"];

export const userStatuses = ["active", "invited", "disabled", "locked"];

const signedInUserId = "user-001";

let users = [
  createUser({
    id: "user-001",
    name: "小明",
    email: "xiaoming@example.com",
    role: "owner",
    status: "active",
    team: { id: "team-platform", name: "Platform" },
    mfaEnabled: true,
    lastActiveAt: "2026-06-10T09:12:00.000Z",
    createdAt: "2025-11-02T08:00:00.000Z"
  }),
  createUser({
    id: "user-002",
    name: "小明 2",
    email: "xiaoming2@example.com",
    role: "admin",
    status: "active",
    team: { id: "team-ops", name: "Operations" },
    mfaEnabled: true,
    lastActiveAt: "2026-06-09T16:30:00.000Z",
    createdAt: "2025-12-12T08:00:00.000Z"
  }),
  createUser({
    id: "user-003",
    name: "小明 3",
    email: "xiaoming3@example.com",
    role: "operator",
    status: "invited",
    team: { id: "team-sales", name: "Sales" },
    mfaEnabled: false,
    createdAt: "2026-01-08T08:00:00.000Z"
  }),
  createUser({
    id: "user-004",
    name: "小明 4",
    email: "xiaoming4@example.com",
    role: "viewer",
    status: "disabled",
    team: { id: "team-support", name: "Support" },
    mfaEnabled: false,
    lastActiveAt: "2026-05-21T11:20:00.000Z",
    createdAt: "2026-02-18T08:00:00.000Z"
  }),
  createUser({
    id: "user-005",
    name: "小明 5",
    email: "xiaoming5@example.com",
    role: "admin",
    status: "locked",
    team: { id: "team-security", name: "Security" },
    mfaEnabled: true,
    lastActiveAt: "2026-06-01T10:00:00.000Z",
    createdAt: "2026-03-01T08:00:00.000Z"
  })
];

function createUser(user) {
  return {
    phone: "",
    avatarUrl: "",
    updatedAt: user.createdAt,
    ...user
  };
}

export function getSignedInUserId() {
  return signedInUserId;
}

export function getUserRoleOptions() {
  return userRoles.map((role) => ({
    label: role,
    value: role
  }));
}

export function getUserStatusOptions() {
  return userStatuses.map((status) => ({
    label: status,
    value: status
  }));
}

export async function queryUsers(query = {}, context = {}) {
  await delay(context.delay ?? 180);
  maybeThrowMockError(query);

  const currentRole = context.currentRole || "owner";
  const pageNum = positiveNumber(query.pageNum, 1);
  const pageSize = positiveNumber(query.pageSize, 20);
  const filtered = sortUsers(filterUsers(users, query), query);
  const start = (pageNum - 1) * pageSize;
  const list = filtered.slice(start, start + pageSize).map((user) =>
    withUserPermissions(user, {
      currentRole,
      signedInUserId
    })
  );

  return {
    list,
    pageNum,
    pageSize,
    total: filtered.length
  };
}

export async function createUserRecord(input, context = {}) {
  await delay(context.delay ?? 180);
  assertCanMutate(context.currentRole, "create");

  const now = new Date().toISOString();
  const user = createUser({
    id: `user-${String(users.length + 1).padStart(3, "0")}`,
    name: input.name,
    email: input.email,
    phone: input.phone || "",
    role: input.role || "viewer",
    status: input.status || "invited",
    team: input.team,
    mfaEnabled: Boolean(input.mfaEnabled),
    createdAt: now,
    updatedAt: now
  });

  users = [user, ...users];

  return user;
}

export async function updateUserRecord(userId, patch, context = {}) {
  await delay(context.delay ?? 180);
  assertCanMutate(context.currentRole, "edit");

  let updatedUser;
  const now = new Date().toISOString();

  users = users.map((user) => {
    if (user.id !== userId) return user;
    updatedUser = { ...user, ...patch, updatedAt: now };
    return updatedUser;
  });

  if (!updatedUser) {
    throw createMockError("USER_NOT_FOUND", "User does not exist.");
  }

  return updatedUser;
}

export async function deleteUserRecord(userId, context = {}) {
  await delay(context.delay ?? 180);
  const user = users.find((item) => item.id === userId);

  if (!user) {
    throw createMockError("USER_NOT_FOUND", "User does not exist.");
  }

  const permissions = getUserPermissions(user, {
    currentRole: context.currentRole || "owner",
    signedInUserId
  });

  if (!permissions.canDelete) {
    throw createMockError("USER_DELETE_FORBIDDEN", getDisabledReasons(user, {
      currentRole: context.currentRole || "owner",
      signedInUserId
    }).delete || "You do not have permission to delete this user.");
  }

  users = users.filter((item) => item.id !== userId);

  return { id: userId };
}

export async function resetUserPassword(userId, context = {}) {
  await delay(context.delay ?? 180);
  const user = users.find((item) => item.id === userId);

  if (!user) {
    throw createMockError("USER_NOT_FOUND", "User does not exist.");
  }

  const permissions = getUserPermissions(user, {
    currentRole: context.currentRole || "owner",
    signedInUserId
  });

  if (!permissions.canResetPassword) {
    throw createMockError("USER_RESET_PASSWORD_FORBIDDEN", "You do not have permission to reset password.");
  }

  return {
    id: userId,
    temporaryPassword: "visible-only-in-demo"
  };
}

export function getUserPermissions(user, { currentRole, signedInUserId: currentUserId }) {
  const isSelf = user.id === currentUserId;
  const canManage = currentRole === "owner" || currentRole === "admin";
  const canExport = currentRole === "owner" || currentRole === "admin" || currentRole === "operator";
  const canDeleteOwner = currentRole === "owner";
  const canDelete = canManage && !isSelf && (user.role !== "owner" || canDeleteOwner);
  const canDisable = canManage && !isSelf && user.status === "active";
  const canEnable = canManage && user.status === "disabled";

  return {
    canViewDetail: true,
    canCreate: canManage,
    canEdit: canManage,
    canEnable,
    canDisable,
    canResetPassword: canManage,
    canDelete,
    canSelect: canExport && !isSelf
  };
}

export function getDisabledReasons(user, { currentRole, signedInUserId: currentUserId }) {
  const reasons = {};
  const isSelf = user.id === currentUserId;
  const canManage = currentRole === "owner" || currentRole === "admin";
  const canExport = currentRole === "owner" || currentRole === "admin" || currentRole === "operator";

  if (!canExport) {
    reasons.select = "当前角色不能执行批量操作。";
  }

  if (isSelf) {
    reasons.select = "不能对当前登录用户执行批量操作。";
    reasons.disable = "不能禁用当前登录用户。";
    reasons.delete = "不能删除当前登录用户。";
  }

  if (!canManage) {
    reasons.edit = "当前角色没有编辑用户权限。";
    reasons.enable = "当前角色没有启用用户权限。";
    reasons.disable = "当前角色没有禁用用户权限。";
    reasons.resetPassword = "当前角色没有重置密码权限。";
    reasons.delete = "当前角色没有删除用户权限。";
  }

  if (currentRole === "admin" && user.role === "owner") {
    reasons.delete = "Admin 不能删除 Owner 用户。";
  }

  if (user.status !== "active") {
    reasons.disable ||= "只有 active 用户可以被禁用。";
  }

  if (user.status !== "disabled") {
    reasons.enable ||= "只有 disabled 用户可以被启用。";
  }

  return reasons;
}

function withUserPermissions(user, context) {
  return {
    ...user,
    permissions: getUserPermissions(user, context),
    disabledReasons: getDisabledReasons(user, context)
  };
}

function filterUsers(source, query) {
  const keyword = String(query.keyword || "").trim().toLowerCase();

  return source.filter((user) => {
    if (keyword) {
      const haystack = [user.name, user.email, user.phone].join(" ").toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }

    if (query.role && user.role !== query.role) return false;
    if (query.status && user.status !== query.status) return false;
    if (query.teamId && user.team?.id !== query.teamId) return false;
    if (query.mfaEnabled !== undefined && String(user.mfaEnabled) !== String(query.mfaEnabled)) return false;

    return true;
  });
}

function sortUsers(source, query) {
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  return [...source].sort((left, right) => {
    const leftValue = left[sortBy] || "";
    const rightValue = right[sortBy] || "";
    const result = String(leftValue).localeCompare(String(rightValue));
    return sortOrder === "asc" ? result : -result;
  });
}

function maybeThrowMockError(query) {
  if (query.keyword === "__error") {
    throw createMockError("USER_LIST_ERROR", "Mock list request failed.");
  }
}

function assertCanMutate(currentRole = "owner", action) {
  const canManage = currentRole === "owner" || currentRole === "admin";

  if (!canManage) {
    throw createMockError(`USER_${action.toUpperCase()}_FORBIDDEN`, "Current role cannot mutate users.");
  }
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createMockError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
