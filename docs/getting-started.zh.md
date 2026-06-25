# 快速开始

B2B Frontend Blueprint 用于帮助团队和 AI 编程工具生成更符合 2B 控制台习惯的前端界面，同时提供一个可复用的 starter 模板。

适合这些场景：

- 2B 管理后台。
- SaaS 控制台。
- 内部工具。
- 数据运营平台。
- AI 辅助页面生成和代码审查。

## 先做什么

1. 阅读 [MVP 边界](./mvp-scope.zh.md)。
2. 运行本地 demo。
3. 生成一个 starter 项目。
4. 阅读 API 接入契约。
5. 新增或改造一个资源模块。
6. 让 AI 生成或审查页面时加载对应 rules。

## 运行 Demo

在仓库根目录执行：

```bash
pnpm dev
```

打开：

```text
http://127.0.0.1:4173/apps/demo-vanilla/
```

不要直接通过 `file://` 打开 `apps/demo-vanilla/index.html`。当前 demo 使用 ES modules 和跨 package 导入，需要通过本地服务运行。

Demo 包含：

- User Management：手写列表 CRUD 参考。
- Import Records：导入流程参考。
- Project Settings：详情页参考。
- Resource CRUD：由资源元数据驱动的通用资源页示例。

## 生成 Starter 项目

生成一个通用控制台 starter：

```bash
node scripts/create-blueprint.mjs my-console --template vanilla --with-demo
```

生成一个只启用部分模块的 starter：

```bash
node scripts/create-blueprint.mjs ops-console \
  --modules activities,imports \
  --app-name "运营后台" \
  --locale zh \
  --theme system \
  --density compact \
  --api-base-url https://api.example.com
```

运行生成项目：

```bash
cd ops-console
pnpm build
pnpm dev
```

生成项目会从 `blueprint.config.js` 读取运行时配置。

## 配置运行时选项

scaffold 会写入：

```js
export default {
  appName: "运营后台",
  apiBaseUrl: "https://api.example.com",
  defaultLocale: "zh",
  defaultTheme: "system",
  density: "compact",
  enabledModules: ["activities", "imports"]
};
```

这个文件是 app 名称、后端地址、主题、语言、密度、启用模块的第一入口。

## 接入真实后端

阅读：

- [API 接入契约](./api-integration.zh.md)
- [API Integration Contract](./api-integration.md)

推荐模式：

```js
import { createHttpClient } from "../packages/request/src/index.js";
import config from "../blueprint.config.js";

const client = createHttpClient({
  baseUrl: config.apiBaseUrl,
  getToken: () => localStorage.getItem("access_token")
});
```

资源模块应该接收 API 对象，不要在模块内部直接创建全局 client。

## 新增资源模块

阅读：

- [新增资源模块](./add-resource-module.zh.md)
- [Add Resource Module](./add-resource-module.md)

可以参考已有活动资源：

```text
packages/data/src/activities.js
```

Resource Pattern 覆盖：

- filters
- table columns
- form schema
- CRUD API
- import contract
- row actions

## 给 AI 使用

AI 生成页面时，先加载：

- [AI 规则总入口](../component-rules/_ai-bundles/all-ai-rules.zh.md)
- [Core Foundation](../component-rules/_ai-bundles/core-foundation-ai-bundle.md)
- 匹配当前任务的场景 bundle，例如 [List CRUD](../component-rules/_ai-bundles/list-crud-ai-bundle.md)

Prompt 可以这样写：

```text
生成一个 2B 控制台资源管理页面。

遵循：
- component-rules/_ai-bundles/core-foundation-ai-bundle.md
- component-rules/_ai-bundles/list-crud-ai-bundle.md
- docs/add-resource-module.zh.md
- docs/api-integration.zh.md

使用 Resource Module Pattern。
操作作用域必须清晰。
危险操作使用 ConfirmDialog。
必须覆盖 loading、empty、error、disabled 和 permission 状态。
```

AI 审查代码时，重点要求检查：

- 交互边界问题。
- 状态缺失。
- 危险操作不安全。
- 权限行为不清晰。
- API 契约不一致。
- resource schema 不一致。

## 维护规则

每个组件规则模块默认包含四个文件：

```text
{module}-rules.md
{module}-rules.zh.md
{module}-ai-rules.md
{module}-ai-rules.zh.md
```

修改规则时：

1. 先更新人类可读版本。
2. 再更新 AI 规则版本。
3. 保持中文和英文同步。
4. 更新受影响的 AI bundle。
5. 新增模块时更新 inventory。

详见 [规则写作指南](./rule-authoring-guide.zh.md)。
