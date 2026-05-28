# Timeline / Activity / Audit Log AI Rules

> Compact execution rules for AI-generated 2B timeline, activity log, audit log, and task log behavior.
> Use `timeline-activity-log-rules.md` as the detailed reference.

---

## 1. Component Boundary

Choose by purpose:

| Component | Use for |
|---|---|
| Timeline | progress, lifecycle, approval/deployment stages |
| Activity Log | recent user/system operational events |
| Audit Log | security/compliance/permission/billing evidence |
| Task Log | import/export/sync/job execution output |

Rules:

- Timeline is narrative/status-oriented.
- Activity Log is event-oriented and user-friendly.
- Audit Log is evidence-oriented, precise, immutable, filterable.
- Task Log can be technical and streaming.
- Do not render Audit Log as decorative timeline.

---

## 2. Event Contract

Event should include:

- id
- server timestamp
- actor and actorId when available
- action
- target and targetType
- status
- summary
- metadata/details
- source
- requestId/traceId when useful

Rules:

- Audit Log must not rely on client timestamp.
- Actor/source must be explicit.
- Target should include stable id when names can change.
- Action should use controlled vocabulary when filterable.
- Metadata remains structured.
- Status does not rely on color only.

---

## 3. Display

Rules:

- Timeline usually oldest-first and emphasizes current milestone.
- Activity Log usually newest-first and emphasizes `who did what to what`.
- Audit Log usually newest-first, dense, factual, read-only.
- Task Log usually oldest-first and shows queued/running/retrying/succeeded/failed/canceled.
- Long metadata is collapsible or opens read-only drawer/dialog.
- Sensitive values must be masked.

---

## 4. Filters And Pagination

Rules:

- Audit Log requires time range filter.
- Audit Log should support actor/action/status/source filters when fields exist.
- Search supports ids, actor/resource names, requestId/traceId when useful.
- Large logs use pagination, cursor loading, load more, or virtual scroll.
- Audit Log should prefer explicit pagination/cursor over endless ambiguous scroll.
- Filter empty differs from no events.

---

## 5. Interactions

Allowed:

- expand/collapse details
- open read-only detail
- copy ids
- filter by actor/action/target/status
- jump to related resource if permitted
- retry task step only when domain supports it

Forbidden:

- edit audit records
- delete audit records from UI
- mutate original event content
- hide audit events with client-only logic
- put dangerous actions inside audit rows

---

## 6. States And Reliability

Rules:

- Initial load may use skeleton rows.
- Incremental loading keeps existing events.
- Refresh failure preserves old events.
- Permission denied must not look like empty data.
- Forbidden audit detail explains access restriction.
- Not-found/deleted related resource has clear unavailable state.
- Audit records are immutable from product UI.
- Export exists when compliance investigation needs it.

---

## 7. AI Checklist

- Component choice matches purpose.
- Audit Log is not decorative timeline.
- Event includes timestamp, actor, action, target, status, stable ids when needed.
- Audit timestamp/actor come from backend.
- Sorting direction is intentional.
- Audit filters include time range.
- Sensitive data is masked.
- Details are read-only and collapsible/drawer.
- Empty/error/permission states are distinct.
- Audit records cannot be edited/deleted.
