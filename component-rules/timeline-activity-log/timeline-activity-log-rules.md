# Timeline / Activity Log / Audit Log Rules

> Use these rules for chronological records in 2B products.
> Timeline explains process progress. Activity Log explains operational events. Audit Log preserves trustworthy compliance/security records.

---

## 1. Component Boundary

Choose the component by the purpose of the record, not by visual style.

| Component | Use for | Main promise |
|---|---|---|
| Timeline | Process progress, lifecycle, approval path, deployment stage. | Helps users understand where something is in a flow. |
| Activity Log | Recent user/system activity around a resource. | Helps users understand what happened operationally. |
| Audit Log | Security, compliance, permission, billing, data access, destructive actions. | Provides precise, immutable, trustworthy evidence. |
| Task Log | Import/export/sync/job execution output. | Helps users track machine progress and diagnose failure. |

Rules:

- Timeline is narrative and status-oriented.
- Activity Log is event-oriented and can be user friendly.
- Audit Log is evidence-oriented and must be precise, filterable, and tamper-resistant.
- Task Log can be technical and streaming.
- Do not use decorative timeline styling for audit data.
- Do not treat Activity Log as a compliance-grade Audit Log.

Use Timeline when:

- There is a small number of meaningful milestones.
- The user cares about progress, current status, or next step.
- Events represent lifecycle stages, not every tiny mutation.

Use Activity Log when:

- The user wants to see recent changes or operations.
- Events are useful for collaboration and debugging.
- Human-readable summaries are more important than raw payloads.

Use Audit Log when:

- Events may be used for security review, compliance, billing disputes, access investigation, or incident review.
- Logs need strong filters, precise timestamps, actor identity, source, target, and immutable details.

---

## 2. Event Data Contract

Each event should define:

- `id`: stable unique event id.
- `timestamp`: event time from server.
- `actor`: user, system, API key, integration, service account.
- `actorId`: stable actor id when available.
- `action`: clear verb or event type.
- `target`: affected resource name and/or id.
- `targetType`: resource category.
- `status`: success, failed, pending, warning, info.
- `summary`: short human-readable event title.
- `description`: optional explanatory sentence.
- `metadata`: structured details.
- `source`: web, api, system, integration, scheduled job, CLI.
- `requestId` / `traceId`: useful for support/debugging.
- `ip` / `location` / `userAgent`: only when relevant and allowed.

Minimum contract:

| Component | Required fields |
|---|---|
| Timeline | id, timestamp, status, summary |
| Activity Log | id, timestamp, actor, action, target, status, summary |
| Audit Log | id, timestamp, actor, actorId/source, action, target, targetType, status, metadata |
| Task Log | id, timestamp, status, summary/message |

Rules:

- Timestamp must be generated or confirmed by the backend.
- Audit Log must not rely on client-generated timestamps.
- Actor should be explicit: user, system, API key, integration, service account.
- Action should use a controlled vocabulary when logs are filterable.
- Target should include a stable id when names can change.
- Status must not rely on color only.
- Metadata should remain structured, not only plain text.

---

## 3. Display Structure

Default event display:

```text
Status marker / icon
Summary
Actor + action + target
Timestamp
Optional description
Optional metadata/details
```

Timeline display:

- Emphasize milestone title and current status.
- Show current step clearly.
- Show completed, current, failed, and upcoming states.
- Avoid showing too many low-value events.
- Oldest-first is usually better for lifecycle progress.

Activity Log display:

- Emphasize `who did what to what`.
- Newest-first is usually the default.
- Summaries may be friendlier than raw event names.
- Related events may be grouped by time, actor, or batch operation.

Audit Log display:

- Prefer dense list/table-like rows over decorative timeline when volume is high.
- Show exact timestamp, actor/source, action, target, and status.
- Keep wording factual and neutral.
- Do not hide important details behind decorative summaries only.

Task Log display:

- Show streaming/pending states when the job is running.
- Show step output, warnings, failures, retries, and duration when useful.
- Long logs should be collapsible/searchable or downloadable.

---

## 4. Sorting, Grouping, And Pagination

Sorting rules:

- Activity Log and Audit Log default to newest-first.
- Timeline defaults to oldest-first for progress/lifecycle stories.
- Task Log usually uses oldest-first for execution flow.
- Sorting direction must be visible or predictable.

Grouping rules:

- Group by date for long logs.
- Group by actor only when the actor is the main investigation axis.
- Group by batch/request when one action creates many events.
- Do not group audit records in a way that hides individual event identity.

Pagination/loading rules:

- Large logs require pagination, cursor loading, or infinite loading.
- Audit Log should prefer explicit pagination or cursor-based loading over endless ambiguous scroll.
- Activity Log can use `Load more`.
- Task Log can stream while running, then become stable history.
- Loading more appears at the bottom for newest-first lists unless the list is reverse-chronological chat-style.
- Virtual scrolling is allowed when event count is high and row height is stable enough.

---

## 5. Filters And Search

Common filters:

- Time range.
- Actor.
- Action type.
- Status.
- Source.
- Target/resource.
- Resource type.
- Request id / trace id.
- IP / API key / integration when relevant.

Rules:

- Audit Log must provide time range filtering.
- Audit Log should provide actor/action/status/source filters when those fields exist.
- Page-level logs should preserve filters in URL when users need recovery/share.
- Search should support ids, actor names, resource names, request ids, and exact event ids when useful.
- Filter empty state must distinguish `no events` from `no results for current filters`.
- Audit Log filters should not silently default to a narrow range without visible indication.

