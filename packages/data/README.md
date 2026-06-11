# Data Package

Framework-agnostic mock data and async API contracts for the demo app.

This package does not depend on a request library or UI framework. It provides predictable fixtures so page modules can validate list queries, permissions, disabled reasons, mutation states, and error handling.

## User Management

Exports:

- `queryUsers(query, context)`
- `createUserRecord(input, context)`
- `updateUserRecord(userId, patch, context)`
- `deleteUserRecord(userId, context)`
- `resetUserPassword(userId, context)`
- `getUserPermissions(user, context)`
- `getDisabledReasons(user, context)`
- `getUserRoleOptions()`
- `getUserStatusOptions()`

## Context

```js
const context = {
  currentRole: "owner",
  delay: 180
};
```

Supported roles:

- `owner`
- `admin`
- `operator`
- `viewer`

## Mock Error

Use this query to trigger a list error:

```js
queryUsers({ keyword: "__error" }, { currentRole: "owner" });
```

## Rules

- Keep this package UI-free.
- Keep this package framework-free.
- Keep permission and disabled reason examples close to the data contract.
- Use stable row IDs for selection and mutation.

