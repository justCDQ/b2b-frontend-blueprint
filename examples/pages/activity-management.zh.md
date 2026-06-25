# 活动管理

这个示例用于说明运营后台如何使用通用 Resource Pattern。

## 使用场景

运营人员通常需要：

- 导入活动数据。
- 上架或下架活动。
- 修改活动内容。
- 删除活动，并进行二次确认。
- 搜索和筛选活动记录。

## 资源契约

活动资源定义在：

```text
packages/data/src/activities.js
```

它导出：

```js
activityResource
activityFormSchema
activityImportContract
queryActivities()
createActivityRecord()
updateActivityRecord()
deleteActivityRecord()
publishActivity()
unpublishActivity()
```

## 后端接口接入

接入真实后端时，页面契约保持稳定，只替换 API 实现：

```js
export const activityApi = {
  query: (query) => client.get("/activities", { query }),
  create: (input) => client.post("/activities", input),
  update: (id, patch) => client.patch(`/activities/${id}`, patch),
  delete: (id) => client.delete(`/activities/${id}`),
  publish: (id) => client.post(`/activities/${id}/publish`),
  unpublish: (id) => client.post(`/activities/${id}/unpublish`)
};
```

## 交互规则

- 上架/下架是行操作，pending 时需要防止重复点击。
- 删除属于危险操作，必须使用 ConfirmDialog。
- 导入使用统一导入流程：上传、字段映射、数据校验、导入结果。
- 表单保存前必须完成必填项校验。