---

## 6. Details And Metadata

Use inline detail when:

- The event has 1-3 short additional fields.
- The details help explain the summary immediately.

Use collapsible detail when:

- Metadata is useful but verbose.
- There are before/after values, reason, request id, or error detail.

Use Drawer/Dialog detail when:

- Metadata is large or structured.
- The user needs to compare before/after data.
- The event contains error stack, request payload summary, permission context, or related records.

Rules:

- Sensitive values must be masked.
- Provide copy actions for event id, request id, trace id, resource id, and actor id when useful.
- Failed events should expose error reason when available.
- For before/after changes, show field name, previous value, and new value.
- For deleted resources, keep enough identity to understand what was deleted.
- Do not expose secrets, tokens, passwords, private keys, or full credentials in logs.

---

## 7. Interaction Rules

Allowed interactions:

- Expand/collapse details.
- Open event detail drawer/dialog.
- Copy ids.
- Filter by actor/action/target/status.
- Jump to related resource when permission allows.
- Retry task step only in Task Log when the domain explicitly supports it.

Not allowed:

- Editing audit records.
- Deleting audit records from the UI.
- Mutating original event content.
- Hiding audit events through client-side UI-only logic.

Click behavior:

- Timeline milestone click may open milestone detail.
- Activity Log row click may open detail when metadata exists.
- Audit Log row click should open read-only detail.
- Task Log row click may expand raw output or diagnostics.
- If an event links to an external or deleted resource, show clear unavailable/deleted state.

Action placement:

- Row-level actions should be subtle and right-aligned.
- Common actions: copy, view detail, filter by this value.
- Dangerous actions should not appear inside audit log rows.
- If retry exists for task logs, it must follow Action System pending/disabled rules.

---

## 8. Reliability And Trust

Audit Log reliability rules:

- Audit records are immutable from the product UI.
- Events should be created server-side.
- Timestamps should use server time and include timezone context when necessary.
- Actor identity should be stable even if display name changes.
- Resource identity should be stable even if resource name changes.
- Redaction must preserve enough context for investigation.
- Export should be available when compliance/investigation workflows require it.

Activity Log reliability rules:

- Activity summaries can be user friendly, but must not contradict source data.
- If events are eventually consistent, show refresh or last updated state when necessary.
- If refresh fails, preserve old logs and show non-destructive error feedback.

Task Log reliability rules:

- Running state must distinguish queued, running, retrying, succeeded, failed, canceled.
- If streaming disconnects, show reconnect/retry state.
- Do not mark task as successful until backend status confirms it.

---

## 9. Empty, Loading, Error, And Permission

Loading:

- Initial load may use skeleton rows or compact loading.
- Incremental loading should not clear already loaded events.
- Refresh should preserve old data while pending when possible.

Empty:

- Empty timeline explains that no milestone has started or no history exists.
- Empty activity log explains that no activity has happened yet.
- Empty audit log should be factual and avoid implying permission if unknown.
- Filter empty provides `Clear filters`.

Error:

- Initial load error uses StateView with retry.
- Refresh error preserves old events and shows toast or inline warning.
- Failed event is not the same as failed log loading.

Permission:

- Permission denied should not look like empty data.
- Audit Log permission errors should explain access restriction at a high level.
- Sensitive metadata may be partially masked while the event row remains visible.

---

## 10. Mobile

Rules:

- Use compact stacked rows.
- Keep timestamp and actor visible.
- Move metadata/detail into expandable section or drawer.
- Avoid dense audit investigation workflows on small dialogs.
- Filters may collapse into a filter drawer/sheet.
- Long technical Task Log output should wrap or open full-screen detail.

---

## 11. Accessibility

Rules:

- Timeline order must be programmatically understandable.
- Status markers must have text alternatives.
- Expand/collapse controls must be keyboard accessible.
- Row actions must have labels/tooltips.
- Timestamp should be readable by assistive technology, not only relative text.
- Do not rely only on color to indicate success/failure/warning.

---

## 12. Examples

Timeline:

```text
Created -> Configured -> Waiting for approval -> Approved -> Published
```

Activity Log:

```text
小明 changed the workspace name from "Data Ops" to "Data Platform".
System synced 1,240 records from Salesforce.
API key "prod-sync" failed to update customer #CUS-1024.
```

Audit Log:

```text
2026-05-22 14:35:12 UTC
actor: rebecca@example.com / user_123
action: role.updated
target: workspace_456
source: web
status: success
metadata: role changed from Viewer to Admin
```

Task Log:

```text
14:30:01 Queued import job
14:30:08 Parsed file: 4,200 rows
14:30:14 Warning: 12 rows missing optional phone number
14:30:20 Failed: 3 required fields missing
```

---

## 13. AI Review Checklist

- Component type matches timeline/activity/audit/task purpose.
- Audit Log is not implemented as decorative timeline.
- Event contract includes timestamp, actor, action, target, status, and stable ids when needed.
- Audit timestamps and actors come from trustworthy backend data.
- Sorting direction is intentional and visible/predictable.
- Large logs have pagination/loading strategy.
- Audit Log has time range and useful filters.
- Details are collapsible or opened in read-only detail.
- Sensitive data is masked.
- Empty, filter empty, error, and permission states are distinct.
- Refresh failure preserves old events when possible.
- Audit records cannot be edited or deleted from UI.
