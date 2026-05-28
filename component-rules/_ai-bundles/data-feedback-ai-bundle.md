# Data Feedback AI Bundle

Use this bundle for loading, empty, error, status, notification, and log-heavy screens.

## Load These Rules

1. [`core-foundation-ai-bundle.md`](./core-foundation-ai-bundle.md)
2. [`state-view-ai-rules.md`](../state-view/state-view-ai-rules.md)
3. [`feedback-toast-ai-rules.md`](../feedback-toast/feedback-toast-ai-rules.md)
4. [`status-badge-ai-rules.md`](../status-badge/status-badge-ai-rules.md)
5. [`timeline-activity-log-ai-rules.md`](../timeline-activity-log/timeline-activity-log-ai-rules.md)
6. [`tooltip-helptext-ai-rules.md`](../tooltip-helptext/tooltip-helptext-ai-rules.md)

## Use For

- Dashboards and detail pages with status.
- Activity/Audit/Task log pages.
- Async or partially failing data views.
- Empty/error/permission state review.

## Must Enforce

- StateView scope matches affected area.
- Refresh preserves old data when possible.
- Toast is not content replacement.
- Status colors are semantic and not color-only.
- Audit Log is evidence-oriented and read-only.
- Permission denied does not look like empty data.
- Sensitive data is masked.
