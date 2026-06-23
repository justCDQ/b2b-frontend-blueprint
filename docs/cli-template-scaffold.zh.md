# CLI 模板脚手架设计

这份文档用于定义下一阶段：如何把当前 B2B Frontend Blueprint 从可运行 demo 推进成可复用项目模板。

## 目标

CLI 的目标是生成一个可用的 2B 控制台项目起点，同时不要过早绑定某个前端框架。

第一版脚手架应该提供：

- 清晰的应用目录结构。
- 主题 token 和布局基础。
- 无头交互契约。
- 可保留、可删除、可参考的 demo 页面。
- RBAC、i18n、登录认证、测试、浏览器兼容的扩展口子。

## 第一版暂不解决

第一版 CLI 不需要一次性解决所有事情。

暂不包含：

- 完整生产级认证服务。
- 完整 RBAC 后端。
- 强绑定某个框架的重型组件实现。
- 复杂插件市场。
- 完整设计系统配置后台。

这些内容可以在模板结构稳定后继续叠加。

## 推荐命令

```bash
create-b2b-blueprint my-console
```

可选参数：

```bash
create-b2b-blueprint my-console --template vanilla
create-b2b-blueprint my-console --template react
create-b2b-blueprint my-console --with-demo
create-b2b-blueprint my-console --without-demo
create-b2b-blueprint my-console --i18n zh,en
create-b2b-blueprint my-console --theme light,dark
```

## 模板层级

### 第一层：Vanilla Reference

用途：

- 在不引入框架假设的前提下验证交互规则。
- 让生成项目足够容易阅读和替换。
- 为 AI agent 提供清晰的参考实现。

建议结构：

```text
apps/web/
├── index.html
├── src/
│   ├── main.js
│   ├── styles.css
│   ├── pages/
│   ├── modules/
│   └── shared/
packages/
├── theme/
├── headless/
├── data/
└── dom/
```

### 第二层：Framework Adapter

用途：

- 后续再添加 React、Vue 等适配层。
- 继续复用同一套 headless contract 和交互规则。

框架适配层应该包装行为，而不是重写核心交互规则。

## 生成项目结构

第一版建议输出：

```text
my-console/
├── apps/
│   └── web/
├── packages/
│   ├── theme/
│   ├── headless/
│   ├── data/
│   ├── dom/
│   └── recipes/
├── docs/
│   ├── rules/
│   ├── architecture.md
│   └── getting-started.md
├── scripts/
├── package.json
└── README.md
```

## 页面模块

第一版模板应该内置这些 demo 模块：

- User Management。
- Import Records。
- Project Settings Detail。
- Activity Log。

每个模块都应该保留：

- 页面入口。
- 本地数据契约。
- 交互处理。
- 权限与 disabled reason。
- loading、empty、error、pending 状态。

## 配置文件

CLI 应该生成一个小型配置文件：

```js
export default {
  appName: "My Console",
  locale: ["zh", "en"],
  themeModes: ["light", "dark"],
  defaultRole: "owner",
  demoModules: ["users", "imports", "projects"]
};
```

## 后续可选模块

MVP 之后，CLI 可以逐步支持：

- RBAC 权限模型。
- 登录认证流程。
- i18n 字典。
- E2E 测试。
- 浏览器兼容降级。
- 框架适配层。
- Mock API 层。
- CLI update 命令。

## 工程规则

生成代码需要遵循：

- 业务权限不要写死在视觉组件中。
- mutation pending 状态必须显式。
- 危险操作必须使用 ConfirmDialog。
- 页面状态尽可能局部管理，非必要不提升成全局状态。
- 使用 token，不硬编码主题值。
- demo data 必须容易替换成真实 API contract。
- 文档靠近生成代码。

## 推荐实现阶段

1. 将当前 vanilla demo 抽成 template 目录。
2. 增加一个脚本，把 template 拷贝到目标目录。
3. 替换 app name 和 package metadata。
4. 增加可选 demo module 选择。
5. 为生成结果增加 smoke test。
6. 发布为 npm package。

