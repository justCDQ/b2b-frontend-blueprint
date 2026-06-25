import { createFormSchema } from "../../form-schema/src/index.js";
import { createImportWorkflowContract } from "../../import-workflow/src/index.js";
import { createResourceModule } from "../../resource/src/index.js";

export const activityStatuses = ["draft", "online", "offline", "ended"];

let activities = [
  createActivity({
    id: "activity-001",
    title: "新人首单活动",
    status: "online",
    channel: "App",
    startAt: "2026-06-01T00:00:00.000Z",
    endAt: "2026-06-30T23:59:59.000Z",
    owner: "小明",
    updatedAt: "2026-06-20T10:30:00.000Z"
  }),
  createActivity({
    id: "activity-002",
    title: "会员日加码",
    status: "draft",
    channel: "Web",
    startAt: "2026-07-08T00:00:00.000Z",
    endAt: "2026-07-10T23:59:59.000Z",
    owner: "小明",
    updatedAt: "2026-06-18T09:20:00.000Z"
  }),
  createActivity({
    id: "activity-003",
    title: "渠道拉新激励",
    status: "offline",
    channel: "Partner",
    startAt: "2026-05-01T00:00:00.000Z",
    endAt: "2026-05-31T23:59:59.000Z",
    owner: "小明",
    updatedAt: "2026-06-02T11:00:00.000Z"
  })
];

export const activityFormSchema = createFormSchema([
  { name: "title", label: "活动名称", type: "input", required: true, maxLength: 60 },
  { name: "channel", label: "渠道", type: "select", required: true, options: ["App", "Web", "Partner"] },
  { name: "status", label: "状态", type: "select", required: true, options: activityStatuses },
  { name: "startAt", label: "开始时间", type: "datetime", required: true },
  { name: "endAt", label: "结束时间", type: "datetime", required: true }
]);

export const activityImportContract = createImportWorkflowContract({
  resource: "activity",
  requiredFields: ["title", "channel", "startAt", "endAt"],
  acceptedTypes: [".csv", ".xlsx"],
  maxFileSizeMb: 30
});

export const activityResource = createResourceModule({
  key: "activities",
  label: "资源 CRUD",
  navLabel: "资源 CRUD",
  resource: "activity",
  description: "由 Resource Module Pattern 驱动的通用资源管理页面示例。",
  form: activityFormSchema,
  importContract: activityImportContract,
  filters: [
    { name: "keyword", label: "关键词", type: "search" },
    { name: "status", label: "状态", type: "select", options: activityStatuses },
    { name: "channel", label: "渠道", type: "select", options: ["App", "Web", "Partner"] }
  ],
  columns: [
    { key: "title", label: "活动名称" },
    { key: "status", label: "状态" },
    { key: "channel", label: "渠道" },
    { key: "startAt", label: "开始时间" },
    { key: "endAt", label: "结束时间" },
    { key: "owner", label: "负责人" },
    { key: "updatedAt", label: "更新时间" }
  ],
  actions: [
    { key: "edit", label: "修改", scope: "row" },
    { key: "toggleOnline", label: "上架/下架", scope: "row" },
    { key: "delete", label: "删除", scope: "row", danger: true }
  ],
  api: {
    query: queryActivities,
    create: createActivityRecord,
    update: updateActivityRecord,
    delete: deleteActivityRecord
  }
});

export async function queryActivities(query = {}) {
  await delay(120);
  const pageNum = positiveNumber(query.pageNum, 1);
  const pageSize = positiveNumber(query.pageSize, 20);
  const filtered = filterActivities(activities, query);
  const start = (pageNum - 1) * pageSize;

  return {
    list: filtered.slice(start, start + pageSize),
    pageNum,
    pageSize,
    total: filtered.length
  };
}

export async function createActivityRecord(input) {
  await delay(120);
  const now = new Date().toISOString();
  const activity = createActivity({
    id: `activity-${String(activities.length + 1).padStart(3, "0")}`,
    owner: "小明",
    updatedAt: now,
    ...input
  });

  activities = [activity, ...activities];
  return activity;
}

export async function updateActivityRecord(activityId, patch) {
  await delay(120);
  const now = new Date().toISOString();
  let updated;

  activities = activities.map((activity) => {
    if (activity.id !== activityId) return activity;
    updated = { ...activity, ...patch, updatedAt: now };
    return updated;
  });

  if (!updated) throw new Error("活动不存在。");
  return updated;
}

export async function deleteActivityRecord(activityId) {
  await delay(120);
  activities = activities.filter((activity) => activity.id !== activityId);
  return { id: activityId };
}

export async function publishActivity(activityId) {
  return updateActivityRecord(activityId, { status: "online" });
}

export async function unpublishActivity(activityId) {
  return updateActivityRecord(activityId, { status: "offline" });
}

function createActivity(activity) {
  return {
    description: "",
    ...activity
  };
}

function filterActivities(source, query) {
  const keyword = String(query.keyword || "").trim().toLowerCase();

  return source.filter((activity) => {
    if (keyword) {
      const haystack = [activity.title, activity.channel, activity.owner].join(" ").toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }

    if (query.status && activity.status !== query.status) return false;
    if (query.channel && activity.channel !== query.channel) return false;
    return true;
  });
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
