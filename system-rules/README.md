# System Rules

System rules define architecture-level constraints beyond individual UI components.

They are used for:

- reusable console template architecture
- CLI module design
- design token strategy
- permission architecture
- browser compatibility
- i18n
- data fetching and API contracts
- testing strategy

## Current Rules

- [Component Architecture](./component-architecture/component-architecture-rules.md)
- [Component Architecture AI Rules](./component-architecture/component-architecture-ai-rules.md)

## Planned Rules

- Theme Token Rules
- RBAC Permission Rules
- i18n Rules
- Data Fetching / API Rules
- Browser Compatibility Rules
- Testing Rules
- Auth / User System Rules
- CLI Registry Rules

## File Convention

Each system rule should follow the same four-file convention:

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```
