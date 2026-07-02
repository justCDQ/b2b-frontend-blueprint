export {
  activityFormSchema,
  activityImportContract,
  activityResource,
  activityResourceParts,
  activityStatuses,
  createActivityRecord,
  deleteActivityRecord,
  publishActivity,
  queryActivities,
  unpublishActivity,
  updateActivityRecord
} from "./activities.js";

export {
  createUserRecord,
  deleteUserRecord,
  getDisabledReasons,
  getSignedInUserId,
  getUserPermissions,
  getUserRoleOptions,
  getUserStatusOptions,
  queryUsers,
  resetUserPassword,
  updateUserRecord,
  userRoles,
  userStatuses
} from "./users.js";

export function getDemoSummary() {
  return [
    { label: "Core packages", value: "5" },
    { label: "Page blueprints", value: "3" },
    { label: "Frameworks required", value: "0" },
    { label: "Theme modes", value: "2" }
  ];
}

export function getMvpModules() {
  return [
    "theme tokens",
    "headless behavior",
    "DOM controllers",
    "component recipes",
    "vanilla demo shell"
  ];
}
