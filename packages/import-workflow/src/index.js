export const importSteps = [
  { key: "upload", label: "上传文件" },
  { key: "mapping", label: "字段映射" },
  { key: "validation", label: "数据校验" },
  { key: "result", label: "导入结果" }
];

export function createImportWorkflowContract({
  resource,
  acceptedTypes = [".csv", ".xlsx"],
  maxFileSizeMb = 20,
  requiredFields = [],
  steps = importSteps
}) {
  return {
    resource,
    acceptedTypes,
    maxFileSizeMb,
    requiredFields,
    steps,
    validateFile(file) {
      if (!file) return "请选择需要导入的文件。";
      const validType = acceptedTypes.some((type) => file.name?.endsWith(type));
      if (!validType) return `仅支持 ${acceptedTypes.join(", ")} 文件。`;
      if (file.size > maxFileSizeMb * 1024 * 1024) return `文件不能超过 ${maxFileSizeMb}MB。`;
      return "";
    },
    validateMapping(mapping) {
      const missing = requiredFields.filter((field) => !mapping[field]);
      return missing.length > 0 ? `缺少必填字段映射：${missing.join(", ")}。` : "";
    }
  };
}

export function normalizeImportTask(task) {
  return {
    id: task.id,
    fileName: task.fileName,
    status: task.status || "pending",
    total: task.total || 0,
    failed: task.failed || 0,
    createdAt: task.createdAt,
    errorFileUrl: task.errorFileUrl || ""
  };
}
