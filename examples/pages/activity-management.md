# Activity Management

This example shows how an operations console can use the generic resource pattern.

## Use Case

Activity operators need to:

- Import activity data.
- Publish or unpublish activities.
- Edit activity content.
- Delete activities with confirmation.
- Search and filter activity records.

## Resource Contract

The activity resource lives in:

```text
packages/data/src/activities.js
```

It exposes:

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

## API Adapter Mapping

When connecting a real backend, keep the page contract stable and replace the API implementation:

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

## Interaction Rules

- Publish and unpublish are row actions and should prevent duplicate clicks while pending.
- Delete is dangerous and must use ConfirmDialog.
- Import uses the shared import workflow: upload, mapping, validation, result.
- Form submission validates required fields before saving.
