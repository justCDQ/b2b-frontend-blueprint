# Rule Authoring Guide

This guide defines how to write and maintain rules in this repository.

The goal is to keep every rule useful for two audiences:

- Humans who need complete product and interaction reasoning.
- AI coding agents that need short, strict, executable constraints.

## Default Module Structure

Each component or system module must live in its own folder.

```text
component-rules/{module}/
├── {module}-rules.md
├── {module}-rules.zh.md
├── {module}-ai-rules.md
└── {module}-ai-rules.zh.md
```

System-level rules use the same pattern:

```text
system-rules/{module}/
├── {module}-rules.md
├── {module}-rules.zh.md
├── {module}-ai-rules.md
└── {module}-ai-rules.zh.md
```

## File Purposes

### Human-Readable Rules

Files:

- `{module}-rules.md`
- `{module}-rules.zh.md`

Use these files to explain:

- What the component is for.
- When to use it.
- When not to use it.
- Layout and placement rules.
- Interaction details.
- State behavior.
- Data and permission contracts.
- Responsive behavior.
- Common mistakes.
- Examples.

Human-readable rules may include product reasoning, scenario boundaries, and tradeoffs.

### AI Rules

Files:

- `{module}-ai-rules.md`
- `{module}-ai-rules.zh.md`

Use these files to tell AI what it must do.

AI rules should be:

- Short.
- Imperative.
- Specific.
- Boundary-driven.
- Easy to paste into prompts.
- Free of long discussion.

Avoid vague language such as:

- "Consider using..."
- "It may be better to..."
- "Try to make it nice..."

Prefer enforceable language:

- "Use ConfirmDialog for destructive confirmation."
- "Disable row selection checkbox when the row cannot be selected."
- "Do not use toast as the only feedback for blocking errors."

## Writing Order

Use this order when creating a new rule module:

1. Write the Chinese human-readable version.
2. Write the English human-readable version.
3. Extract the Chinese AI version.
4. Extract the English AI version.
5. Add the module to the inventory.
6. Add the module to one or more AI bundles if it affects common generation tasks.

## Recommended Human Rule Sections

Use these sections unless the module clearly does not need them:

```text
# {Component} Rules

## Purpose
## When To Use
## When Not To Use
## Structure
## Interaction Rules
## States
## Disabled And Permission Rules
## Responsive Behavior
## Data Contract
## Accessibility
## Examples
## Anti-Patterns
```

Not every file needs every section, but each module should clearly answer:

- What problem does this component solve?
- What is its boundary with nearby components?
- What behavior is required?
- What behavior is forbidden?
- What must AI generate by default?

## Recommended AI Rule Sections

Use compact sections:

```text
# {Component} AI Rules

## Use When
## Do
## Do Not
## Required States
## Examples
```

Keep examples short. Prefer patterns over complete application code.

## Boundary Rules

Good B2B rules usually decide boundaries, not just style.

Examples:

- Table vs Card List.
- Dialog vs Drawer vs Detail Page.
- Toast vs Inline Error vs StateView.
- Route Navigation vs Tabs vs SegmentedControl.
- Disabled due to permission vs disabled due to current state.
- Traditional pagination vs next-token pagination vs infinite scroll.

When a boundary exists, the rule must say:

- Which option is the default.
- Which conditions change the default.
- What must happen when the option changes.
- Which option is forbidden for a given case.

## Example Quality Bar

A useful example should include:

- A realistic B2B scenario.
- The selected component.
- Why it is selected.
- Important states or permissions.

Good:

```text
Use ConfirmDialog when deleting a user from a table row action. The dialog title must include the target action, and the description must name the specific user and explain that deletion cannot be undone.
```

Weak:

```text
Show a modal when needed.
```

## Style Rules For AI Files

AI files should:

- Prefer bullet lists.
- Use direct commands.
- Avoid long paragraphs.
- Avoid implementation-library references unless the repository explicitly requires one.
- Avoid visual style details unless they affect interaction or layout.
- Include only examples that help generation behavior.

## Bundle Maintenance

Bundles live in:

```text
component-rules/_ai-bundles/
```

Update bundles when:

- A new module is added.
- A module becomes required for common page generation.
- A rule changes the behavior of a scenario bundle.

Do not put every module into every bundle. Bundles should remain scenario-based.

## Inventory Maintenance

Inventory files live in:

```text
component-rules/_inventory/
```

Update inventory when:

- A module is added.
- A module is renamed.
- A module changes from draft to stable.
- A module gains or loses AI rule files.

## Definition Of Done

A rule change is complete when:

- The human-readable English file is updated.
- The human-readable Chinese file is updated.
- The AI English file is updated.
- The AI Chinese file is updated.
- Relevant bundles are updated.
- Links still resolve.
- The rule does not contradict nearby modules.

