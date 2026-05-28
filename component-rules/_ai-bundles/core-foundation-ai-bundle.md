# Core Foundation AI Bundle

Use this bundle as the baseline for most 2B UI generation and review.

## Load These Rules

1. [`action-system-ai-rules.md`](../action-system/action-system-ai-rules.md)
2. [`responsive-layout-ai-rules.md`](../responsive-layout/responsive-layout-ai-rules.md)
3. [`state-view-ai-rules.md`](../state-view/state-view-ai-rules.md)
4. [`feedback-toast-ai-rules.md`](../feedback-toast/feedback-toast-ai-rules.md)
5. [`tooltip-helptext-ai-rules.md`](../tooltip-helptext/tooltip-helptext-ai-rules.md)

## Use For

- Any 2B console screen.
- Any page with actions, responsive behavior, or loading/error states.
- Baseline review before adding component-specific rules.

## Must Enforce

- Action scope is clear.
- Pending prevents duplicate mutation.
- Responsive changes do not reset business state.
- Loading, empty, error, disabled, and permission states are scoped correctly.
- Toast is not used as the only feedback for blocking errors.
- Critical information is not tooltip-only.
